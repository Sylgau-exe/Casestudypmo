// api/neg/auth/register.js - YCBS 288 Course Edition
import { UserDB } from '../../lib-neg/db.js';
import { generateToken, cors } from '../../lib-neg/auth.js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password, name } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: 'All fields required' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

  try {
    const existing = await UserDB.findByEmail(email.toLowerCase());
    if (existing) return res.status(409).json({ error: 'Email already registered. Please log in.' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await UserDB.create(email.toLowerCase(), passwordHash, name);
    const token = generateToken(user);

    return res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Registration failed' });
  }
}
