// api/game/score.js — Generate scorecard for completed session
import { cors, getUserFromRequest } from '../../lib-neg/auth.js';
import { SessionDB, MessageDB } from '../../lib-neg/db.js';
import { getScenario, calculateGrade } from '../../lib-neg/scenarios.js';
import { getScoringPrompt, getDebriefPrompt } from '../../lib-neg/louis.js';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Robust JSON extraction — handles AI wrapping JSON in commentary
function extractJSON(text) {
  // Strip markdown fences
  let clean = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  // Try direct parse first
  try { return JSON.parse(clean); } catch(e) {}
  // Find first { and last } — extract the JSON object
  const start = clean.indexOf('{');
  const end = clean.lastIndexOf('}');
  if (start !== -1 && end > start) {
    try { return JSON.parse(clean.substring(start, end + 1)); } catch(e) {}
  }
  return null;
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const decoded = getUserFromRequest(req);
    if (!decoded) return res.status(401).json({ error: 'Authentication required' });

    const { sessionId, lang } = req.body;
    const effectiveLang = lang || 'en';
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

    const session = await SessionDB.findById(sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (session.user_id !== decoded.userId) return res.status(403).json({ error: 'Not your session' });

    // Check if already scored (scorecard stored as JSONB in session row)
    if (session.scorecard) {
      return res.status(200).json({ scorecard: session.scorecard, debrief: session.debrief });
    }

    const scenario = getScenario(session.scenario_id);
    const transcript = await MessageDB.getBySession(sessionId);

    const dealOutcome = {
      dealReached: session.deal_reached,
      walkawayParty: session.walkaway_party
    };

    // Generate AI scoring
    const scoringPrompt = getScoringPrompt(scenario, transcript, dealOutcome, effectiveLang);
    const scoringResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [{ role: 'user', content: scoringPrompt }]
    });

    let scores;
    try {
      scores = extractJSON(scoringResponse.content[0].text);
      if (!scores) throw new Error('No JSON found');
    } catch (e) {
      console.error('Score parse error:', e);
      scores = { dealValue: 50, valueCreation: 50, relationship: 50, processSkill: 50, efficiency: 50, strategicAwareness: 50, overallScore: 50, dealReached: session.deal_reached };
    }

    const grade = calculateGrade(scores.overallScore);

    // Build scorecard object
    const scorecard = {
      ...scores,
      grade,
      scenarioId: session.scenario_id,
      dealReached: session.deal_reached,
      walkawayJustified: scores.walkawayJustified || false
    };

    // Generate debrief
    const debriefPrompt = getDebriefPrompt(scenario, transcript, scores, effectiveLang);
    const debriefResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1200,
      messages: [{ role: 'user', content: debriefPrompt }]
    });

    let debriefData;
    try {
      debriefData = extractJSON(debriefResponse.content[0].text);
      if (!debriefData) throw new Error('No JSON found in debrief');
    } catch (e) {
      console.error('Debrief parse error:', e);
      debriefData = effectiveLang === 'fr' ? {
        summary: 'Session terminée. Consultez votre bulletin pour un retour détaillé.',
        strengths: ['Négociation complétée'],
        improvements: ['Pratiquez davantage de scénarios'],
        missedOpportunities: [],
        tacticalAnalysis: 'Continuez à pratiquer pour améliorer vos compétences.',
        nextSessionAdvice: 'Essayez un scénario différent pour élargir votre expérience.'
      } : {
        summary: 'Session completed. Review your scorecard for detailed feedback.',
        strengths: ['Completed the negotiation'],
        improvements: ['Practice more scenarios'],
        missedOpportunities: [],
        tacticalAnalysis: 'Continue practicing to improve your negotiation skills.',
        nextSessionAdvice: 'Try a different scenario to broaden your experience.'
      };
    }

    // Save score and debrief to the session row (SessionDB.saveScore exists in db.js)
    await SessionDB.saveScore(sessionId, scorecard, debriefData);

    return res.status(200).json({ scorecard, debrief: debriefData });
  } catch (err) {
    console.error('Score error:', err);
    return res.status(500).json({ error: 'Scoring failed' });
  }
}
