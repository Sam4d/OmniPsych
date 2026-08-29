import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  limit, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';
import { 
  UserProfile, 
  PublicProfile, 
  FriendRecord, 
  CompatibilityDuel, 
  UserPsychologicalVector 
} from '../types';
import { getArchetypeById } from '../utils/scoring';

/**
 * Calculates in-depth comparative psychometric compatibility between two psychological vectors
 */
export function calculateCompatibilityBetweenVectors(
  vecA: UserPsychologicalVector,
  vecB: UserPsychologicalVector
): {
  score: number;
  grade: string;
  synergies: string[];
  frictions: string[];
  communicationProtocol: string;
} {
  // 1. HEXACO Distance & Synergy
  const hA = vecA.hexaco;
  const hB = vecB.hexaco;

  // Values alignment (Honesty-Humility & Conscientiousness benefit from similarity)
  const hhDiff = Math.abs(hA.honestyHumility - hB.honestyHumility);
  const cDiff = Math.abs(hA.conscientiousness - hB.conscientiousness);
  const oDiff = Math.abs(hA.openness - hB.openness);

  // Temperament polarity (Introversion + Extraversion creates healthy balance)
  const eBalance = 100 - Math.abs(50 - ((hA.extraversion + hB.extraversion) / 2));
  
  // Agreeableness buffer
  const meanAgreeableness = (hA.agreeableness + hB.agreeableness) / 2;

  // 2. Attachment Matrix Harmony
  const styleA = vecA.attachment.style;
  const styleB = vecB.attachment.style;
  let attachmentBonus = 80;

  if (styleA === 'Secure' && styleB === 'Secure') attachmentBonus = 98;
  else if (styleA === 'Secure' || styleB === 'Secure') attachmentBonus = 88;
  else if (
    (styleA === 'Anxious-Preoccupied' && styleB === 'Dismissive-Avoidant') ||
    (styleA === 'Dismissive-Avoidant' && styleB === 'Anxious-Preoccupied')
  ) attachmentBonus = 62; // Classic Anxious-Avoidant trap
  else attachmentBonus = 72;

  // 3. Trait EQ Safety Buffer
  const meanEq = (vecA.traitEq.score + vecB.traitEq.score) / 2;

  // 4. RIASEC shared wavelength
  const sharedCodes = vecA.riasec.topCodes.filter(c => vecB.riasec.topCodes.includes(c)).length;
  const riasecBonus = sharedCodes === 3 ? 95 : sharedCodes === 2 ? 85 : sharedCodes === 1 ? 75 : 65;

  // Weighted composite score (0-100)
  const rawScore = (
    (100 - hhDiff) * 0.20 +
    (100 - cDiff) * 0.15 +
    (100 - oDiff) * 0.15 +
    eBalance * 0.10 +
    meanAgreeableness * 0.10 +
    attachmentBonus * 0.15 +
    meanEq * 0.10 +
    riasecBonus * 0.05
  );

  const score = Math.max(45, Math.min(99, Math.round(rawScore)));

  // Grade classification
  let grade = 'A-Tier Catalytic Synergy';
  if (score >= 90) grade = 'S-Tier Harmonic Resonator';
  else if (score >= 82) grade = 'A-Tier Catalytic Synergy';
  else if (score >= 74) grade = 'B-Tier Dynamic Polar Complement';
  else if (score >= 65) grade = 'C-Tier High-Growth Friction';
  else grade = 'D-Tier Volatile Polarity';

  // Dynamic Synergies
  const synergies: string[] = [];
  if (hhDiff < 20) synergies.push('Shared moral integrity & congruent authentic baseline');
  if (cDiff < 25) synergies.push('Synchronized operational rhythm & mutual reliability');
  if (oDiff < 25) synergies.push('Parallel intellectual curiosity & conceptual exploration');
  if (meanEq > 75) synergies.push('High emotional decompression capacity during high-pressure sprints');
  if (attachmentBonus >= 85) synergies.push('Safe psychological vulnerability loop without panic withdrawal');
  if (synergies.length < 3) synergies.push('Complementary blindspot compensation across decision axes');

  // Dynamic Frictions
  const frictions: string[] = [];
  if (hhDiff >= 25) frictions.push('Divergence in strategic transparency vs tactical gamesmanship');
  if (cDiff >= 30) frictions.push('Mismatched tolerances for spontaneity vs structured planning');
  if (
    (styleA === 'Anxious-Preoccupied' && styleB === 'Dismissive-Avoidant') ||
    (styleA === 'Dismissive-Avoidant' && styleB === 'Anxious-Preoccupied')
  ) frictions.push('Risk of Anxious-Avoidant escalation during conflict cooldown periods');
  if (meanAgreeableness < 50) frictions.push('Blunt directness may bypass psychological buffer during debates');
  if (frictions.length === 0) frictions.push('Risk of groupthink or avoidance of productive ideological confrontation');

  const archA = getArchetypeById(vecA.calculatedArchetypeId);
  const archB = getArchetypeById(vecB.calculatedArchetypeId);

  const communicationProtocol = `When ${archA.name} collaborates with ${archB.name}, balance analytical structure with explicit emotional check-ins. Establish clear intent before delivering constructive critiques, and allow structured asynchronous reflection time before resolving major impasses.`;

  return {
    score,
    grade,
    synergies: synergies.slice(0, 3),
    frictions: frictions.slice(0, 2),
    communicationProtocol,
  };
}

