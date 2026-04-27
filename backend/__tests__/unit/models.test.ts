import db, { initializeDatabase } from '../../src/config/database';
import { ClientModel } from '../../src/models/Client';
import { OnboardingProgressModel } from '../../src/models/OnboardingProgress';
import { StepDataModel } from '../../src/models/StepData';

beforeAll(() => {
  initializeDatabase();
});

beforeEach(() => {
  db.exec('DELETE FROM clients');
  db.exec('DELETE FROM onboarding_progress');
  db.exec('DELETE FROM step_data');
});

describe('ClientModel', () => {
  it('should create a client', () => {
    const client = ClientModel.create('test@example.com', 'Acme Corp', 'John Doe', '555-1234');
    expect(client.email).toBe('test@example.com');
    expect(client.company).toBe('Acme Corp');
    expect(client.name).toBe('John Doe');
    expect(client.phone).toBe('555-1234');
    expect(client.uuid).toBeDefined();
  });

  it('should get client by uuid', () => {
    const created = ClientModel.create('test@example.com');
    const retrieved = ClientModel.getByUuid(created.uuid);
    expect(retrieved?.uuid).toBe(created.uuid);
  });

  it('should get client by id', () => {
    const created = ClientModel.create('test@example.com');
    const retrieved = ClientModel.getById(created.id);
    expect(retrieved?.id).toBe(created.id);
  });

  it('should update a client', () => {
    const client = ClientModel.create('test@example.com', 'Old Co');
    const updated = ClientModel.update(client.uuid, { company: 'New Co' });
    expect(updated.company).toBe('New Co');
  });

  it('should return null for non-existent client', () => {
    expect(ClientModel.getByUuid('nonexistent')).toBeNull();
  });
});

describe('OnboardingProgressModel', () => {
  it('should create progress for a client', () => {
    const client = ClientModel.create('test@example.com');
    const progress = OnboardingProgressModel.create(client.id);
    expect(progress.currentStep).toBe(1);
    expect(progress.stepsCompleted).toEqual([]);
    expect(progress.completedAt).toBeNull();
  });

  it('should update step and mark as completed', () => {
    const client = ClientModel.create('test@example.com');
    OnboardingProgressModel.create(client.id);
    
    const p1 = OnboardingProgressModel.updateStep(client.id, 1);
    expect(p1.stepsCompleted).toEqual([1]);
    expect(p1.currentStep).toBe(2);

    const p2 = OnboardingProgressModel.updateStep(client.id, 2);
    expect(p2.stepsCompleted).toContain(2);
    expect(p2.currentStep).toBe(3);
  });

  it('should mark as complete when all 5 steps done', () => {
    const client = ClientModel.create('test@example.com');
    OnboardingProgressModel.create(client.id);
    
    for (let i = 1; i <= 5; i++) {
      OnboardingProgressModel.updateStep(client.id, i);
    }
    
    const progress = OnboardingProgressModel.getByClientId(client.id);
    expect(progress?.stepsCompleted.length).toBe(5);
    expect(progress?.completedAt).not.toBeNull();
  });

  it('should not duplicate steps', () => {
    const client = ClientModel.create('test@example.com');
    OnboardingProgressModel.create(client.id);
    
    OnboardingProgressModel.updateStep(client.id, 1);
    OnboardingProgressModel.updateStep(client.id, 1);
    
    const progress = OnboardingProgressModel.getByClientId(client.id);
    expect(progress?.stepsCompleted).toEqual([1]);
  });

  it('should detect completion', () => {
    const client = ClientModel.create('test@example.com');
    OnboardingProgressModel.create(client.id);
    
    expect(OnboardingProgressModel.isComplete(client.id)).toBe(false);
    
    for (let i = 1; i <= 5; i++) {
      OnboardingProgressModel.updateStep(client.id, i);
    }
    
    expect(OnboardingProgressModel.isComplete(client.id)).toBe(true);
  });
});

describe('StepDataModel', () => {
  it('should save step data', () => {
    const client = ClientModel.create('test@example.com');
    const formData = { name: 'John', email: 'john@example.com' };
    
    const saved = StepDataModel.save(client.id, 1, formData);
    expect(saved.formData).toEqual(formData);
    expect(saved.step).toBe(1);
  });

  it('should retrieve step data', () => {
    const client = ClientModel.create('test@example.com');
    const formData = { field1: 'value1' };
    
    StepDataModel.save(client.id, 1, formData);
    const retrieved = StepDataModel.getByClientAndStep(client.id, 1);
    expect(retrieved?.formData).toEqual(formData);
  });

  it('should update existing step data', () => {
    const client = ClientModel.create('test@example.com');
    
    StepDataModel.save(client.id, 1, { v: 1 });
    StepDataModel.save(client.id, 1, { v: 2 });
    
    const retrieved = StepDataModel.getByClientAndStep(client.id, 1);
    expect(retrieved?.formData).toEqual({ v: 2 });
  });

  it('should get all step data for a client', () => {
    const client = ClientModel.create('test@example.com');
    
    StepDataModel.save(client.id, 1, { s: 1 });
    StepDataModel.save(client.id, 2, { s: 2 });
    
    const data = StepDataModel.getByClient(client.id);
    expect(data.length).toBe(2);
  });
});
