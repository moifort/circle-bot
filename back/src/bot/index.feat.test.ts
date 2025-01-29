import { describe, it } from 'bun:test'
import { Bot } from './query'

describe('Bot', () => {
  it('should take the bet', () => {
    Bot.run()
  })
})
