import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest';
import {
  initializeTestEnvironment,
  RulesTestEnvironment,
  assertFails,
  assertSucceeds,
} from '@firebase/rules-unit-testing';
import * as fs from 'fs';
import * as path from 'path';

let testEnv: RulesTestEnvironment;

describe('Firestore Security Rules - Compatibility Duels & Privacy Gates', () => {
  beforeAll(async () => {
    const rulesPath = path.resolve(__dirname, 'firestore.rules');
    const rules = fs.readFileSync(rulesPath, 'utf8');

    testEnv = await initializeTestEnvironment({
      projectId: 'omnipsyche-security-test',
      firestore: {
        rules,
        host: '127.0.0.1',
        port: 8080,
      },
    });
  });

  afterAll(async () => {
    if (testEnv) {
      await testEnv.cleanup();
    }
  });

  beforeEach(async () => {
    if (testEnv) {
      await testEnv.clearFirestore();
    }
  });

  it('P0: Unauthenticated users CANNOT read completed duels', async () => {
    if (!testEnv) return;

    // Seed completed duel as admin
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection('compatibility_duels').doc('duel_completed_123').set({
        duelId: 'duel_completed_123',
        inviterUid: 'user_alice',
        inviterName: 'Alice',
        inviterArchetypeId: 'intj',
        inviteeUid: 'user_bob',
        inviteeName: 'Bob',
        inviteeArchetypeId: 'enfp',
        status: 'completed',
        compatibilityScore: 92,
        chemistryGrade: 'S-Tier Harmonic Resonator',
      });
    });

    const unauthedDb = testEnv.unauthenticatedContext().firestore();
    const duelDocRef = unauthedDb.collection('compatibility_duels').doc('duel_completed_123');

    await assertFails(duelDocRef.get());
  });

  it('P0: Signed-in user who is NOT a participant CANNOT read completed duels', async () => {
    if (!testEnv) return;

    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection('compatibility_duels').doc('duel_completed_123').set({
        duelId: 'duel_completed_123',
        inviterUid: 'user_alice',
        inviterName: 'Alice',
        inviterArchetypeId: 'intj',
        inviteeUid: 'user_bob',
        inviteeName: 'Bob',
        inviteeArchetypeId: 'enfp',
        status: 'completed',
        compatibilityScore: 92,
      });
    });

    const eveDb = testEnv.authenticatedContext('user_eve_stranger').firestore();
    const duelDocRef = eveDb.collection('compatibility_duels').doc('duel_completed_123');

    await assertFails(duelDocRef.get());
  });

  it('P0: Pending duel CAN be read by invite link visitor (for joining challenge)', async () => {
    if (!testEnv) return;

    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection('compatibility_duels').doc('duel_pending_456').set({
        duelId: 'duel_pending_456',
        inviterUid: 'user_alice',
        inviterName: 'Alice',
        inviterArchetypeId: 'intj',
        status: 'pending',
      });
    });

    const unauthedDb = testEnv.unauthenticatedContext().firestore();
    const duelDocRef = unauthedDb.collection('compatibility_duels').doc('duel_pending_456');

    await assertSucceeds(duelDocRef.get());
  });

  it('P0: Inviter and Invitee participants CAN read completed duels', async () => {
    if (!testEnv) return;

    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection('compatibility_duels').doc('duel_completed_123').set({
        duelId: 'duel_completed_123',
        inviterUid: 'user_alice',
        inviterName: 'Alice',
        inviterArchetypeId: 'intj',
        inviteeUid: 'user_bob',
        inviteeName: 'Bob',
        inviteeArchetypeId: 'enfp',
        status: 'completed',
        compatibilityScore: 92,
      });
    });

    const aliceDb = testEnv.authenticatedContext('user_alice').firestore();
    const bobDb = testEnv.authenticatedContext('user_bob').firestore();

    await assertSucceeds(aliceDb.collection('compatibility_duels').doc('duel_completed_123').get());
    await assertSucceeds(bobDb.collection('compatibility_duels').doc('duel_completed_123').get());
  });

  it('P1: Public profiles list query enforces limit <= 10', async () => {
    if (!testEnv) return;

    const userDb = testEnv.authenticatedContext('user_charlie').firestore();
    
    // Query with limit 15 should fail
    const overLimitQuery = userDb.collection('public_profiles').limit(15);
    await assertFails(overLimitQuery.get());

    // Query with limit 5 should succeed
    const validLimitQuery = userDb.collection('public_profiles').limit(5);
    await assertSucceeds(validLimitQuery.get());
  });
});
