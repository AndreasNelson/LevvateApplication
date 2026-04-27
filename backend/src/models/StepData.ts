import db from '../config/database.js';

export interface IStepData {
  id: number;
  clientId: number;
  step: number;
  formData: Record<string, any>;
  submittedAt: number;
}

export class StepDataModel {
  private static maskCardNumber(data: Record<string, any>): Record<string, any> {
    const masked = { ...data };
    if (masked.cardNumber) {
      const last4 = masked.cardNumber.toString().slice(-4);
      masked.cardNumber = `**** **** **** ${last4}`;
    }
    return masked;
  }

  static async save(clientId: number, step: number, formData: Record<string, any>): Promise<IStepData> {
    const now = Date.now();
    const dataToSave = step === 3 ? this.maskCardNumber(formData) : formData;

    await db.execute({
      sql: `INSERT INTO step_data (clientId, step, formData, submittedAt)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(clientId, step) DO UPDATE SET
              formData = excluded.formData,
              submittedAt = excluded.submittedAt`,
      args: [clientId, step, JSON.stringify(dataToSave), now]
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
