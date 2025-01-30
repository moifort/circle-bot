import { Bettor } from '../bettor/command'
import { Evaluator } from '../evaluator/query'
import type { OpenBet } from '../market/index.type'
import { Market } from '../market/query'
import type { Amount as AmountType } from '../utils/index.type'
import { log } from '../utils/logger'
import { TransactionDescription } from '../wallet/index.validator'
import { Wallet } from '../wallet/query'

export class Bot {
  @log
  static async run() {
    console.log('[BOT] Start placing bets')
    const bets = await Market.latestOpenBets()
    for (const bet of bets) {
      const currentCapital = await Wallet.balance()
      console.log(`[BOT] current capital ${currentCapital}`)
      const result = await Bot.placeBet(bet, currentCapital)
      if (result.isError() && ['funds-too-low', 'insufficient-funds'].includes(result.error)) {
        console.log(`[BOT] Stopped because ${result.error}: ${await Wallet.balance()}`)
        return
      }
      if (result.isError()) console.error(`[BOT] ${result.error}, continuing...`)
    }
    console.log(`[BOT] Placing bet completed! Analyzing ${bets.length} bets, current balance ${await Wallet.balance()}`)
    console.log('[BOT] Start updating bets')
    await Bettor.updateAllPendingBet()
    console.log('[BOT] Update placed bet status completed!')
  }

  static async placeBet({ id, title, yes, no, endAt }: OpenBet, currentCapital: AmountType) {
    return Evaluator.evaluate(yes, no, currentCapital)
      .map((evaluation) =>
        Wallet.withdraw(evaluation.amountToBet, TransactionDescription({ betId: id, betTitle: title })).then(
          () => evaluation,
        ),
      )
      .map(({ outcome, amountToBet, expectedGain }) =>
        Bettor.placeBet(id, title, endAt, outcome, outcome === 'yes' ? yes : no, amountToBet, expectedGain),
      )
  }
}
