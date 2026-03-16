// api/game/tts.js - Edge TTS proxy (Microsoft Neural voices - FREE, unlimited)
import { cors, getUserFromRequest } from '../../../lib-neg/auth.js';
import { EdgeTTS } from '@andresaya/edge-tts';

// Voice mapping — professional male voices for "Louis"
const VOICES = {
  en: 'en-GB-RyanNeural',       // British English male — professional, warm
  fr: 'fr-CA-ThierryNeural'     // Canadian French male — natural Québec accent
};

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const decoded = getUserFromRequest(req);
    if (!decoded) return res.status(401).json({ error: 'Authentication required' });

    const { text, lang } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const cleanText = text.trim().slice(0, 5000);
    const voice = lang === 'fr' ? VOICES.fr : VOICES.en;

    console.log('[TTS] Synthesizing', cleanText.length, 'chars with voice:', voice);

    const tts = new EdgeTTS();
    await tts.synthesize(cleanText, voice, {
      rate: '-5%',
      pitch: '+0Hz',
      volume: '+0%',
      outputFormat: 'audio-24khz-96kbitrate-mono-mp3'
    });

    const audioBuffer = tts.toBuffer();
    console.log('[TTS] Generated audio buffer:', audioBuffer?.length, 'bytes');

    if (!audioBuffer || audioBuffer.length === 0) {
      return res.status(500).json({ error: 'TTS returned empty audio' });
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.length);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.status(200).send(audioBuffer);

  } catch (err) {
    console.error('[TTS] Error:', err.message || err);
    if (!res.headersSent) {
      return res.status(500).json({ error: 'TTS generation failed', detail: err.message });
    }
  }
}
