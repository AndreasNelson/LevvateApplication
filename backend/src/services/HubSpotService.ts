import { IClient } from '../models/Client.js';

export interface HubSpotSyncResult {
  success: boolean;
  contactId?: string;
  error?: string;
}

export class HubSpotService {
  static async syncClientToHubSpot(client: IClient): Promise<HubSpotSyncResult> {
    // Mock HubSpot API call
    console.log(`[HubSpot Mock] Syncing client to CRM:`, {
      email: client.email,
      name: client.name,
      company: client.company,
      phone: client.phone,
      timestamp: new Date().toISOString()
    });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Return mock success
    return {
      success: true,
      contactId: `hubspot_${client.uuid}`
    };
  }
}

export default HubSpotService;
