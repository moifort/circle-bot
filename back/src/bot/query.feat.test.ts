import { describe, it } from 'bun:test'
import { Bot } from './query'

describe('Bot', () => {
  it('should run', async () => {
    await Bot.run()
  })
})
