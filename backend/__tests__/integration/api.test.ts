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
});