/**
 * Search public profiles by username or friend code
 */
export async function searchPublicProfiles(searchQuery: string): Promise<PublicProfile[]> {
  const cleaned = searchQuery.trim().toLowerCase();
  if (!cleaned) return [];

  const path = 'public_profiles';
  try {
    // Try exact friend code match first
    const qFriendCode = query(
      collection(db, path),
      where('friendCode', '==', searchQuery.trim().toUpperCase()),
      limit(5)
    );
    const snapCode = await getDocs(qFriendCode);
    if (!snapCode.empty) {
      return snapCode.docs.map(d => d.data() as PublicProfile);
    }

    // Search by username
    const qUsername = query(
      collection(db, path),
      where('username', '>=', cleaned),
      where('username', '<=', cleaned + '\uf8ff'),
      limit(8)
    );
    const snapUser = await getDocs(qUsername);
    return snapUser.docs.map(d => d.data() as PublicProfile);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

/**
 * Add a friend to user's friend subcollection
 */
export async function addFriend(currentUserId: string, friendProfile: PublicProfile): Promise<void> {
  const path = `users/${currentUserId}/friends/${friendProfile.uid}`;
  try {
    const friendDocRef = doc(db, 'users', currentUserId, 'friends', friendProfile.uid);
    const friendRecord: FriendRecord = {
      friendUid: friendProfile.uid,
      friendUsername: friendProfile.username,
      friendDisplayName: friendProfile.displayName,
      friendCode: friendProfile.friendCode,
      friendArchetypeId: friendProfile.primaryArchetypeId,
      friendHouse: friendProfile.house,
      addedAt: new Date().toISOString(),
    };
    await setDoc(friendDocRef, friendRecord);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Remove a friend from user's friends
 */
export async function removeFriend(currentUserId: string, friendUid: string): Promise<void> {
  const path = `users/${currentUserId}/friends/${friendUid}`;
  try {
    const friendDocRef = doc(db, 'users', currentUserId, 'friends', friendUid);
    await deleteDoc(friendDocRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Real-time listener for user's friends list
 */
export function subscribeToFriends(
  currentUserId: string,
  onUpdate: (friends: FriendRecord[]) => void
): () => void {
  const path = `users/${currentUserId}/friends`;
  const friendsCollection = collection(db, 'users', currentUserId, 'friends');

  return onSnapshot(
    friendsCollection,
    (snapshot) => {
      const friends: FriendRecord[] = [];
      snapshot.forEach(docSnap => {
        friends.push(docSnap.data() as FriendRecord);
      });
      onUpdate(friends);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

/**
 * Create a new Compatibility Challenge / Duel
 */
export async function createCompatibilityDuel(
  inviter: UserProfile,
  inviterVector: UserPsychologicalVector
): Promise<CompatibilityDuel> {
  const duelId = `duel_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  const path = `compatibility_duels/${duelId}`;

  const duel: CompatibilityDuel = {
    duelId,
    inviterUid: inviter.uid,
    inviterName: inviter.displayName,
    inviterArchetypeId: inviterVector.calculatedArchetypeId,
    inviterVector,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };

  try {
    await setDoc(doc(db, 'compatibility_duels', duelId), duel);
    return duel;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return duel;
  }
}

/**
 * Fetch a single compatibility duel
 */
export async function getCompatibilityDuel(duelId: string): Promise<CompatibilityDuel | null> {
  const path = `compatibility_duels/${duelId}`;
  try {
    const snap = await getDoc(doc(db, 'compatibility_duels', duelId));
    if (snap.exists()) {
      return snap.data() as CompatibilityDuel;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

/**
 * Real-time listener for a compatibility duel
 */
export function subscribeToDuel(
  duelId: string,
  onUpdate: (duel: CompatibilityDuel) => void
): () => void {
  const path = `compatibility_duels/${duelId}`;
  const duelDocRef = doc(db, 'compatibility_duels', duelId);

  return onSnapshot(
    duelDocRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data() as CompatibilityDuel);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

/**
 * Complete a compatibility duel when invitee submits their vector
 */
export async function completeCompatibilityDuel(
  duelId: string,
  inviteeName: string,
  inviteeUid: string,
  inviteeVector: UserPsychologicalVector
): Promise<CompatibilityDuel> {
  const path = `compatibility_duels/${duelId}`;
  try {
    const duelDocRef = doc(db, 'compatibility_duels', duelId);
    const snap = await getDoc(duelDocRef);
    if (!snap.exists()) {
      throw new Error('Compatibility duel not found');
    }
    const currentDuel = snap.data() as CompatibilityDuel;
    if (!currentDuel.inviterVector) {
      throw new Error('Inviter psychological vector not present in duel');
    }

    const comparison = calculateCompatibilityBetweenVectors(currentDuel.inviterVector, inviteeVector);
    const now = new Date().toISOString();

    const updatedPayload: Partial<CompatibilityDuel> = {
      inviteeUid,
      inviteeName,
      inviteeArchetypeId: inviteeVector.calculatedArchetypeId,
      inviteeVector,
      status: 'completed',
      compatibilityScore: comparison.score,
      chemistryGrade: comparison.grade,
      synergyHighlights: comparison.synergies,
      frictionWarnings: comparison.frictions,
      communicationProtocol: comparison.communicationProtocol,
      updatedAt: now,
    };

    await updateDoc(duelDocRef, updatedPayload);
    return { ...currentDuel, ...updatedPayload } as CompatibilityDuel;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}
