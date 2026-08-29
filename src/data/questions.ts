import { TestQuestion, MicroTest } from '../types';

export const OMNI_ASSESSMENT_QUESTIONS: TestQuestion[] = [
  // LAYER 1: CORE PERSONALITY (HEXACO 6 Domains & Subfacets)
  {
    id: 'hex-1',
    prompt: 'I rarely attempt to manipulate others or flatter people just to get special favors.',
    domain: 'hexaco',
    subDimension: 'honestyHumility'
  },
  {
    id: 'hex-2',
    prompt: 'I would feel deeply uncomfortable if I possessed vast wealth while others lacked basic necessities.',
    domain: 'hexaco',
    subDimension: 'honestyHumility'
  },
  {
    id: 'hex-3',
    prompt: 'I rarely experience intense anxiety or worry about things that might go wrong in the future.',
    domain: 'hexaco',
    subDimension: 'emotionality',
    reverseKeyed: true
  },
  {
    id: 'hex-4',
    prompt: 'I feel a profound emotional resonance and tearfulness during moving artistic or human moments.',
    domain: 'hexaco',
    subDimension: 'emotionality'
  },
  {
    id: 'hex-5',
    prompt: 'In large gatherings, I naturally introduce myself to new people and initiate energizing conversations.',
    domain: 'hexaco',
    subDimension: 'extraversion'
  },
  {
    id: 'hex-6',
    prompt: 'I prefer quiet, solitary evenings dedicated to deep focus over high-energy social parties.',
    domain: 'hexaco',
    subDimension: 'extraversion',
    reverseKeyed: true
  },
  {
    id: 'hex-7',
    prompt: 'I easily forgive people who have wronged me once they apologize, without harboring lingering grudges.',
    domain: 'hexaco',
    subDimension: 'agreeableness'
  },
  {
    id: 'hex-8',
    prompt: 'I tend to express harsh, unvarnished criticism even if it bruises someone’s immediate feelings.',
    domain: 'hexaco',
    subDimension: 'agreeableness',
    reverseKeyed: true
  },
  {
    id: 'hex-9',
    prompt: 'I maintain meticulous order in my work environment and organize my schedule with precise discipline.',
    domain: 'hexaco',
    subDimension: 'conscientiousness'
  },
  {
    id: 'hex-10',
    prompt: 'I persist relentlessly on challenging projects until every single detail is executed to perfection.',
    domain: 'hexaco',
    subDimension: 'conscientiousness'
  },
  {
    id: 'hex-11',
    prompt: 'I am constantly drawn to radical, unconventional theories, abstract philosophies, and avant-garde art.',
    domain: 'hexaco',
    subDimension: 'openness'
  },
  {
    id: 'hex-12',
    prompt: 'I prefer concrete, tried-and-true practical methods over speculative conceptual experiments.',
    domain: 'hexaco',
    subDimension: 'openness',
    reverseKeyed: true
  },

  // Statistical Infrequency Validation Item (Detects random clicking / speedrunning)
  {
    id: 'trap-1',
    prompt: 'I make a conscious effort to breathe air at least once every ten seconds to stay alive.',
    domain: 'hexaco',
    subDimension: 'infrequency',
    infrequencyCheck: true
  },

  // LAYER 2: RELATIONAL ATTACHMENT (ECR-R Anxiety & Avoidance)
  {
    id: 'att-1',
    prompt: 'I often worry that my close romantic or platonic partners do not value me as much as I value them.',
    domain: 'attachment',
    subDimension: 'anxiety'
  },
  {
    id: 'att-2',
    prompt: 'I need frequent reassurance and verbal validation to feel confident and secure in relationships.',
    domain: 'attachment',
    subDimension: 'anxiety'
  },
  {
    id: 'att-3',
    prompt: 'I feel uncomfortable when people try to get emotionally too close or dependent upon me.',
    domain: 'attachment',
    subDimension: 'avoidance'
  },
  {
    id: 'att-4',
    prompt: 'I find it easy to depend on partners and feel comfortable being vulnerable with my deepest secrets.',
    domain: 'attachment',
    subDimension: 'avoidance',
    reverseKeyed: true
  },

  // LAYER 3: LOVE & CONNECTION DYNAMICS (Empirical Vectors & Gottman)
  {
    id: 'rel-1',
    prompt: 'Receiving direct, sincere verbal praise and intellectual recognition makes me feel deeply cherished.',
    domain: 'relational',
    subDimension: 'emotionalAttunement'
  },
  {
    id: 'rel-2',
    prompt: 'Undivided, phone-free quality time spent in meaningful dialogue is my primary metric for intimacy.',
    domain: 'relational',
    subDimension: 'sharedQualityTime'
  },
  {
    id: 'rel-3',
    prompt: 'When someone proactively handles a stressful practical chore for me, I feel immensely supported.',
    domain: 'relational',
    subDimension: 'tacticalSupport'
  },
  {
    id: 'rel-4',
    prompt: 'During heated disagreements, I proactively de-escalate tension and protect psychological safety.',
    domain: 'relational',
    subDimension: 'psychologicalSafety'
  },

  // LAYER 4: VOCATIONAL & CAREER FIT (Holland RIASEC)
  {
    id: 'ria-1',
    prompt: 'I enjoy building physical prototypes, operating mechanical systems, or working outdoors with tools.',
    domain: 'riasec',
    subDimension: 'realistic'
  },
  {
    id: 'ria-2',
    prompt: 'I love analyzing scientific datasets, deciphering algorithms, and solving mathematical mysteries.',
    domain: 'riasec',
    subDimension: 'investigative'
  },
  {
    id: 'ria-3',
    prompt: 'I thrive when creating visual art, composing music, designing interfaces, or writing original prose.',
    domain: 'riasec',
    subDimension: 'artistic'
  },
  {
    id: 'ria-4',
    prompt: 'I am deeply motivated by teaching, mentoring, counseling, and helping other people flourish.',
    domain: 'riasec',
    subDimension: 'social'
  },
  {
    id: 'ria-5',
    prompt: 'I excel at pitching ambitious visions, negotiating deals, and leading commercial enterprises.',
    domain: 'riasec',
    subDimension: 'enterprising'
  },
  {
    id: 'ria-6',
    prompt: 'I find satisfaction in organizing financial spreadsheets, streamlining workflows, and maintaining logs.',
    domain: 'riasec',
    subDimension: 'conventional'
  },

  // LAYER 5: COGNITIVE & EMOTIONAL STYLE (Trait EQ & Grit)
  {
    id: 'eq-1',
    prompt: 'I have an accurate, immediate awareness of my own emotional triggers as they arise in real time.',
    domain: 'traitEq',
    subDimension: 'selfAwareness'
  },
  {
    id: 'eq-2',
    prompt: 'Under high stress or provocation, I can quickly self-soothe and regain cognitive clarity.',
    domain: 'traitEq',
    subDimension: 'emotionRegulation'
  },
  {
    id: 'grit-1',
    prompt: 'I have overcome substantial setbacks to conquer an important long-term goal that took years.',
    domain: 'grit',
    subDimension: 'perseverance'
  },

  // LAYER 6: SHADOW & DARK TRIAD (SD3 Constructive Framing)
  {
    id: 'sd-1',
    prompt: 'I naturally calculate the power dynamics and hidden incentives in any negotiation room.',
    domain: 'shadow',
    subDimension: 'machiavellianism'
  },
  {
    id: 'sd-2',
    prompt: 'I have a strong drive to leave a lasting, world-renowned legacy and be recognized for exceptional talent.',
    domain: 'shadow',
    subDimension: 'narcissism'
  },

  // LAYER 7: NEURODIVERSITY SCREENERS (HSP, ASRS, Executive Pacing)
  {
    id: 'nd-1',
    prompt: 'I become easily overwhelmed by intense sensory inputs like bright fluorescent lights or loud sirens.',
    domain: 'neurodiversity',
    subDimension: 'hsp'
  },
  {
    id: 'nd-2',
    prompt: 'When a topic genuinely captures my passion, I enter an intense hyper-focus state where hours vanish.',
    domain: 'neurodiversity',
    subDimension: 'attentionRegulation'
  }
];

