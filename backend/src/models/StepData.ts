import db from '../config/database.js';

export interface IStepData {
  id: number;
  clientId: number;
  step: number;
  formData: Record<string, any>;
  submittedAt: number;
}

export class StepDataModel {
  static save(clientId: number, step: number, formData: Record<string, any>): IStepData {
    const now = Date.now();
    const stmt = db.prepare(`
      INSERT INTO step_data (clientId, step, formData, submittedAt)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(clientId, step) DO UPDATE SET
        formData = excluded.formData,
        submittedAt = excluded.submittedAt
    `);

    stmt.run(clientId, step, JSON.stringify(formData), now);
    return this.getByClientAndStep(clientId, step)!;
  }

  static getByClientAndStep(clientId: number, step: number): IStepData | null {
    const stmt = db.prepare('SELECT * FROM step_data WHERE clientId = ? AND step = ?');
    const row = stmt.get(clientId, step) as any;
    if (!row) return null;
    
    return {
      ...row,
      formData: JSON.parse(row.formData)
    };
  }

  static getByClient(clientId: number): IStepData[] {
    const stmt = db.prepare('SELECT * FROM step_data WHERE clientId = ? ORDER BY step ASC');
    const rows = stmt.all(clientId) as any[];
    
    return rows.map(row => ({
      ...row,
      formData: JSON.parse(row.formData)
    }));
  }
}

export default StepDataModel;
