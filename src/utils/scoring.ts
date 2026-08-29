import { UserPsychologicalVector, IdentityVariant } from '../types';
import { ARCHETYPES } from '../data/archetypes';

const STORAGE_KEY = 'omnipsyche_user_vector_v1';

export const DEFAULT_INITIAL_VECTOR: UserPsychologicalVector = {
  hexaco: {
    honestyHumility: 82,
    emotionality: 34,
    extraversion: 45,
    agreeableness: 68,
    conscientiousness: 89,
    openness: 92,
    subfacets: {
      sincerity: 85,
      fairness: 88,
      greedAvoidance: 80,
      modesty: 75,
      fearfulness: 30,
      anxiety: 35,
      dependence: 28,
      sentimentality: 42,
      socialBoldness: 70,
      sociability: 48,
      liveliness: 52,
      forgivingness: 72,
      gentleness: 68,
      flexibility: 62,
      patience: 70,
      organization: 92,
      diligence: 90,
      perfectionism: 88,
      prudence: 86,
      aestheticAppreciation: 90,
      inquisitiveness: 96,
      creativity: 94,
      unconventionality: 88
    }
  },
  attachment: {
    anxiety: 28,
    avoidance: 32,
    style: 'Secure',
    description: 'High autonomy combined with emotional accessibility. You express vulnerability without panic and grant partners freedom without resentment.',
    growthEdge: 'Continue vocalizing subtle needs early before relying entirely on self-contained problem-solving.'
  },
  relational: {
    emotionalAttunement: 88,
    sharedQualityTime: 92,
    tacticalSupport: 84,
    somatosensoryTouch: 70,
    tangibleDevotion: 55,
    psychologicalSafetyIndex: 94
  },
  riasec: {
    realistic: 45,
    investigative: 94,
    artistic: 82,
    social: 58,
    enterprising: 76,
    conventional: 60,
    topCodes: ['Investigative', 'Artistic', 'Enterprising'],
    hollandCode: 'IAE'
  },
  traitEq: {
    score: 84,
    selfAwareness: 88,
    emotionRegulation: 86,
    empathy: 78,
    socialCompetence: 84
  },
  shadow: {
    machiavellianism: 48,
    narcissism: 52,
    psychopathy: 24,
    shadowIntegrationLevel: 'Mastered & Ethical',
    reframeInsight: 'Your subclinical strategic awareness allows you to detect manipulative tactics in business and defend your team with ethical leverage.'
  },
  neurodiversity: {
    highSensitivityHsp: 68,
    attentionRegulationAsrs: 62,
    executiveFunctionPacing: 78,
    sensoryProcessingLoad: 55
  },
  grit: {
    score: 4.4,
    perseveranceOfEffort: 4.6,
    consistencyOfInterest: 4.2
  },
  identityVariant: 'A',
  calculatedArchetypeId: 'intj',
  completionDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  totalAssessmentsCompleted: 1,
  completedTestIds: ['omni-core'],
  xpPoints: 450
};

export function loadUserVector(): UserPsychologicalVector {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load user vector from localStorage', e);
  }
  return DEFAULT_INITIAL_VECTOR;
}

export function saveUserVector(vector: UserPsychologicalVector): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vector));
  } catch (e) {
    console.error('Failed to save user vector to localStorage', e);
  }
}

/**
 * Calculates continuous vector scores from raw test responses (1-7 Likert scale)
 */
