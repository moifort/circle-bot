import { describe, expect, it, spyOn } from 'bun:test'
import { Result } from 'typescript-result'
import { $firestore } from '../index'
import { BetId, BetOutcome, BetTitle } from '../market/index.validator'
import { PolymarketPrice } from '../market/infra/repository.validator'
import { Market } from '../market/query'
import { Amount } from '../utils/index.validator'
import { BettorCommand } from './command'
import { PlacedBetId } from './index.validator'
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
      status: 'pending',
      title: BetTitle('Trump will win the election'),
      outcome: 'yes',
      outcomePrice: PolymarketPrice(0.8),
      amountBet: Amount(100),
      potentialGain: Amount(10),
      betEndAt: new Date(),
      placedAt: new Date(),
    })

    // When
    await BettorCommand.updateAllPendingBet()

    // Then
    expect(await PlacedBetRepository.findAll($firestore)('won')).toHaveLength(1)
  })

  it('redeemAllBets', async () => {
    // Given
    await PlacedBetRepository.save($firestore)({
      id: PlacedBetId('won-bet-id-01'),
      status: 'won' as const,
      title: BetTitle('Trump will win the election'),
      outcome: 'yes',
      outcomePrice: PolymarketPrice(0.8),
      amountBet: Amount(100),
      potentialGain: Amount(10),
      betEndAt: new Date(),
      placedAt: new Date(),
    })
    await PlacedBetRepository.save($firestore)({
      id: PlacedBetId('won-bet-id-02'),
      status: 'won' as const,
      title: BetTitle('Trump will win the election'),
      outcome: 'yes',
      outcomePrice: PolymarketPrice(0.6),
      amountBet: Amount(200),
      potentialGain: Amount(10),
      betEndAt: new Date(),
      placedAt: new Date(),
    })

    // When
    const redeemAmount = await BettorCommand.redeemAllWonBets()

    // Then
    expect(redeemAmount).toBe(Amount(458))
    expect(await BettorQuery.getGain()).toBe(Amount(158))
    expect(await PlacedBetRepository.findAll($firestore)('redeemed')).toHaveLength(2)
  })
})
