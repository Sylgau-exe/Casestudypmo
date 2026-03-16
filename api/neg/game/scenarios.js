// api/game/scenarios.js - List available scenarios
import { cors } from '../../../lib-neg/auth.js';
import { getScenarioList } from '../../../lib-neg/scenarios.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const scenarios = getScenarioList();
    return res.status(200).json({ scenarios });
  } catch (err) {
    console.error('Scenarios error:', err);
    return res.status(500).json({ error: 'Failed to load scenarios' });
  }
}
