-- plan_state: stores Charter + Plan JSON per team
-- Run this in Neon console for the casestudypmo database

CREATE TABLE IF NOT EXISTS plan_state (
    id SERIAL PRIMARY KEY,
    team_id TEXT NOT NULL UNIQUE,
    state JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_plan_state_team ON plan_state(team_id);
