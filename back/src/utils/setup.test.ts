import { afterEach, beforeAll } from 'bun:test'
import { type RulesTestEnvironment, initializeTestEnvironment } from '@firebase/rules-unit-testing'

if (Bun.env.npm_lifecycle_event === 'test:feat') {
  let testEnv: RulesTestEnvironment

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({})
  })

  afterEach(async () => {
    await testEnv.clearFirestore()
  })
}
