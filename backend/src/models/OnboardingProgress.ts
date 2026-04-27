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
  static create(clientId: number): IOnboardingProgress {
    const now = Date.now();
    const stmt = db.prepare(`
      INSERT INTO onboarding_progress (clientId, currentStep, stepsCompleted, lastUpdated)
      VALUES (?, ?, ?, ?)
    `);
    
    stmt.run(clientId, 1, JSON.stringify([]), now);
    return this.getByClientId(clientId)!;
  }

  static getByClientId(clientId: number): IOnboardingProgress | null {
    const stmt = db.prepare('SELECT * FROM onboarding_progress WHERE clientId = ?');
    const row = stmt.get(clientId) as any;
    if (!row) return null;
    
    return {
      ...row,
      stepsCompleted: JSON.parse(row.stepsCompleted)
    };
  }

  static updateStep(clientId: number, stepNumber: number): IOnboardingProgress {
    const progress = this.getByClientId(clientId);
    if (!progress) throw new Error('Progress not found');

    const stepsCompleted = [...new Set([...progress.stepsCompleted, stepNumber])];
    const currentStep = Math.min(stepNumber + 1, 5);
    const completedAt = stepsCompleted.length === 5 ? Date.now() : null;
    const now = Date.now();

    const stmt = db.prepare(`
      UPDATE onboarding_progress 
      SET currentStep = ?, stepsCompleted = ?, completedAt = ?, lastUpdated = ?
      WHERE clientId = ?
    `);

    stmt.run(currentStep, JSON.stringify(stepsCompleted), completedAt, now, clientId);
    return this.getByClientId(clientId)!;
  }

  static isComplete(clientId: number): boolean {
    const progress = this.getByClientId(clientId);
    if (!progress) return false;
    return progress.stepsCompleted.length === 5;
  }
}

export default OnboardingProgressModel;
