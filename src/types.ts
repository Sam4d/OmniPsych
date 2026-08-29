export type GrandHouse = 'The Strategists' | 'The Diplomats' | 'The Navigators' | 'The Explorers';

export type IdentityVariant = 'A' | 'T'; // Assertive vs Turbulent

export interface Archetype {
  id: string;
  code: string; // e.g. INTJ, ENFP
  name: string; // e.g. The Grand Architect
  title: string; // e.g. Master Tactician & Systems Visionary
  house: GrandHouse;
  houseColor: string; // Hex code
  accentColor: string;
  badgeBg: string;
  shortDescription: string;
  fullDescription: string;
  superpowers: string[];
  blindspots: string[];
  famousExamples: string[];
  careerClusters: string[];
  relationshipKeys: {
    idealMatches: string[];
    frictionRisk: string[];
    communicationTip: string;
  };
  mbtiEquiv: string;
  hexacoProfile: {
    honestyHumility: number; // 0-100
    emotionality: number;
    extraversion: number;
    agreeableness: number;
    conscientiousness: number;
    openness: number;
  };
  riasecPrimary: string[]; // e.g. ['Investigative', 'Artistic', 'Enterprising']
  attachmentTendency: 'Secure' | 'Anxious-Preoccupied' | 'Dismissive-Avoidant' | 'Fearful-Avoidant';
  traitEqBaseline: number; // 0-100
  avatarProps: {
    iconName: string;
    propName: string;
    geometricShape: 'diamond' | 'hexagon' | 'circle' | 'square' | 'triangle';
    auraGradient: string;
  };
}

export interface HexacoScores {
  honestyHumility: number;
  emotionality: number;
  extraversion: number;
  agreeableness: number;
  conscientiousness: number;
  openness: number;
  subfacets: {
    sincerity: number;
    fairness: number;
    greedAvoidance: number;
    modesty: number;
    fearfulness: number;
    anxiety: number;
    dependence: number;
    sentimentality: number;
    socialBoldness: number;
    sociability: number;
    liveliness: number;
    forgivingness: number;
    gentleness: number;
    flexibility: number;
    patience: number;
    organization: number;
    diligence: number;
    perfectionism: number;
    prudence: number;
    aestheticAppreciation: number;
    inquisitiveness: number;
    creativity: number;
    unconventionality: number;
  };
}

export interface AttachmentScores {
  anxiety: number; // 0-100
  avoidance: number; // 0-100
  style: 'Secure' | 'Anxious-Preoccupied' | 'Dismissive-Avoidant' | 'Fearful-Avoidant';
  description: string;
  growthEdge: string;
}

export interface RelationalExpressionScores {
  emotionalAttunement: number; // Words / Attunement
  sharedQualityTime: number;
  tacticalSupport: number; // Acts of service
  somatosensoryTouch: number;
  tangibleDevotion: number; // Gifts
  psychologicalSafetyIndex: number; // Gottman index
}

export interface RiasecScores {
  realistic: number;
  investigative: number;
  artistic: number;
  social: number;
  enterprising: number;
  conventional: number;
  topCodes: ('Realistic' | 'Investigative' | 'Artistic' | 'Social' | 'Enterprising' | 'Conventional')[];
  hollandCode: string; // e.g. "IAS"
}

export interface TraitEqScores {
  score: number; // 0-100
  selfAwareness: number;
  emotionRegulation: number;
  empathy: number;
  socialCompetence: number;
}

export interface ShadowScores {
  machiavellianism: number; // Subclinical
  narcissism: number;
  psychopathy: number;
  shadowIntegrationLevel: 'Mastered & Ethical' | 'Calibrated Leverage' | 'Emergent Awareness';
  reframeInsight: string;
}

export interface NeurodiversityScores {
  highSensitivityHsp: number; // 0-100
  attentionRegulationAsrs: number; // 0-100
  executiveFunctionPacing: number; // 0-100
  sensoryProcessingLoad: number; // 0-100
}

export interface GritScores {
  score: number; // 1.0 - 5.0
  perseveranceOfEffort: number;
  consistencyOfInterest: number;
}

export interface UserPsychologicalVector {
  hexaco: HexacoScores;
  attachment: AttachmentScores;
  relational: RelationalExpressionScores;
  riasec: RiasecScores;
  traitEq: TraitEqScores;
  shadow: ShadowScores;
  neurodiversity: NeurodiversityScores;
  grit: GritScores;
  identityVariant: IdentityVariant;
  calculatedArchetypeId: string;
  completionDate: string;
  totalAssessmentsCompleted: number;
  completedTestIds?: string[];
  xpPoints?: number;
}

export interface CareerMatch {
  title: string;
  onetCode: string;
  medianSalary: string;
  growthRate: string;
  riasecVector: string;
  matchScore: number;
  skills: string[];
  description: string;
}

export interface TestQuestion {
  id: string;
  prompt: string;
  domain: 'hexaco' | 'attachment' | 'relational' | 'riasec' | 'traitEq' | 'shadow' | 'neurodiversity' | 'grit';
  subDimension: string;
  reverseKeyed?: boolean;
  infrequencyCheck?: boolean; // Statistical validation trap
}

export interface MicroTest {
  id: string;
  title: string;
  subtitle: string;
  timeMinutes: number;
  questionCount: number;
  domain: string;
  color: string;
  badge: string;
  iconName: string;
  description: string;
  questions: TestQuestion[];
}

export interface WrappedSlide {
  id: string;
  headline: string;
  subhead: string;
  statHighlight: string;
  description: string;
  tag: string;
  bgColor: string;
  accentColor: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  username: string;
  friendCode: string;
  avatarColor: string;
  primaryArchetypeId?: string;
  archetypeTitle?: string;
  house?: GrandHouse;
  identityVariant?: IdentityVariant;
  psychologicalVector?: UserPsychologicalVector;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicProfile {
  uid: string;
  displayName: string;
  username: string;
  friendCode: string;
  avatarColor: string;
  primaryArchetypeId: string;
  archetypeTitle: string;
  house: GrandHouse;
  identityVariant: IdentityVariant;
  attachmentStyle?: string;
  hollandCode?: string;
  bio?: string;
  updatedAt: string;
}

export interface FriendRecord {
  friendUid: string;
  friendUsername: string;
  friendDisplayName: string;
  friendCode: string;
  friendArchetypeId: string;
  friendHouse: GrandHouse;
  addedAt: string;
}

export interface CompatibilityDuel {
  duelId: string;
  inviterUid: string;
  inviterName: string;
  inviterArchetypeId: string;
  inviterVector?: UserPsychologicalVector;
  inviteeUid?: string;
  inviteeName?: string;
  inviteeArchetypeId?: string;
  inviteeVector?: UserPsychologicalVector;
  status: 'pending' | 'completed';
  compatibilityScore?: number;
  chemistryGrade?: string;
  synergyHighlights?: string[];
  frictionWarnings?: string[];
  communicationProtocol?: string;
  createdAt: string;
  updatedAt: string;
}
