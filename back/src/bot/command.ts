import { BettorCommand } from '../bettor/command'
import type { BettorId } from '../bettor/index.type'
import { BettorQuery } from '../bettor/query'
import { Evaluator } from '../evaluator/query'
import { Market } from '../market/query'
import type { WalletId } from '../wallet/index.type'
import { TransactionDescription } from '../wallet/index.validator'
import { Wallet } from '../wallet/query'

export namespace Bot {
  export const runWithFavoriteStrategy = async (bettorId: BettorId, walletId: WalletId) => {
    const bets = await Market.getLatestOpenBets()
    for (const { id, title, endAt, yes, no } of bets) {
      const currentCapital = await Wallet.balance(walletId)()
      const result = await Evaluator.evaluateWithFavoriteStrategy(yes, no, currentCapital)
        .map(({ outcome, amountToBet }) =>
          BettorCommand.placeBet(bettorId)(id, title, endAt, outcome, outcome === 'yes' ? yes : no, amountToBet),
        )
        .map(({ amountBet }) =>
          Wallet.withdraw(walletId)(amountBet, TransactionDescription({ betId: id, betTitle: title })),
        )
      if (result.isError() && ['funds-too-low', 'insufficient-funds'].includes(result.error)) {
        console.log(`[BOT] Stopped because ${result.error}: ${currentCapital}`)
        return
      }
      if (result.isError()) console.error(`[BOT] ${result.error}, continuing...`)
    }
    await BettorCommand.updateAllPendingBet(bettorId)()
    const redeemedAmount = await BettorCommand.redeemAllWonBets(bettorId)()
    if (redeemedAmount > 0) await Wallet.deposit(walletId)(redeemedAmount, TransactionDescription('redeem'))
  }

  export const runWithJumpStrategy = async (bettorId: BettorId, walletId: WalletId) => {
    console.log('[BOT] Start placing bets')
    const placedBetIds = await BettorQuery.getCurrentPlacedBets(bettorId)()
    const bets = await Market.getOpenBetsWithPriceHistory(placedBetIds)
    for (const { yes, no, id, title, endAt } of bets) {
      const currentCapital = await Wallet.balance(walletId)()
      console.log(`[BOT] current capital ${currentCapital}`)
      const result = await Evaluator.evaluateWithJumpStrategy([], currentCapital)
        .map(({ outcome, amountToBet }) =>
          BettorCommand.placeBet(bettorId)(id, title, endAt, outcome, outcome === 'yes' ? yes : no, amountToBet),
        )
        .map(({ amountBet }) =>
          Wallet.withdraw(walletId)(amountBet, TransactionDescription({ betId: id, betTitle: title })),
        )
      if (result.isError() && ['funds-too-low', 'insufficient-funds'].includes(result.error)) {
        console.log(`[BOT] Stopped because ${result.error}: ${currentCapital}`)
        return
      }
      if (result.isError()) console.error(`[BOT] ${result.error}, continuing...`)
    }
  }
}
