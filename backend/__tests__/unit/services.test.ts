import { HubSpotService } from '../../src/services/HubSpotService';
import { NotificationService } from '../../src/services/NotificationService';
import { CompletionService } from '../../src/services/CompletionService';
import { ClientModel } from '../../src/models/Client';
import { OnboardingProgressModel } from '../../src/models/OnboardingProgress';
import { StepDataModel } from '../../src/models/StepData';
import db, { initializeDatabase } from '../../src/config/database';

beforeAll(async () => {
  await initializeDatabase();
});

beforeEach(async () => {
  await db.execute('DELETE FROM clients');
  await db.execute('DELETE FROM notifications');
});

describe('HubSpotService', () => {
  it('should sync client to HubSpot', async () => {
    const client = await ClientModel.create('test@example.com', 'TestCo', 'John');
    const result = await HubSpotService.syncClientToHubSpot(client);
    
    expect(result.success).toBe(true);
    expect(result.contactId).toBeDefined();
  });
});

describe('NotificationService', () => {
  it('should notify team', async () => {
    const client = await ClientModel.create('test@example.com');
    await NotificationService.notifyTeam('test_event', client.id, {});
    
    const result = await db.execute({
      sql: 'SELECT * FROM notifications WHERE clientId = ?',
      args: [client.id]
    });
    const notification = result.rows[0];
    expect(notification).toBeDefined();
  });
});

describe('CompletionService', () => {
  it('should throw error if onboarding not complete', async () => {
    const client = await ClientModel.create('test@example.com');
    await expect(CompletionService.handleCompletion(client.id))
      .rejects.toThrow('Onboarding not complete');
  });

  it('should handle failed HubSpot sync gracefully', async () => {
    const client = await ClientModel.create('complete@example.com');
    await OnboardingProgressModel.create(client.id);
    for (let i = 1; i <= 5; i++) {
      await StepDataModel.save(client.id, i, { step: i });
      await OnboardingProgressModel.updateStep(client.id, i);
    }

    jest.spyOn(HubSpotService, 'syncClientToHubSpot').mockResolvedValueOnce({
      success: false,
      error: 'API Error'
    });
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await CompletionService.handleCompletion(client.id);

    expect(consoleSpy).toHaveBeenCalledWith('HubSpot sync failed:', 'API Error');
    consoleSpy.mockRestore();
  });
});
