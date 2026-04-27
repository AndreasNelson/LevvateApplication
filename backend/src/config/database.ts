import { createClient } from '@libsql/client';

const url = process.env.TURSO_DATABASE_URL || `file:${process.env.DATABASE_PATH || './data/onboarding.db'}`;
const authToken = process.env.TURSO_AUTH_TOKEN;

export const db = createClient({
  url,
  authToken,
});

export async function initializeDatabase(): Promise<void> {
  const schema = [
    `CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT UNIQUE NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      name TEXT,
      phone TEXT,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS onboarding_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clientId INTEGER UNIQUE NOT NULL,
      currentStep INTEGER NOT NULL DEFAULT 1,
      stepsCompleted TEXT NOT NULL DEFAULT '[]',
      completedAt INTEGER,
      lastUpdated INTEGER NOT NULL,
      FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS step_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clientId INTEGER NOT NULL,
      step INTEGER NOT NULL,
      formData TEXT NOT NULL,
      submittedAt INTEGER NOT NULL,
      FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE,
      UNIQUE(clientId, step)
    )`,
    `CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event TEXT NOT NULL,
      clientId INTEGER,
      status TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE
    )`,
    `CREATE INDEX IF NOT EXISTS idx_clients_uuid ON clients(uuid)`,
    `CREATE INDEX IF NOT EXISTS idx_progress_clientId ON onboarding_progress(clientId)`,
    `CREATE INDEX IF NOT EXISTS idx_stepdata_clientId ON step_data(clientId)`
  ];

  for (const query of schema) {
    await db.execute(query);
  }
}

export default db;
