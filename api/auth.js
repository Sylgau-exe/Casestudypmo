import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.POSTGRES_URL);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin2026';

function cors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
    cors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { action } = req.body;

    try {
        // ═══ LIST TEAMS (for registration dropdown) ═══
        if (action === 'list-teams') {
            const teams = await sql`
                SELECT tenant_id, team_display_name, 
                       (team_password IS NOT NULL) as is_active
                FROM pmo_state 
                WHERE team_password IS NOT NULL
                ORDER BY tenant_id
            `;
            return res.status(200).json({ teams });
        }

        // ═══ REGISTER ═══
        if (action === 'register') {
            const { firstName, lastName, email, teamId } = req.body;

            if (!firstName || !lastName || !email || !teamId) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            // Check team exists and has a password set
            const team = await sql`
                SELECT tenant_id, team_display_name, team_password 
                FROM pmo_state WHERE tenant_id = ${teamId}
            `;
            if (team.length === 0) {
                return res.status(400).json({ error: 'Team not found' });
            }
            if (!team[0].team_password) {
                return res.status(400).json({ error: 'This team is not yet activated. Ask your instructor to set a password.' });
            }

            // Check email not already registered
            const existing = await sql`SELECT id FROM pmo_users WHERE email = ${email.toLowerCase().trim()}`;
            if (existing.length > 0) {
                return res.status(400).json({ error: 'This email is already registered. Use Login instead.' });
            }

            // Check team capacity (max 6 per team)
            const count = await sql`SELECT COUNT(*) as cnt FROM pmo_users WHERE team_id = ${teamId}`;
            if (parseInt(count[0].cnt) >= 6) {
                return res.status(400).json({ error: 'This team is full (max 6 members). Choose another team.' });
            }

            // Create user
            const result = await sql`
                INSERT INTO pmo_users (first_name, last_name, email, team_id)
                VALUES (${firstName.trim()}, ${lastName.trim()}, ${email.toLowerCase().trim()}, ${teamId})
                RETURNING id, first_name, last_name, email, team_id
            `;

            return res.status(200).json({
                success: true,
                user: result[0],
                teamName: team[0].team_display_name,
                message: 'Registration successful! You can now log in.'
            });
        }

        // ═══ LOGIN ═══
        if (action === 'login') {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            // Find user
            const user = await sql`
                SELECT u.id, u.first_name, u.last_name, u.email, u.team_id,
                       s.team_display_name, s.team_password
                FROM pmo_users u
                JOIN pmo_state s ON s.tenant_id = u.team_id
                WHERE u.email = ${email.toLowerCase().trim()}
            `;

            if (user.length === 0) {
                return res.status(400).json({ error: 'Email not found. Register first.' });
            }

            // Check team password
            if (user[0].team_password !== password) {
                return res.status(400).json({ error: 'Incorrect password' });
            }

            return res.status(200).json({
                success: true,
                user: {
                    id: user[0].id,
                    firstName: user[0].first_name,
                    lastName: user[0].last_name,
                    email: user[0].email,
                    teamId: user[0].team_id,
                    teamName: user[0].team_display_name
                }
            });
        }

        // ═══ ADMIN LOGIN ═══
        if (action === 'admin-login') {
            const { password } = req.body;
            
            if (password !== ADMIN_PASSWORD) {
                return res.status(400).json({ error: 'Incorrect admin password' });
            }

            return res.status(200).json({ success: true, role: 'admin' });
        }

        return res.status(400).json({ error: 'Unknown action' });

    } catch (error) {
        console.error('Auth error:', error);
        return res.status(500).json({ error: 'Server error', details: error.message });
    }
}
