import React, { useState } from 'react';
import { 
  BookOpen, 
  X, 
  Search, 
  ShieldCheck, 
  Layers, 
  Compass, 
  BrainCircuit, 
  Activity, 
  Heart, 
  EyeOff, 
  Flame, 
  Cpu, 
  Feather, 
  HelpCircle,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface PsychometricGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTermId?: string;
}

interface GlossaryEntry {
  id: string;
  term: string;
  standard: string;
  category: 'core' | 'attachment' | 'career' | 'shadow' | 'neuro' | 'foundations';
  icon: any;
  color: string;
  summary: string;
  detailedExplanation: string[];
  whyItMatters: string;
  practicalExample: string;
  scientificCitations: string;
}

export const GLOSSARY_ENTRIES: GlossaryEntry[] = [
  {
    id: 'hexaco',
    term: 'HEXACO-PI-R Standard',
    standard: '6-Dimensional Dimensional Personality Framework (Ashton & Lee)',
    category: 'core',
    icon: ShieldCheck,
    color: '#6366F1',
    summary: 'The modern empirical gold standard replacing traditional 5-factor models, introducing the crucial 6th dimension: Honesty-Humility.',
    detailedExplanation: [
      'For decades, academic psychology used the Big Five (OCEAN: Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism). However, cross-cultural lexical studies across 12+ languages discovered a 6th fundamental trait that Big Five missed: Honesty-Humility.',
      'H - Honesty-Humility: Sincerity, fairness, greed-avoidance, and modesty vs. entitlement, exploitation, and manipulative flattery.',
      'E - Emotionality: Fearfulness, anxiety, emotional dependence, and sentimentality.',
      'X - eXtraversion: Social self-esteem, social boldness, sociability, and vitality.',
      'A - Agreeableness: Forgiveness, gentleness, flexibility, and patience (vs. anger and resentment).',
      'C - Conscientiousness: Organization, diligence, perfectionism, and prudence.',
      'O - Openness to Experience: Aesthetic appreciation, inquisitiveness, creativity, and unconventionality.'
    ],
    whyItMatters: 'It prevents confusing pleasant social demeanor (Agreeableness) with genuine ethical fairness and non-exploitiveness (Honesty-Humility).',
    practicalExample: 'A high-stakes negotiator with High Agreeableness but Low Honesty-Humility might speak with charismatic charm while secretly slipping unfair terms into a contract. HEXACO catches this distinction precisely.',
    scientificCitations: 'Ashton, M. C., & Lee, K. (2007). Empirical, theoretical, and practical advantages of the HEXACO model of personality structure. Personality and Social Psychology Review, 11(2), 150-166.'
  },
  {
    id: 'identity-variant',
    term: 'Identity Variant (-A Assertive vs. -T Turbulent)',
    standard: 'Neuroticism & Stress-Regulation Calibration',
    category: 'core',
    icon: Activity,
    color: '#10B981',
    summary: 'Measures how you respond to stress, failure, and self-doubt, indicating whether your baseline is calm resilience (-A) or vigilant perfectionism (-T).',
    detailedExplanation: [
      'The Identity suffix (-A or -T) sits on top of your primary 4-letter archetype code (e.g., INTJ-A vs. INTJ-T).',
      '-A (Assertive): Emotionally stable, even-tempered, resistant to burnout, and confident in past decisions. They rarely second-guess themselves, though they can occasionally overlook subtle blindspots.',
      '-T (Turbulent): Emotionally reactive, driven by high perfectionism, hyper-attuned to risks, and constantly striving to improve. They experience higher situational stress but frequently catch nuanced errors others miss.'
    ],
    whyItMatters: 'Two people with the exact same archetype (e.g., ENTJ) will operate entirely differently depending on whether they lead with unshakable composure (-A) or relentless self-scrutiny (-T).',
    practicalExample: 'When an unexpected crisis hits, an Assertive (-A) leader remains relaxed and takes swift executive action, while a Turbulent (-T) leader aggressively audits every possible failure point to prevent repeat mistakes.',
    scientificCitations: 'Costa, P. T., & McCrae, R. R. (1992). Revised NEO Personality Inventory (NEO-PI-R). Psychological Assessment Resources.'
  },
  {
    id: 'attachment-theory',
    term: 'ECR-R Attachment Theory & Gottman Index',
    standard: 'Experiences in Close Relationships-Revised (Fraley et al.) & Gottman Relational Metrics',
    category: 'attachment',
    icon: Heart,
    color: '#FF6B6B',
    summary: 'Maps your subconscious relational blueprint along continuous Attachment Anxiety and Attachment Avoidance dimensions.',
    detailedExplanation: [
      'Attachment theory defines how human beings bond, communicate vulnerability, handle emotional distance, and navigate relational conflict.',
      'Continuous Axes: Rather than rigid boxes, ECR-R plots you on two continuous spectra: Attachment Anxiety (fear of abandonment/rejection) and Attachment Avoidance (fear of intimacy/dependency).',
      'The 4 Quadrants:',
      '• Secure (Low Anxiety, Low Avoidance): Comfortable with emotional closeness, trusts partners, communicates needs directly.',
      '• Anxious-Preoccupied (High Anxiety, Low Avoidance): Craves deep reassurance, hypersensitive to partner moods, fears disconnection.',
      '• Dismissive-Avoidant (Low Anxiety, High Avoidance): Highly self-reliant, suppresses emotional vulnerability, withdraws during intense conflict.',
      '• Fearful-Avoidant / Disorganized (High Anxiety, High Avoidance): Desires deep closeness but fears getting hurt, oscillating between pursuit and withdrawal.',
      'Gottman Relational Index: Measures conflict de-escalation, repair attempt frequency, and the maintenance of the gold-standard 5:1 positive-to-negative interaction ratio.'
    ],
    whyItMatters: 'Attachment styles predict 80%+ of recurring relationship friction, communication impasses, and workplace partnership dynamics.',
    practicalExample: 'During a heated disagreement, an Anxious partner pursues immediate resolution while an Avoidant partner shuts down. Understanding this prevents treating healthy differences as relational crises.',
    scientificCitations: 'Fraley, R. C., Waller, N. G., & Brennan, K. A. (2000). An item response theory analysis of the Experiences in Close Relationships-Revised (ECR-R) adult attachment measure.'
  },
  {
    id: 'riasec-onet',
    term: 'Holland RIASEC Vocational Triad & O*NET 900+',
    standard: 'Holland Hexagonal Model & US Department of Labor Occupational Database',
    category: 'career',
    icon: Compass,
    color: '#6366F1',
    summary: 'Empirical classification of work personality across 6 interest archetypes, mapped directly to 900+ real-world career trajectories.',
    detailedExplanation: [
      'Developed by vocational psychologist Dr. John L. Holland, RIASEC categorizes all professional environments into 6 core themes:',
      '• R - Realistic: Practical, mechanical, physical, hands-on tool manipulation, concrete outcomes.',
      '• I - Investigative: Analytical, scientific, theoretical problem-solving, intellectual autonomy.',
      '• A - Artistic: Unstructured creative expression, aesthetics, original design, intuitive synthesis.',
      '• S - Social: Helping, mentoring, teaching, empathic coaching, community-oriented collaboration.',
      '• E - Enterprising: Persuasion, leadership, business strategy, entrepreneurial risk-taking, public speaking.',
      '• C - Conventional: Systematic data organization, precision accuracy, financial compliance, structured protocols.',
      'O*NET Cross-Mapping: Your 3-letter Holland Triad (e.g. IRC, EAS, SIA) matches directly against empirical task profiles of 900+ occupations maintained by the US Department of Labor.'
    ],
    whyItMatters: 'Job dissatisfaction is rarely about lack of intelligence; it is almost always an incongruence between your RIASEC interest profile and the daily cognitive demands of your role.',
    practicalExample: 'An Investigative-Artistic (IA) thinker forced into a Conventional-Enterprising (CE) repetitive data entry job will experience severe cognitive drain regardless of compensation.',
    scientificCitations: 'Holland, J. L. (1997). Making vocational choices: A theory of vocational personalities and work environments. Psychological Assessment Resources.'
  },
  {
    id: 'trait-eq',
    term: 'Trait Emotional Intelligence (TEIQue-SF & Bar-On)',
    standard: 'Petrides Trait EI & Bar-On Emotional Quotient Inventory',
    category: 'core',
    icon: Activity,
    color: '#0EA5E9',
    summary: 'Measures your emotional self-efficacy, intrapersonal regulation, empathic perception, and social adaptiveness.',
    detailedExplanation: [
      'While traditional IQ measures cognitive processing speed and pattern recognition, Trait EQ measures your ability to recognize, understand, express, and regulate emotional dynamics in yourself and others.',
      'Core Sub-dimensions:',
      '• Self-Awareness: Accurate perception of internal emotional triggers and physical somatic cues.',
      '• Emotion Regulation: Capacity to modulate intense affect, prevent reactive flooding, and maintain intentional behavior under pressure.',
      '• Empathic Attunement: Cognitive theory-of-mind and emotional resonance with the lived experience of peers.',
      '• Stress Tolerance & Optimism: Realistic hopefulness and stamina in the face of setbacks.'
    ],
    whyItMatters: 'High EQ accounts for over 58% of executive performance success and is the strongest predictor of sustainable leadership efficacy.',
    practicalExample: 'When receiving harsh public criticism, high Trait EQ allows you to separate the constructive data from the emotional sting, replying with measured clarity rather than defensive reactivity.',
    scientificCitations: 'Petrides, K. V., & Furnham, A. (2001). Trait emotional intelligence: Psychometric investigation with reference to established trait taxonomies.'
  },
  {
    id: 'subclinical-shadow',
    term: 'Subclinical Shadow & Dark Triad (SD3)',
    standard: 'Short Dark Triad (Paulhus & Williams) & Jungian Shadow Integration',
    category: 'shadow',
    icon: EyeOff,
    color: '#0F172A',
    summary: 'Assesses subclinical traits (Machiavellian strategy, Narcissistic agency, Psychopathic boldness) reframed as healthy boundary defense.',
    detailedExplanation: [
      'The Dark Triad (Paulhus & Williams, 2002) explores subclinical personality variance in everyday populations:',
      '• Subclinical Machiavellianism: Strategic foresight, political acumen, pragmatism, alliance building, and negotiation savvy.',
      '• Subclinical Narcissism: Ambition, leadership drive, self-worth, desire for impactful legacy, and public agency.',
      '• Subclinical Psychopathy / Boldness: Low social anxiety, stress immunity, fearless decision-making under severe uncertainty.',
      'Modern Shadow Integration: Rather than treating these as inherently negative, healthy integration uses them as shields: knowing how predators operate allows you to construct impenetrable boundaries and negotiate fearlessly without being exploited.'
    ],
    whyItMatters: 'Purely naive prosocial individuals without integrated shadow traits frequently suffer from chronic boundary collapse, under-compensation, and corporate exploitation.',
    practicalExample: 'In salary negotiations or contract disputes, an individual with integrated shadow traits will hold their ground firmly and deploy game-theory strategies without guilt.',
    scientificCitations: 'Paulhus, D. L., & Williams, K. M. (2002). The Dark Triad of personality: Narcissism, Machiavellianism, and psychopathy. Journal of Research in Personality, 36(6), 556-563.'
  },
  {
    id: 'neurodiversity-asrs-hsp',
    term: 'Neurodiversity & Attentional Vectors (ASRS v1.1 & HSP)',
    standard: 'WHO Adult ADHD Self-Report Scale (Kessler et al.) & Aron HSP Sensory Processing Scale',
    category: 'neuro',
    icon: Cpu,
    color: '#FFE600',
    summary: 'Quantifies executive function pacing, attention switching vs hyperfocus, and sensory processing sensitivity.',
    detailedExplanation: [
      'Human cognition exists along a broad neurodiverse spectrum of executive functioning and sensory processing:',
      '• ASRS v1.1 Attentional Regulation: Measures how your brain handles sustained attention on repetitive tasks versus rapid context switching, novelty-seeking, and divergent hyperfocus bursts.',
      '• Executive Function Pacing: Pacing rhythms (sprint-and-recover vs steady linear cadence) and working memory load management.',
      '• Aron HSP Sensory Processing Sensitivity (SPS): Depth of cognitive sensory processing, susceptibility to environmental overstimulation (open offices, harsh lighting, loud noises), and heightened subtle pattern perception.'
    ],
    whyItMatters: 'Designing a work schedule that aligns with your nervous system’s natural cognitive cadence eliminates chronic burnout and uncovers specialized hyperfocus superpowers.',
    practicalExample: 'An HSP individual thrives in quiet, low-stimulus environments with deep focus blocks, whereas an ADHD divergent thinker performs best with rapid task sprints and novel challenges.',
    scientificCitations: 'Kessler, R. C., et al. (2005). The World Health Organization Adult ADHD Self-Report Scale (ASRS). Psychological Medicine; Aron, E. N., & Aron, A. (1997). Sensory-processing sensitivity and its relation to introversion and emotionality. JPSP.'
  },
  {
    id: 'duckworth-grit',
    term: 'Duckworth Grit Scale',
    standard: 'Perseverance of Effort & Consistency of Interest Scale (Duckworth et al.)',
    category: 'core',
    icon: Flame,
    color: '#F97316',
    summary: 'Evaluates relentless long-term stamina and dedication to multi-year goals, independent of raw cognitive IQ.',
    detailedExplanation: [
      'Developed by MacArthur Fellow Dr. Angela Duckworth, Grit measures the intersection of passion and perseverance over multi-year horizons.',
      'Two Essential Components:',
      '1. Perseverance of Effort: Willingness to work through grueling plateaus, setbacks, and repetitive practice without giving up.',
      '2. Consistency of Interest: Maintaining focus on a primary overarching mission rather than abandoning projects for every new distraction.',
      'Scores range from 1.0 to 5.0, where 4.0+ reflects elite long-term execution stamina.'
    ],
    whyItMatters: 'Across West Point cadets, National Spelling Bee champions, and Fortune 500 founders, Grit outperforms raw talent and standardized test scores as a predictor of top-tier milestone attainment.',
    practicalExample: 'When a startup faces 18 months of sluggish traction, high grit keeps the founder executing iterative daily improvements while peers quit prematurely.',
    scientificCitations: 'Duckworth, A. L., Peterson, C., Matthews, M. D., & Kelly, D. R. (2007). Grit: Perseverance and passion for long-term goals. Journal of Personality and Social Psychology, 92(6), 1087-1101.'
  },
  {
    id: 'continuous-vectors',
    term: 'Continuous Vector Mathematics vs. Binary Typecasting',
    standard: 'High-Dimensional Psychometric Graph Topology (UPG 2.0)',
    category: 'foundations',
    icon: BrainCircuit,
    color: '#0F172A',
    summary: 'Why OmniPsyche computes high-dimensional continuous vectors rather than pigeonholing you into fragile 4-letter binary buckets.',
    detailedExplanation: [
      'Traditional pop-psychology tests (like basic MBTI) force continuous human traits into rigid binary dichotomies (e.g. 51% Introvert = 100% Introvert, 49% Introvert = 100% Extrovert). This creates false stereotypes and extreme test-retest unreliability.',
      'The Continuous Vector Solution: OmniPsyche represents your personality as a continuous 14-dimensional coordinate point in psychological vector space.',
      'Archetype Resonance: Your 4-letter archetype (e.g. INTJ) is simply the closest semantic gravitational anchor in the graph, but all 7 underlying layers remain fully continuous, nuanced, and dynamic.'
    ],
    whyItMatters: 'You are never trapped in a rigid box. Your profile captures the exact nuance between 52% and 94% on any given trait.',
    practicalExample: 'Two people who both carry the "INTJ" archetype code can have completely different career trajectories and attachment blueprints because their underlying continuous vectors reflect their unique life experience.',
    scientificCitations: 'McCrae, R. R., & Costa, P. T. (1989). Reinterpreting the Myers-Briggs Type Indicator from the perspective of the five-factor model of personality. Journal of Personality, 57(1), 17-40.'
  }
];

