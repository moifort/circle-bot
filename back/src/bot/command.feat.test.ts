import { describe, it } from 'bun:test'
import { BettorId } from '../bettor/index.validator'
import { WalletId } from '../wallet/index.validator'
import { Bot } from './command'

describe('Bot', () => {
  it('should run favorite strategy', async () => {
    await Bot.runWithFavoriteStrategy(BettorId('bettor-id'), WalletId('wallet-id'))
  })

  it.skip('should run jump strategy', async () => {
    await Bot.runWithJumpStrategy(BettorId('bettor-id'), WalletId('wallet-id'))
  })
})
