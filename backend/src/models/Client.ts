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
  static create(email: string, company?: string, name?: string, phone?: string): IClient {
    const uuid = uuidv4();
    const now = Date.now();
    
    const stmt = db.prepare(`
      INSERT INTO clients (uuid, email, company, name, phone, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(uuid, email, company || null, name || null, phone || null, now, now);
    return this.getByUuid(uuid)!;
  }

  static getByUuid(uuid: string): IClient | null {
    const stmt = db.prepare('SELECT * FROM clients WHERE uuid = ?');
    return stmt.get(uuid) as IClient || null;
  }

  static getById(id: number): IClient | null {
    const stmt = db.prepare('SELECT * FROM clients WHERE id = ?');
    return stmt.get(id) as IClient || null;
  }

  static update(uuid: string, data: Partial<Omit<IClient, 'id' | 'uuid' | 'createdAt'>>): IClient {
    const client = this.getByUuid(uuid);
    if (!client) throw new Error('Client not found');

    const updates = { ...data, updatedAt: Date.now() };
    const keys = Object.keys(updates);
    const values = Object.values(updates);
    const placeholders = keys.map(k => `${k} = ?`).join(', ');

    const stmt = db.prepare(`UPDATE clients SET ${placeholders} WHERE uuid = ?`);
    stmt.run(...values, uuid);

    return this.getByUuid(uuid)!;
  }
}

export default ClientModel;
