import { Bettor } from '../bettor/query'
import { Evaluator } from '../evaluator/query'
import type { Bet } from '../market/index.type'
import { Market } from '../market/query'
import type { Amount as AmountType } from '../utils/index.type'
import { Amount } from '../utils/index.validator'
import { log } from '../utils/logger'
import { TransactionDescription } from '../wallet/index.validator'
import { Wallet } from '../wallet/query'

export class Bot {
  @log
  static async run() {
    await Wallet.deposit(Amount(1000), TransactionDescription('Initial deposit'))
    const bets = await Market.latestPoliticalBets()
    for (const bet of bets) {
      const currentCapital = await Wallet.balance()
      console.log(`[BOT] current capital ${currentCapital}`)
      const result = await Bot.placeBet(bet, currentCapital)
      if (result.isError() && ['funds-too-low', 'insufficient-funds'].includes(result.error)) {
        console.log(`[BOT] Stopped because ${result.error}: ${await Wallet.balance()}`)
        return
      }
    }
  }

  @log
  static async placeBet({ id, title, yes, no }: Bet, currentCapital: AmountType) {
    return Evaluator.evaluate(yes, no, currentCapital)
      .map(({ outcome, amountToBet, expectedGain }) => Bettor.placeBet(id, title, outcome, amountToBet, expectedGain))
      .map(({ amountBet }) => Wallet.withdraw(amountBet, TransactionDescription({ betId: id, betTitle: title })))
  }
}
