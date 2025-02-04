import { chain } from 'lodash'
import { $firestore } from '../index'
import { Amount } from '../utils/index.validator'
import { log } from '../utils/logger'
import { Rules } from './business-rules'
import { PlacedBetRepository } from './infra/repository'

export class BettorQuery {
  @log
  static async getAllBets() {
    return await PlacedBetRepository.findAll($firestore)('no-filter')
  }

  @log
  static async getGain() {
    const winningBets = await PlacedBetRepository.findAll($firestore)('redeemed')
    return Rules.totalGain(winningBets)
  }

  @log
  static async getEstimatedGain() {
    const redeemedBets = await PlacedBetRepository.findAll($firestore)('redeemed')
    const lostBets = await PlacedBetRepository.findAll($firestore)('lost')
    const gain = chain([...lostBets, ...redeemedBets])
      .sumBy(({ potentialGain }) => potentialGain)
      .value()
    return Amount(gain)
  }

  @log
  static async getComingEstimatedGain() {
    const pendingBets = await PlacedBetRepository.findAll($firestore)('pending')
    const gain = chain(pendingBets)
      .sumBy(({ potentialGain }) => potentialGain)
      .value()
    return Amount(gain)
  }

  @log
  static async getLoss() {
    const lostBets = await PlacedBetRepository.findAll($firestore)('lost')
    const lost = chain(lostBets)
      .sumBy(({ amountBet }) => amountBet)
      .value()
    return Amount(lost)
  }
}
