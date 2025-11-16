import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../interview_coach.db');
const db = new sqlite3.Database(dbPath);

export const initializeDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    let tablesCreated = 0;
    const totalTables = 5;

    const onTableCreated = (err: Error | null) => {
      if (err) {
        reject(err);
        return;
      }
      tablesCreated += 1;
      if (tablesCreated === totalTables) {
        resolve();
      }
    };

    db.serialize(() => {
      // Users table
      db.run(
        `CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        onTableCreated
      );

      // Sessions table
      db.run(
        `CREATE TABLE IF NOT EXISTS sessions (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          token TEXT UNIQUE NOT NULL,
          expiresAt DATETIME NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        )`,
        onTableCreated
      );

      // CV Data table
      db.run(
        `CREATE TABLE IF NOT EXISTS cvData (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          cvText TEXT,
          keywords TEXT,
          parsedData TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        )`,
        onTableCreated
      );

      // Stories table
      db.run(
        `CREATE TABLE IF NOT EXISTS stories (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          title TEXT,
          content TEXT,
          format TEXT,
          competency TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        )`,
        onTableCreated
      );

      // Interview Sessions table
      db.run(
        `CREATE TABLE IF NOT EXISTS interviewSessions (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          questions TEXT,
          answers TEXT,
          score REAL,
          feedback TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        )`,
        onTableCreated
      );
    });
  });
};

export const getDatabase = () => db;
export default db;