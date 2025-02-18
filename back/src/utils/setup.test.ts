import { afterEach, beforeAll } from 'bun:test'
import { type RulesTestEnvironment, initializeTestEnvironment } from '@firebase/rules-unit-testing'
import type firebase from 'firebase/compat/app'

let testEnv: RulesTestEnvironment
export let $testFirestore: firebase.firestore.Firestore
beforeAll(async () => {
  testEnv = await initializeTestEnvironment({})
  $testFirestore = testEnv.unauthenticatedContext().firestore()
})

afterEach(async () => {
  await testEnv.clearFirestore()
})
