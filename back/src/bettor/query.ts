import { chain } from 'lodash'
import { $firestore } from '../index'
import type { BetId } from '../market/index.type'
import type { Amount as AmountType } from '../utils/index.type'
import { Amount } from '../utils/index.validator'
import { Rules } from './business-rules'
import type { BettorId } from './index.type'
import { PlacedBetRepository } from './infra/repository'

export namespace BettorQuery {
  export const getAllBets = (bettorId: BettorId) => async () => {
    return await PlacedBetRepository.findAll($firestore, bettorId)('no-filter')
  }

  export const getTotalGain = (bettorId: BettorId) => async () => {
    const winningBets = await PlacedBetRepository.findAll($firestore, bettorId)('redeemed')
    return Rules.totalGain(winningBets)
  }

  export const getTotalLoss = (bettorId: BettorId) => async () => {
    const lostBets = await PlacedBetRepository.findAll($firestore, bettorId)('lost')
    const lost = chain(lostBets)
      .sumBy(({ amountBet }) => amountBet)
      .value()
    return Amount(lost)
  }

  export const getTotalNetGain = (bettorId: BettorId) => async () => {
    const [gain, loss] = await Promise.all([BettorQuery.getTotalGain(bettorId)(), BettorQuery.getTotalLoss(bettorId)()])
    return Rules.totalNetGain(gain, loss)
  }

  export const getBankroll = (bettorId: BettorId) => async (initialAmount: AmountType) => {
    const [gain, loss] = await Promise.all([BettorQuery.getTotalGain(bettorId)(), BettorQuery.getTotalLoss(bettorId)()])
    return Rules.bankroll(initialAmount, gain, loss)
  }

  export const getPerformance = (bettorId: BettorId) => async (initialAmount: AmountType) => {
    const [gain, loss] = await Promise.all([BettorQuery.getTotalGain(bettorId)(), BettorQuery.getTotalLoss(bettorId)()])
    return Rules.performance(initialAmount, gain, loss)
  }

  export const getCurrentPlacedBets = (id: BettorId) => async (): Promise<BetId[]> => {
    throw new Error('Not implemented')
  }
}
