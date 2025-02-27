import { chain } from 'lodash'
import { $firestore } from '../index'
import type { BetId } from '../market/index.type'
import type { Amount as AmountType } from '../utils/index.type'
import { Amount, Percentage } from '../utils/index.validator'
import { Rules } from './business-rules'
import type { BettorId } from './index.type'
import { PlacedBetRepository } from './infra/repository'

export namespace BettorQuery {
  export const getAllBets = (bettorId: BettorId) => async () => {
    return await PlacedBetRepository.findAll($firestore, bettorId)('no-filter')
  }

  export const getGain = (bettorId: BettorId) => async () => {
    const winningBets = await PlacedBetRepository.findAll($firestore, bettorId)('redeemed')
    return Rules.totalGain(winningBets)
  }

  export const getReturnOnInvestment = (bettorId: BettorId) => async (initialAmount: AmountType) => {
    const [gain, loss] = await Promise.all([BettorQuery.getGain(bettorId)(), BettorQuery.getLoss(bettorId)()])
    const netGain = gain - loss
    const percentageReturn = netGain / initialAmount
    return Percentage(percentageReturn)
  }

  export const getLoss = (bettorId: BettorId) => async () => {
    const lostBets = await PlacedBetRepository.findAll($firestore, bettorId)('lost')
    const lost = chain(lostBets)
      .sumBy(({ amountBet }) => amountBet)
      .value()
    return Amount(lost)
  }

  export const getCurrentPlacedBets = (id: BettorId) => async (): Promise<BetId[]> => {
    throw new Error('Not implemented')
  }
}