export const QUICK_LAB_TESTS: MicroTest[] = [
  {
    id: 'attachment-radar',
    title: 'The Attachment Radar',
    subtitle: 'ECR-R Dimensional Matrix',
    timeMinutes: 3,
    questionCount: 6,
    domain: 'Relational Psychology',
    color: '#6366F1',
    badge: 'ECR-R VALIDATED',
    iconName: 'HeartHandshake',
    description: 'Map your exact placement across Attachment Anxiety and Avoidance. Unpack your relational triggers and security keys.',
    questions: [
      {
        id: 'ql-att-1',
        prompt: 'I worry a lot about my relationships and fear my partner will lose interest in me.',
        domain: 'attachment',
        subDimension: 'anxiety'
      },
      {
        id: 'ql-att-2',
        prompt: 'I find it relatively easy to get emotionally close to others and trust them with my vulnerability.',
        domain: 'attachment',
        subDimension: 'avoidance',
        reverseKeyed: true
      },
      {
        id: 'ql-att-3',
        prompt: 'When I feel stressed or upset, my first instinct is to withdraw into isolation rather than reach out.',
        domain: 'attachment',
        subDimension: 'avoidance'
      },
      {
        id: 'ql-att-4',
        prompt: 'I often feel frustrated when close partners are not as available or emotionally invested as I desire.',
        domain: 'attachment',
        subDimension: 'anxiety'
      },
      {
        id: 'ql-att-5',
        prompt: 'I am comfortable without close emotional relationships and prefer complete self-reliance.',
        domain: 'attachment',
        subDimension: 'avoidance'
      },
      {
        id: 'ql-att-6',
        prompt: 'I believe I am fundamentally worthy of love and trust that healthy partners will support me.',
        domain: 'attachment',
        subDimension: 'anxiety',
        reverseKeyed: true
      }
    ]
  },
  {
    id: 'career-matrix',
    title: 'The Career Matrix',
    subtitle: 'Holland Code RIASEC + O*NET Matcher',
    timeMinutes: 4,
    questionCount: 6,
    domain: 'Vocational Science',
    color: '#10B981',
    badge: 'O*NET 900+ OCCUPATIONS',
    iconName: 'Briefcase',
    description: 'Discover your 3-letter Holland RIASEC profile and match your cognitive vector to top-tier career clusters & salary bands.',
    questions: [
      {
        id: 'ql-car-1',
        prompt: 'I enjoy diagnosing complex systems, designing software, or researching theoretical questions.',
        domain: 'riasec',
        subDimension: 'investigative'
      },
      {
        id: 'ql-car-2',
        prompt: 'I love leading high-stakes projects, pitching commercial visions, and taking entrepreneurial risks.',
        domain: 'riasec',
        subDimension: 'enterprising'
      },
      {
        id: 'ql-car-3',
        prompt: 'I find deep fulfillment in counseling, coaching, and developing people to achieve their potential.',
        domain: 'riasec',
        subDimension: 'social'
      },
      {
        id: 'ql-car-4',
        prompt: 'I prefer working with visual design, sound, expressive writing, and creative experimentation.',
        domain: 'riasec',
        subDimension: 'artistic'
      },
      {
        id: 'ql-car-5',
        prompt: 'I enjoy organizing precise databases, auditing financial models, and optimizing workflows.',
        domain: 'riasec',
        subDimension: 'conventional'
      },
      {
        id: 'ql-car-6',
        prompt: 'I enjoy hands-on physical building, machinery troubleshooting, and spatial craft.',
        domain: 'riasec',
        subDimension: 'realistic'
      }
    ]
  },
  {
    id: 'shadow-archetype',
    title: 'The Shadow Archetype',
    subtitle: 'Subclinical SD3 Integration Index',
    timeMinutes: 3,
    questionCount: 6,
    domain: 'Shadow Psychology',
    color: '#0F172A',
    badge: 'SD3 SUBCLINICAL SCALE',
    iconName: 'EyeOff',
    description: 'Integrate your subclinical Machiavellian, Narcissistic, and Psychopathic traits into healthy boundary-setting and strategic leverage.',
    questions: [
      {
        id: 'ql-sh-1',
        prompt: 'It is wise to keep your strategic cards close to your chest and not reveal your full leverage prematurely.',
        domain: 'shadow',
        subDimension: 'machiavellianism'
      },
      {
        id: 'ql-sh-2',
        prompt: 'I have a high appetite for calculated risks that would cause more timid people to freeze.',
        domain: 'shadow',
        subDimension: 'psychopathy'
      },
      {
        id: 'ql-sh-3',
        prompt: 'I know that I possess extraordinary capabilities that deserve high-impact recognition and influence.',
        domain: 'shadow',
        subDimension: 'narcissism'
      },
      {
        id: 'ql-sh-4',
        prompt: 'I can maintain icy, surgical focus in contentious debates where others get swept up in emotional panic.',
        domain: 'shadow',
        subDimension: 'psychopathy'
      },
      {
        id: 'ql-sh-5',
        prompt: 'I am skilled at reading what people truly desire and tailoring my presentation to align incentives.',
        domain: 'shadow',
        subDimension: 'machiavellianism'
      },
      {
        id: 'ql-sh-6',
        prompt: 'I hold myself to elite standards and expect to be in rooms where major historical decisions occur.',
        domain: 'shadow',
        subDimension: 'narcissism'
      }
    ]
  },
  {
    id: 'trait-eq-pulse',
    title: 'Trait EQ Pulse',
    subtitle: 'TEIQue-SF 4-Factor Assessment',
    timeMinutes: 3,
    questionCount: 6,
    domain: 'Emotional Intelligence',
    color: '#0EA5E9',
    badge: 'TEIQue-SF SYNTHESIS',
    iconName: 'Activity',
    description: 'Evaluate your Trait Emotional Intelligence across Self-Awareness, Emotion Regulation, Empathy, and Social Competence.',
    questions: [
      {
        id: 'ql-eq-1',
        prompt: 'I immediately identify what specific emotion I am experiencing, even when it is subtle or complex.',
        domain: 'traitEq',
        subDimension: 'selfAwareness'
      },
      {
        id: 'ql-eq-2',
        prompt: 'When confronted with sudden bad news, I can regulate my nervous system and respond constructively.',
        domain: 'traitEq',
        subDimension: 'emotionRegulation'
      },
      {
        id: 'ql-eq-3',
        prompt: 'I instinctively pick up on unspoken micro-expressions and atmospheric tension in a room.',
        domain: 'traitEq',
        subDimension: 'empathy'
      },
      {
        id: 'ql-eq-4',
        prompt: 'I find it easy to adapt my social style to make very different personalities feel at ease.',
        domain: 'traitEq',
        subDimension: 'socialCompetence'
      },
      {
        id: 'ql-eq-5',
        prompt: 'I rarely lose control of my temper, even during intense, unfair provocations.',
        domain: 'traitEq',
        subDimension: 'emotionRegulation'
      },
      {
        id: 'ql-eq-6',
        prompt: 'I genuinely care about the emotional wellbeing of colleagues and friends and notice their fatigue.',
        domain: 'traitEq',
        subDimension: 'empathy'
      }
    ]
  },
  {
    id: 'gottman-relational',
    title: 'Relational Expression & Gottman Matrix',
    subtitle: '6-Vector Empirical Connection Profile',
    timeMinutes: 3,
    questionCount: 6,
    domain: 'Relational Science',
    color: '#F43F5E',
    badge: 'GOTTMAN METRICS',
    iconName: 'Flame',
    description: 'Move beyond pop-psychology: measure your 6 empirical relational expression vectors and conflict safety index.',
    questions: [
      {
        id: 'ql-got-1',
        prompt: 'I feel most deeply connected when a partner actively listens to my inner world with focused presence.',
        domain: 'relational',
        subDimension: 'emotionalAttunement'
      },
      {
        id: 'ql-got-2',
        prompt: 'Shared activities, exploratory travel, and uninterrupted quality time are essential for my happiness.',
        domain: 'relational',
        subDimension: 'sharedQualityTime'
      },
      {
        id: 'ql-got-3',
        prompt: 'Reliable tactical actions—fixing issues, making life easier—speak louder to me than poetic declarations.',
        domain: 'relational',
        subDimension: 'tacticalSupport'
      },
      {
        id: 'ql-got-4',
        prompt: 'Physical affection, hugs, and tactile warmth are crucial for soothing my nervous system.',
        domain: 'relational',
        subDimension: 'somatosensoryTouch'
      },
      {
        id: 'ql-got-5',
        prompt: 'Thoughtful, symbolic gifts that show someone truly remembers what I cherish bring immense joy.',
        domain: 'relational',
        subDimension: 'tangibleDevotion'
      },
      {
        id: 'ql-got-6',
        prompt: 'I never use contempt or stonewalling during disagreements; I preserve mutual dignity.',
        domain: 'relational',
        subDimension: 'psychologicalSafety'
      }
    ]
  },
  {
    id: 'duckworth-grit',
    title: 'Duckworth Grit & Resilience',
    subtitle: 'Long-Term Perseverance Index',
    timeMinutes: 2,
    questionCount: 4,
    domain: 'Behavioral Psychology',
    color: '#F59E0B',
    badge: 'GRIT SCALE VALIDATED',
    iconName: 'ShieldCheck',
    description: 'Measure your score on Angela Duckworth’s Grit Scale: test your stamina for multi-year goals vs novelty-seeking.',
    questions: [
      {
        id: 'ql-gr-1',
        prompt: 'Setbacks do not discourage me; I view failure as data and double down on execution.',
        domain: 'grit',
        subDimension: 'perseverance'
      },
      {
        id: 'ql-gr-2',
        prompt: 'I maintain intense fascination and consistency with a major life obsession for years without abandoning it.',
        domain: 'grit',
        subDimension: 'consistency'
      },
      {
        id: 'ql-gr-3',
        prompt: 'I am a hard worker who consistently follows through on difficult commitments regardless of mood.',
        domain: 'grit',
        subDimension: 'perseverance'
      },
      {
        id: 'ql-gr-4',
        prompt: 'I finish whatever I begin, even when the initial novelty and excitement have completely faded.',
        domain: 'grit',
        subDimension: 'consistency'
      }
    ]
  },
  {
    id: 'executive-asrs',
    title: 'Executive Focus & Attention Flow',
    subtitle: 'ASRS v1.1 Screener (Non-Diagnostic)',
    timeMinutes: 3,
    questionCount: 5,
    domain: 'Cognitive Science',
    color: '#FFE600',
    badge: 'NON-DIAGNOSTIC INDEX',
    iconName: 'Cpu',
    description: 'Explore your attentional regulation spectrum, hyper-focus tendencies, and executive function pacing.',
    questions: [
      {
        id: 'ql-asrs-1',
        prompt: 'How often do you have trouble wrapping up the fine details of a project once the challenging parts are done?',
        domain: 'neurodiversity',
        subDimension: 'attentionRegulation'
      },
      {
        id: 'ql-asrs-2',
        prompt: 'When working on complex tasks, you enter deep flow states where you forget to eat or drink.',
        domain: 'neurodiversity',
        subDimension: 'attentionRegulation'
      },
      {
        id: 'ql-asrs-3',
        prompt: 'You find repetitive administrative tasks mentally excruciating unless gamified with high speed.',
        domain: 'neurodiversity',
        subDimension: 'executiveFunction'
      },
      {
        id: 'ql-asrs-4',
        prompt: 'Your brain generates 10 creative connections simultaneously while someone is explaining a simple step.',
        domain: 'neurodiversity',
        subDimension: 'executiveFunction'
      },
      {
        id: 'ql-asrs-5',
        prompt: 'You structure your calendar with visual time-blocks and alarms to prevent time-blindness.',
        domain: 'neurodiversity',
        subDimension: 'executiveFunction'
      }
    ]
  },
  {
    id: 'hsp-sensory',
    title: 'HSP Sensory Processing Index',
    subtitle: 'Aron Highly Sensitive Profile',
    timeMinutes: 2,
    questionCount: 4,
    domain: 'Sensory Psychology',
    color: '#A3F7BF',
    badge: 'SENSORY PROFILE',
    iconName: 'Feather',
    description: 'Evaluate your environmental sensitivity, sensory processing depth, and autonomic recovery requirements.',
    questions: [
      {
        id: 'ql-hsp-1',
        prompt: 'I am deeply moved by subtle acoustic details, complex fragrances, and visual composition.',
        domain: 'neurodiversity',
        subDimension: 'hsp'
      },
      {
        id: 'ql-hsp-2',
        prompt: 'After spending hours in crowded, noisy environments, I need solitary quiet time in a dim room to recharge.',
        domain: 'neurodiversity',
        subDimension: 'hsp'
      },
      {
        id: 'ql-hsp-3',
        prompt: 'I notice subtle changes in other people’s emotional body language that others completely overlook.',
        domain: 'neurodiversity',
        subDimension: 'hsp'
      },
      {
        id: 'ql-hsp-4',
        prompt: 'I have a rich, highly complex inner life with vivid imagination and multi-layered introspection.',
        domain: 'neurodiversity',
        subDimension: 'hsp'
      }
    ]
  }
];
