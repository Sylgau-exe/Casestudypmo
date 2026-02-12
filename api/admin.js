import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.POSTGRES_URL);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin2026';

function cors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Token');
}

function checkAdmin(req) {
    return req.headers['x-admin-token'] === ADMIN_PASSWORD;
}

export default async function handler(req, res) {
    cors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (!checkAdmin(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // ═══ GET — Dashboard data ═══
        if (req.method === 'GET') {
            // Get all teams with their passwords and user counts
            const teams = await sql`
                SELECT s.tenant_id, s.team_display_name, s.team_password, s.updated_at,
                       COALESCE(jsonb_array_length(s.projects), 0) as project_count
                FROM pmo_state s
                ORDER BY s.tenant_id
            `;

            // Get all users grouped by team
            const users = await sql`
                SELECT id, first_name, last_name, email, team_id, created_at
                FROM pmo_users
                ORDER BY team_id, created_at
            `;

            return res.status(200).json({ teams, users });
        }

        // ═══ POST — Admin actions ═══
        if (req.method === 'POST') {
            const { action } = req.body;

            // Set team password
            if (action === 'set-password') {
                const { teamId, password } = req.body;
                if (!teamId || !password) {
                    return res.status(400).json({ error: 'Team ID and password required' });
                }
                if (password.length < 4) {
                    return res.status(400).json({ error: 'Password must be at least 4 characters' });
                }
                await sql`
                    UPDATE pmo_state SET team_password = ${password} 
                    WHERE tenant_id = ${teamId}
                `;
                return res.status(200).json({ success: true, message: `Password set for ${teamId}` });
            }

            // Set team display name
            if (action === 'set-name') {
                const { teamId, name } = req.body;
                if (!teamId || !name) {
                    return res.status(400).json({ error: 'Team ID and name required' });
                }
                await sql`
                    UPDATE pmo_state SET team_display_name = ${name.trim()} 
                    WHERE tenant_id = ${teamId}
                `;
                return res.status(200).json({ success: true, message: `Name updated for ${teamId}` });
            }

            // Remove a student
            if (action === 'remove-user') {
                const { userId } = req.body;
                if (!userId) {
                    return res.status(400).json({ error: 'User ID required' });
                }
                await sql`DELETE FROM pmo_users WHERE id = ${userId}`;
                return res.status(200).json({ success: true, message: 'User removed' });
            }

            // Reset team data (wipe their PMO work)
            if (action === 'reset-team') {
                const { teamId } = req.body;
                if (!teamId) {
                    return res.status(400).json({ error: 'Team ID required' });
                }
                // Reset to empty state but keep password and name
                await sql`
                    UPDATE pmo_state 
                    SET projects = '[]'::jsonb, 
                        people = '[]'::jsonb,
                        assignments = '{}'::jsonb, 
                        triage_items = '[]'::jsonb,
                        updated_at = NOW(),
                        updated_by = 'Admin Reset'
                    WHERE tenant_id = ${teamId}
                `;
                return res.status(200).json({ success: true, message: `Team ${teamId} data reset` });
            }

            // Reload demo data for a team
            if (action === 'reload-demo') {
                const { teamId } = req.body;
                if (!teamId) {
                    return res.status(400).json({ error: 'Team ID required' });
                }
                
                const demoProjects = [
                    {"id":"ip1","name":"NR-300 Firmware v3.2 Update","chef":"Raj Patel","source":"operations","branch":"project","status":"in_progress","charter":{"sponsor":"Thomas Bergeron","type":"Software Development","priority":"High","overview":"Critical firmware update. Two major customers contractually waiting for $3.2M in repeat orders.","objectives":["Add predictive maintenance","Improve motion accuracy 12%","Patch cybersecurity"],"inScope":"Firmware + Controls + Customer validation","duration":"6","startDate":"2025-11-01","endDate":"2026-04-30"},"scores":{"strategic_fit":8,"productivity":7,"market":8,"core_competency":9,"feasibility":8,"mission":7},"resources":40,"triageDate":"2025-10-15"},
                    {"id":"ip2","name":"ISO 9001:2015 Recertification","chef":"Amir Hassan","source":"executive","branch":"project","status":"in_progress","charter":{"sponsor":"Isabelle Chen","type":"Compliance","priority":"Critical","overview":"ISO certification expires April 2026. Audit March 17-21. 28% of revenue at risk.","objectives":["Pass recertification audit","Close corrective actions","Update QMS docs"],"inScope":"Quality Management System + All departments","duration":"6","startDate":"2025-10-01","endDate":"2026-03-31"},"scores":{"strategic_fit":9,"productivity":5,"market":7,"core_competency":8,"feasibility":9,"mission":8},"resources":45,"triageDate":"2025-09-20"}
                ];
                const demoPeople = [
                    {"id":"pers-dominique","name":"Dominique Lafleur","functionId":"mechanical_eng","availByMonth":{"2026-01":80,"2026-02":80,"2026-03":80,"2026-04":80,"2026-05":80,"2026-06":40,"2026-07":40,"2026-08":60,"2026-09":80,"2026-10":80}},
                    {"id":"pers-raj","name":"Raj Patel","functionId":"software_eng","availByMonth":{"2026-01":60,"2026-02":60,"2026-03":60,"2026-04":60,"2026-05":60,"2026-06":40,"2026-07":20,"2026-08":40,"2026-09":60,"2026-10":60}},
                    {"id":"pers-yuki","name":"Yuki Tanaka","functionId":"manufacturing_eng","availByMonth":{"2026-01":60,"2026-02":60,"2026-03":60,"2026-04":60,"2026-05":60,"2026-06":30,"2026-07":30,"2026-08":40,"2026-09":60,"2026-10":60}},
                    {"id":"pers-amir","name":"Amir Hassan","functionId":"quality_eng","availByMonth":{"2026-01":40,"2026-02":40,"2026-03":40,"2026-04":40,"2026-05":40,"2026-06":20,"2026-07":20,"2026-08":30,"2026-09":40,"2026-10":40}},
                    {"id":"pers-steve","name":"Steve Moreau","functionId":"it_systems","availByMonth":{"2026-01":80,"2026-02":80,"2026-03":80,"2026-04":80,"2026-05":80,"2026-06":60,"2026-07":40,"2026-08":60,"2026-09":80,"2026-10":80}},
                    {"id":"pers-line","name":"Line Bhatt","functionId":"product_mgmt","availByMonth":{"2026-01":60,"2026-02":60,"2026-03":60,"2026-04":60,"2026-05":60,"2026-06":40,"2026-07":20,"2026-08":40,"2026-09":60,"2026-10":60}}
                ];
                const demoAssignments = {"ip1":{"pers-raj":{"2026-01":30,"2026-02":30,"2026-03":25,"2026-04":20},"pers-line":{"2026-01":10,"2026-02":10,"2026-03":5,"2026-04":5}},"ip2":{"pers-amir":{"2026-01":25,"2026-02":30,"2026-03":35},"pers-yuki":{"2026-01":10,"2026-02":15,"2026-03":20}}};
                const demoWeights = {"strategic_fit":25,"productivity":20,"market":15,"core_competency":15,"feasibility":15,"mission":10};

                await sql`
                    UPDATE pmo_state 
                    SET projects = ${JSON.stringify(demoProjects)}::jsonb,
                        people = ${JSON.stringify(demoPeople)}::jsonb,
                        assignments = ${JSON.stringify(demoAssignments)}::jsonb,
                        triage_items = '[]'::jsonb,
                        criteria_weights = ${JSON.stringify(demoWeights)}::jsonb,
                        updated_at = NOW(),
                        updated_by = 'Admin - Demo Reload'
                    WHERE tenant_id = ${teamId}
                `;
                return res.status(200).json({ success: true, message: `Demo data reloaded for ${teamId}` });
            }

            return res.status(400).json({ error: 'Unknown action' });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('Admin error:', error);
        return res.status(500).json({ error: 'Server error', details: error.message });
    }
}