export function calculateVectorFromAnswers(
  answers: Record<string, number>,
  questions: Array<{ id: string; domain: string; subDimension: string; reverseKeyed?: boolean; infrequencyCheck?: boolean }>,
  currentVector: UserPsychologicalVector = DEFAULT_INITIAL_VECTOR,
  completedTestId: string = 'omni-core'
): UserPsychologicalVector {
  const newVector: UserPsychologicalVector = JSON.parse(JSON.stringify(currentVector));

  // Temporary accumulators
  const domainSums: Record<string, { total: number; count: number }> = {};
  const subSums: Record<string, { total: number; count: number }> = {};

  questions.forEach((q) => {
    if (q.infrequencyCheck) return; // Skip statistical check items from score calculations
    const rawVal = answers[q.id];
    if (rawVal === undefined) return;

    // Likert 1-7 normalized to 0-100
    const normalized = q.reverseKeyed ? ((8 - rawVal - 1) / 6) * 100 : ((rawVal - 1) / 6) * 100;

    // Track domain
    if (!domainSums[q.domain]) domainSums[q.domain] = { total: 0, count: 0 };
    domainSums[q.domain].total += normalized;
    domainSums[q.domain].count += 1;

    // Track subDimension
    const subKey = `${q.domain}_${q.subDimension}`;
    if (!subSums[subKey]) subSums[subKey] = { total: 0, count: 0 };
    subSums[subKey].total += normalized;
    subSums[subKey].count += 1;
  });

  // Update HEXACO
  const hexSubs = ['honestyHumility', 'emotionality', 'extraversion', 'agreeableness', 'conscientiousness', 'openness'] as const;
  hexSubs.forEach((sub) => {
    const key = `hexaco_${sub}`;
    if (subSums[key] && subSums[key].count > 0) {
      const avg = Math.round(subSums[key].total / subSums[key].count);
      newVector.hexaco[sub] = avg;
    }
  });

  // Update Attachment
  const attAnxiety = subSums['attachment_anxiety'] ? Math.round(subSums['attachment_anxiety'].total / subSums['attachment_anxiety'].count) : newVector.attachment.anxiety;
  const attAvoidance = subSums['attachment_avoidance'] ? Math.round(subSums['attachment_avoidance'].total / subSums['attachment_avoidance'].count) : newVector.attachment.avoidance;
  newVector.attachment.anxiety = attAnxiety;
  newVector.attachment.avoidance = attAvoidance;

  if (attAnxiety < 50 && attAvoidance < 50) {
    newVector.attachment.style = 'Secure';
    newVector.attachment.description = 'Low anxiety, low avoidance. Secure autonomous connection with ease of mutual vulnerability.';
  } else if (attAnxiety >= 50 && attAvoidance < 50) {
    newVector.attachment.style = 'Anxious-Preoccupied';
    newVector.attachment.description = 'High attunement with fear of disconnection. Deep loyalty coupled with vulnerability to reassurance-seeking.';
  } else if (attAnxiety < 50 && attAvoidance >= 50) {
    newVector.attachment.style = 'Dismissive-Avoidant';
    newVector.attachment.description = 'Fierce self-reliance and cognitive independence with a tendency to withdraw during high emotional friction.';
  } else {
    newVector.attachment.style = 'Fearful-Avoidant';
    newVector.attachment.description = 'Desire for close connection balanced by protective caution regarding boundary violations.';
  }

  // Update RIASEC
  const riasecKeys = ['realistic', 'investigative', 'artistic', 'social', 'enterprising', 'conventional'] as const;
  const riasecScoresList: { name: 'Realistic' | 'Investigative' | 'Artistic' | 'Social' | 'Enterprising' | 'Conventional'; score: number }[] = [];

  riasecKeys.forEach((key) => {
    const subKey = `riasec_${key}`;
    if (subSums[subKey] && subSums[subKey].count > 0) {
      newVector.riasec[key] = Math.round(subSums[subKey].total / subSums[subKey].count);
    }
    const properName = (key.charAt(0).toUpperCase() + key.slice(1)) as any;
    riasecScoresList.push({ name: properName, score: newVector.riasec[key] });
  });

  riasecScoresList.sort((a, b) => b.score - a.score);
  newVector.riasec.topCodes = riasecScoresList.slice(0, 3).map((r) => r.name);
  newVector.riasec.hollandCode = newVector.riasec.topCodes.map((c) => c.charAt(0)).join('');

  // Update Trait EQ
  if (domainSums['traitEq'] && domainSums['traitEq'].count > 0) {
    newVector.traitEq.score = Math.round(domainSums['traitEq'].total / domainSums['traitEq'].count);
  }

  // Determine Identity Variant: Assertive (-A) vs Turbulent (-T) based on Emotionality / Neuroticism
  const emotionality = newVector.hexaco.emotionality;
  newVector.identityVariant = emotionality > 50 ? 'T' : 'A';

  // Determine Archetype
  newVector.calculatedArchetypeId = determineArchetypeFromVector(newVector);
  
  // Track completed test IDs
  const existingSet = new Set(newVector.completedTestIds || []);
  if (completedTestId) {
    existingSet.add(completedTestId);
  }
  newVector.completedTestIds = Array.from(existingSet);
  newVector.totalAssessmentsCompleted = (currentVector.totalAssessmentsCompleted || 0) + 1;
  newVector.xpPoints = (currentVector.xpPoints || 300) + 150;
  newVector.completionDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return newVector;
}

/**
 * Classifies the 16 core typologies based on continuous Big Five / HEXACO vectors
 */
export function determineArchetypeFromVector(vector: UserPsychologicalVector): string {
  const { extraversion, openness, conscientiousness, agreeableness } = vector.hexaco;

  const isExtraverted = extraversion >= 50;
  const isOpen = openness >= 50;
  const isConscientious = conscientiousness >= 50;
  const isAgreeable = agreeableness >= 50;

  // MBTI mapping logic from continuous traits:
  // E/I from extraversion
  // N/S from openness
  // F/T from agreeableness
  // J/P from conscientiousness
  let code = '';
  code += isExtraverted ? 'E' : 'I';
  code += isOpen ? 'N' : 'S';
  code += isAgreeable ? 'F' : 'T';
  code += isConscientious ? 'J' : 'P';

  const match = ARCHETYPES.find((a) => a.code.toUpperCase() === code);
  return match ? match.id : 'intj';
}

export function getArchetypeById(id: string) {
  return ARCHETYPES.find((a) => a.id.toLowerCase() === id.toLowerCase()) || ARCHETYPES[0];
}
