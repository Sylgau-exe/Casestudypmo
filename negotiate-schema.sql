-- ═══════════════════════════════════════
-- NegotiateSim Tables for YCBS 288
-- Run ONCE in your Neon SQL console
-- Uses neg_users to avoid collision with PMO pmo_users
-- ═══════════════════════════════════════

-- Negotiation users (separate from PMO users)
CREATE TABLE IF NOT EXISTS neg_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255),
  plan VARCHAR(50) DEFAULT 'course',
  free_sessions_used INTEGER DEFAULT 0,
  is_admin BOOLEAN DEFAULT false,
  auth_provider VARCHAR(50) DEFAULT 'email',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Negotiation sessions
CREATE TABLE IF NOT EXISTS negotiation_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES neg_users(id) ON DELETE CASCADE,
  scenario_id VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20) DEFAULT 'standard',
  status VARCHAR(20) DEFAULT 'briefing',
  exchange_count INTEGER DEFAULT 0,
  deal_reached BOOLEAN,
  walkaway_party VARCHAR(20),
  overall_score INTEGER,
  grade VARCHAR(2),
  scorecard JSONB,
  debrief JSONB,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Negotiation messages (conversation transcript)
CREATE TABLE IF NOT EXISTS negotiation_messages (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES negotiation_sessions(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  exchange_number INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_neg_users_email ON neg_users(email);
CREATE INDEX IF NOT EXISTS idx_neg_sessions_user ON negotiation_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_neg_sessions_status ON negotiation_sessions(status);
CREATE INDEX IF NOT EXISTS idx_neg_messages_session ON negotiation_messages(session_id);

-- Verify
SELECT 'neg_users' as table_name, COUNT(*) as rows FROM neg_users
UNION ALL
SELECT 'negotiation_sessions', COUNT(*) FROM negotiation_sessions
UNION ALL
SELECT 'negotiation_messages', COUNT(*) FROM negotiation_messages;
