import { sqlite } from "@/db/client";

let initialized = false;

export function initDb() {
  if (initialized) return;

  sqlite.execSync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS cards (
      id TEXT PRIMARY KEY NOT NULL,
      alias TEXT NOT NULL,
      bank TEXT NOT NULL,
      credit_limit REAL NOT NULL,
      cutoff_day INTEGER NOT NULL,
      payment_due_day INTEGER NOT NULL,
      network TEXT,
      color TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS card_snapshots (
      id TEXT PRIMARY KEY NOT NULL,
      card_id TEXT NOT NULL,
      captured_at TEXT NOT NULL,
      current_balance REAL NOT NULL,
      statement_balance REAL NOT NULL,
      minimum_payment REAL NOT NULL,
      payment_to_avoid_interest REAL NOT NULL,
      last_cutoff_date TEXT NOT NULL,
      payment_due_date TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_card_snapshots_card_id
      ON card_snapshots(card_id);

    CREATE INDEX IF NOT EXISTS idx_card_snapshots_captured_at
      ON card_snapshots(captured_at);
  `);

  initialized = true;
}
