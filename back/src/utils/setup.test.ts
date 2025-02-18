import { afterEach, beforeAll } from 'bun:test'
import { type RulesTestEnvironment, initializeTestEnvironment } from '@firebase/rules-unit-testing'
import type firebase from 'firebase/compat/app'

let testEnv: RulesTestEnvironment
export let $testFirestore: firebase.firestore.Firestore
beforeAll(async () => {
  if (Bun.env.npm_lifecycle_event === 'test:feat') {
    testEnv = await initializeTestEnvironment({})
    $testFirestore = testEnv.unauthenticatedContext().firestore()
  }
})

afterEach(async () => {
  if (Bun.env.npm_lifecycle_event === 'test:feat') {
    await testEnv.clearFirestore()
  }
})
