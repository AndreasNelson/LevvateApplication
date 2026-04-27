import db from '../config/database.js';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';

export interface IClient {
  id: number;
  uuid: string;
  email: string;
  company: string | null;
  name: string | null;
  phone: string | null;
  createdAt: number;
  updatedAt: number;
}

export class ClientModel {
  static async create(email: string, company?: string, name?: string, phone?: string): Promise<IClient> {
    const uuid = uuidv4();
    const now = Date.now();
    
    await db.execute({
      sql: `INSERT INTO clients (uuid, email, company, name, phone, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [uuid, email, company || null, name || null, phone || null, now, now]
    });
    
    const client = await this.getByUuid(uuid);
    return client!;
  }

  static async getByUuid(uuid: string): Promise<IClient | null> {
    const result = await db.execute({
      sql: 'SELECT * FROM clients WHERE uuid = ?',
      args: [uuid]
    });
    return (result.rows[0] as unknown as IClient) || null;
  }

  static async getById(id: number): Promise<IClient | null> {
    const result = await db.execute({
      sql: 'SELECT * FROM clients WHERE id = ?',
      args: [id]
    });
    return (result.rows[0] as unknown as IClient) || null;
  }

  static async update(uuid: string, data: Partial<Omit<IClient, 'id' | 'uuid' | 'createdAt'>>): Promise<IClient> {
    const client = await this.getByUuid(uuid);
    if (!client) throw new Error('Client not found');

    const updates = { ...data, updatedAt: Date.now() };
    const keys = Object.keys(updates);
    const values = Object.values(updates);
    const placeholders = keys.map(k => `${k} = ?`).join(', ');

    await db.execute({
      sql: `UPDATE clients SET ${placeholders} WHERE uuid = ?`,
      args: [...values, uuid]
    });

    const updated = await this.getByUuid(uuid);
    return updated!;
  }
}

export default ClientModel;
