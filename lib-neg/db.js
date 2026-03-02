// lib-neg/db.js - Database helpers for NegotiateSim (YCBS 288 Course Edition)
// All scenarios unlocked — no paywall, no plan restrictions
import { sql } from '@vercel/postgres';

export const UserDB = {
  async create(email, passwordHash, name) {
    const result = await sql`
      INSERT INTO neg_users (email, password_hash, name, plan)
      VALUES (${email}, ${passwordHash}, ${name}, 'course')
      RETURNING *
    `;
    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await sql`SELECT * FROM neg_users WHERE email = ${email}`;
    return result.rows[0] || null;
  },

  async findById(id) {
    const result = await sql`SELECT * FROM neg_users WHERE id = ${id}`;
    return result.rows[0] || null;
  },

  // COURSE MODE: All scenarios always allowed
  async canStartSession(userId, scenarioId) {
    const user = await this.findById(userId);
    if (!user) return { allowed: false, code: 'AUTH_ERROR' };
    return { allowed: true };
  },

  async incrementFreeSessions(userId) {
    await sql`UPDATE neg_users SET free_sessions_used = COALESCE(free_sessions_used, 0) + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ${userId}`;
  }
};

export const SessionDB = {
  async create(userId, scenarioId, difficulty) {
    const result = await sql`
      INSERT INTO negotiation_sessions (user_id, scenario_id, difficulty, status)
      VALUES (${userId}, ${scenarioId}, ${difficulty || 'standard'}, 'briefing')
      RETURNING *
    `;
    return result.rows[0];
  },

  async findById(id) {
    const result = await sql`SELECT * FROM negotiation_sessions WHERE id = ${id}`;
    return result.rows[0] || null;
  },

  async getActive(userId) {
    const result = await sql`
      SELECT * FROM negotiation_sessions 
      WHERE user_id = ${userId} AND status IN ('briefing', 'active')
      ORDER BY created_at DESC LIMIT 1
    `;
    return result.rows[0] || null;
  },

  async startNegotiation(id) {
    await sql`UPDATE negotiation_sessions SET status = 'active', started_at = CURRENT_TIMESTAMP WHERE id = ${id}`;
  },

  async addExchange(id) {
    await sql`UPDATE negotiation_sessions SET exchange_count = exchange_count + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`;
  },

  async complete(id, dealReached, walkawayParty) {
    await sql`
      UPDATE negotiation_sessions SET 
        status = ${dealReached ? 'completed' : 'walkaway'},
        deal_reached = ${dealReached},
        walkaway_party = ${walkawayParty},
        completed_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;
  },

  async saveScore(id, scorecard, debrief) {
    await sql`
      UPDATE negotiation_sessions SET 
        overall_score = ${scorecard.overallScore},
        grade = ${scorecard.grade},
        scorecard = ${JSON.stringify(scorecard)},
        debrief = ${JSON.stringify(debrief)},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;
  },

  async getUserSessions(userId) {
    const result = await sql`
      SELECT * FROM negotiation_sessions 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC LIMIT 20
    `;
    return result.rows;
  },

  async getUserProgress(userId) {
    const result = await sql`
      SELECT 
        COUNT(*) as total_sessions,
        ROUND(AVG(overall_score)::numeric, 1) as avg_score,
        (SELECT grade FROM negotiation_sessions 
         WHERE user_id = ${userId} AND grade IS NOT NULL 
         ORDER BY CASE grade WHEN 'S' THEN 6 WHEN 'A' THEN 5 WHEN 'B' THEN 4 WHEN 'C' THEN 3 WHEN 'D' THEN 2 WHEN 'F' THEN 1 ELSE 0 END DESC LIMIT 1) as best_grade
      FROM negotiation_sessions 
      WHERE user_id = ${userId} AND overall_score IS NOT NULL
    `;
    return result.rows[0];
  }
};

export const MessageDB = {
  async create(sessionId, role, content, metadata, exchangeNum) {
    const result = await sql`
      INSERT INTO negotiation_messages (session_id, role, content, metadata, exchange_number)
      VALUES (${sessionId}, ${role}, ${content}, ${metadata ? JSON.stringify(metadata) : null}, ${exchangeNum || 0})
      RETURNING *
    `;
    return result.rows[0];
  },

  async getBySession(sessionId) {
    const result = await sql`
      SELECT * FROM negotiation_messages 
      WHERE session_id = ${sessionId}
      ORDER BY created_at ASC
    `;
    return result.rows;
  }
};
