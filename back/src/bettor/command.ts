import { chain, floor } from 'lodash'
import { Result } from 'typescript-result'
import { $firestore } from '../index'
import type { BetId, BetOutcome, BetTitle } from '../market/index.type'
import type { PolymarketPrice } from '../market/infra/repository.type'
import { Market } from '../market/query'
import type { Amount as AmountType } from '../utils/index.type'
import { Amount } from '../utils/index.validator'
import { log } from '../utils/logger'
import { Rules } from './business-rules'
import { PlacedBetRepository } from './infra/repository'

export class BettorCommand {
  @log
  static async placeBet(
    betId: BetId,
    betTitle: BetTitle,
    betEndAt: Date,
    selectedOutcome: BetOutcome,
    outcomePrice: PolymarketPrice,
    amountToBet: AmountType,
    potentialGain: AmountType,
  ) {
    if (await PlacedBetRepository.exist($firestore)(betId)) return Result.error('bet-already-placed' as const)
    const placeBet = {
      id: betId,
      status: 'pending' as const,
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
    for (const { id, outcome } of pendingBets) {
      const result = await Market.getBet(id)
      if (result.isError()) continue
      if (result.value.status === 'closed') {
        const { winningOutcome } = result.value
        const status = winningOutcome === outcome ? 'won' : 'lost'
        await PlacedBetRepository.update($firestore)({ id, status })
      }
    }
  }

  @log
  static async redeemAllWonBets() {
    const wonBets = await PlacedBetRepository.findAll($firestore)('won')
    const redeemAmount = chain(wonBets)
      .sumBy(({ amountBet, outcomePrice }) => amountBet + Rules.gain(outcomePrice, amountBet))
      .value()
    await Promise.all(wonBets.map(({ id }) => PlacedBetRepository.update($firestore)({ id, status: 'redeemed' })))
    return Amount(floor(redeemAmount))
  }
}
