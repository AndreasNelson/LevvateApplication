import ClientModel from '../models/Client.js';
import OnboardingProgressModel from '../models/OnboardingProgress.js';
import StepDataModel from '../models/StepData.js';
import HubSpotService from './HubSpotService.js';
import NotificationService from './NotificationService.js';

export class CompletionService {
  static async handleCompletion(clientId: number): Promise<void> {
    const progress = OnboardingProgressModel.getByClientId(clientId);
    
    if (!progress || progress.stepsCompleted.length !== 5) {
      throw new Error('Onboarding not complete');
    }

    const client = ClientModel.getById(clientId);
    if (!client) throw new Error('Client not found');

    const stepData = StepDataModel.getByClient(clientId);

    // 1. Sync to HubSpot
    const hubspotResult = await HubSpotService.syncClientToHubSpot(client);
    if (!hubspotResult.success) {
      console.error('HubSpot sync failed:', hubspotResult.error);
    }

    // 2. Notify team
    await NotificationService.notifyTeam('onboarding_completed', clientId, {
      client: {
        uuid: client.uuid,
        email: client.email,
        name: client.name,
        company: client.company
      },
      stepsData: stepData,
      completedAt: progress.completedAt
    });

    // 3. Send confirmation email to client
    await NotificationService.sendEmail(
      client.email,
      'Onboarding Complete!',
      `Thank you for completing your onboarding, ${client.name}. We will be in touch shortly.`
    );
  }
}

export default CompletionService;
