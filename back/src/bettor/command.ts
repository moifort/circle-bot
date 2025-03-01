import { chain } from 'lodash'
import { Result } from 'typescript-result'
import { $firestore } from '../index'
import type { BetId, BetOutcome, BetTitle } from '../market/index.type'
import type { PolymarketPrice } from '../market/infra/repository.type'
import { Market } from '../market/query'
import type { Amount as AmountType } from '../utils/index.type'
import { Amount } from '../utils/index.validator'
import { Rules } from './business-rules'
import type { BettorId, PendingBet } from './index.type'
import { PlacedBetRepository } from './infra/repository'

export namespace BettorCommand {
  export const placeBet =
    (bettorId: BettorId) =>
    async (
      betId: BetId,
      betTitle: BetTitle,
      betEndAt: Date,
      selectedOutcome: BetOutcome,
      outcomePrice: PolymarketPrice,
      amountToBet: AmountType,
    ) => {
      if (await PlacedBetRepository.exist($firestore, bettorId)(betId))
        return Result.error('bet-already-placed' as const)
      const pendingBet: PendingBet = {
        id: betId,
        bettorId,
        status: 'pending' as const,
        title: betTitle,
        outcome: selectedOutcome,
        outcomePrice,
        amountBet: amountToBet,
        placedAt: new Date(),
        betEndAt: betEndAt,
      }
      await PlacedBetRepository.save($firestore)(pendingBet)
      return Result.ok(pendingBet)
    }

  export const updateAllPendingBet = (bettorId: BettorId) => async () => {
    const pendingBets = await PlacedBetRepository.findAll($firestore, bettorId)('pending')
    for (const { id, outcome } of pendingBets) {
      const bet = await Market.getBet(id)
      if (bet.status === 'closed') {
        const status = bet.winningOutcome === outcome ? 'won' : 'lost'
        await PlacedBetRepository.update($firestore)({ id, status })
      }
    }
  }

  export const redeemAllWonBets = (bettorId: BettorId) => async () => {
    const wonBets = await PlacedBetRepository.findAll($firestore, bettorId)('won')
    const redeemAmount = chain(wonBets)
      .sumBy(({ amountBet, outcomePrice }) => amountBet + Rules.gain(outcomePrice, amountBet))
      .value()
    await Promise.all(wonBets.map(({ id }) => PlacedBetRepository.update($firestore)({ id, status: 'redeemed' })))
    return Amount(redeemAmount)
  }
}
