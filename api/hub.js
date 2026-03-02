import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.POSTGRES_URL);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin2026';

function cors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Token');
}

export default async function handler(req, res) {
    cors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        // Ensure hub_settings table exists
        await sql`
            CREATE TABLE IF NOT EXISTS hub_settings (
                id INTEGER PRIMARY KEY DEFAULT 1,
                platform_active BOOLEAN DEFAULT true,
                updated_at TIMESTAMP DEFAULT NOW(),
                CHECK (id = 1)
            )
        `;
        await sql`
            INSERT INTO hub_settings (id, platform_active) 
            VALUES (1, true) 
            ON CONFLICT (id) DO NOTHING
        `;

        // ═══ GET — Platform status (public) ═══
        if (req.method === 'GET') {
            const result = await sql`SELECT platform_active FROM hub_settings WHERE id = 1`;
            const active = result.length > 0 ? result[0].platform_active : true;
            return res.status(200).json({ active });
        }

        // ═══ POST — Admin actions ═══
        if (req.method === 'POST') {
            if (req.headers['x-admin-token'] !== ADMIN_PASSWORD) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const { action, active } = req.body;

            if (action === 'set-active') {
                await sql`
                    UPDATE hub_settings 
                    SET platform_active = ${active === true}, updated_at = NOW() 
                    WHERE id = 1
                `;
                return res.status(200).json({ success: true, active: active === true });
            }

            return res.status(400).json({ error: 'Unknown action' });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('Hub API error:', error);
        return res.status(500).json({ error: 'Server error', details: error.message });
    }
}
