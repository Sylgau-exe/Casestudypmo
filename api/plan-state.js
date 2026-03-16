import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.POSTGRES_URL);

function cors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Team-Name');
}

export default async function handler(req, res) {
    cors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        // ─── POST: register, login, or save state ───
        if (req.method === 'POST') {
            const body = req.body;
            const action = body?.action;

            // ── REGISTER ──
            if (action === 'register') {
                const { team, password } = body;
                if (!team || !password) return res.status(400).json({ error: 'Team name and password are required.' });
                if (password.length < 4) return res.status(400).json({ error: 'Password must be at least 4 characters.' });
                const teamId = team.trim().toLowerCase().replace(/\s+/g, '-');
                // Check if team exists
                const existing = await sql`SELECT team_id FROM plan_state WHERE team_id = ${teamId}`;
                if (existing.length > 0) return res.status(409).json({ error: 'This team name is already taken. Try logging in or choose a different name.' });
                // Create team
                await sql`
                    INSERT INTO plan_state (team_id, team_display_name, team_password, state, updated_at)
                    VALUES (${teamId}, ${team.trim()}, ${password}, '{}', NOW())
                `;
                return res.status(201).json({ success: true, teamId, teamName: team.trim() });
            }

            // ── LOGIN ──
            if (action === 'login') {
                const { team, password } = body;
                if (!team || !password) return res.status(400).json({ error: 'Team name and password are required.' });
                const teamId = team.trim().toLowerCase().replace(/\s+/g, '-');
                const result = await sql`
                    SELECT team_id, team_display_name, team_password
                    FROM plan_state
                    WHERE team_id = ${teamId}
                `;
                if (result.length === 0) return res.status(400).json({ error: 'Team not found. Please register first.' });
                if (result[0].team_password !== password) return res.status(400).json({ error: 'Incorrect password.' });
                return res.status(200).json({
                    success: true,
                    teamId: result[0].team_id,
                    teamName: result[0].team_display_name || team.trim()
                });
            }

            // ── SAVE STATE ──
            const teamId = req.query.team;
            if (!teamId) return res.status(400).json({ error: 'Missing ?team= parameter' });
            const userName = req.headers['x-team-name'] || null;
            if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Body must be JSON object' });

            const result = await sql`
                INSERT INTO plan_state (team_id, state, updated_by, updated_at)
                VALUES (${teamId}, ${JSON.stringify(body)}, ${userName}, NOW())
                ON CONFLICT (team_id)
                DO UPDATE SET
                    state = ${JSON.stringify(body)},
                    updated_by = ${userName},
                    updated_at = NOW()
                RETURNING updated_at
            `;
            return res.status(200).json({ success: true, updatedAt: result[0]?.updated_at });
        }

        // ─── GET: load team's plan state ───
        if (req.method === 'GET') {
            const teamId = req.query.team;
            if (!teamId) return res.status(400).json({ error: 'Missing ?team= parameter' });
            const result = await sql`
                SELECT state, updated_at, updated_by
                FROM plan_state
                WHERE team_id = ${teamId}
            `;
            if (result.length === 0) return res.status(200).json({ state: null, updatedAt: null });
            return res.status(200).json({
                state: result[0].state,
                updatedAt: result[0].updated_at,
                updatedBy: result[0].updated_by
            });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('Plan state API error:', error);
        return res.status(500).json({ error: 'Database error', details: error.message });
    }
}
