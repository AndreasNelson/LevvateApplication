import db from '../config/database.js';

export interface IStepData {
  id: number;
  clientId: number;
  step: number;
  formData: Record<string, any>;
  submittedAt: number;
}

export class StepDataModel {
  static async save(clientId: number, step: number, formData: Record<string, any>): Promise<IStepData> {
    const now = Date.now();
    await db.execute({
      sql: `INSERT INTO step_data (clientId, step, formData, submittedAt)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(clientId, step) DO UPDATE SET
              formData = excluded.formData,
              submittedAt = excluded.submittedAt`,
      args: [clientId, step, JSON.stringify(formData), now]
    });
    
    const saved = await this.getByClientAndStep(clientId, step);
    return saved!;
  }

  static async getByClientAndStep(clientId: number, step: number): Promise<IStepData | null> {
    const result = await db.execute({
      sql: 'SELECT * FROM step_data WHERE clientId = ? AND step = ?',
      args: [clientId, step]
    });
    const row = result.rows[0] as any;
    if (!row) return null;
    
    return {
      ...row,
      formData: JSON.parse(row.formData)
    };
  }

  static async getByClient(clientId: number): Promise<IStepData[]> {
    const result = await db.execute({
      sql: 'SELECT * FROM step_data WHERE clientId = ? ORDER BY step ASC',
      args: [clientId]
    });
    const rows = result.rows as any[];
    
    return rows.map(row => ({
      ...row,
      formData: JSON.parse(row.formData)
    }));
  }
}

export default StepDataModel;
