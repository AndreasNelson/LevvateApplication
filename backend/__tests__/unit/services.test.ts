import { HubSpotService } from '../../src/services/HubSpotService';
import { StripeService } from '../../src/services/StripeService';
import { NotificationService } from '../../src/services/NotificationService';
import { ClientModel } from '../../src/models/Client';
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

describe('StripeService', () => {
  it('should create payment intent', async () => {
    const intent = await StripeService.createPaymentIntent(9900);
    
    expect(intent.amount).toBe(9900);
    expect(intent.currency).toBe('usd');
    expect(intent.intentId).toBeDefined();
    expect(intent.clientSecret).toBeDefined();
  });

  it('should confirm payment', async () => {
    const intent = await StripeService.createPaymentIntent(9900);
    const result = await StripeService.confirmPayment(intent.intentId, 'pm_test');
    
    expect(result.success).toBe(true);
    expect(result.transactionId).toBeDefined();
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

  it('should send email', async () => {
    await expect(NotificationService.sendEmail('test@example.com', 'Subject', 'Body')).resolves.toBeUndefined();
  });
});
