// api/auth/me.js (adapted to use db.js like BizSimHub)
import { sql } from '@vercel/postgres';
import { requireAuth, cors } from '../../lib-neg/auth.js';
import { UserDB } from '../../lib-neg/db.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const decoded = await requireAuth(req, res);
  if (!decoded) return;

  try {
    const user = await UserDB.findById(decoded.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    let sessionCount = { rows: [{ count: 0 }] };
    try { sessionCount = await sql`SELECT COUNT(*) as count FROM negotiation_sessions WHERE user_id = ${user.id}`; } catch(e) {}

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan || 'free',
        free_sessions_used: user.free_sessions_used || 0,
        isAdmin: user.is_admin,
        authProvider: user.auth_provider,
        createdAt: user.created_at,
        sessionCount: parseInt(sessionCount.rows[0].count)
      }
    });
  } catch (error) {
    console.error('Me error:', error);
    return res.status(500).json({ error: 'Failed to fetch user data' });
  }
}
