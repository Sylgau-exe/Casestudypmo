import { PmoStateDB } from '../lib/db.js';

function cors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-User-Name');
}

export default async function handler(req, res) {
    cors(res);
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const tenantId = req.query.tenant || 'default';

    try {
        if (req.method === 'GET') {
            // Load state from database
            const state = await PmoStateDB.getState(tenantId);
            return res.status(200).json(state);
        }

        if (req.method === 'POST') {
            // Save state to database
            const state = req.body;
            const userName = req.headers['x-user-name'] || null;
            
            const result = await PmoStateDB.saveState(state, userName, tenantId);
            return res.status(200).json(result);
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('State API error:', error);
        return res.status(500).json({ error: 'Database error', details: error.message });
    }
}