export const PsychometricGlossaryModal: React.FC<PsychometricGlossaryModalProps> = ({
  isOpen,
  onClose,
  initialTermId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(initialTermId || 'hexaco');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'ALL TERMS' },
    { id: 'core', label: 'CORE TRAITS & HEXACO' },
    { id: 'attachment', label: 'ATTACHMENT & GOTTMAN' },
    { id: 'career', label: 'VOCATIONAL & RIASEC' },
    { id: 'shadow', label: 'SHADOW & DEFENSE' },
    { id: 'neuro', label: 'NEURODIVERSITY & COGNITION' },
    { id: 'foundations', label: 'VECTOR MATHEMATICS' },
  ];

  const filteredEntries = GLOSSARY_ENTRIES.filter((entry) => {
    const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;
    const matchesSearch = 
      entry.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.standard.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.detailedExplanation.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#0F172A]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl h-[94dvh] sm:h-auto sm:max-h-[90vh] brutal-border brutal-shadow-xl flex flex-col overflow-hidden text-[#0F172A] relative">
        {/* Modal Header (Compact & Responsive on Mobile) */}
        <div className="bg-[#FFE600] p-3 sm:p-5 brutal-border-b flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-start gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#0F172A] text-[#FFE600] brutal-border flex items-center justify-center font-display font-black text-base sm:text-xl shrink-0 mt-0.5">
              <BookOpen size={18} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="brutal-badge bg-[#0F172A] text-white text-[9px] sm:text-[10px] font-mono font-bold">
                  EMPIRICAL SCIENCE & METHODOLOGY
                </span>
                <span className="hidden sm:inline font-mono text-[10px] font-bold text-slate-900 bg-white/80 px-2 py-0.5 brutal-border">
                  PEER-REVIEWED STANDARDS
                </span>
              </div>
              <h2 className="font-display font-black text-lg sm:text-2xl text-[#0F172A] tracking-tight mt-0.5">
                Psychometric Terms & Standards Explained
              </h2>
              <p className="font-mono text-[11px] sm:text-xs text-slate-800 line-clamp-1 sm:line-clamp-none mt-0.5">
                Every index, test standard, and mathematical metric in OmniPsyche demystified in clear language.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 bg-white brutal-border hover:bg-slate-100 transition-colors shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center"
            title="Close Glossary"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search & Horizontal Filter Bar (Ultra space-efficient on mobile) */}
        <div className="p-2.5 sm:p-4 bg-slate-50 border-b-2 border-[#0F172A] space-y-2 shrink-0">
          {/* Search Bar */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scientific terms (e.g. HEXACO, Attachment, Holland, Grit)..."
              className="w-full pl-9 pr-3 py-1.5 sm:py-2 bg-white brutal-border font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#FFE600]"
            />
          </div>

          {/* Horizontal scrollable category pill bar on mobile, wrap on desktop */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap font-mono text-[11px] no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 brutal-border font-bold whitespace-nowrap text-center transition-all shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-[#0F172A] text-white brutal-shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-[#0F172A]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Term Cards with smooth touch scroll and overscroll contain */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-6 space-y-3 sm:space-y-4">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <HelpCircle size={32} className="mx-auto text-slate-400" />
              <h3 className="font-display font-black text-base sm:text-lg text-[#0F172A]">No scientific terms found</h3>
              <p className="font-mono text-xs text-slate-500">Try searching for HEXACO, Gottman, RIASEC, Grit, or Shadow.</p>
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const Icon = entry.icon;
              const isExpanded = expandedId === entry.id;

              return (
                <div
                  key={entry.id}
                  className={`brutal-border transition-all ${
                    isExpanded ? 'bg-white brutal-shadow-md' : 'bg-slate-50 hover:bg-white'
                  }`}
                >
                  {/* Card Header Accordion */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                    className="p-3 sm:p-5 flex items-start justify-between gap-2.5 cursor-pointer select-none"
                  >
                    <div className="flex items-start gap-2.5 sm:gap-3.5 min-w-0">
                      <div
                        className="w-8 h-8 sm:w-10 sm:h-10 brutal-border text-white flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: entry.color }}
                      >
                        <Icon size={18} />
                      </div>

                      <div className="space-y-0.5 sm:space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-mono text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-indigo-900 bg-indigo-50 px-1.5 py-0.5 brutal-border border-indigo-200 truncate max-w-full">
                            {entry.standard}
                          </span>
                        </div>
                        <h3 className="font-display font-black text-base sm:text-xl text-[#0F172A] leading-tight">
                          {entry.term}
                        </h3>
                        <p className="font-mono text-[11px] sm:text-xs text-slate-700 leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-none">
                          {entry.summary}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 p-1 bg-white brutal-border text-[#0F172A] mt-1">
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                  </div>

                  {/* Expanded Deep-Dive Details */}
                  {isExpanded && (
                    <div className="px-3 pb-4 sm:px-6 sm:pb-6 pt-2 border-t-2 border-[#0F172A] space-y-3 sm:space-y-4 animate-in fade-in duration-150">
                      {/* Deep-Dive Breakdown */}
                      <div className="space-y-1.5 sm:space-y-2">
                        <span className="font-mono text-[10px] sm:text-[11px] font-black uppercase text-slate-500 block">
                          DETAILED PSYCHOMETRIC BREAKDOWN:
                        </span>
                        <div className="space-y-2 bg-[#FDFBF7] p-3 sm:p-4 brutal-border font-mono text-xs text-slate-800 leading-relaxed">
                          {entry.detailedExplanation.map((p, idx) => (
                            <p key={idx}>{p}</p>
                          ))}
                        </div>
                      </div>

                      {/* Why it Matters & Practical Example Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3.5">
                        <div className="p-3 sm:p-4 bg-emerald-50/70 brutal-border border-emerald-300 space-y-1">
                          <span className="font-mono text-[10px] font-black uppercase text-emerald-900 flex items-center gap-1">
                            <CheckCircle2 size={13} className="text-emerald-700" />
                            WHY THIS METRIC MATTERS
                          </span>
                          <p className="font-mono text-xs text-emerald-950 leading-relaxed">
                            {entry.whyItMatters}
                          </p>
                        </div>

                        <div className="p-3 sm:p-4 bg-amber-50/70 brutal-border border-amber-300 space-y-1">
                          <span className="font-mono text-[10px] font-black uppercase text-amber-900 flex items-center gap-1">
                            <BrainCircuit size={13} className="text-amber-700" />
                            REAL-WORLD APPLICATION
                          </span>
                          <p className="font-mono text-xs text-amber-950 leading-relaxed">
                            {entry.practicalExample}
                          </p>
                        </div>
                      </div>

                      {/* Peer-Reviewed Citation Footer */}
                      <div className="p-2 sm:p-2.5 bg-slate-100 brutal-border text-[10px] font-mono text-slate-600">
                        <strong className="text-slate-800">Primary Literature Citation:</strong> {entry.scientificCitations}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer (Compact and safe for mobile screens) */}
        <div className="p-3 sm:p-4 bg-[#FDFBF7] border-t-2 border-[#0F172A] flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          <span className="font-mono text-[10px] sm:text-xs text-slate-600 text-center sm:text-left hidden sm:inline">
            OmniPsyche complies with peer-reviewed psychometric protocols.
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto brutal-btn bg-[#0F172A] text-white px-5 py-2 font-mono text-xs font-black min-h-[40px] flex items-center justify-center"
          >
            GOT IT, CLOSE GLOSSARY
          </button>
        </div>
      </div>
    </div>
  );
};
