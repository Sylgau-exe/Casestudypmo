import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.POSTGRES_URL);

export const PmoStateDB = {
    // Get current state
    async getState(tenantId = 'default') {
        const result = await sql`
            SELECT projects, people, assignments, triage_items, criteria_weights, updated_at, updated_by
            FROM pmo_state 
            WHERE tenant_id = ${tenantId}
        `;
        if (result.length === 0) {
            // Create default state if not exists
            await sql`
                INSERT INTO pmo_state (tenant_id, projects, people, assignments, triage_items, criteria_weights)
                VALUES (${tenantId}, '[]', '{}', '{}', '[]', '{}')
            `;
            return {
                projects: [],
                people: {},
                assignments: {},
                triageItems: [],
                criteriaWeights: {},
                updatedAt: new Date().toISOString(),
                updatedBy: null
            };
        }
        const row = result[0];
        return {
            projects: row.projects || [],
            people: row.people || {},
            assignments: row.assignments || {},
            triageItems: row.triage_items || [],
            criteriaWeights: row.criteria_weights || {},
            updatedAt: row.updated_at,
            updatedBy: row.updated_by
        };
    },

    // Save state
    async saveState(state, userName = null, tenantId = 'default') {
        const result = await sql`
            UPDATE pmo_state 
            SET 
                projects = ${JSON.stringify(state.projects || [])},
                people = ${JSON.stringify(state.people || {})},
                assignments = ${JSON.stringify(state.assignments || {})},
                triage_items = ${JSON.stringify(state.triageItems || [])},
                criteria_weights = ${JSON.stringify(state.criteriaWeights || {})},
                updated_at = NOW(),
                updated_by = ${userName}
            WHERE tenant_id = ${tenantId}
            RETURNING updated_at
        `;
        
        // Log activity
        await sql`
            INSERT INTO pmo_activity_log (tenant_id, action, details, user_name)
            VALUES (${tenantId}, 'state_update', ${JSON.stringify({
                projectCount: (state.projects || []).length,
                peopleCount: Object.keys(state.people || {}).length
            })}, ${userName})
        `;
        
        return { success: true, updatedAt: result[0]?.updated_at };
    },

    // Get activity log
    async getActivityLog(tenantId = 'default', limit = 50) {
        const result = await sql`
            SELECT action, details, user_name, created_at
            FROM pmo_activity_log
            WHERE tenant_id = ${tenantId}
            ORDER BY created_at DESC
            LIMIT ${limit}
        `;
        return result;
    }
};

export default sql;
