import request from 'supertest';
import db from '../../src/config/database';
import app from '../../src/index';

beforeEach(async () => {
  await db.execute('DELETE FROM clients');
  await db.execute('DELETE FROM onboarding_progress');
  await db.execute('DELETE FROM step_data');
  await db.execute('DELETE FROM notifications');
});

describe('API Routes', () => {
  it('POST /api/clients - should create a new client', async () => {
    const res = await request(app)
      .post('/api/clients')
      .send({ email: 'test@example.com', company: 'TestCo', name: 'John' });
    
    expect(res.status).toBe(201);
    expect(res.body.uuid).toBeDefined();
    expect(res.body.progress.currentStep).toBe(1);
  });

  it('POST /api/clients - should require email', async () => {
    const res = await request(app)
      .post('/api/clients')
      .send({ company: 'TestCo' });
    
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('GET /api/clients/:uuid - should get client', async () => {
    const createRes = await request(app)
      .post('/api/clients')
      .send({ email: 'test@example.com' });
    
    const uuid = createRes.body.uuid;
    const res = await request(app).get(`/api/clients/${uuid}`);
    
    expect(res.status).toBe(200);
    expect(res.body.client.uuid).toBe(uuid);
  });

  it('GET /api/clients/:uuid - should include stepData in response', async () => {
    const createRes = await request(app)
      .post('/api/clients')
      .send({ email: 'stepdata@example.com' });
    
    const uuid = createRes.body.uuid;
    await request(app)
      .post(`/api/clients/${uuid}/step/1`)
      .send({ formData: { field: 'value' } });

    const res = await request(app).get(`/api/clients/${uuid}`);
    expect(res.status).toBe(200);
    expect(res.body.stepData[1]).toEqual({ field: 'value' });
  });

  it('GET /api/clients/:uuid - should return 404 for non-existent client', async () => {
    const res = await request(app).get('/api/clients/nonexistent');
    expect(res.status).toBe(404);
  });

  it('POST /api/clients/:uuid/step/:step - should submit step data', async () => {
    const createRes = await request(app)
      .post('/api/clients')
      .send({ email: 'test@example.com' });
    
    const uuid = createRes.body.uuid;
    const res = await request(app)
      .post(`/api/clients/${uuid}/step/1`)
      .send({ formData: { name: 'John', email: 'john@example.com' } });
    
    expect(res.status).toBe(200);
    expect(res.body.progress.stepsCompleted).toContain(1);
  });

  it('POST /api/clients/:uuid/step/:step - should require formData', async () => {
    const createRes = await request(app)
      .post('/api/clients')
      .send({ email: 'noform@example.com' });
    
    const uuid = createRes.body.uuid;
    const res = await request(app)
      .post(`/api/clients/${uuid}/step/1`)
      .send({});
    
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Form data is required');
  });

  it('POST /api/clients/:uuid/step/:step - should return 404 for non-existent client', async () => {
    const res = await request(app)
      .post('/api/clients/nonexistent/step/1')
      .send({ formData: {} });
    expect(res.status).toBe(404);
  });

  it('POST /api/clients/:uuid/step/:step - should validate step number', async () => {
    const createRes = await request(app)
      .post('/api/clients')
      .send({ email: 'test@example.com' });
    
    const uuid = createRes.body.uuid;
    const res = await request(app)
      .post(`/api/clients/${uuid}/step/10`)
      .send({ formData: {} });
    
    expect(res.status).toBe(400);
  });

  it('POST /api/clients/:uuid/step/:step - should complete onboarding after 5 steps', async () => {
    const createRes = await request(app)
      .post('/api/clients')
      .send({ email: 'test@example.com' });
    
    const uuid = createRes.body.uuid;
    
    for (let i = 1; i <= 5; i++) {
      const res = await request(app)
        .post(`/api/clients/${uuid}/step/${i}`)
        .send({ formData: { step: i } });
      
      expect(res.status).toBe(200);
    }
    
    const progressRes = await request(app).get(`/api/clients/${uuid}/progress`);
    expect(progressRes.body.isComplete).toBe(true);
  });

  it('GET /api/clients/:uuid/progress - should get progress', async () => {
    const createRes = await request(app)
      .post('/api/clients')
      .send({ email: 'test@example.com' });
    
    const uuid = createRes.body.uuid;
    const res = await request(app).get(`/api/clients/${uuid}/progress`);
    
    expect(res.status).toBe(200);
    expect(res.body.currentStep).toBe(1);
  });

  it('GET /api/clients/:uuid/progress - should return 404 for non-existent client', async () => {
    const res = await request(app).get('/api/clients/nonexistent/progress');
    expect(res.status).toBe(404);
  });

  it('should return 404 for non-existent route', async () => {
    const res = await request(app).get('/api/invalid-route');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Route not found');
  });

  it('POST /api/clients - should return 500 if model throws error', async () => {
    const { ClientModel } = require('../../src/models/Client');
    jest.spyOn(ClientModel, 'create').mockRejectedValueOnce(new Error('DB Error'));
    
    const res = await request(app)
      .post('/api/clients')
      .send({ email: 'error@example.com' });
    
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('DB Error');
  });

  it('GET /api/clients/:uuid - should return 500 if model throws error', async () => {
    const { ClientModel } = require('../../src/models/Client');
    jest.spyOn(ClientModel, 'getByUuid').mockRejectedValueOnce(new Error('DB Error'));
    
    const res = await request(app).get('/api/clients/some-uuid');
    
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('DB Error');
  });

  it('POST /api/clients/:uuid/step/:step - should return 500 if model throws error', async () => {
    const { ClientModel } = require('../../src/models/Client');
    jest.spyOn(ClientModel, 'getByUuid').mockRejectedValueOnce(new Error('DB Error'));
    
    const res = await request(app)
      .post('/api/clients/some-uuid/step/1')
      .send({ formData: {} });
    
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('DB Error');
  });

  it('GET /api/clients/:uuid/progress - should return 500 if model throws error', async () => {
    const { ClientModel } = require('../../src/models/Client');
    jest.spyOn(ClientModel, 'getByUuid').mockRejectedValueOnce(new Error('DB Error'));
    
    const res = await request(app).get('/api/clients/some-uuid/progress');
    
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('DB Error');
  });
});
