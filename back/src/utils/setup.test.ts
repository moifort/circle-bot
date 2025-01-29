import { afterEach } from 'bun:test'

afterEach(async () => {
  if (Bun.env.npm_lifecycle_event === 'test:feat') {
    console.log('Cleaning up Firestore emulator')
    await fetch(
      `http://${process.env.FIRESTORE_EMULATOR_HOST}/emulator/v1/projects/${process.env.GCLOUD_PROJECT}/databases/(default)/documents`,
      { method: 'DELETE' },
    )
  }
})
