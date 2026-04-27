import db from '../config/database.js';

export interface IOnboardingProgress {
  id: number;
  clientId: number;
  currentStep: number;
  stepsCompleted: number[];
  completedAt: number | null;
  lastUpdated: number;
}

export class OnboardingProgressModel {
  static async create(clientId: number): Promise<IOnboardingProgress> {
    const now = Date.now();
    await db.execute({
      sql: `INSERT INTO onboarding_progress (clientId, currentStep, stepsCompleted, lastUpdated)
            VALUES (?, ?, ?, ?)`,
      args: [clientId, 1, JSON.stringify([]), now]
    });
    
    const progress = await this.getByClientId(clientId);
    return progress!;
  }

  static async getByClientId(clientId: number): Promise<IOnboardingProgress | null> {
    const result = await db.execute({
      sql: 'SELECT * FROM onboarding_progress WHERE clientId = ?',
      args: [clientId]
    });
    const row = result.rows[0] as any;
    if (!row) return null;
    
    return {
      ...row,
      stepsCompleted: JSON.parse(row.stepsCompleted)
    };
  }

  static async updateStep(clientId: number, stepNumber: number): Promise<IOnboardingProgress> {
    const progress = await this.getByClientId(clientId);
    if (!progress) throw new Error('Progress not found');

    const stepsCompleted = [...new Set([...progress.stepsCompleted, stepNumber])];
    const currentStep = Math.min(stepNumber + 1, 5);
    const completedAt = stepsCompleted.length === 5 ? Date.now() : null;
    const now = Date.now();

    await db.execute({
      sql: `UPDATE onboarding_progress 
            SET currentStep = ?, stepsCompleted = ?, completedAt = ?, lastUpdated = ?
            WHERE clientId = ?`,
      args: [currentStep, JSON.stringify(stepsCompleted), completedAt, now, clientId]
    });

    const updated = await this.getByClientId(clientId);
    return updated!;
  }

  static async isComplete(clientId: number): Promise<boolean> {
    const progress = await this.getByClientId(clientId);
    if (!progress) return false;
    return progress.stepsCompleted.length === 5;
  }
}

export default OnboardingProgressModel;
