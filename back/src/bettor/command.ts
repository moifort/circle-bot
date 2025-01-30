import { Result } from 'typescript-result'
import { $firestore } from '../index'
import type { BetId, BetOutcome, BetTitle } from '../market/index.type'
import type { PolymarketPrice } from '../market/infra/repository.type'
import { Market } from '../market/query'
import type { Amount } from '../utils/index.type'
import { log } from '../utils/logger'
import type { PlacedBet } from './index.type'
import { PlacedBetRepository } from './infra/repository'

export class Bettor {
  @log
  static async placeBet(
    betId: BetId,
    betTitle: BetTitle,
    betEndAt: Date,
    selectedOutcome: BetOutcome,
    outcomePrice: PolymarketPrice,
    amountToBet: Amount,
    potentialGain: Amount,
  ) {
    if (await PlacedBetRepository.exist($firestore)(betId)) return Result.error('bet-already-placed' as const)
    const placeBet: PlacedBet = {
      id: betId,
      status: 'pending',
      title: betTitle,
      outcome: selectedOutcome,
      outcomePrice,
      amountBet: amountToBet,
      potentialGain: potentialGain,
      placedAt: new Date(),
      betEndAt: betEndAt,
    }
    await PlacedBetRepository.save($firestore)(placeBet)
    return Result.ok(placeBet)
  }

  @log
  static async updateAllPendingBet() {
    const pendingBets = await PlacedBetRepository.findAll($firestore)('pending')
    for (const pendingBet of pendingBets) {
      const result = await Market.bet(pendingBet.id)
      if (!result.isError() && result.value.status === 'closed') {
        const { winningOutcome } = result.value
        await PlacedBetRepository.update($firestore)({
          id: pendingBet.id,
          status: winningOutcome === pendingBet.outcome ? 'won' : 'lost',
        })
      }
    }
  }
}
