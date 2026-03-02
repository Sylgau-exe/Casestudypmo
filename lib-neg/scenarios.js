// lib/scenarios.js - NegotiateSim Scenario Library
// Each scenario: role brief, counterpart AI config, negotiable issues, scoring rubric

export const SCENARIOS = {
  salary: {
    id: 'salary',
    title: 'The Salary Negotiation',
    subtitle: 'Negotiate your compensation package for a new role',
    category: 'Career',
    difficulty: 'Beginner',
    difficultyColor: '#1A8A7A',
    duration: '10–15 min',
    exchanges: { min: 8, max: 15 },
    skillsFocus: ['Anchoring', 'BATNA usage', 'Package deals', 'First-offer advantage'],
    icon: '💼',
    description: 'You\'ve been offered a senior product manager role at a growing tech company. The base offer is good but not great. You know your market value, you have a competing offer, and you want to negotiate the full package — salary, signing bonus, equity, and remote work flexibility.',

    userBrief: {
      role: 'Jordan Chen — Senior Product Manager Candidate',
      situation: 'TechForward Inc. has offered you the Senior PM role after 3 rounds of interviews. They clearly want you — the VP of Product said you were their top candidate. You have 5 years of PM experience and strong references.',
      objectives: [
        'Base salary: Target $155K (offered $140K, market range $135K–$165K)',
        'Signing bonus: Target $20K (not yet offered)',
        'Equity: Target 0.15% (offered 0.08%)',
        'Remote work: Target 3 days/week (offered 1 day/week)',
        'Start date: Flexible, can use as leverage'
      ],
      batna: 'You have a competing offer from DataScale Corp at $148K base + $15K signing bonus, but you genuinely prefer TechForward\'s product and culture.',
      constraints: [
        'You need to respond within 5 business days',
        'You cannot reveal your exact competing offer number',
        'You\'re relocating, so remote flexibility matters a lot'
      ],
      hiddenInfo: 'DataScale\'s offer has no equity and requires 5 days in-office. TechForward doesn\'t know this weakness.',
      strategyHints: [
        'Anchor high but reasonable on salary',
        'Bundle issues — trade start date flexibility for remote days',
        'Use the competing offer as leverage without revealing specifics',
        'Show enthusiasm for the company while negotiating firmly'
      ]
    },

    counterpart: {
      name: 'Rachel Torres',
      title: 'VP of Talent Acquisition, TechForward Inc.',
      personality: 'professional-friendly',
      style: 'Rachel is warm but budget-conscious. She genuinely wants to close you but has approval limits. She\'ll push back on salary with "budget constraints" but has more flexibility than she initially reveals on equity and signing bonus.',
      objectives: [
        'Keep base salary under $150K (hard ceiling $155K with VP approval)',
        'Signing bonus max $15K without approval, up to $25K with approval',
        'Equity max 0.12% (anything above needs board approval)',
        'Prefers 2 days/week remote max (but can do 3 if pushed)'
      ],
      hiddenPriorities: 'The role has been open for 4 months. The team is struggling without a Senior PM. Rachel has pressure from the VP of Product to close this fast. She can be more flexible than she initially shows, especially on non-salary items.',
      negotiationApproach: 'Start firm on salary, show flexibility on other items. Use time pressure ("we need someone by March"). Express genuine enthusiasm about the candidate.',
      concessionPattern: 'Gives ground on equity and remote first, then signing bonus, salary last. Will do salary bump only if candidate makes a strong case.'
    },

    issues: [
      { id: 'salary', label: 'Base Salary', type: 'number', unit: '$K', userTarget: 155, counterpartTarget: 140, userBatna: 148, counterpartMax: 155, weight: 35 },
      { id: 'signing', label: 'Signing Bonus', type: 'number', unit: '$K', userTarget: 20, counterpartTarget: 0, userBatna: 10, counterpartMax: 25, weight: 20 },
      { id: 'equity', label: 'Equity (%)', type: 'number', unit: '%', userTarget: 0.15, counterpartTarget: 0.08, userBatna: 0.10, counterpartMax: 0.12, weight: 20 },
      { id: 'remote', label: 'Remote Days/Week', type: 'number', unit: 'days', userTarget: 3, counterpartTarget: 1, userBatna: 2, counterpartMax: 3, weight: 15 },
      { id: 'start', label: 'Start Date', type: 'choice', options: ['2 weeks', '4 weeks', '6 weeks'], userPreference: '4 weeks', counterpartPreference: '2 weeks', weight: 10 }
    ],

    scoringNotes: 'Beginner scenario — students should practice anchoring, BATNA reference (without revealing), and bundling. Bonus points for creative package deals.'
  },

  vendor: {
    id: 'vendor',
    title: 'The Vendor Contract',
    subtitle: 'Renegotiate a critical software vendor agreement',
    category: 'Procurement',
    difficulty: 'Intermediate',
    difficultyColor: '#4A7FBA',
    duration: '15–20 min',
    exchanges: { min: 10, max: 20 },
    skillsFocus: ['Multi-issue tradeoffs', 'Concession strategy', 'Contract terms', 'Relationship management'],
    icon: '📋',
    description: 'Your company\'s 3-year contract with your primary cloud infrastructure vendor is up for renewal. Usage has grown 300% but the vendor knows switching costs are high. You need to negotiate price, SLA terms, and support levels.',

    userBrief: {
      role: 'Alex Rivera — Director of IT, MidMarket Solutions',
      situation: 'CloudPrime has been your cloud vendor for 3 years. Your annual spend has grown from $120K to $480K. The contract renewal is in 6 weeks. CloudPrime knows migration would cost you 3 months and $200K+.',
      objectives: [
        'Annual cost: Target $400K (current $480K, they\'ll push for $520K)',
        'SLA uptime: Target 99.99% (current 99.9%)',
        'Support tier: Target 24/7 premium (current business hours only)',
        'Contract length: Prefer 2 years (they want 5 years)',
        'Price lock: No more than 5% annual increase',
        'Data portability: Full export capability within 30 days'
      ],
      batna: 'You have preliminary quotes from AzureScale ($420K/yr) and CloudNova ($380K/yr), but migration would take 3 months and cost $200K+ in engineering time.',
      constraints: [
        'CTO is watching this deal closely — needs savings to fund AI initiative',
        'Team strongly prefers CloudPrime\'s tooling (switching cost is real)',
        'Budget approval required for anything over $450K annual'
      ],
      hiddenInfo: 'Your CTO privately told you she\'d approve up to $460K if the SLA and support improvements are strong enough. CloudNova\'s quote has hidden costs that would bring total to ~$440K.',
      strategyHints: [
        'Lead with the competitive alternatives to establish leverage',
        'Use volume growth as a loyalty argument for better pricing',
        'Trade contract length for better pricing and SLA terms',
        'Get the support upgrade as a "goodwill" concession'
      ]
    },

    counterpart: {
      name: 'Marcus Webb',
      title: 'Enterprise Account Manager, CloudPrime',
      personality: 'analytical-persistent',
      style: 'Marcus is data-driven and methodical. He\'ll use TCO calculations and switching cost arguments. Relationship-oriented but firm on pricing. Will offer creative solutions (credits, tiered pricing) rather than straight discounts.',
      objectives: [
        'Renew at $500K+ annually (minimum $440K)',
        'Lock in 3-5 year contract',
        'Maintain current SLA (99.9%) — 99.99% costs real money',
        'Premium support is possible but needs to be traded for commitment'
      ],
      hiddenPriorities: 'Marcus is 2 deals away from President\'s Club. Losing this account would be devastating. He has pre-approval for up to 20% discount for a 3+ year commitment. His manager told him to close this within 2 weeks.',
      negotiationApproach: 'Lead with value proposition and relationship history. Use switching cost analysis. Offer volume tiers rather than flat discounts. Push for longer commitment.',
      concessionPattern: 'Starts with creative packaging (credits, volume tiers). Then support upgrade for commitment. Price movement comes last and in small increments.'
    },

    issues: [
      { id: 'annual_cost', label: 'Annual Cost', type: 'number', unit: '$K', userTarget: 400, counterpartTarget: 520, userBatna: 450, counterpartMax: 440, weight: 30 },
      { id: 'sla', label: 'SLA Uptime', type: 'choice', options: ['99.9%', '99.95%', '99.99%'], userPreference: '99.99%', counterpartPreference: '99.9%', weight: 20 },
      { id: 'support', label: 'Support Tier', type: 'choice', options: ['Business Hours', '12/7 Extended', '24/7 Premium'], userPreference: '24/7 Premium', counterpartPreference: 'Business Hours', weight: 15 },
      { id: 'contract_length', label: 'Contract Length', type: 'choice', options: ['1 year', '2 years', '3 years', '5 years'], userPreference: '2 years', counterpartPreference: '5 years', weight: 15 },
      { id: 'price_cap', label: 'Annual Increase Cap', type: 'number', unit: '%', userTarget: 5, counterpartTarget: 12, userBatna: 8, counterpartMax: 5, weight: 10 },
      { id: 'data_portability', label: 'Data Export SLA', type: 'choice', options: ['No guarantee', '90 days', '60 days', '30 days'], userPreference: '30 days', counterpartPreference: 'No guarantee', weight: 10 }
    ],

    scoringNotes: 'Intermediate — tests multi-issue negotiation, concession tracking, and relationship balance. Students should demonstrate logrolling (trading low-priority for high-priority items).'
  },

  partnership: {
    id: 'partnership',
    title: 'The Partnership Deal',
    subtitle: 'Negotiate equity split and terms for a strategic partnership',
    category: 'M&A / Partnerships',
    difficulty: 'Advanced',
    difficultyColor: '#C44D4D',
    duration: '20–25 min',
    exchanges: { min: 12, max: 22 },
    skillsFocus: ['Earn-outs', 'Control vs. value', 'Creative deal structures', 'Multi-party interests'],
    icon: '🤝',
    description: 'Your successful e-learning startup has caught the attention of a major EdTech corporation. They want to acquire a majority stake or create a strategic partnership. You need to protect your vision while securing growth capital and distribution.',

    userBrief: {
      role: 'Sam Okafor — Founder & CEO, LearnLoop',
      situation: 'LearnLoop (your AI-powered adaptive learning platform) has 50K users, $1.2M ARR, growing 15% month-over-month. EduCorp Global (Fortune 500 EdTech) wants to partner or acquire. They have the distribution you need — 12M users and relationships with 3,000 universities.',
      objectives: [
        'Valuation: $15M+ pre-money (they\'ll start at $8-10M)',
        'Control: Retain operational control and product vision',
        'Equity: Keep at least 35% post-deal',
        'Board: 3 seats minimum for founders (vs. their 2)',
        'Earn-out: Performance-based bonuses tied to growth milestones',
        'IP: Retain core AI algorithm IP rights'
      ],
      batna: 'You have enough runway for 14 months. Two VCs have expressed interest at $12M valuation, but without EduCorp\'s distribution.',
      constraints: [
        'Your co-founder wants to stay independent — she\'ll leave if they take too much control',
        'Your lead investor has a 2x liquidation preference',
        'EduCorp\'s distribution could 10x your user base in 18 months'
      ],
      hiddenInfo: 'Your AI algorithm is 18 months ahead of EduCorp\'s internal R&D. They know it. Their Chief Product Officer privately told a mutual contact that "LearnLoop is the best adaptive engine we\'ve evaluated."',
      strategyHints: [
        'Anchor high on valuation with comparable exits data',
        'Propose earn-out structure that aligns both parties',
        'Trade equity for operational autonomy',
        'IP retention is your strongest leverage point'
      ]
    },

    counterpart: {
      name: 'Diana Chen',
      title: 'SVP of Corporate Development, EduCorp Global',
      personality: 'strategic-calculated',
      style: 'Diana is a seasoned dealmaker. She\'s friendly but always calculating. She\'ll use EduCorp\'s size and distribution as leverage. She respects founders who negotiate well and will be more generous with those who demonstrate strategic thinking.',
      objectives: [
        'Acquire 55-65% stake at $10M pre-money',
        'Full integration rights within 24 months',
        'Board majority for EduCorp',
        'IP transfer included in deal'
      ],
      hiddenPriorities: 'EduCorp\'s board has approved up to $18M for this deal. Their internal AI team failed and was disbanded 3 months ago. They NEED LearnLoop\'s tech. Diana has a Q2 deadline to close this deal for EduCorp\'s annual strategy presentation.',
      negotiationApproach: 'Start low on valuation, emphasize "what we bring to the table" (distribution, brand, capital). Test founder\'s resolve. Willing to be creative on structure.',
      concessionPattern: 'Moves on valuation incrementally. Flexible on earn-outs and board seats. IP is her hardest line (but she can compromise to licensing). Gives operational autonomy as a "trust-building" move.'
    },

    issues: [
      { id: 'valuation', label: 'Pre-Money Valuation', type: 'number', unit: '$M', userTarget: 15, counterpartTarget: 10, userBatna: 12, counterpartMax: 18, weight: 25 },
      { id: 'equity', label: 'EduCorp Stake (%)', type: 'number', unit: '%', userTarget: 40, counterpartTarget: 60, userBatna: 50, counterpartMax: 55, weight: 20 },
      { id: 'board', label: 'Founder Board Seats', type: 'choice', options: ['1 of 5', '2 of 5', '3 of 5', '3 of 7'], userPreference: '3 of 5', counterpartPreference: '1 of 5', weight: 15 },
      { id: 'ip', label: 'IP Rights', type: 'choice', options: ['Full transfer', 'Exclusive license', 'Non-exclusive license', 'Retained by founders'], userPreference: 'Retained by founders', counterpartPreference: 'Full transfer', weight: 20 },
      { id: 'earnout', label: 'Earn-out (bonus if 3x growth)', type: 'number', unit: '$M', userTarget: 5, counterpartTarget: 0, userBatna: 2, counterpartMax: 4, weight: 10 },
      { id: 'autonomy', label: 'Operational Autonomy Period', type: 'choice', options: ['6 months', '12 months', '24 months', '36 months'], userPreference: '36 months', counterpartPreference: '6 months', weight: 10 }
    ],

    scoringNotes: 'Advanced — tests creative structuring, value creation, and strategic thinking. High marks for students who find integrative solutions (e.g., IP license + earn-out that aligns incentives).'
  },

  realestate: {
    id: 'realestate',
    title: 'The Real Estate Deal',
    subtitle: 'Negotiate the purchase of a commercial property',
    category: 'Real Estate',
    difficulty: 'Beginner',
    difficultyColor: '#1A8A7A',
    duration: '10–15 min',
    exchanges: { min: 8, max: 14 },
    skillsFocus: ['Research leverage', 'Urgency creation', 'Inspection contingencies', 'Creative terms'],
    icon: '🏢',
    description: 'You\'re buying a mixed-use commercial property for your expanding consulting firm. The seller seems motivated but the market is competitive. You need to negotiate price, closing timeline, and several contingencies.',

    userBrief: {
      role: 'Taylor Brooks — Managing Partner, Brooks Consulting Group',
      situation: 'A 4,500 sq ft mixed-use property at 220 Elm Street is listed at $825K. Ground floor retail space, upstairs offices — perfect for your growing firm (currently in a lease expiring in 4 months). The building needs some cosmetic work but is structurally sound.',
      objectives: [
        'Purchase price: Target $760K (listed $825K)',
        'Closing timeline: 45–60 days preferred',
        'Inspection contingency: 14 days minimum',
        'Seller concessions: $15K toward closing costs',
        'Personal property: Include existing office furniture and fixtures'
      ],
      batna: 'You can renew your current lease for 1 year at $4,800/month while you keep looking. There\'s another property at 180 Pine Street ($870K, needs more renovation).',
      constraints: [
        'Pre-approved for $800K mortgage',
        'Current lease expires in 4 months — some time pressure',
        'Need occupancy by month 3 ideally'
      ],
      hiddenInfo: 'You know from public records that the seller bought this property 18 months ago for $710K. The property has been listed for 67 days with one price reduction already.',
      strategyHints: [
        'Use days-on-market as leverage for lower price',
        'Offer faster closing in exchange for lower price',
        'Inspection contingency is non-negotiable — hold firm',
        'Furniture/fixtures are low cost to seller but valuable to you'
      ]
    },

    counterpart: {
      name: 'Pat Coleman',
      title: 'Property Owner (represented by Coleman Properties LLC)',
      personality: 'direct-impatient',
      style: 'Pat is a no-nonsense real estate investor who wants to move on to the next deal. Motivated to sell but doesn\'t want to look like a pushover. Will respond well to clean, decisive offers.',
      objectives: [
        'Sell at $800K+ (minimum $770K)',
        'Close within 45 days',
        'Minimal contingencies',
        'As-is sale preferred'
      ],
      hiddenPriorities: 'Pat has a 1031 exchange deadline in 75 days — needs to close this sale to roll into a larger property. Every day counts. Pat will trade price for speed and certainty.',
      negotiationApproach: 'Counter quickly, push for fast closing. Use "multiple interested parties" (partially true). Resist contingencies but cave if buyer is serious.',
      concessionPattern: 'Fastest mover on closing timeline flexibility. Then price (in $10K increments). Resistant to seller concessions but will fold on furniture/fixtures as a "sweetener."'
    },

    issues: [
      { id: 'price', label: 'Purchase Price', type: 'number', unit: '$K', userTarget: 760, counterpartTarget: 825, userBatna: 790, counterpartMax: 770, weight: 40 },
      { id: 'closing', label: 'Closing Timeline', type: 'choice', options: ['30 days', '45 days', '60 days', '75 days'], userPreference: '45 days', counterpartPreference: '30 days', weight: 15 },
      { id: 'inspection', label: 'Inspection Period', type: 'choice', options: ['7 days', '10 days', '14 days', 'Waived'], userPreference: '14 days', counterpartPreference: 'Waived', weight: 15 },
      { id: 'concessions', label: 'Seller Concessions', type: 'number', unit: '$K', userTarget: 15, counterpartTarget: 0, userBatna: 5, counterpartMax: 10, weight: 15 },
      { id: 'fixtures', label: 'Furniture & Fixtures', type: 'choice', options: ['Not included', 'Partial (office only)', 'All included'], userPreference: 'All included', counterpartPreference: 'Not included', weight: 15 }
    ],

    scoringNotes: 'Beginner — focuses on research leverage, urgency/timing dynamics, and bundling. Students who discover the 1031 exchange pressure (through probing questions) score highest.'
  },

  crosscultural: {
    id: 'crosscultural',
    title: 'The Cross-Cultural Joint Venture',
    subtitle: 'Negotiate a JV with a Japanese conglomerate',
    category: 'International',
    difficulty: 'Advanced',
    difficultyColor: '#C44D4D',
    duration: '20–25 min',
    exchanges: { min: 12, max: 22 },
    skillsFocus: ['Face-saving', 'Cultural intelligence', 'Indirect communication', 'Relationship-first negotiation'],
    icon: '🌏',
    description: 'Your North American renewable energy firm is negotiating a joint venture with Tanaka Industries, a major Japanese conglomerate. Cultural differences, communication styles, and different views on time, hierarchy, and relationship will test your adaptability.',

    userBrief: {
      role: 'Morgan Ellis — VP of International Partnerships, GreenGrid Energy',
      situation: 'GreenGrid has proprietary solar panel technology that Tanaka wants for the Japanese and Southeast Asian markets. Tanaka has manufacturing scale, government relationships, and distribution networks you need. This JV could be worth $100M+ over 5 years.',
      objectives: [
        'Revenue split: 55/45 in GreenGrid\'s favor (they\'ll want 60/40 their way)',
        'Technology licensing: Retain IP, license to JV exclusively',
        'Management: Co-CEO structure or GreenGrid-led operations',
        'Market scope: Japan + Southeast Asia initially',
        'Minimum commitment: $20M investment from Tanaka'
      ],
      batna: 'A Korean partner (SunKorea Corp) has expressed interest but has less market access and manufacturing capacity.',
      constraints: [
        'Your board requires majority operational control',
        'IP must stay with GreenGrid under any structure',
        'You need Tanaka\'s government relationships in Japan — critical for permits'
      ],
      hiddenInfo: 'Tanaka\'s current solar technology supplier is losing market share, and their contract expires in 8 months. They need a new technology partner urgently, but won\'t show urgency — it would mean losing face.',
      strategyHints: [
        'Build relationship before diving into numbers — ask about Tanaka\'s vision',
        'Use indirect language: "We might consider..." rather than "We want..."',
        'Show respect for Tanaka\'s market expertise and reputation',
        'Patience is power — silence and pauses are tools, not awkwardness',
        'Face-saving: Never back someone into a corner publicly'
      ]
    },

    counterpart: {
      name: 'Kenji Nakamura',
      title: 'Executive Director, Strategic Partnerships, Tanaka Industries',
      personality: 'formal-relationship-oriented',
      style: 'Nakamura-san is highly formal, relationship-focused, and uses indirect communication. He values harmony, patience, and mutual respect. He will be put off by aggressive or transactional approaches. He appreciates when the other party shows understanding of Japanese business culture.',
      objectives: [
        'Revenue split: 60/40 in Tanaka\'s favor',
        'Technology transfer (not just licensing)',
        'Japanese management leading operations',
        'Phased rollout starting with Japan only',
        'Long-term partnership (10+ year horizon)'
      ],
      hiddenPriorities: 'Nakamura\'s CEO personally championed this deal. Failure would mean significant loss of face for Nakamura. He has significant flexibility but will take time to reveal it. Values long-term relationship over short-term gains.',
      negotiationApproach: 'Slow, methodical. Begin with vision and relationship building. Avoid direct "no" — use "that would be difficult" or "we need to study further." Respect for patience and cultural sensitivity unlocks concessions.',
      concessionPattern: 'Very slow to concede. Responds positively to relationship-building moves. Big concessions come after trust is established, often in later exchanges. Will match generosity with generosity.'
    },

    issues: [
      { id: 'revenue_split', label: 'Revenue Split (GreenGrid %)', type: 'number', unit: '%', userTarget: 55, counterpartTarget: 40, userBatna: 48, counterpartMax: 52, weight: 25 },
      { id: 'ip', label: 'Technology Rights', type: 'choice', options: ['Full transfer', 'Exclusive JV license', 'Non-exclusive license', 'GreenGrid retains, trains'], userPreference: 'GreenGrid retains, trains', counterpartPreference: 'Full transfer', weight: 20 },
      { id: 'management', label: 'JV Leadership', type: 'choice', options: ['Tanaka-led', 'Co-leadership', 'GreenGrid-led', 'Rotating annually'], userPreference: 'GreenGrid-led', counterpartPreference: 'Tanaka-led', weight: 15 },
      { id: 'market', label: 'Initial Market Scope', type: 'choice', options: ['Japan only', 'Japan + S. Korea', 'Japan + SE Asia', 'All Asia-Pacific'], userPreference: 'Japan + SE Asia', counterpartPreference: 'Japan only', weight: 15 },
      { id: 'investment', label: 'Tanaka Initial Investment', type: 'number', unit: '$M', userTarget: 20, counterpartTarget: 10, userBatna: 15, counterpartMax: 18, weight: 15 },
      { id: 'duration', label: 'JV Duration', type: 'choice', options: ['3 years', '5 years', '7 years', '10 years'], userPreference: '5 years', counterpartPreference: '10 years', weight: 10 }
    ],

    scoringNotes: 'Advanced — tests cultural intelligence heavily. Students who rush or use aggressive tactics score poorly. Those who build relationship, show patience, use indirect language, and demonstrate cultural awareness score highest.'
  },

  teamconflict: {
    id: 'teamconflict',
    title: 'The Team Conflict Resolution',
    subtitle: 'Mediate a heated dispute between two team members',
    category: 'Leadership',
    difficulty: 'Intermediate',
    difficultyColor: '#4A7FBA',
    duration: '10–15 min',
    exchanges: { min: 8, max: 15 },
    skillsFocus: ['Active listening', 'Reframing', 'Interest-based resolution', 'Emotional intelligence'],
    icon: '⚖️',
    description: 'Two of your best team members are in open conflict about project direction. As their manager, you need to mediate — but this isn\'t just about the project. There are underlying issues of recognition, trust, and work style. Your goal is resolution, not just compromise.',

    userBrief: {
      role: 'Casey Park — Engineering Manager, Product Team Alpha',
      situation: 'Your two senior engineers — Dev (backend lead) and Priya (frontend lead) — are fighting over the architecture for a critical new feature. Dev wants microservices; Priya wants a monolith refactor. The conflict has escalated to the point where they\'re not speaking. Team morale is dropping.',
      objectives: [
        'Resolve the technical dispute with a path forward both can support',
        'Rebuild the working relationship between Dev and Priya',
        'Identify and address the underlying personal tensions',
        'Keep the project on its Q2 deadline',
        'Demonstrate leadership that strengthens team trust'
      ],
      batna: 'You could escalate to the VP of Engineering, but that would undermine your authority and embarrass both engineers.',
      constraints: [
        'You can\'t just pick a side — both have valid technical arguments',
        'Dev has been passed over for promotion twice and is sensitive about being heard',
        'Priya joined 6 months ago and feels she has to prove herself',
        'The team is watching how you handle this'
      ],
      hiddenInfo: 'Dev privately told a colleague he feels "pushed out" by Priya\'s influence. Priya confided to HR that she feels Dev dismisses her ideas because she\'s newer.',
      strategyHints: [
        'Listen to both sides without immediately problem-solving',
        'Acknowledge emotions before addressing the technical issue',
        'Reframe the conflict from "Dev vs. Priya" to "what\'s best for the product"',
        'Find the interests behind the positions — what do they each really need?',
        'Create a face-saving path for both to step back from hardened positions'
      ]
    },

    counterpart: {
      name: 'Dev Sharma & Priya Patel',
      title: 'Senior Engineers, Product Team Alpha',
      personality: 'emotional-defensive',
      style: 'You\'ll be mediating between two people. Dev is frustrated and feels unheard — he\'ll be initially defensive and may bring up past grievances. Priya is anxious about being seen as the "new person causing problems" — she\'ll be more measured but has strong convictions. Both are talented and reasonable when they feel heard.',
      objectives: [
        'Dev: Wants his experience and contributions recognized; wants microservices',
        'Priya: Wants to be taken seriously despite being newer; believes monolith is more practical',
        'Both: Want the project to succeed, want to feel respected'
      ],
      hiddenPriorities: 'Dev\'s real issue is feeling invisible after being passed over for promotion. Priya\'s real issue is imposter syndrome in a new team. The technical disagreement is real but secondary to the personal dynamics.',
      negotiationApproach: 'Will start adversarial. Responds strongly to active listening and validation. De-escalates when manager acknowledges emotions. Technical compromise becomes possible once personal issues are addressed.',
      concessionPattern: 'Dev softens when his experience is explicitly acknowledged. Priya opens up when given safe space. Both move toward compromise when reframed as collaboration. Creative technical middle ground (e.g., hybrid approach) becomes possible.'
    },

    issues: [
      { id: 'architecture', label: 'Technical Approach', type: 'choice', options: ['Full microservices', 'Hybrid (micro + mono)', 'Monolith refactor', 'Phased migration'], userPreference: 'Hybrid (micro + mono)', counterpartPreference: null, weight: 25 },
      { id: 'dev_recognition', label: 'Dev\'s Role Recognition', type: 'choice', options: ['No change', 'Tech lead title', 'Architecture decision authority', 'Promotion discussion'], userPreference: 'Architecture decision authority', counterpartPreference: null, weight: 20 },
      { id: 'priya_integration', label: 'Priya\'s Integration', type: 'choice', options: ['No change', 'Co-ownership of feature', 'Frontend architecture lead', 'Innovation sprint lead'], userPreference: 'Co-ownership of feature', counterpartPreference: null, weight: 20 },
      { id: 'process', label: 'Decision Process Going Forward', type: 'choice', options: ['Manager decides', 'Team vote', 'RFC process with review', 'Rotating decision lead'], userPreference: 'RFC process with review', counterpartPreference: null, weight: 15 },
      { id: 'timeline', label: 'Resolution Timeline', type: 'choice', options: ['Decide today', 'Prototype both (1 week)', '2-week evaluation sprint', 'External review'], userPreference: 'Prototype both (1 week)', counterpartPreference: null, weight: 10 },
      { id: 'relationship', label: 'Relationship Repair', type: 'choice', options: ['Let it resolve naturally', 'Structured 1-on-1s', 'Joint project milestone', 'Team retrospective'], userPreference: 'Joint project milestone', counterpartPreference: null, weight: 10 }
    ],

    scoringNotes: 'Intermediate mediation scenario. Scored heavily on emotional intelligence, active listening, and reframing. Students who jump straight to technical solutions without addressing emotions score poorly. Those who discover the hidden personal dynamics (promotion, imposter syndrome) score highest.'
  }
};

// Helper to get scenario list (for dashboard)
export function getScenarioList() {
  return Object.values(SCENARIOS).map(s => ({
    id: s.id, title: s.title, subtitle: s.subtitle, category: s.category,
    difficulty: s.difficulty, difficultyColor: s.difficultyColor,
    duration: s.duration, skillsFocus: s.skillsFocus, icon: s.icon,
    description: s.description
  }));
}

// Get full scenario by ID
export function getScenario(id) {
  return SCENARIOS[id] || null;
}

// Grade from score
export function calculateGrade(score) {
  if (score >= 95) return 'S';
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}
