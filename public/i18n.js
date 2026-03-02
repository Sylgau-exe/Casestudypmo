// Google Analytics GA4 — auto-injected on every page via i18n.js
(function(){var id='G-4VS9H69PP1';if(!document.querySelector('script[src*="googletagmanager"]')){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+id;document.head.appendChild(s);window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',id);}})();

// public/i18n.js - NegotiateSim Frontend Translation System
// Include via <script src="/i18n.js"></script> before page scripts

const STRINGS = {
  // Nav
  nav_signout: { en: 'Sign Out', fr: 'Déconnexion' },
  
  // Dashboard
  dash_welcome_suffix: { en: ', welcome back. Ready to sharpen your negotiation skills?', fr: ', bon retour. Prêt à affiner tes compétences en négociation?' },
  dash_sessions: { en: 'Sessions', fr: 'Sessions' },
  dash_avg_score: { en: 'Avg Score', fr: 'Score moy.' },
  dash_best_grade: { en: 'Best Grade', fr: 'Meilleure note' },
  dash_sessions_left: { en: 'Sessions Left', fr: 'Sessions rest.' },
  dash_choose: { en: 'Choose Your', fr: 'Choisissez votre' },
  dash_scenario: { en: 'Scenario', fr: 'Scénario' },
  dash_recent: { en: 'Recent Sessions', fr: 'Sessions récentes' },
  dash_no_sessions: { en: 'No sessions yet. Pick a scenario above to start!', fr: 'Aucune session. Choisissez un scénario ci-dessus!' },
  dash_start: { en: 'Start →', fr: 'Commencer →' },
  dash_deal: { en: '🤝 Deal', fr: '🤝 Entente' },
  dash_walkaway: { en: '🚶 Walkaway', fr: '🚶 Retrait' },
  th_scenario: { en: 'Scenario', fr: 'Scénario' },
  th_result: { en: 'Result', fr: 'Résultat' },
  th_score: { en: 'Score', fr: 'Score' },
  th_grade: { en: 'Grade', fr: 'Note' },
  th_date: { en: 'Date', fr: 'Date' },

  // Negotiate
  neg_briefing_title: { en: '📋 Mission Briefing', fr: '📋 Briefing de mission' },
  neg_complete: { en: '🏁 Complete', fr: '🏁 Terminé' },
  neg_room: { en: '💬 Negotiation Room', fr: '💬 Salle de négociation' },
  neg_walk_away: { en: '🚶 Walk Away', fr: '🚶 Se retirer' },
  neg_accept_deal: { en: '🤝 Accept Deal', fr: '🤝 Accepter' },
  neg_loading: { en: 'Preparing negotiation...', fr: 'Préparation de la négociation...' },
  neg_louis_reviewing: { en: 'Louis is reviewing the briefing', fr: 'Louis prépare le briefing' },
  neg_counterpart: { en: 'Counterpart', fr: 'Contrepartie' },
  neg_objectives: { en: 'Your Objectives', fr: 'Vos objectifs' },
  neg_batna: { en: 'Your BATNA', fr: 'Votre MESORE' },
  neg_progress: { en: 'Progress', fr: 'Progression' },
  neg_exchange: { en: 'Exchange', fr: 'Échange' },
  neg_louis_briefing: { en: "Louis's Strategic Briefing", fr: 'Briefing stratégique de Louis' },
  neg_ai_coach: { en: 'Your AI Negotiation Coach', fr: 'Votre coach IA en négociation' },
  neg_enter_room: { en: 'Enter the Room — Meet', fr: 'Entrer — Rencontrer' },
  neg_starting: { en: 'Starting...', fr: 'Démarrage...' },
  neg_negotiate_as: { en: 'Negotiate as', fr: 'Négociez en tant que' },
  neg_ask_louis_hint: { en: 'Click Louis to chat with your coach', fr: 'Cliquez sur Louis pour discuter avec votre coach' },
  neg_enter_send: { en: 'Enter to send · Shift+Enter for new line', fr: 'Entrée pour envoyer · Maj+Entrée nouvelle ligne' },
  neg_louis_placeholder: { en: "Ask Louis — 'Should I push harder?'", fr: "Demandez à Louis — 'Devrais-je insister?'" },
  neg_ask: { en: 'Ask', fr: 'Demander' },
  neg_advice: { en: 'Advice', fr: 'Conseil' },
  neg_coach: { en: 'Coach', fr: 'Coach' },
  neg_louis_online: { en: 'Online — ready to coach', fr: 'En ligne — prêt à coacher' },
  neg_listen_louis: { en: 'Listen to Louis', fr: 'Écouter Louis' },
  neg_louis_voice_toggle: { en: 'Toggle Louis voice', fr: 'Activer/désactiver la voix de Louis' },
  neg_louis_chat_empty: { en: "I'm Louis, your negotiation coach.<br>Ask me anything — strategy, tactics, or just talk through your approach.", fr: "Je suis Louis, ton coach de négociation.<br>Demande-moi n'importe quoi — stratégie, tactiques, ou discutons de ton approche." },
  neg_louis_chat_placeholder: { en: "Chat with Louis...", fr: "Discutez avec Louis..." },
  neg_send_louis: { en: 'Send', fr: 'Envoyer' },
  neg_walked_away: { en: 'You walked away.', fr: 'Vous vous êtes retiré.' },
  neg_deal_reached: { en: '🤝 Deal reached!', fr: '🤝 Entente conclue!' },
  neg_analyzing: { en: 'Louis is analyzing your performance...', fr: 'Louis analyse votre performance...' },
  neg_view_scorecard: { en: 'View Scorecard & Debrief →', fr: 'Voir le bulletin et débrief →' },
  neg_back_dashboard: { en: '← Back to Dashboard', fr: '← Retour au tableau de bord' },
  neg_near_end: { en: '⏰ Negotiation approaching conclusion. Consider your final offer.', fr: '⏰ Négociation en conclusion. Considérez votre offre finale.' },
  neg_error: { en: '⚠️ Error. Try again.', fr: '⚠️ Erreur. Réessayez.' },
  neg_confirm_walk: { en: 'Walk away from this negotiation?', fr: 'Se retirer de cette négociation?' },
  neg_active_session: { en: 'Active Session Found', fr: 'Session active trouvée' },
  neg_active_msg: { en: 'You have an unfinished negotiation in progress.', fr: 'Vous avez une négociation en cours.' },
  neg_start_fresh: { en: 'Start Fresh', fr: 'Recommencer' },
  neg_free_used: { en: 'Free Sessions Used', fr: 'Sessions gratuites épuisées' },
  neg_upgrade: { en: 'Upgrade to continue', fr: 'Passez au niveau supérieur' },

  // Results
  res_loading: { en: 'Loading scorecard...', fr: 'Chargement du bulletin...' },
  res_scorecard: { en: 'Scorecard', fr: 'Bulletin' },
  res_not_found: { en: 'Session not found', fr: 'Session introuvable' },
  res_dashboard: { en: '← Dashboard', fr: '← Tableau de bord' },
  res_deal_value: { en: 'Deal Value', fr: 'Valeur' },
  res_value_creation: { en: 'Value Creation', fr: 'Création valeur' },
  res_relationship: { en: 'Relationship', fr: 'Relation' },
  res_process_skill: { en: 'Process Skill', fr: 'Processus' },
  res_efficiency: { en: 'Efficiency', fr: 'Efficacité' },
  res_strategy: { en: 'Strategy', fr: 'Stratégie' },
  res_louis_debrief: { en: "Louis's Coaching Debrief", fr: 'Débrief de coaching de Louis' },
  res_analysis_done: { en: 'Analysis complete.', fr: 'Analyse terminée.' },
  res_strengths: { en: '✅ Strengths', fr: '✅ Forces' },
  res_improvements: { en: '📈 Areas for Improvement', fr: '📈 Points à améliorer' },
  res_next_session: { en: 'Next Session:', fr: 'Prochaine session :' },
  res_replay: { en: '🔄 Replay', fr: '🔄 Rejouer' },
  res_all_scenarios: { en: '📋 All Scenarios', fr: '📋 Tous les scénarios' },

  // Login
  login_title: { en: 'Master the Art of Negotiation', fr: "Maîtrisez l'art de la négociation" },

  // Paywall
  pw_free_trial: { en: 'Free Trial', fr: 'Essai gratuit' },
  pw_premium: { en: '🔒 Premium', fr: '🔒 Premium' },
  pw_locked: { en: '🔒', fr: '🔒' },
  pw_modal_title: { en: 'Unlock All Scenarios', fr: 'Débloquez tous les scénarios' },
  pw_modal_sub: { en: 'Upgrade to access all 6 negotiation scenarios, unlimited sessions, and detailed coaching from Louis.', fr: 'Passez au niveau supérieur pour accéder aux 6 scénarios de négociation, sessions illimitées, et coaching détaillé de Louis.' },
  pw_monthly: { en: 'Monthly', fr: 'Mensuel' },
  pw_monthly_price: { en: '$19/mo', fr: '19$/mois' },
  pw_monthly_desc: { en: 'Unlimited scenarios & sessions', fr: 'Scénarios et sessions illimités' },
  pw_lifetime: { en: 'Lifetime', fr: 'À vie' },
  pw_lifetime_price: { en: '$149', fr: '149$' },
  pw_lifetime_desc: { en: 'One-time payment, forever', fr: 'Paiement unique, pour toujours' },
  pw_best_value: { en: 'Best Value', fr: 'Meilleur prix' },
  pw_choose: { en: 'Choose', fr: 'Choisir' },
  pw_trial_badge: { en: '✨ Free Trial — 1 Session', fr: '✨ Essai gratuit — 1 session' },
  pw_trial_used: { en: 'Trial Used', fr: 'Essai utilisé' },
  pw_close: { en: '✕', fr: '✕' },
  pw_restore: { en: 'Already a subscriber?', fr: 'Déjà abonné?' },
  login_subtitle: { en: 'AI-powered negotiation simulations with real-time coaching', fr: "Simulations de négociation IA avec coaching en temps réel" },
  login_email: { en: 'Email', fr: 'Courriel' },
  login_password: { en: 'Password', fr: 'Mot de passe' },
  login_signin: { en: 'Sign In', fr: 'Se connecter' },
  login_signup: { en: 'Create Account', fr: 'Créer un compte' },
  login_name: { en: 'Full Name', fr: 'Nom complet' },
  login_google: { en: 'Continue with Google', fr: 'Continuer avec Google' },

  // Scenario data
  sc: {
    salary: { 
      title: { en: 'The Salary Negotiation', fr: 'La négociation salariale' },
      sub: { en: 'Negotiate your compensation package for a new role', fr: 'Négociez votre rémunération pour un nouveau poste' },
      cat: { en: 'Career', fr: 'Carrière' },
      diff: { en: 'Beginner', fr: 'Débutant' },
      skills: { en: ['Anchoring','BATNA usage','Package deals'], fr: ['Ancrage','Utilisation MESORE','Offres groupées'] },
      counterpartTitle: { en: 'VP of Talent Acquisition, TechForward Inc.', fr: 'VP Acquisition de talents, TechForward Inc.' },
      objectives: {
        en: [
          'Base salary: Target $155K (offered $140K, market range $135K–$165K)',
          'Signing bonus: Target $20K (not yet offered)',
          'Equity: Target 0.15% (offered 0.08%)',
          'Remote work: Target 3 days/week (offered 1 day/week)',
          'Start date: Flexible, can use as leverage'
        ],
        fr: [
          'Salaire de base : Cible 155K$ (offert 140K$, marché 135K$–165K$)',
          'Prime de signature : Cible 20K$ (pas encore offerte)',
          'Équité : Cible 0,15% (offert 0,08%)',
          'Télétravail : Cible 3 jours/sem. (offert 1 jour/sem.)',
          'Date de début : Flexible, à utiliser comme levier'
        ]
      },
      batna: {
        en: "You have a competing offer from DataScale Corp at $148K base + $15K signing bonus, but you genuinely prefer TechForward's product and culture.",
        fr: "Vous avez une offre concurrente de DataScale Corp à 148K$ de base + 15K$ de prime, mais vous préférez sincèrement le produit et la culture de TechForward."
      }
    },
    vendor: {
      title: { en: 'The Vendor Contract', fr: 'Le contrat fournisseur' },
      sub: { en: 'Renegotiate a critical software vendor agreement', fr: 'Renégociez un contrat fournisseur logiciel critique' },
      cat: { en: 'Procurement', fr: 'Approvisionnement' },
      diff: { en: 'Intermediate', fr: 'Intermédiaire' },
      skills: { en: ['Multi-issue tradeoffs','Concession strategy','Contract terms'], fr: ['Compromis multi-enjeux','Stratégie de concession','Termes contractuels'] },
      counterpartTitle: { en: 'VP of Enterprise Sales, CloudPrime', fr: 'VP Ventes entreprises, CloudPrime' },
      objectives: {
        en: [
          'Annual cost: Target $400K (current $480K, they\'ll push for $520K)',
          'SLA uptime: Target 99.99% (current 99.9%)',
          'Support tier: Target 24/7 premium (current business hours only)',
          'Contract length: Prefer 2 years (they want 5 years)',
          'Price lock: No more than 5% annual increase',
          'Data portability: Full export within 30 days'
        ],
        fr: [
          'Coût annuel : Cible 400K$ (actuel 480K$, ils voudront 520K$)',
          'SLA disponibilité : Cible 99,99% (actuel 99,9%)',
          'Support : Cible premium 24/7 (actuel heures ouvrables)',
          'Durée du contrat : Préférence 2 ans (ils veulent 5 ans)',
          'Gel de prix : Maximum 5% d\'augmentation annuelle',
          'Portabilité des données : Export complet en 30 jours'
        ]
      },
      batna: {
        en: "You have preliminary quotes from AzureScale ($420K/yr) and CloudNova ($380K/yr), but migration would take 3 months and cost $200K+ in engineering time.",
        fr: "Vous avez des soumissions préliminaires d'AzureScale (420K$/an) et CloudNova (380K$/an), mais la migration prendrait 3 mois et coûterait 200K$+ en temps d'ingénierie."
      }
    },
    partnership: {
      title: { en: 'The Partnership Deal', fr: "L'entente de partenariat" },
      sub: { en: 'Structure a strategic partnership with revenue sharing', fr: 'Structurez un partenariat stratégique' },
      cat: { en: 'Business Dev', fr: 'Dév. affaires' },
      diff: { en: 'Advanced', fr: 'Avancé' },
      skills: { en: ['Value creation','Equity structures','Trust building'], fr: ['Création de valeur','Structures d\'équité','Bâtir la confiance'] },
      counterpartTitle: { en: 'Chief Strategy Officer, EduCorp Global', fr: 'Directrice de la stratégie, EduCorp Global' },
      objectives: {
        en: [
          'Valuation: $15M+ pre-money (they\'ll start at $8-10M)',
          'Control: Retain operational control and product vision',
          'Equity: Keep at least 35% post-deal',
          'Board: 3 seats minimum for founders (vs. their 2)',
          'Earn-out: Performance-based bonuses tied to growth',
          'IP: Retain core AI algorithm IP rights'
        ],
        fr: [
          'Évaluation : 15M$+ pré-investissement (ils commenceront à 8-10M$)',
          'Contrôle : Conserver le contrôle opérationnel et la vision produit',
          'Équité : Garder au moins 35% post-transaction',
          'C.A. : 3 sièges min. pour les fondateurs (vs. leurs 2)',
          'Compléments de prix : Bonis liés à la croissance',
          'P.I. : Conserver les droits de propriété intellectuelle de l\'algorithme IA'
        ]
      },
      batna: {
        en: "You have enough runway for 14 months. Two VCs have expressed interest at $12M valuation, but without EduCorp's distribution.",
        fr: "Vous avez une piste de financement pour 14 mois. Deux fonds de capital-risque sont intéressés à une évaluation de 12M$, mais sans la distribution d'EduCorp."
      }
    },
    realestate: {
      title: { en: 'The Real Estate Deal', fr: 'La transaction immobilière' },
      sub: { en: 'Negotiate the purchase of a commercial property', fr: "Négociez l'achat d'une propriété commerciale" },
      cat: { en: 'Real Estate', fr: 'Immobilier' },
      diff: { en: 'Beginner', fr: 'Débutant' },
      skills: { en: ['Research leverage','Urgency','Creative terms'], fr: ['Levier de recherche','Urgence','Termes créatifs'] },
      counterpartTitle: { en: 'Owner / Commercial Real Estate Investor', fr: 'Propriétaire / Investisseur immobilier commercial' },
      objectives: {
        en: [
          'Purchase price: Target $760K (listed $825K)',
          'Closing timeline: 45–60 days preferred',
          'Inspection contingency: 14 days minimum',
          'Seller concessions: $15K toward closing costs',
          'Personal property: Include existing office furniture and fixtures'
        ],
        fr: [
          'Prix d\'achat : Cible 760K$ (affiché 825K$)',
          'Délai de clôture : 45–60 jours préféré',
          'Clause d\'inspection : 14 jours minimum',
          'Concessions du vendeur : 15K$ vers les frais de clôture',
          'Biens inclus : Mobilier de bureau et équipements existants'
        ]
      },
      batna: {
        en: "You can renew your current lease for 1 year at $4,800/month while you keep looking. There's another property at 180 Pine Street ($870K, needs more renovation).",
        fr: "Vous pouvez renouveler votre bail actuel pour 1 an à 4 800$/mois. Il y a une autre propriété au 180 rue Pine (870K$, plus de rénovations nécessaires)."
      }
    },
    crosscultural: {
      title: { en: 'Cross-Cultural Joint Venture', fr: 'Coentreprise interculturelle' },
      sub: { en: 'Navigate a JV with a Japanese conglomerate', fr: 'Naviguez une coentreprise avec un conglomérat japonais' },
      cat: { en: 'International', fr: 'International' },
      diff: { en: 'Advanced', fr: 'Avancé' },
      skills: { en: ['Cultural intelligence','Face-saving','Indirect comms'], fr: ['Intelligence culturelle','Préserver la face','Communication indirecte'] },
      counterpartTitle: { en: 'Director of International Business, Tanaka Industries', fr: 'Directeur des affaires internationales, Tanaka Industries' },
      objectives: {
        en: [
          'Revenue split: 55/45 in GreenGrid\'s favor (they\'ll want 60/40 their way)',
          'Technology licensing: Retain IP, license to JV exclusively',
          'Management: Co-CEO structure or GreenGrid-led operations',
          'Market scope: Japan + Southeast Asia initially',
          'Minimum commitment: $20M investment from Tanaka'
        ],
        fr: [
          'Partage des revenus : 55/45 en faveur de GreenGrid (ils voudront 60/40)',
          'Licence technologique : Conserver la P.I., licence exclusive à la coentreprise',
          'Gestion : Structure co-PDG ou opérations dirigées par GreenGrid',
          'Portée du marché : Japon + Asie du Sud-Est initialement',
          'Engagement minimum : 20M$ d\'investissement de Tanaka'
        ]
      },
      batna: {
        en: "A Korean partner (SunKorea Corp) has expressed interest but has less market access and manufacturing capacity.",
        fr: "Un partenaire coréen (SunKorea Corp) a exprimé son intérêt, mais possède moins d'accès au marché et de capacité de fabrication."
      }
    },
    teamconflict: {
      title: { en: 'Team Conflict Resolution', fr: "Résolution de conflit d'équipe" },
      sub: { en: 'Mediate a resource dispute between departments', fr: 'Médiez un conflit de ressources entre départements' },
      cat: { en: 'Leadership', fr: 'Leadership' },
      diff: { en: 'Intermediate', fr: 'Intermédiaire' },
      skills: { en: ['Mediation','Active listening','Win-win framing'], fr: ['Médiation','Écoute active','Cadrage gagnant-gagnant'] },
      counterpartTitle: { en: 'Senior Engineers (Dev & Priya)', fr: 'Ingénieurs seniors (Dev et Priya)' },
      objectives: {
        en: [
          'Resolve the technical dispute with a path forward both can support',
          'Rebuild the working relationship between Dev and Priya',
          'Identify and address the underlying personal tensions',
          'Keep the project on its Q2 deadline',
          'Demonstrate leadership that strengthens team trust'
        ],
        fr: [
          'Résoudre le différend technique avec un plan que les deux peuvent appuyer',
          'Reconstruire la relation de travail entre Dev et Priya',
          'Identifier et adresser les tensions personnelles sous-jacentes',
          'Respecter l\'échéance Q2 du projet',
          'Démontrer un leadership qui renforce la confiance de l\'équipe'
        ]
      },
      batna: {
        en: "You could escalate to the VP of Engineering, but that would undermine your authority and embarrass both engineers.",
        fr: "Vous pourriez escalader au VP de l'ingénierie, mais cela minerait votre autorité et embarrasserait les deux ingénieurs."
      }
    }
  }
};

// Core functions
function getLang() { return localStorage.getItem('negotiate_lang') || 'en'; }
function setLang(l) { localStorage.setItem('negotiate_lang', l); window.location.reload(); }
function t(key) { 
  const s = STRINGS[key]; 
  if (!s) return key; 
  const lang = getLang();
  return s[lang] || s.en || key; 
}
function tsc(scenarioId, field) {
  const sc = STRINGS.sc[scenarioId];
  if (!sc || !sc[field]) return '';
  const lang = getLang();
  const val = sc[field];
  if (Array.isArray(val[lang])) return val[lang];
  return val[lang] || val.en || '';
}

// Language toggle HTML for nav
function langToggleHTML() {
  const lang = getLang();
  const other = lang === 'en' ? 'fr' : 'en';
  const label = lang === 'en' ? 'FR' : 'EN';
  return `<button onclick="setLang('${other}')" style="background:rgba(99,102,241,0.15);color:#a5b4fc;border:1px solid rgba(99,102,241,0.3);border-radius:6px;padding:4px 10px;cursor:pointer;font-size:13px;font-weight:700;font-family:var(--font-display);letter-spacing:1px" title="${lang==='en'?'Passer en français':'Switch to English'}">${label}</button>`;
}
