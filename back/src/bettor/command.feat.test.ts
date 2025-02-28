import { describe, expect, it, spyOn } from 'bun:test'
import { Result } from 'typescript-result'
import { $firestore } from '../index'
import { BetId, BetOutcome, BetTitle } from '../market/index.validator'
import { PolymarketPrice } from '../market/infra/repository.validator'
import { Market } from '../market/query'
import { Amount } from '../utils/index.validator'
import { BettorCommand } from './command'
import { BettorId, PlacedBetId } from './index.validator'
import { PlacedBetRepository } from './infra/repository'
import { BettorQuery } from './query'

describe('Bettor', () => {
  it('updateAllPendingBet', async () => {
    // Given
    const marketGetBetSpy = spyOn(Market, 'getBet')
    marketGetBetSpy.mockImplementation(() =>
      Promise.resolve(
        Result.ok({
          id: BetId('bet-id'),
          status: 'closed',
          endAt: new Date(),
          winningOutcome: BetOutcome('yes'),
        }),
      ),
    )
    await PlacedBetRepository.save($firestore)({
      id: PlacedBetId('bet-id'),
      bettorId: BettorId('bettor-id'),
      status: 'pending',
      title: BetTitle('Trump will win the election'),
      outcome: 'yes',
      outcomePrice: PolymarketPrice(0.8),
      amountBet: Amount(100),
      betEndAt: new Date(),
      placedAt: new Date(),
    })

    // When
    await BettorCommand.updateAllPendingBet(BettorId('bettor-id'))()

    // Then
    expect(await PlacedBetRepository.findAll($firestore, BettorId('bettor-id'))('won')).toHaveLength(1)
  })

  it('redeemAllBets', async () => {
    // Given
    await PlacedBetRepository.save($firestore)({
      id: PlacedBetId('won-bet-id-01'),
      bettorId: BettorId('bettor-id'),
      status: 'won' as const,
      title: BetTitle('Trump will win the election'),
      outcome: 'yes',
      outcomePrice: PolymarketPrice(0.8),
      amountBet: Amount(100),
      betEndAt: new Date(),
      placedAt: new Date(),
    })
    await PlacedBetRepository.save($firestore)({
      id: PlacedBetId('won-bet-id-02'),
      bettorId: BettorId('bettor-id'),
      status: 'won' as const,
      title: BetTitle('Trump will win the election'),
      outcome: 'yes',
      outcomePrice: PolymarketPrice(0.6),
      amountBet: Amount(200),
      betEndAt: new Date(),
      placedAt: new Date(),
    })

    // When
    const redeemAmount = await BettorCommand.redeemAllWonBets(BettorId('bettor-id'))()

    // Then
    expect(redeemAmount).toBe(Amount(458))
    expect(await BettorQuery.getTotalGain(BettorId('bettor-id'))()).toBe(Amount(158.33333333333337))
    expect(await PlacedBetRepository.findAll($firestore, BettorId('bettor-id'))('redeemed')).toHaveLength(2)
  })
})
