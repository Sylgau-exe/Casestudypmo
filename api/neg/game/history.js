// api/game/history.js — User session history and progress
import { cors, getUserFromRequest } from '../../../lib-neg/auth.js';
import { UserDB, SessionDB } from '../../../lib-neg/db.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const decoded = getUserFromRequest(req);
    if (!decoded) return res.status(401).json({ error: 'Authentication required' });

    const sessions = await SessionDB.getUserSessions(decoded.userId);
    const progress = await SessionDB.getUserProgress(decoded.userId);
    const user = await UserDB.findById(decoded.userId);

    // Count completed sessions (not just scored ones)
    const completedSessions = sessions.filter(s =>
      s.status === 'completed' || s.status === 'walkaway'
    );

    // Sessions left for free users
    let sessionsLeft = null;
    if (user.plan === 'free') {
      sessionsLeft = Math.max(0, 3 - (user.free_sessions_used || 0));
    }

    return res.status(200).json({
      sessions: completedSessions.map(s => ({
        id: s.id,
        scenario_id: s.scenario_id,
        status: s.status,
        deal_reached: s.deal_reached,
        exchange_count: s.exchange_count,
        score: s.overall_score,
        grade: s.grade,
        scorecard: s.scorecard,
        debrief: s.debrief,
        created_at: s.created_at,
        completed_at: s.completed_at
      })),
      progress: {
        total_sessions: completedSessions.length,
        avg_score: progress.avg_score ? parseFloat(progress.avg_score) : null,
        best_grade: progress.best_grade || null
      },
      sessionsLeft
    });
  } catch (err) {
    console.error('History error:', err);
    return res.status(500).json({ error: 'Failed to load history' });
  }
}
