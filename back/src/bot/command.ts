import { Result } from 'typescript-result'
import { BettorCommand } from '../bettor/command'
import type { BettorId } from '../bettor/index.type'
import { BettorQuery } from '../bettor/query'
import { Evaluator } from '../evaluator/query'
import { Market } from '../market/query'
import { Amount, Limit } from '../utils/index.validator'
import type { WalletId } from '../wallet/index.type'
import { TransactionDescription } from '../wallet/index.validator'
import { Wallet } from '../wallet/query'

export namespace Bot {
  const INITIAL_DEPOSIT = Amount(1000)

  export const runWithFavoriteStrategy = async (bettorId: BettorId, walletId: WalletId, limit = Limit(300)) => {
    const placedBetIds = await BettorQuery.getCurrentPlacedBets(bettorId)()
    const bets = await Market.getLatestOpenBets(placedBetIds, limit)
    for (const { id, title, endAt, yes, no } of bets) {
      const bankroll = await BettorQuery.getBankroll(bettorId)(INITIAL_DEPOSIT)
      const evaluation = Evaluator.evaluateWithFavoriteStrategy(yes, no, bankroll)
      if (evaluation.error === 'funds-too-low') return Result.error(evaluation.error)
      if (evaluation.error === 'unprofitable-bet') continue
      const { outcome, amountToBet } = evaluation.getOrThrow()
      const { error } = await Wallet.withdraw(walletId)(
        amountToBet,
        TransactionDescription({ betId: id, betTitle: title }),
      )
      if (error === 'insufficient-funds') return Result.error(evaluation.error)
      await BettorCommand.placeBet(bettorId)(id, title, endAt, outcome, outcome === 'yes' ? yes : no, amountToBet)
    }
    await BettorCommand.updateAllPendingBet(bettorId)()
    const redeemedAmount = await BettorCommand.redeemAllWonBets(bettorId)()
    if (redeemedAmount > 0) await Wallet.deposit(walletId)(redeemedAmount, TransactionDescription('redeem'))
    return Result.ok()
  }

  export const runWithJumpStrategy = async (bettorId: BettorId, walletId: WalletId, limit = Limit(300)) => {
    const placedBetIds = await BettorQuery.getCurrentPlacedBets(bettorId)()
    const bets = await Market.getOpenBetsWithPriceHistory(placedBetIds, limit)
    for (const { yes, no, id, title, endAt, priceHistory } of bets) {
      const bankroll = await BettorQuery.getBankroll(bettorId)(INITIAL_DEPOSIT)
      const evaluation = Evaluator.evaluateWithJumpStrategy(priceHistory, bankroll)
      if (evaluation.error === 'funds-too-low') return Result.error(evaluation.error)
      if (evaluation.error === 'unprofitable-bet') continue
      if (evaluation.error === 'insufficient-history') continue
      const { outcome, amountToBet } = evaluation.getOrThrow()
      const { error } = await Wallet.withdraw(walletId)(
        amountToBet,
        TransactionDescription({ betId: id, betTitle: title }),
      )
      if (error === 'insufficient-funds') return Result.error(evaluation.error)
      await BettorCommand.placeBet(bettorId)(id, title, endAt, outcome, outcome === 'yes' ? yes : no, amountToBet)
    }
    return Result.ok()
  }
}
