import Database from 'better-sqlite3';
import path from 'path';

const dbPath = process.env.DATABASE_PATH || './data/onboarding.db';

export const db: Database.Database = new Database(dbPath);

export function initializeDatabase(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT UNIQUE NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      name TEXT,
      phone TEXT,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS onboarding_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clientId INTEGER UNIQUE NOT NULL,
      currentStep INTEGER NOT NULL DEFAULT 1,
      stepsCompleted TEXT NOT NULL DEFAULT '[]',
      completedAt INTEGER,
      lastUpdated INTEGER NOT NULL,
      FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS step_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clientId INTEGER NOT NULL,
      step INTEGER NOT NULL,
      formData TEXT NOT NULL,
      submittedAt INTEGER NOT NULL,
      FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE,
      UNIQUE(clientId, step)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event TEXT NOT NULL,
      clientId INTEGER,
      status TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_clients_uuid ON clients(uuid);
    CREATE INDEX IF NOT EXISTS idx_progress_clientId ON onboarding_progress(clientId);
    CREATE INDEX IF NOT EXISTS idx_stepdata_clientId ON step_data(clientId);
  `);
}

export default db;
