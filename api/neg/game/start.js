// api/game/start.js - Start a new negotiation session
import { cors, getUserFromRequest } from '../../../lib-neg/auth.js';
import { UserDB, SessionDB, MessageDB } from '../../../lib-neg/db.js';
import { getScenario } from '../../../lib-neg/scenarios.js';
import { getBriefingPrompt } from '../../../lib-neg/louis.js';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const decoded = getUserFromRequest(req);
    if (!decoded) return res.status(401).json({ error: 'Authentication required' });

    const { scenarioId, difficulty, lang } = req.body;
    if (!scenarioId) return res.status(400).json({ error: 'scenarioId required' });

    const scenario = getScenario(scenarioId);
    if (!scenario) return res.status(404).json({ error: 'Scenario not found' });

    // Check if user can start a session (plan + scenario access)
    const access = await UserDB.canStartSession(decoded.userId, scenarioId);
    if (!access.allowed) {
      const msg = access.code === 'SCENARIO_LOCKED' 
        ? 'This scenario requires a paid plan.' 
        : 'Free trial used. Upgrade to continue.';
      return res.status(403).json({ error: msg, code: access.code });
    }

    // Check for active session
    const active = await SessionDB.getActive(decoded.userId);
    if (active) {
      return res.status(409).json({
        error: 'You have an active session',
        activeSessionId: active.id,
        activeScenario: active.scenario_id
      });
    }

    // Create session
    const session = await SessionDB.create(
      decoded.userId,
      scenarioId,
      difficulty || 'standard'
    );

    // Generate Louis briefing (pass lang for bilingual support)
    const briefingPrompt = getBriefingPrompt(scenario, lang || 'en');
    const briefingResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [{ role: 'user', content: briefingPrompt }]
    });
    const briefingText = briefingResponse.content[0].text;

    // Save Louis briefing as first message
    await MessageDB.create(session.id, 'louis', briefingText, null, 0);

    // Increment free sessions if on free plan
    const user = await UserDB.findById(decoded.userId);
    if (user.plan === 'free') {
      await UserDB.incrementFreeSessions(decoded.userId);
    }

    return res.status(200).json({
      sessionId: session.id,
      scenario: {
        id: scenario.id,
        title: scenario.title,
        subtitle: scenario.subtitle,
        difficulty: scenario.difficulty,
        duration: scenario.duration,
        counterpartName: scenario.counterpart.name,
        counterpartTitle: scenario.counterpart.title,
        icon: scenario.icon
      },
      briefing: {
        louis: briefingText,
        roleBrief: scenario.userBrief,
        issues: scenario.issues.map(i => ({
          id: i.id, label: i.label, type: i.type, unit: i.unit,
          ...(i.options ? { options: i.options } : {})
        }))
      }
    });
  } catch (err) {
    console.error('Start session error:', err);
    return res.status(500).json({ error: 'Failed to start session' });
  }
}
