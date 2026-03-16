// api/game/ask-louis.js - On-demand Louis coaching during negotiation (conversational)
import { cors, getUserFromRequest } from '../../../lib-neg/auth.js';
import { SessionDB, MessageDB } from '../../../lib-neg/db.js';
import { getScenario } from '../../../lib-neg/scenarios.js';
import { getAskLouisConversationalPrompt, getAskLouisPrompt } from '../../../lib-neg/louis.js';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const decoded = getUserFromRequest(req);
    if (!decoded) return res.status(401).json({ error: 'Authentication required' });

    const { sessionId, question, playerName, lang, louisHistory } = req.body;
    if (!sessionId || !question) return res.status(400).json({ error: 'sessionId and question required' });

    const session = await SessionDB.findById(sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (session.user_id !== decoded.userId) return res.status(403).json({ error: 'Not your session' });

    const scenario = getScenario(session.scenario_id);
    if (!scenario) return res.status(500).json({ error: 'Scenario not found' });

    // Get recent negotiation conversation history
    const history = await MessageDB.getBySession(sessionId);

    // Use conversational prompt if louisHistory is provided, otherwise fallback
    let prompt;
    if (louisHistory && louisHistory.length > 0) {
      prompt = getAskLouisConversationalPrompt(scenario, history, louisHistory, question, playerName || 'Student', lang || 'en');
    } else {
      prompt = getAskLouisPrompt(scenario, history, question, playerName || 'Student', lang || 'en');
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }]
    });
    const advice = response.content[0].text;

    // Save as louis message (don't increment exchange count)
    await MessageDB.create(sessionId, 'louis', `[Asked: "${question}"]\n${advice}`, null, session.exchange_count);

    return res.status(200).json({ advice, question });
  } catch (err) {
    console.error('Ask Louis error:', err);
    return res.status(500).json({ error: 'Louis is unavailable right now' });
  }
}
