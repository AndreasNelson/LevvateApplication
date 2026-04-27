import { Router, Request, Response, NextFunction } from 'express';
import ClientModel from '../models/Client.js';
import OnboardingProgressModel from '../models/OnboardingProgress.js';
import StepDataModel from '../models/StepData.js';
import CompletionService from '../services/CompletionService.js';

const router = Router();

// Validation middleware
const validateStepData = (req: Request, res: Response, next: NextFunction): void => {
  const { step } = req.params;
  const stepNum = parseInt(step, 10);

  if (isNaN(stepNum) || stepNum < 1 || stepNum > 5) {
    res.status(400).json({ error: 'Invalid step number' });
    return;
  }

  next();
};

// POST /api/clients - Create new client
router.post('/clients', (req: Request, res: Response): void => {
  try {
    const { email, company, name, phone } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    const client = ClientModel.create(email, company, name, phone);
    const progress = OnboardingProgressModel.create(client.id);

    res.status(201).json({
      uuid: client.uuid,
      progress: {
        currentStep: progress.currentStep,
        stepsCompleted: progress.stepsCompleted
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/clients/:uuid - Get client and progress
router.get('/clients/:uuid', (req: Request, res: Response): void => {
  try {
    const { uuid } = req.params;
    const client = ClientModel.getByUuid(uuid);

    if (!client) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    const progress = OnboardingProgressModel.getByClientId(client.id);
    const stepData = StepDataModel.getByClient(client.id);

    res.json({
      client: {
        uuid: client.uuid,
        email: client.email,
        name: client.name,
        company: client.company,
        phone: client.phone
      },
      progress: {
        currentStep: progress?.currentStep || 1,
        stepsCompleted: progress?.stepsCompleted || [],
        isComplete: progress?.completedAt ? true : false
      },
      stepData: stepData.reduce((acc, item) => {
        acc[item.step] = item.formData;
        return acc;
      }, {} as Record<number, any>)
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/clients/:uuid/step/:step - Submit step data
router.post('/clients/:uuid/step/:step', validateStepData, async (req: Request, res: Response): Promise<void> => {
  try {
    const { uuid, step } = req.params;
    const stepNum = parseInt(step, 10);
    const { formData } = req.body;

    if (!formData) {
      res.status(400).json({ error: 'Form data is required' });
      return;
    }

    const client = ClientModel.getByUuid(uuid);
    if (!client) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    // Save step data
    StepDataModel.save(client.id, stepNum, formData);

    // Update progress
    const progress = OnboardingProgressModel.updateStep(client.id, stepNum);

    // Check if onboarding is complete
    if (progress.stepsCompleted.length === 5) {
      await CompletionService.handleCompletion(client.id);
    }

    res.json({
      progress: {
        currentStep: progress.currentStep,
        stepsCompleted: progress.stepsCompleted,
        isComplete: progress.completedAt ? true : false
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/clients/:uuid/progress - Get progress only
router.get('/clients/:uuid/progress', (req: Request, res: Response): void => {
  try {
    const { uuid } = req.params;
    const client = ClientModel.getByUuid(uuid);

    if (!client) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    const progress = OnboardingProgressModel.getByClientId(client.id);

    res.json({
      currentStep: progress?.currentStep || 1,
      stepsCompleted: progress?.stepsCompleted || [],
      isComplete: progress?.completedAt ? true : false
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
