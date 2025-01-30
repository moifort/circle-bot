import { chain } from 'lodash'
import { $firestore } from '../index'
import { log } from '../utils/logger'
import { Rules } from './business-rules'
import { PlacedBetRepository } from './infra/repository'

export class Bettor {
  @log
  static async allPlacedBet() {
    return await PlacedBetRepository.findAll($firestore)()
  }

  static async totalGain() {
    const winningBets = await PlacedBetRepository.findAll($firestore)('won')
    return Rules.totalGain(winningBets)
  }

  static async totalPotentialGain() {
    const bets = await PlacedBetRepository.findAll($firestore)()
    return chain(bets)
      .filter(({ status }) => status !== 'pending')
      .sumBy(({ potentialGain }) => potentialGain)
      .value()
  }
}
