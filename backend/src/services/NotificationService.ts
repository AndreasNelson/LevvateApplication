import db from '../config/database.js';

export class NotificationService {
  static async notifyTeam(event: string, clientId: number, details: any): Promise<void> {
    // Log notification event to database
    await db.execute({
      sql: `INSERT INTO notifications (event, clientId, status, createdAt)
            VALUES (?, ?, ?, ?)`,
      args: [event, clientId, 'sent', Date.now()]
    });

    // Mock email/Slack notification
    console.log(`[Notification Mock] Team notified:`, {
      event,
      clientId,
      details,
      timestamp: new Date().toISOString()
    });
  }

  static async sendEmail(to: string, subject: string, body: string): Promise<void> {
    // Mock email sending
    console.log(`[Email Mock] Email sent:`, {
      to,
      subject,
      body,
      timestamp: new Date().toISOString()
    });
  }
}

export default NotificationService;
