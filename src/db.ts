import Database from "better-sqlite3"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, "..", "data")
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir)

const db = new Database(path.join(dataDir, "usage.db"))

db.exec(`
  CREATE TABLE IF NOT EXISTS usage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reaction_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    timestamp INTEGER NOT NULL DEFAULT (unixepoch())
  );
  CREATE INDEX IF NOT EXISTS idx_usage_reaction ON usage(reaction_id);
`)

export interface UsageStats {
  totalUses: number
  lastUseTimestamp: number
  lastUserId: string
  topUserId: string
  topUserUses: number
}

const insertStmt = db.prepare(
  "INSERT INTO usage (reaction_id, user_id) VALUES (?, ?)"
)

export const recordUsage = (reactionId: string, userId: string): void => {
  insertStmt.run(reactionId, userId)
}

export const getUsageStats = (reactionId: string): UsageStats | null => {
  const total = (
    db
      .prepare("SELECT COUNT(*) as count FROM usage WHERE reaction_id = ?")
      .get(reactionId) as { count: number }
  ).count

  if (total === 0) return null

  const last = db
    .prepare(
      "SELECT user_id, timestamp FROM usage WHERE reaction_id = ? ORDER BY timestamp DESC LIMIT 1"
    )
    .get(reactionId) as { user_id: string; timestamp: number }

  const top = db
    .prepare(
      `SELECT user_id, COUNT(*) as uses FROM usage WHERE reaction_id = ?
       GROUP BY user_id ORDER BY uses DESC LIMIT 1`
    )
    .get(reactionId) as { user_id: string; uses: number }

  return {
    totalUses: total,
    lastUseTimestamp: last.timestamp,
    lastUserId: last.user_id,
    topUserId: top.user_id,
    topUserUses: top.uses
  }
}

export interface TopReaction {
  reactionId: string
  uses: number
}

export const getTopReactions = (limit = 10): TopReaction[] => {
  const rows = db
    .prepare(
      `SELECT reaction_id, COUNT(*) as uses FROM usage
       GROUP BY reaction_id ORDER BY uses DESC LIMIT ?`
    )
    .all(limit) as { reaction_id: string; uses: number }[]
  return rows.map((r) => ({ reactionId: r.reaction_id, uses: r.uses }))
}
