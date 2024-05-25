import assert from 'assert';
import { describe, it, before, after } from 'mocha';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import fs from 'fs';

const projectId = 'focus-27466';

describe('Firebase Firestore Rules', () => {
  let testEnv: RulesTestEnvironment;

  before(async () => {
    testEnv = await initializeTestEnvironment({
      projectId,
      firestore: {
        rules: fs.readFileSync('../firestore.rules', 'utf8'),
      },
    });
  });

  after(async () => {
    await testEnv.cleanup();
  });

  describe('User Document Creation', () => {
    it('should allow creating a user document', async () => {
      const uid = 'testUid123';
      const userContext = testEnv.authenticatedContext(uid);

      await assertSucceeds(
        userContext.firestore().collection('users').doc(uid).set({
          email: 'test@example.com',
        }),
      );
    });
  });
});
