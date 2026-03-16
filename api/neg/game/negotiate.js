// api/game/negotiate.js - Core negotiation exchange
import { cors, getUserFromRequest } from '../../../lib-neg/auth.js';
import { SessionDB, MessageDB } from '../../../lib-neg/db.js';
import { getScenario } from '../../../lib-neg/scenarios.js';
import { getCounterpartPrompt, getHintPrompt } from '../../../lib-neg/louis.js';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const decoded = getUserFromRequest(req);
    if (!decoded) return res.status(401).json({ error: 'Authentication required' });

    const { sessionId, message, action, lang } = req.body;
    const effectiveLang = lang || 'en';

    // Handle "abandon" — no sessionId needed, finds active session
    if (action === 'abandon') {
      const active = await SessionDB.getActive(decoded.userId);
      if (active) {
        await SessionDB.complete(active.id, false, 'abandoned');
      }
      return res.status(200).json({ success: true, message: 'Session abandoned' });
    }

    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

    const session = await SessionDB.findById(sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (session.user_id !== decoded.userId) return res.status(403).json({ error: 'Not your session' });
    if (session.status === 'completed' || session.status === 'walkaway' || session.status === 'abandoned') {
      return res.status(400).json({ error: 'Session already ended' });
    }

    const scenario = getScenario(session.scenario_id);
    if (!scenario) return res.status(500).json({ error: 'Scenario configuration error' });

    // Handle "begin negotiation" action
    if (action === 'begin') {
      await SessionDB.startNegotiation(sessionId);

      // Generate counterpart's opening
      const counterpartPrompt = getCounterpartPrompt(scenario, [], effectiveLang);
      const counterpartResponse = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        system: counterpartPrompt,
        messages: [{ role: 'user', content: `[The negotiation is beginning. You are ${scenario.counterpart.name}. Give your opening statement — introduce yourself and set the tone for the negotiation. Reference your objectives naturally.]` }]
      });
      const counterpartText = counterpartResponse.content[0].text;

      await SessionDB.addExchange(sessionId);
      await MessageDB.create(sessionId, 'counterpart', counterpartText, null, 1);

      return res.status(200).json({
        counterpartMessage: counterpartText,
        counterpartName: scenario.counterpart.name,
        exchangeCount: 1,
        maxExchanges: scenario.exchanges.max,
        status: 'active'
      });
    }

    // Handle "walkaway" action
    if (action === 'walkaway') {
      // Save user's walkaway message
      const walkawayMsg = message || "I'm going to have to walk away from this negotiation.";
      const exchangeNum = session.exchange_count + 1;
      await MessageDB.create(sessionId, 'user', walkawayMsg, null, exchangeNum);

      // Get counterpart's reaction to walkaway
      const history = await MessageDB.getBySession(sessionId);
      const counterpartPrompt = getCounterpartPrompt(scenario, history.filter(m => m.role !== 'louis'), effectiveLang);
      const counterpartResponse = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system: counterpartPrompt,
        messages: [{ role: 'user', content: `[The other party has indicated they want to walk away. Give a brief reaction — express regret and optionally make one final concession attempt. Keep it to 2-3 sentences.]` }]
      });
      const counterpartText = counterpartResponse.content[0].text;
      await MessageDB.create(sessionId, 'counterpart', counterpartText, null, exchangeNum);

      await SessionDB.complete(sessionId, false, 'user');

      return res.status(200).json({
        counterpartMessage: counterpartText,
        status: 'walkaway',
        message: 'You walked away from the negotiation.'
      });
    }

    // Handle "accept" action (accept current offer / deal)
    if (action === 'accept') {
      const acceptMsg = message || "I think we have a deal. Let's move forward with these terms.";
      const exchangeNum = session.exchange_count + 1;
      await MessageDB.create(sessionId, 'user', acceptMsg, null, exchangeNum);

      // Get counterpart's reaction to deal
      const history = await MessageDB.getBySession(sessionId);
      const counterpartPrompt = getCounterpartPrompt(scenario, history.filter(m => m.role !== 'louis'), effectiveLang);
      const counterpartResponse = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system: counterpartPrompt,
        messages: [{ role: 'user', content: `[The other party has agreed to the terms discussed. Confirm the deal positively and briefly summarize what was agreed. Keep it to 2-3 sentences.]` }]
      });
      const counterpartText = counterpartResponse.content[0].text;
      await MessageDB.create(sessionId, 'counterpart', counterpartText, null, exchangeNum);

      await SessionDB.complete(sessionId, true, null);

      return res.status(200).json({
        counterpartMessage: counterpartText,
        status: 'completed',
        message: 'Deal reached!'
      });
    }

    // Handle regular negotiation message
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message required' });
    }

    const exchangeNum = session.exchange_count + 1;

    // Save user message
    await MessageDB.create(sessionId, 'user', message, null, exchangeNum);

    // Get full conversation history
    const history = await MessageDB.getBySession(sessionId);
    const negotiationHistory = history.filter(m => m.role !== 'louis');

    // Generate counterpart response
    const counterpartPrompt = getCounterpartPrompt(scenario, negotiationHistory, effectiveLang);

    // Build messages array for Anthropic (alternating user/assistant)
    const apiMessages = [];
    let lastRole = null;
    for (const msg of negotiationHistory) {
      const role = msg.role === 'user' ? 'user' : 'assistant';
      if (role === lastRole) {
        // Merge consecutive same-role messages
        apiMessages[apiMessages.length - 1].content += '\n' + msg.content;
      } else {
        apiMessages.push({ role, content: msg.content });
      }
      lastRole = role;
    }

    // Ensure last message is from user
    if (apiMessages.length === 0 || apiMessages[apiMessages.length - 1].role !== 'user') {
      apiMessages.push({ role: 'user', content: message });
    }

    const counterpartResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      system: counterpartPrompt,
      messages: apiMessages
    });
    const counterpartText = counterpartResponse.content[0].text;

    // Save counterpart response
    await MessageDB.create(sessionId, 'counterpart', counterpartText, null, exchangeNum);
    await SessionDB.addExchange(sessionId);

    // Check if counterpart initiated walkaway
    const lowerResponse = counterpartText.toLowerCase();
    const counterpartWalkaway = lowerResponse.includes('walk away') || lowerResponse.includes('end this negotiation') || lowerResponse.includes('cannot continue');

    if (counterpartWalkaway && exchangeNum >= scenario.exchanges.min) {
      await SessionDB.complete(sessionId, false, 'counterpart');
      return res.status(200).json({
        counterpartMessage: counterpartText,
        status: 'walkaway',
        walkawayParty: 'counterpart',
        exchangeCount: exchangeNum,
        message: `${scenario.counterpart.name} walked away from the negotiation.`
      });
    }

    // Generate optional Louis hint (every 3 exchanges)
    let louisHint = null;
    if (exchangeNum % 3 === 0 && exchangeNum < scenario.exchanges.max) {
      try {
        const hintPrompt = getHintPrompt(scenario, negotiationHistory, message, effectiveLang);
        const hintResponse = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 100,
          messages: [{ role: 'user', content: hintPrompt }]
        });
        louisHint = hintResponse.content[0].text;
        await MessageDB.create(sessionId, 'louis', louisHint, null, exchangeNum);
      } catch (e) {
        console.error('Louis hint error:', e);
      }
    }

    // Check if we should suggest wrapping up
    const nearEnd = exchangeNum >= scenario.exchanges.max - 2;

    return res.status(200).json({
      counterpartMessage: counterpartText,
      counterpartName: scenario.counterpart.name,
      louisHint,
      exchangeCount: exchangeNum,
      maxExchanges: scenario.exchanges.max,
      nearEnd,
      status: 'active'
    });
  } catch (err) {
    console.error('Negotiate error:', err);
    return res.status(500).json({ error: 'Negotiation failed' });
  }
}
