import { Result } from 'typescript-result'
import { $firestore } from '../index'
import type { BetId, BetOutcome, BetTitle } from '../market/index.type'
import type { Amount } from '../utils/index.type'
import { log } from '../utils/logger'
import type { PlacedBet } from './index.type'
import { PlacedBetRepository } from './infra/repository'

export class Bettor {
  @log
  static async placeBet(
    betId: BetId,
    betTitle: BetTitle,
    selectedOutcome: BetOutcome,
    amountToBet: Amount,
    potentialGain: Amount,
  ) {
    const placeBet: PlacedBet = {
      id: betId,
      title: betTitle,
      outcome: selectedOutcome,
      amountBet: amountToBet,
      potentialGain: potentialGain,
      placedAt: new Date(),
    }
    await PlacedBetRepository.save($firestore)(placeBet)
    return Result.ok(placeBet)
  }

  @log
  static async allPlacedBet() {
    await PlacedBetRepository.findAll($firestore)()
  }
}
