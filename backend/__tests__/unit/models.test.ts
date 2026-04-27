import db, { initializeDatabase } from '../../src/config/database';
import { ClientModel } from '../../src/models/Client';
import { OnboardingProgressModel } from '../../src/models/OnboardingProgress';
import { StepDataModel } from '../../src/models/StepData';

beforeAll(async () => {
  await initializeDatabase();
});

beforeEach(async () => {
  await db.execute('DELETE FROM clients');
  await db.execute('DELETE FROM onboarding_progress');
  await db.execute('DELETE FROM step_data');
});

describe('ClientModel', () => {
  it('should create a client', async () => {
    const client = await ClientModel.create('test@example.com', 'Acme Corp', 'John Doe', '555-1234');
    expect(client.email).toBe('test@example.com');
    expect(client.company).toBe('Acme Corp');
    expect(client.name).toBe('John Doe');
    expect(client.phone).toBe('555-1234');
    expect(client.uuid).toBeDefined();
  });

  it('should get client by uuid', async () => {
    const created = await ClientModel.create('test@example.com');
    const retrieved = await ClientModel.getByUuid(created.uuid);
    expect(retrieved?.uuid).toBe(created.uuid);
  });

  it('should get client by id', async () => {
    const created = await ClientModel.create('test@example.com');
    const retrieved = await ClientModel.getById(created.id);
    expect(retrieved?.id).toBe(created.id);
  });

  it('should return null for non-existent client by id', async () => {
    const result = await ClientModel.getById(999);
    expect(result).toBeNull();
  });

  it('should update a client', async () => {
    const client = await ClientModel.create('test@example.com', 'Old Co');
    const updated = await ClientModel.update(client.uuid, { company: 'New Co' });
    expect(updated.company).toBe('New Co');
  });

  it('should throw error when updating non-existent client', async () => {
    await expect(ClientModel.update('nonexistent', { name: 'New' }))
      .rejects.toThrow('Client not found');
  });

  it('should return null for non-existent client', async () => {
    const result = await ClientModel.getByUuid('nonexistent');
    expect(result).toBeNull();
  });
});

describe('OnboardingProgressModel', () => {
  it('should create progress for a client', async () => {
    const client = await ClientModel.create('test@example.com');
    const progress = await OnboardingProgressModel.create(client.id);
    expect(progress.currentStep).toBe(1);
    expect(progress.stepsCompleted).toEqual([]);
    expect(progress.completedAt).toBeNull();
  });

  it('should update step and mark as completed', async () => {
    const client = await ClientModel.create('test@example.com');
    await OnboardingProgressModel.create(client.id);
    
    const p1 = await OnboardingProgressModel.updateStep(client.id, 1);
    expect(p1.stepsCompleted).toEqual([1]);
    expect(p1.currentStep).toBe(2);

    const p2 = await OnboardingProgressModel.updateStep(client.id, 2);
    expect(p2.stepsCompleted).toContain(2);
    expect(p2.currentStep).toBe(3);
  });

  it('should throw error when updating step for non-existent progress', async () => {
    await expect(OnboardingProgressModel.updateStep(999, 1))
      .rejects.toThrow('Progress not found');
  });

  it('should mark as complete when all 5 steps done', async () => {
    const client = await ClientModel.create('test@example.com');
    await OnboardingProgressModel.create(client.id);
    
    for (let i = 1; i <= 5; i++) {
      await OnboardingProgressModel.updateStep(client.id, i);
    }
    
    const progress = await OnboardingProgressModel.getByClientId(client.id);
    expect(progress?.stepsCompleted.length).toBe(5);
    expect(progress?.completedAt).not.toBeNull();
  });

  it('should not duplicate steps', async () => {
    const client = await ClientModel.create('test@example.com');
    await OnboardingProgressModel.create(client.id);
    
    await OnboardingProgressModel.updateStep(client.id, 1);
    await OnboardingProgressModel.updateStep(client.id, 1);
    
    const progress = await OnboardingProgressModel.getByClientId(client.id);
    expect(progress?.stepsCompleted).toEqual([1]);
  });

  it('should detect completion', async () => {
    const client = await ClientModel.create('test@example.com');
    await OnboardingProgressModel.create(client.id);
    
    expect(await OnboardingProgressModel.isComplete(client.id)).toBe(false);
    
    for (let i = 1; i <= 5; i++) {
      await OnboardingProgressModel.updateStep(client.id, i);
    }
    
    expect(await OnboardingProgressModel.isComplete(client.id)).toBe(true);
  });

  it('should return false for isComplete if progress not found', async () => {
    expect(await OnboardingProgressModel.isComplete(999)).toBe(false);
  });
});

describe('StepDataModel', () => {
  it('should save step data', async () => {
    const client = await ClientModel.create('test@example.com');
    const formData = { name: 'John', email: 'john@example.com' };
    
    const saved = await StepDataModel.save(client.id, 1, formData);
    expect(saved.formData).toEqual(formData);
    expect(saved.step).toBe(1);
  });

  it('should retrieve step data', async () => {
    const client = await ClientModel.create('test@example.com');
    const formData = { field1: 'value1' };
    
    await StepDataModel.save(client.id, 1, formData);
    const retrieved = await StepDataModel.getByClientAndStep(client.id, 1);
    expect(retrieved?.formData).toEqual(formData);
  });

  it('should return null for non-existent step data', async () => {
    const retrieved = await StepDataModel.getByClientAndStep(999, 1);
    expect(retrieved).toBeNull();
  });

  it('should update existing step data', async () => {
    const client = await ClientModel.create('test@example.com');
    
    await StepDataModel.save(client.id, 1, { v: 1 });
    await StepDataModel.save(client.id, 1, { v: 2 });
    
    const retrieved = await StepDataModel.getByClientAndStep(client.id, 1);
    expect(retrieved?.formData).toEqual({ v: 2 });
  });

  it('should get all step data for a client', async () => {
    const client = await ClientModel.create('test@example.com');
    
    await StepDataModel.save(client.id, 1, { s: 1 });
    await StepDataModel.save(client.id, 2, { s: 2 });
    
    const data = await StepDataModel.getByClient(client.id);
    expect(data.length).toBe(2);
  });
});
