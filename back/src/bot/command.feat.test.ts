import { describe, it } from 'bun:test'
import { Bot } from './command'

describe('Bot', () => {
  it('should run', async () => {
    await Bot.run()
  })
})
