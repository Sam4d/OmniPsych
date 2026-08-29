import { Archetype } from '../types';

export const ARCHETYPES: Archetype[] = [
  // HOUSE 1: THE STRATEGISTS (Electric Indigo #6366F1)
  {
    id: 'intj',
    code: 'INTJ',
    name: 'The Grand Architect',
    title: 'Master Tactician & Systems Visionary',
    house: 'The Strategists',
    houseColor: '#6366F1',
    accentColor: '#FFE600',
    badgeBg: '#EEF2FF',
    mbtiEquiv: 'INTJ',
    shortDescription: 'Driven by objective rationality, structural perfection, and far-reaching systemic strategy.',
    fullDescription: 'The Grand Architect operates at the synthesis of high Openness and peak Conscientiousness. They see human institutions and technical architectures as interconnected matrices waiting to be optimized. Armed with an unrolled blueprint and obsidian compass, they rarely compromise on first-principles logic.',
    superpowers: [
      'Multi-Decade Strategic Foresight',
      'First-Principles Systems Synthesis',
      'Crisis Decisiveness & Intellectual Stamina'
    ],
    blindspots: [
      'Intellectual Dismissiveness of Emotional Nuance',
      'Analysis Paralysis in Chaotic Environments',
      'Reluctance to Delegate Foundational Logic'
    ],
    famousExamples: ['Ada Lovelace', 'Nikola Tesla', 'Friedrich Nietzsche', 'Christopher Nolan'],
    careerClusters: ['Systems Architecture', 'Quantitative Finance', 'Deep Tech R&D', 'Strategic Consulting'],
    relationshipKeys: {
      idealMatches: ['ENFP (The Spark Catalyst)', 'ENTP (The Paradigm Hacker)'],
      frictionRisk: ['ESFJ (The Community Anchor)', 'ISFP (The Aesthetic Maverick)'],
      communicationTip: 'State facts and objectives clearly; skip superficial small talk and present logical tradeoffs.'
    },
    hexacoProfile: {
      honestyHumility: 78,
      emotionality: 32,
      extraversion: 38,
      agreeableness: 62,
      conscientiousness: 92,
      openness: 95
    },
    riasecPrimary: ['Investigative', 'Enterprising', 'Conventional'],
    attachmentTendency: 'Dismissive-Avoidant',
    traitEqBaseline: 74,
    avatarProps: {
      iconName: 'Compass',
      propName: 'Obsidian Blueprint',
      geometricShape: 'diamond',
      auraGradient: 'from-indigo-600 to-indigo-900'
    }
  },
  {
    id: 'intp',
    code: 'INTP',
    name: 'The Rogue Alchemist',
    title: 'Quantum Theorist & Conceptual Hacker',
    house: 'The Strategists',
    houseColor: '#6366F1',
    accentColor: '#A3F7BF',
    badgeBg: '#EEF2FF',
    mbtiEquiv: 'INTP',
    shortDescription: 'Reality-bending logicians driven by fierce intellectual autonomy and quantum experimentation.',
    fullDescription: 'The Rogue Alchemist views existing paradigms as fragile suggestions. Hovering amid floating terminal screens and bubbling flasks of pure theory, they deconstruct complex puzzles with effortless abstract elegance, uncovering hidden mathematical and philosophical symmetries.',
    superpowers: [
      'Sub-atomic Problem Deconstruction',
      'Hyper-Creative Theoretical Synthesis',
      'Unbiased Epistemic Openness'
    ],
    blindspots: [
      'Practical Implementation Inertia',
      'Communication Aloofness in Social Arenas',
      'Boredom Once Core Principles are Solved'
    ],
    famousExamples: ['Albert Einstein', 'Marie Curie', 'Alan Turing', 'Hannah Arendt'],
    careerClusters: ['Theoretical Physics', 'Cryptography', 'AI Safety & Research', 'Philosophical Logic'],
    relationshipKeys: {
      idealMatches: ['ENTJ (The Sovereign Commander)', 'ENFJ (The Cultural Luminary)'],
      frictionRisk: ['ESTJ (The Iron Marshall)', 'ESFP (The Velvet Maestro)'],
      communicationTip: 'Allow intellectual exploration time; do not demand premature operational commitments.'
    },
    hexacoProfile: {
      honestyHumility: 85,
      emotionality: 28,
      extraversion: 30,
      agreeableness: 58,
      conscientiousness: 68,
      openness: 98
    },
    riasecPrimary: ['Investigative', 'Artistic', 'Realistic'],
    attachmentTendency: 'Dismissive-Avoidant',
    traitEqBaseline: 69,
    avatarProps: {
      iconName: 'FlaskConical',
      propName: 'Holographic Matrix',
      geometricShape: 'hexagon',
      auraGradient: 'from-indigo-500 to-cyan-700'
    }
  },
  {
    id: 'entj',
    code: 'ENTJ',
    name: 'The Sovereign Commander',
    title: 'Imperial Strategist & Institutional Force',
    house: 'The Strategists',
    houseColor: '#6366F1',
    accentColor: '#FF6B6B',
    badgeBg: '#EEF2FF',
    mbtiEquiv: 'ENTJ',
    shortDescription: 'Relentless natural commanders who enforce organizational efficiency and manifest grand vision.',
    fullDescription: 'The Sovereign Commander stands atop symmetrical geometric podiums holding a neon-tipped scepter. They combine unmatched extraverted drive with rigorous tactical discipline, turning chaotic markets and fragmented teams into unstoppable, mission-driven engines.',
    superpowers: [
      'Macro-Scale Organizational Command',
      'Rapid Execution & Bottleneck Annihilation',
      'Magnetic Strategic Persuasion'
    ],
    blindspots: [
      'Impatience with Sub-optimal Velocity',
      'Inadvertent Steamrolling of Sensitive Peers',
      'Workaholic Autonomic Exhaustion'
    ],
    famousExamples: ['Julius Caesar', 'Steve Jobs', 'Margaret Thatcher', 'Napoleon Bonaparte'],
    careerClusters: ['Executive Leadership (CEO/COO)', 'Venture Capital', 'Corporate Turnaround', 'High-Stakes Litigation'],
    relationshipKeys: {
      idealMatches: ['INTP (The Rogue Alchemist)', 'INFP (The Dream Weaver)'],
      frictionRisk: ['ISFP (The Aesthetic Maverick)', 'ISFJ (The Silent Guardian)'],
      communicationTip: 'Bring structured solutions, not just problems. Speak with brevity and data clarity.'
    },
    hexacoProfile: {
      honestyHumility: 65,
      emotionality: 22,
      extraversion: 92,
      agreeableness: 48,
      conscientiousness: 96,
      openness: 86
    },
    riasecPrimary: ['Enterprising', 'Investigative', 'Conventional'],
    attachmentTendency: 'Secure',
    traitEqBaseline: 82,
    avatarProps: {
      iconName: 'Crown',
      propName: 'Neon Scepter',
      geometricShape: 'square',
      auraGradient: 'from-indigo-700 to-rose-900'
    }
  },
  {
    id: 'entp',
    code: 'ENTP',
    name: 'The Paradigm Hacker',
    title: 'Reality Debater & Disruption Catalyst',
    house: 'The Strategists',
    houseColor: '#6366F1',
    accentColor: '#FFE600',
    badgeBg: '#EEF2FF',
    mbtiEquiv: 'ENTP',
    shortDescription: 'Asymmetrical disruptors who dismantle dogma, test boundaries, and forge novel frontiers.',
    fullDescription: 'Equipped with electric goggles and an ambient light disruptor prism, The Paradigm Hacker lives to challenge conventional wisdom. They thrive in dialectical combat, rapidly generating ten groundbreaking hypotheses before others have even defined the premise.',
    superpowers: [
      'Boundaryless Divergent Ideation',
      'High-Speed Dialectical Improvisation',
      'Uncanny Trend & Pattern Spotting'
    ],
    blindspots: [
      'Chronic Devil’s Advocacy Alienation',
      'Follow-through Deficit on Monotonous Tasks',
      'Underestimating Procedural Compliance'
    ],
    famousExamples: ['Socrates', 'Richard Feynman', 'Leonardo da Vinci', 'Mark Twain'],
    careerClusters: ['Venture Incubation', 'Product Innovation', 'Intellectual Property Strategy', 'Investigative Journalism'],
    relationshipKeys: {
      idealMatches: ['INFJ (The Mystic Oracle)', 'INTJ (The Grand Architect)'],
      frictionRisk: ['ISTJ (The Master Auditor)', 'ISFJ (The Silent Guardian)'],
      communicationTip: 'Engage in lively brainstorming without taking debate personally; challenge their ideas constructively.'
    },
    hexacoProfile: {
      honestyHumility: 70,
      emotionality: 26,
      extraversion: 88,
      agreeableness: 54,
      conscientiousness: 60,
      openness: 98
    },
    riasecPrimary: ['Enterprising', 'Investigative', 'Artistic'],
    attachmentTendency: 'Secure',
    traitEqBaseline: 77,
    avatarProps: {
      iconName: 'Zap',
      propName: 'Disruptor Prism',
      geometricShape: 'triangle',
      auraGradient: 'from-indigo-600 to-amber-600'
    }
  },

  // HOUSE 2: THE DIPLOMATS (Neo Mint #10B981)
  {
    id: 'infj',
    code: 'INFJ',
    name: 'The Mystic Oracle',
    title: 'Insight Weaver & Cultural Compass',
    house: 'The Diplomats',
    houseColor: '#10B981',
    accentColor: '#6366F1',
    badgeBg: '#ECFDF5',
    mbtiEquiv: 'INFJ',
    shortDescription: 'Profound insight weavers with an ethereal third-eye aura dedicated to elevating human consciousness.',
    fullDescription: 'The Mystic Oracle is the rarest combination of deep emotional attunement and relentless structured foresight. Wielding a luminescent quill that draws lines of ethical code, they perceive interpersonal currents and societal trajectories long before they emerge into public view.',
    superpowers: [
      'Holistic Human Intuition & Empathic Diagnosis',
      'Moral Architecture & Cultural Transformation',
      'Incisive Individual Counseling'
    ],
    blindspots: [
      'Self-Sacrificing Emotional Absorption',
      'Unforgiving Inner Perfectionism & Burnout',
      'The "INFJ Door Slam" When Boundaries are Violated'
    ],
    famousExamples: ['Carl Jung', 'Mahatma Gandhi', 'Fyodor Dostoevsky', 'Eleanor Roosevelt'],
    careerClusters: ['Psychotherapy & Psychoanalysis', 'Ethical AI Governance', 'Organizational Philosophy', 'Non-profit Strategy'],
    relationshipKeys: {
      idealMatches: ['ENTP (The Paradigm Hacker)', 'ENFP (The Spark Catalyst)'],
      frictionRisk: ['ESTP (The Risk Vector)', 'ESTJ (The Iron Marshall)'],
      communicationTip: 'Validate their deep insights; provide a safe, calm space free of emotional manipulation.'
    },
    hexacoProfile: {
      honestyHumility: 94,
      emotionality: 68,
      extraversion: 36,
      agreeableness: 88,
      conscientiousness: 84,
      openness: 96
    },
    riasecPrimary: ['Social', 'Investigative', 'Artistic'],
    attachmentTendency: 'Anxious-Preoccupied',
    traitEqBaseline: 91,
    avatarProps: {
      iconName: 'Eye',
      propName: 'Luminescent Quill',
      geometricShape: 'diamond',
      auraGradient: 'from-emerald-500 to-teal-800'
    }
  },
  {
    id: 'infp',
    code: 'INFP',
    name: 'The Dream Weaver',
    title: 'Botanical Poet & Idealist Alchemist',
    house: 'The Diplomats',
    houseColor: '#10B981',
    accentColor: '#FF6B6B',
    badgeBg: '#ECFDF5',
    mbtiEquiv: 'INFP',
    shortDescription: 'Gentle, deeply authentic visionaries who protect moral purity and aesthetic sanctuary.',
    fullDescription: 'Carrying a botanical staff and an oversized, hard-bound sketchbook of raw poetry, The Dream Weaver lives in a rich tapestry of values. They are fiercely protective of individual authenticity and have an unparalleled gift for uncovering sacred beauty in the overlooked.',
    superpowers: [
      'Pure Ethical Authenticity & Core Integrity',
      'Sublime Creative & Literary Expression',
      'Radical Compassion for Marginalized Truths'
    ],
    blindspots: [
      'Vulnerability to Disillusionment in Corporate Environments',
      'Avoidance of Harsh Conflict or Tactical Negotiation',
      'Difficulty Translating Grand Visions into Daily Logistics'
    ],
    famousExamples: ['J.R.R. Tolkien', 'Vincent van Gogh', 'Virginia Woolf', 'Albert Camus'],
    careerClusters: ['Creative Writing & Literature', 'Human Rights Advocacy', 'Aesthetic Brand Narrative', 'Art Therapy'],
    relationshipKeys: {
      idealMatches: ['ENTJ (The Sovereign Commander)', 'ENFJ (The Cultural Luminary)'],
      frictionRisk: ['ESTJ (The Iron Marshall)', 'ISTJ (The Master Auditor)'],
      communicationTip: 'Respect their core values; avoid cynical dismissals and celebrate their creative expression.'
    },
    hexacoProfile: {
      honestyHumility: 96,
      emotionality: 74,
      extraversion: 32,
      agreeableness: 90,
      conscientiousness: 54,
      openness: 98
    },
    riasecPrimary: ['Artistic', 'Social', 'Investigative'],
    attachmentTendency: 'Anxious-Preoccupied',
    traitEqBaseline: 86,
    avatarProps: {
      iconName: 'BookOpen',
      propName: 'Botanical Staff',
      geometricShape: 'hexagon',
      auraGradient: 'from-emerald-400 to-indigo-700'
    }
  },
  {
    id: 'enfj',
    code: 'ENFJ',
    name: 'The Cultural Luminary',
    title: 'Charismatic Catalyst & Community Architect',
    house: 'The Diplomats',
    houseColor: '#10B981',
    accentColor: '#FFE600',
    badgeBg: '#ECFDF5',
    mbtiEquiv: 'ENFJ',
    shortDescription: 'Dynamic leaders who inspire collective purpose, heal tribal divides, and champion human potential.',
    fullDescription: 'The Cultural Luminary leads from the front holding a glowing beacon torch and a blocky megaphone of unity. They possess an instinctive charisma that unlocks latent greatness in individuals, orchestrating movements with infectious optimism and disciplined empathy.',
    superpowers: [
      'Inspirational Oratory & Community Mobilization',
      'Emotional Atmosphere Calibration',
      'High-EQ Talent Development'
    ],
    blindspots: [
      'Over-identifying with Others’ Struggles',
      'Stifling Dissent in Pursuit of Harmony',
      'Chronic Martyrdom Syndrome'
    ],
    famousExamples: ['Martin Luther King Jr.', 'Oprah Winfrey', 'Maya Angelou', 'Barack Obama'],
    careerClusters: ['Public Diplomacy', 'Transformational Leadership', 'Education & University Dean', 'Executive Coaching'],
    relationshipKeys: {
      idealMatches: ['INTP (The Rogue Alchemist)', 'INFP (The Dream Weaver)'],
      frictionRisk: ['ISTP (The Cyber Artisan)', 'ISTJ (The Master Auditor)'],
      communicationTip: 'Express appreciation openly; acknowledge their emotional investments and offer reciprocal care.'
    },
    hexacoProfile: {
      honestyHumility: 88,
      emotionality: 62,
      extraversion: 94,
      agreeableness: 92,
      conscientiousness: 86,
      openness: 89
    },
    riasecPrimary: ['Social', 'Enterprising', 'Artistic'],
    attachmentTendency: 'Secure',
    traitEqBaseline: 95,
    avatarProps: {
      iconName: 'Flame',
      propName: 'Beacon Torch',
      geometricShape: 'square',
      auraGradient: 'from-emerald-600 to-amber-600'
    }
  },
  {
    id: 'enfp',
    code: 'ENFP',
    name: 'The Spark Catalyst',
    title: 'Kinetic Dynamo & Novelty Alchemist',
    house: 'The Diplomats',
    houseColor: '#10B981',
    accentColor: '#74B9FF',
    badgeBg: '#ECFDF5',
    mbtiEquiv: 'ENFP',
    shortDescription: 'Energetic visionaries gliding on neon rollerblades, spraying kaleidoscopic inspiration everywhere.',
    fullDescription: 'Gliding across rigid systems with infectious enthusiasm, The Spark Catalyst sees life as an infinite canvas of human connection and creative serendipity. They ignite dormant passion in everyone they meet, acting as the ultimate catalyst for cultural renaissance.',
    superpowers: [
      'Infectious Enthusiastic Momentum',
      'Cross-Disciplinary Concept Synthesis',
      'Radical Interpersonal Warmth'
    ],
    blindspots: [
      'Overcommitting to 50 Concurrent Projects',
      'Aversion to Repetitive Bureaucratic Details',
      'Difficulty Processing Boredom'
    ],
    famousExamples: ['Robin Williams', 'Walt Disney', 'Anne Frank', 'Oscar Wilde'],
    careerClusters: ['Creative Direction', 'Startup Evangelism', 'Social Innovation', 'Experiential Design'],
    relationshipKeys: {
      idealMatches: ['INTJ (The Grand Architect)', 'INFJ (The Mystic Oracle)'],
      frictionRisk: ['ISTJ (The Master Auditor)', 'ESTJ (The Iron Marshall)'],
      communicationTip: 'Keep conversations buoyant and exploratory; celebrate their wild ideas before grounding them.'
    },
    hexacoProfile: {
      honestyHumility: 86,
      emotionality: 66,
      extraversion: 96,
      agreeableness: 88,
      conscientiousness: 52,
      openness: 97
    },
    riasecPrimary: ['Artistic', 'Social', 'Enterprising'],
    attachmentTendency: 'Anxious-Preoccupied',
    traitEqBaseline: 89,
    avatarProps: {
      iconName: 'Sparkles',
      propName: 'Prism Spray Can',
      geometricShape: 'triangle',
      auraGradient: 'from-teal-500 to-pink-600'
    }
  },

  // HOUSE 3: THE NAVIGATORS (Cyber Azure #0EA5E9)
  {
    id: 'istj',
    code: 'ISTJ',
    name: 'The Master Auditor',
    title: 'Precision Chronicler & Institutional Keystone',
    house: 'The Navigators',
    houseColor: '#0EA5E9',
    accentColor: '#FFE600',
    badgeBg: '#F0F9FF',
    mbtiEquiv: 'ISTJ',
    shortDescription: 'Rock-solid guardians of factual integrity, operational uptime, and institutional logic.',
    fullDescription: 'The Master Auditor wears an iron monocle and stands surrounded by stacked, heavy geometric blocks of foundational truth. When society falters, they are the bedrock that ensures contracts are honored, servers stay online, and truth remains uncorrupted by sensationalism.',
    superpowers: [
      'Zero-Defect Operational Reliability',
      'Exhaustive Regulatory & Factual Memory',
      'Unflinching Duty & Personal Accountability'
    ],
    blindspots: [
      'Resistance to Unproven Paradigm Shifts',
      'Perceived Bluntness in Soft Social Contexts',
      'Over-adherence to Legacy Protocol'
    ],
    famousExamples: ['George Washington', 'Angela Merkel', 'Warren Buffett', 'Queen Elizabeth II'],
    careerClusters: ['Financial Auditing', 'Regulatory Compliance', 'Infrastructure Engineering', 'Supply Chain Command'],
    relationshipKeys: {
      idealMatches: ['ESFP (The Velvet Maestro)', 'ESTP (The Risk Vector)'],
      frictionRisk: ['ENFP (The Spark Catalyst)', 'ENTP (The Paradigm Hacker)'],
      communicationTip: 'Present well-documented evidence and timelines; maintain reliability and respect established agreements.'
    },
    hexacoProfile: {
      honestyHumility: 92,
      emotionality: 24,
      extraversion: 34,
      agreeableness: 68,
      conscientiousness: 98,
      openness: 42
    },
    riasecPrimary: ['Conventional', 'Realistic', 'Investigative'],
    attachmentTendency: 'Secure',
    traitEqBaseline: 72,
    avatarProps: {
      iconName: 'FileCheck',
      propName: 'Iron Monocle',
      geometricShape: 'square',
      auraGradient: 'from-sky-600 to-slate-800'
    }
  },
  {
    id: 'isfj',
    code: 'ISFJ',
    name: 'The Silent Guardian',
    title: 'Fortified Shield-Bearer & Caretaker of Tradition',
    house: 'The Navigators',
    houseColor: '#0EA5E9',
    accentColor: '#A3F7BF',
    badgeBg: '#F0F9FF',
    mbtiEquiv: 'ISFJ',
    shortDescription: 'Quiet, thorough caretakers providing ironclad support, emotional safety, and practical care.',
    fullDescription: 'Carrying a massive titanium aegis and a glowing polygonal lantern, The Silent Guardian is the unsung backbone of families and organizations. They remember every anniversary, notice every unspoken burden, and step in with quiet, decisive practical relief.',
    superpowers: [
      'Hyper-Vigilant Practical Attunement',
      'Unconditional Loyalty to Established Bonds',
      'Flawless Logistical & Environmental Care'
    ],
    blindspots: [
      'Bottling Resentment Until Overwhelmed',
      'Reluctance to Advocate for Personal Needs',
      'Anxiety During Unstructured Chaos'
    ],
    famousExamples: ['Mother Teresa', 'Rosa Parks', 'Marcus Aurelius', 'Jimmy Carter'],
    careerClusters: ['Clinical Nursing & Medicine', 'Archival & Curatorial Stewardship', 'Early Childhood Education', 'Operations Support'],
    relationshipKeys: {
      idealMatches: ['ESTP (The Risk Vector)', 'ESFP (The Velvet Maestro)'],
      frictionRisk: ['ENTP (The Paradigm Hacker)', 'ENTJ (The Sovereign Commander)'],
      communicationTip: 'Acknowledge their quiet sacrifices directly; do not take their accommodating nature for granted.'
    },
    hexacoProfile: {
      honestyHumility: 95,
      emotionality: 64,
      extraversion: 38,
      agreeableness: 94,
      conscientiousness: 94,
      openness: 48
    },
    riasecPrimary: ['Social', 'Conventional', 'Realistic'],
    attachmentTendency: 'Anxious-Preoccupied',
    traitEqBaseline: 84,
    avatarProps: {
      iconName: 'Shield',
      propName: 'Titanium Aegis',
      geometricShape: 'hexagon',
      auraGradient: 'from-sky-500 to-teal-800'
    }
  },
  {
    id: 'estj',
    code: 'ESTJ',
    name: 'The Iron Marshall',
    title: 'Chief Orchestrator & Tactical Commander',
    house: 'The Navigators',
    houseColor: '#0EA5E9',
    accentColor: '#FF6B6B',
    badgeBg: '#F0F9FF',
    mbtiEquiv: 'ESTJ',
    shortDescription: 'High-octane operational chiefs who transform ambiguous projects into orderly clockwork.',
    fullDescription: 'The Iron Marshall wears a heavy communications headset and grips an oversized mechanical stopwatch. They take immediate charge of messy operations, establishing clear lines of accountability, measurable milestones, and transparent team standards.',
    superpowers: [
      'High-Throughput Project Orchestration',
      'Direct, Unambiguous Communication',
      'Unyielding Standard Enforcement'
    ],
    blindspots: [
      'Impatience with Unconventional Workstyles',
      'Underestimating Subjective Morale Factors',
      'Over-controlling Micro-management Risk'
    ],
    famousExamples: ['Henry Ford', 'Judge Judy', 'Colin Powell', 'Vince Lombardi'],
    careerClusters: ['Operations Director', 'Construction & Civil Engineering', 'Judicial Systems', 'Emergency Logistics'],
    relationshipKeys: {
      idealMatches: ['ISFP (The Aesthetic Maverick)', 'ISTP (The Cyber Artisan)'],
      frictionRisk: ['INFP (The Dream Weaver)', 'INFJ (The Mystic Oracle)'],
      communicationTip: 'Be punctual, concrete, and accountable; follow through on every single committed milestone.'
    },
    hexacoProfile: {
      honestyHumility: 72,
      emotionality: 20,
      extraversion: 90,
      agreeableness: 50,
      conscientiousness: 97,
      openness: 44
    },
    riasecPrimary: ['Enterprising', 'Conventional', 'Realistic'],
    attachmentTendency: 'Secure',
    traitEqBaseline: 76,
    avatarProps: {
      iconName: 'Activity',
      propName: 'Mechanical Stopwatch',
      geometricShape: 'square',
      auraGradient: 'from-sky-700 to-indigo-900'
    }
  },
  {
    id: 'esfj',
    code: 'ESFJ',
    name: 'The Community Anchor',
    title: 'Hearthkeeper & Cultural Glue',
    house: 'The Navigators',
    houseColor: '#0EA5E9',
    accentColor: '#FFE600',
    badgeBg: '#F0F9FF',
    mbtiEquiv: 'ESFJ',
    shortDescription: 'Warm, hospitable connectors who weave strong community tapestries and preserve social harmony.',
    fullDescription: 'Offering a geometric banquet chalice atop an interconnected digital tapestry of social nodes, The Community Anchor ensures that no team member feels isolated and that group cohesion remains unbreakable through every challenge.',
    superpowers: [
      'Effortless Social Fabric Construction',
      'Proactive Practical Hospitality',
      'High-Stakes Group Morale Stabilization'
    ],
    blindspots: [
      'Sensitivity to Social Criticism or Gossip',
      'Resistance to Radically Unorthodox Norms',
      'Over-policing Others’ Comfort'
    ],
    famousExamples: ['Taylor Swift', 'Jennifer Garner', 'Desmond Tutu', 'Bill Clinton'],
    careerClusters: ['Healthcare Administration', 'Public Relations & Events', 'Human Resources Director', 'Community Organizing'],
    relationshipKeys: {
      idealMatches: ['ISTP (The Cyber Artisan)', 'ISFP (The Aesthetic Maverick)'],
      frictionRisk: ['INTJ (The Grand Architect)', 'INTP (The Rogue Alchemist)'],
      communicationTip: 'Show gratitude openly; participate warmly in shared group traditions.'
    },
    hexacoProfile: {
      honestyHumility: 89,
      emotionality: 60,
      extraversion: 95,
      agreeableness: 93,
      conscientiousness: 91,
      openness: 54
    },
    riasecPrimary: ['Social', 'Enterprising', 'Conventional'],
    attachmentTendency: 'Secure',
    traitEqBaseline: 92,
    avatarProps: {
      iconName: 'Users',
      propName: 'Banquet Chalice',
      geometricShape: 'circle',
      auraGradient: 'from-sky-500 to-amber-600'
    }
  },

  // HOUSE 4: THE EXPLORERS (Acid Coral / Pop Yellow #F43F5E / #F59E0B)
  {
    id: 'istp',
    code: 'ISTP',
    name: 'The Cyber Artisan',
    title: 'Kinetic Mechanic & Tactical Troubleshooter',
    house: 'The Explorers',
    houseColor: '#F43F5E',
    accentColor: '#F59E0B',
    badgeBg: '#FFF1F2',
    mbtiEquiv: 'ISTP',
    shortDescription: 'Hands-on mechanical virtuosos who diagnose complex machinery with instant spatial intuition.',
    fullDescription: 'Equipped with an oversized plasma wrench and a hovering multi-tool drone, The Cyber Artisan operates with razor-sharp physical economy. When systems fail under pressure, they skip the philosophical debate and surgically fix the exact physical root cause in 30 seconds.',
    superpowers: [
      'Instant Crisis Spatial Diagnostics',
      'Mastery Over Complex Tooling & Physical Systems',
      'Unshakeable Calm Under Immediate Danger'
    ],
    blindspots: [
      'Allergic to Theoretical Speculation',
      'Reluctance to Vocalize Internal Reasoning',
      'Impulsive Risk Tolerance When Bored'
    ],
    famousExamples: ['Bruce Lee', 'Clint Eastwood', 'Steve Wozniak', 'Amelia Earhart'],
    careerClusters: ['Autonomous Robotics Engineering', 'Aerospace Mechanics', 'Emergency Trauma Surgery', 'Cybersecurity Forensics'],
    relationshipKeys: {
      idealMatches: ['ESFJ (The Community Anchor)', 'ESTJ (The Iron Marshall)'],
      frictionRisk: ['ENFJ (The Cultural Luminary)', 'INFJ (The Mystic Oracle)'],
      communicationTip: 'Respect their need for autonomy; avoid emotional grilling and focus on concrete actions.'
    },
    hexacoProfile: {
      honestyHumility: 74,
      emotionality: 18,
      extraversion: 36,
      agreeableness: 56,
      conscientiousness: 74,
      openness: 72
    },
    riasecPrimary: ['Realistic', 'Investigative', 'Enterprising'],
    attachmentTendency: 'Dismissive-Avoidant',
    traitEqBaseline: 70,
    avatarProps: {
      iconName: 'Wrench',
      propName: 'Plasma Wrench',
      geometricShape: 'triangle',
      auraGradient: 'from-rose-600 to-amber-700'
    }
  },
  {
    id: 'isfp',
    code: 'ISFP',
    name: 'The Aesthetic Maverick',
    title: 'Sensualist Rebel & Spatial Iconoclast',
    house: 'The Explorers',
    houseColor: '#F43F5E',
    accentColor: '#10B981',
    badgeBg: '#FFF1F2',
    mbtiEquiv: 'ISFP',
    shortDescription: 'Rebellious visual stylists wielding soundwave katanas to slice through rigid corporate conformity.',
    fullDescription: 'The Aesthetic Maverick transforms physical spaces, textiles, and acoustic frequencies into unforgettable sensory poetry. Driven by private, profound passions, they refuse to bend their authentic aesthetic vision to focus-group mediocrity.',
    superpowers: [
      'Exquisite Sensory & Spatial Harmony',
      'Defiant Creative Individuality',
      'Deep, Non-Verbal Empathic Resonance'
    ],
    blindspots: [
      'High Sensitivity to Bureaucratic Control',
      'Defensive Withdrawal When Misunderstood',
      'Reluctance to Plan Long-term Financial Logistical Sprints'
    ],
    famousExamples: ['David Bowie', 'Frida Kahlo', 'Prince', 'Bob Dylan'],
    careerClusters: ['Haute Couture & Industrial Design', 'Cinematography & Lighting', 'Culinary Architecture', 'Sound Design'],
    relationshipKeys: {
      idealMatches: ['ESTJ (The Iron Marshall)', 'ESFJ (The Community Anchor)'],
      frictionRisk: ['ENTJ (The Sovereign Commander)', 'INTJ (The Grand Architect)'],
      communicationTip: 'Give them sensory space to process; appreciate their craft without demanding rapid verbal justifications.'
    },
    hexacoProfile: {
      honestyHumility: 90,
      emotionality: 58,
      extraversion: 40,
      agreeableness: 84,
      conscientiousness: 62,
      openness: 94
    },
    riasecPrimary: ['Artistic', 'Realistic', 'Social'],
    attachmentTendency: 'Anxious-Preoccupied',
    traitEqBaseline: 83,
    avatarProps: {
      iconName: 'Palette',
      propName: 'Soundwave Katana',
      geometricShape: 'hexagon',
      auraGradient: 'from-rose-500 to-emerald-600'
    }
  },
  {
    id: 'estp',
    code: 'ESTP',
    name: 'The Risk Vector',
    title: 'Adrenaline Tactician & High-Speed Arbitrageur',
    house: 'The Explorers',
    houseColor: '#F43F5E',
    accentColor: '#FFE600',
    badgeBg: '#FFF1F2',
    mbtiEquiv: 'ESTP',
    shortDescription: 'High-speed tacticians equipped with jetpack sneakers and neon trading visors seizing live opportunity.',
    fullDescription: 'The Risk Vector thrives where the market is most volatile. They read human micro-expressions and real-time data flows in milliseconds, navigating high-stakes deals and kinetic emergencies with electric confidence and swagger.',
    superpowers: [
      'Microsecond Tactical Response Time',
      'High-Stakes Opportunity Arbitrage',
      'Irresistible Kinetic Presence & Charm'
    ],
    blindspots: [
      'Short-Term Thrill Seeking at Expense of Compounding',
      'Impatient with Abstract Theoretical Whitepapers',
      'Blunt Friction with Slower Decision-Makers'
    ],
    famousExamples: ['Theodore Roosevelt', 'Madonna', 'Ernest Hemingway', 'Winston Churchill'],
    careerClusters: ['High-Frequency Trading & Arbitrage', 'Emergency First Responder Command', 'Venture Dealmaking', 'Pro Athletics'],
    relationshipKeys: {
      idealMatches: ['ISFJ (The Silent Guardian)', 'ISTJ (The Master Auditor)'],
      frictionRisk: ['INFJ (The Mystic Oracle)', 'INFP (The Dream Weaver)'],
      communicationTip: 'Keep up with their energetic pace; be direct, bold, and keep discussions anchored in immediate realities.'
    },
    hexacoProfile: {
      honestyHumility: 62,
      emotionality: 16,
      extraversion: 96,
      agreeableness: 54,
      conscientiousness: 68,
      openness: 76
    },
    riasecPrimary: ['Enterprising', 'Realistic', 'Conventional'],
    attachmentTendency: 'Secure',
    traitEqBaseline: 80,
    avatarProps: {
      iconName: 'Rocket',
      propName: 'Trading Visor',
      geometricShape: 'diamond',
      auraGradient: 'from-rose-600 to-amber-500'
    }
  },
  {
    id: 'esfp',
    code: 'ESFP',
    name: 'The Velvet Maestro',
    title: 'Brutalist Virtuoso & Spotlight Dynamo',
    house: 'The Explorers',
    houseColor: '#F43F5E',
    accentColor: '#74B9FF',
    badgeBg: '#FFF1F2',
    mbtiEquiv: 'ESFP',
    shortDescription: 'Electrifying entertainers holding disco synth-guitars who turn every room into an unforgettable spectacle.',
    fullDescription: 'The Velvet Maestro radiates unfiltered sensory celebration. They live fully in the present moment, commanding the spotlight with effortless style, generous humor, and a magnetic ability to pull everyone into shared joy.',
    superpowers: [
      'Irresistible Live Performance Presence',
      'Spontaneous Mood Transformation',
      'High-Kinetic Physical Coordination'
    ],
    blindspots: [
      'Aversion to Austere Austerity or Long Isolation',
      'Procrastinating Boring Administrative Paperwork',
      'Vulnerability to Transient Hedonism'
    ],
    famousExamples: ['Marilyn Monroe', 'Elvis Presley', 'Freddie Mercury', 'Serena Williams'],
    careerClusters: ['Live Broadcast & Entertainment', 'Luxury Brand Experiential', 'Hospitality Impresario', 'Talent Representation'],
    relationshipKeys: {
      idealMatches: ['ISTJ (The Master Auditor)', 'ISFJ (The Silent Guardian)'],
      frictionRisk: ['INTP (The Rogue Alchemist)', 'INTJ (The Grand Architect)'],
      communicationTip: 'Bring positive energy and humor; share real-world fun activities and show sincere validation.'
    },
    hexacoProfile: {
      honestyHumility: 76,
      emotionality: 52,
      extraversion: 98,
      agreeableness: 88,
      conscientiousness: 58,
      openness: 84
    },
    riasecPrimary: ['Artistic', 'Enterprising', 'Social'],
    attachmentTendency: 'Secure',
    traitEqBaseline: 88,
    avatarProps: {
      iconName: 'Music',
      propName: 'Disco Synth-Guitar',
      geometricShape: 'circle',
      auraGradient: 'from-pink-500 to-amber-500'
    }
  }
];

