import { chain } from 'lodash'
import { $firestore } from '../index'
import { log } from '../utils/logger'
import { Rules } from './business-rules'
import { PlacedBetRepository } from './infra/repository'

export class BettorQuery {
  @log
  static async getAllPlacedBet() {
    return await PlacedBetRepository.findAll($firestore)('no-filter')
  }

  @log
  static async getTotalGain() {
    const winningBets = await PlacedBetRepository.findAll($firestore)('redeemed')
    return Rules.totalGain(winningBets)
  }

  @log
  static async getTotalEstimatedGain() {
    const redeemedBets = await PlacedBetRepository.findAll($firestore)('redeemed')
    const lostBets = await PlacedBetRepository.findAll($firestore)('lost')
    return chain([...lostBets, ...redeemedBets])
      .sumBy(({ potentialGain }) => potentialGain)
      .value()
  }

  @log
  static async getTotalFuturEstimatedGain() {
    const pendingBets = await PlacedBetRepository.findAll($firestore)('pending')
    return chain(pendingBets)
      .sumBy(({ potentialGain }) => potentialGain)
      .value()
  }
}
