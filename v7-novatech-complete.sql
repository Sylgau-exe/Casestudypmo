-- ═══════════════════════════════════════════════════════
-- NovaTech Robotics PMO — Complete Setup v7 (5 Teams + Registration)
-- Run this ONCE in your Neon SQL console
-- ═══════════════════════════════════════════════════════

-- 1. CREATE TABLES
CREATE TABLE IF NOT EXISTS pmo_state (
    id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(50) DEFAULT 'default',
    projects JSONB DEFAULT '[]',
    people JSONB DEFAULT '{}',
    assignments JSONB DEFAULT '{}',
    triage_items JSONB DEFAULT '[]',
    criteria_weights JSONB DEFAULT '{}',
    team_display_name VARCHAR(100),
    team_password VARCHAR(50),
    updated_at TIMESTAMP DEFAULT NOW(),
    updated_by VARCHAR(100),
    UNIQUE(tenant_id)
);

CREATE TABLE IF NOT EXISTS pmo_users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    team_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pmo_activity_log (
    id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(50) DEFAULT 'default',
    action VARCHAR(50),
    details JSONB,
    user_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pmo_state_tenant ON pmo_state(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pmo_users_team ON pmo_users(team_id);
CREATE INDEX IF NOT EXISTS idx_pmo_users_email ON pmo_users(email);
CREATE INDEX IF NOT EXISTS idx_pmo_activity_tenant ON pmo_activity_log(tenant_id);

-- 2. If upgrading from v6 (tables already exist), add new columns
ALTER TABLE pmo_state ADD COLUMN IF NOT EXISTS team_display_name VARCHAR(100);
ALTER TABLE pmo_state ADD COLUMN IF NOT EXISTS team_password VARCHAR(50);

-- 3. INSERT 5 TEAMS WITH DEMO DATA
DO $$
DECLARE
    team_ids TEXT[] := ARRAY['team-1','team-2','team-3','team-4','team-5'];
    team_names TEXT[] := ARRAY['Team 1','Team 2','Team 3','Team 4','Team 5'];
    tid TEXT;
    tname TEXT;
    i INT;
    demo_projects JSONB := '[
    {
        "id":"ip1",
        "name":"NR-300 Firmware v3.2 Update",
        "chef":"Raj Patel",
        "source":"operations",
        "branch":"project",
        "status":"in_progress",
        "charter":{
            "sponsor":"Thomas Bergeron",
            "type":"Software Development",
            "priority":"High",
            "overview":"Critical firmware update adding predictive maintenance alerts, improving motion path accuracy by 12%, and patching three cybersecurity vulnerabilities. Two major customers (FoodCo and AutoParts Inc.) contractually waiting for this update before placing $3.2M in repeat orders.",
            "objectives":["Add predictive maintenance alert system","Improve motion path accuracy by 12%","Patch 3 cybersecurity vulnerabilities from Q3 2025 audit"],
            "inScope":"Firmware + Controls + Customer validation",
            "duration":"6",
            "startDate":"2025-11-01",
            "endDate":"2026-04-30",
            "risks":[{"risk":"Customer validation delays","impact":"Medium","mitigation":"Early access beta with FoodCo"}],
            "milestones":[{"phase":"Development","duration":"3 months","date":"Jan 2026"},{"phase":"Testing & validation","duration":"2 months","date":"Mar 2026"},{"phase":"Customer rollout","duration":"1 month","date":"Apr 2026"}],
            "deliverables":["Updated firmware v3.2","Test reports","Customer deployment package"],
            "stakeholders":[{"name":"Thomas Bergeron","role":"Sponsor"},{"name":"FoodCo","role":"Key Customer"},{"name":"AutoParts Inc.","role":"Key Customer"}]
        },
        "scores":{"strategic_fit":8,"productivity":7,"market":8,"core_competency":9,"feasibility":8,"mission":7},
        "resources":40,
        "triageDate":"2025-10-15"
    },
    {
        "id":"ip2",
        "name":"ISO 9001:2015 Recertification",
        "chef":"Amir Hassan",
        "source":"executive",
        "branch":"project",
        "status":"in_progress",
        "charter":{
            "sponsor":"Isabelle Chen",
            "type":"Compliance",
            "priority":"Critical",
            "overview":"ISO 9001:2015 certification expires April 2026. Recertification audit scheduled March 17-21. Loss of certification would disqualify NovaTech from automotive sector contracts representing 28% of revenue.",
            "objectives":["Pass ISO 9001:2015 recertification audit","Close all outstanding corrective actions","Update quality management documentation"],
            "inScope":"Quality Management System + All departments",
            "duration":"6",
            "startDate":"2025-10-01",
            "endDate":"2026-03-31",
            "risks":[{"risk":"Outstanding CARs not closed in time","impact":"High","mitigation":"Weekly CAR review meetings"},{"risk":"Audit findings requiring major changes","impact":"Medium","mitigation":"Pre-audit internal assessment"}],
            "milestones":[{"phase":"Documentation review","duration":"2 months","date":"Dec 2025"},{"phase":"Internal audit & CARs","duration":"2 months","date":"Feb 2026"},{"phase":"External audit","duration":"1 month","date":"Mar 2026"}],
            "deliverables":["Updated QMS documentation","Internal audit report","Corrective action closure evidence","ISO certificate renewal"],
            "stakeholders":[{"name":"Isabelle Chen","role":"Sponsor"},{"name":"All department heads","role":"Stakeholders"}]
        },
        "scores":{"strategic_fit":9,"productivity":5,"market":7,"core_competency":8,"feasibility":9,"mission":8},
        "resources":45,
        "triageDate":"2025-09-20"
    }
]';
    demo_people JSONB := '[
    {"id":"pers-dominique","name":"Dominique Lafleur","functionId":"mechanical_eng","availByMonth":{"2026-01":80,"2026-02":80,"2026-03":80,"2026-04":80,"2026-05":80,"2026-06":40,"2026-07":40,"2026-08":60,"2026-09":80,"2026-10":80}},
    {"id":"pers-raj","name":"Raj Patel","functionId":"software_eng","availByMonth":{"2026-01":60,"2026-02":60,"2026-03":60,"2026-04":60,"2026-05":60,"2026-06":40,"2026-07":20,"2026-08":40,"2026-09":60,"2026-10":60}},
    {"id":"pers-yuki","name":"Yuki Tanaka","functionId":"manufacturing_eng","availByMonth":{"2026-01":60,"2026-02":60,"2026-03":60,"2026-04":60,"2026-05":60,"2026-06":30,"2026-07":30,"2026-08":40,"2026-09":60,"2026-10":60}},
    {"id":"pers-amir","name":"Amir Hassan","functionId":"quality_eng","availByMonth":{"2026-01":40,"2026-02":40,"2026-03":40,"2026-04":40,"2026-05":40,"2026-06":20,"2026-07":20,"2026-08":30,"2026-09":40,"2026-10":40}},
    {"id":"pers-steve","name":"Steve Moreau","functionId":"it_systems","availByMonth":{"2026-01":80,"2026-02":80,"2026-03":80,"2026-04":80,"2026-05":80,"2026-06":60,"2026-07":40,"2026-08":60,"2026-09":80,"2026-10":80}},
    {"id":"pers-line","name":"Line Bhatt","functionId":"product_mgmt","availByMonth":{"2026-01":60,"2026-02":60,"2026-03":60,"2026-04":60,"2026-05":60,"2026-06":40,"2026-07":20,"2026-08":40,"2026-09":60,"2026-10":60}}
]';
    demo_assignments JSONB := '{
    "ip1":{
        "pers-raj":{"2026-01":30,"2026-02":30,"2026-03":25,"2026-04":20},
        "pers-line":{"2026-01":10,"2026-02":10,"2026-03":5,"2026-04":5}
    },
    "ip2":{
        "pers-amir":{"2026-01":25,"2026-02":30,"2026-03":35},
        "pers-yuki":{"2026-01":10,"2026-02":15,"2026-03":20}
    }
}';
    demo_weights JSONB := '{"strategic_fit":25,"productivity":20,"market":15,"core_competency":15,"feasibility":15,"mission":10}';
BEGIN
    FOR i IN 1..5 LOOP
        tid := team_ids[i];
        tname := team_names[i];
        INSERT INTO pmo_state (tenant_id, team_display_name, projects, people, assignments, triage_items, criteria_weights, updated_by)
        VALUES (tid, tname, demo_projects, demo_people, demo_assignments, '[]'::jsonb, demo_weights, 'System - NovaTech Setup')
        ON CONFLICT (tenant_id) DO UPDATE SET
            team_display_name = COALESCE(pmo_state.team_display_name, tname),
            projects = demo_projects,
            people = demo_people,
            assignments = demo_assignments,
            triage_items = '[]'::jsonb,
            criteria_weights = demo_weights,
            updated_at = NOW(),
            updated_by = 'System - NovaTech Reset';
    END LOOP;
END $$;

-- Verify: should show 5 rows
SELECT tenant_id, team_display_name, team_password IS NOT NULL as has_password, 
       jsonb_array_length(projects) as projects, jsonb_array_length(people) as resources
FROM pmo_state ORDER BY tenant_id;