export const GRAND_HOUSES = [
  {
    name: 'The Strategists' as const,
    color: '#6366F1',
    bgColor: '#EEF2FF',
    borderColor: '#0F172A',
    description: 'Driven by objective rationality, long-term vision, and intellectual independence.',
    traits: ['Rationality', 'Strategic Foresight', 'Deep Logic', 'Systems Architecture'],
    archetypeIds: ['intj', 'intp', 'entj', 'entp']
  },
  {
    name: 'The Diplomats' as const,
    color: '#10B981',
    bgColor: '#ECFDF5',
    borderColor: '#0F172A',
    description: 'Driven by emotional resonance, deep interpersonal cooperation, and passionate idealism.',
    traits: ['Empathy', 'Cultural Vision', 'Ethical Core', 'Human Catalyst'],
    archetypeIds: ['infj', 'infp', 'enfj', 'enfp']
  },
  {
    name: 'The Navigators' as const,
    color: '#0EA5E9',
    bgColor: '#F0F9FF',
    borderColor: '#0F172A',
    description: 'Grounded, highly practical, and focused intently on order, security, and institutional stability.',
    traits: ['Reliability', 'Duty & Honor', 'Order & Systems', 'Logistical Keystones'],
    archetypeIds: ['istj', 'isfj', 'estj', 'esfj']
  },
  {
    name: 'The Explorers' as const,
    color: '#F43F5E',
    bgColor: '#FFF1F2',
    borderColor: '#0F172A',
    description: 'Spontaneous, ingenious, and fiercely adaptable to the present moment, prioritizing tactical mastery.',
    traits: ['Kinetic Agility', 'Spatial Mastery', 'Aesthetic Rebellion', 'Live Arbitrage'],
    archetypeIds: ['istp', 'isfp', 'estp', 'esfp']
  }
];
