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

    const teamId = req.query.team;
    if (!teamId) return res.status(400).json({ error: 'Missing ?team= parameter' });

    try {
        // ─── GET: load team's plan state ───
        if (req.method === 'GET') {
            const result = await sql`
                SELECT state, updated_at, updated_by
                FROM plan_state
                WHERE team_id = ${teamId}
            `;
            if (result.length === 0) {
                return res.status(200).json({ state: null, updatedAt: null });
            }
            return res.status(200).json({
                state: result[0].state,
                updatedAt: result[0].updated_at,
                updatedBy: result[0].updated_by
            });
        }

        // ─── POST: save team's plan state ───
        if (req.method === 'POST') {
            const body = req.body;
            const userName = req.headers['x-team-name'] || null;

            if (!body || typeof body !== 'object') {
                return res.status(400).json({ error: 'Body must be JSON object' });
            }

            // Upsert: insert or update
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

            return res.status(200).json({
                success: true,
                updatedAt: result[0]?.updated_at
            });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('Plan state API error:', error);
        return res.status(500).json({ error: 'Database error', details: error.message });
    }
}
