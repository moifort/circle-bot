import { describe, expect, it, spyOn } from 'bun:test'
import { Result } from 'typescript-result'
import { $firestore } from '../index'
import { BetId, BetOutcome, BetTitle } from '../market/index.validator'
import { PolymarketPrice } from '../market/infra/repository.validator'
import { Market } from '../market/query'
import { Amount } from '../utils/index.validator'
import { Bettor } from './command'
import { PlacedBetId } from './index.validator'
import { PlacedBetRepository } from './infra/repository'

describe('Bettor', () => {
  it('save', async () => {
    // Given
    const marketGetBetSpy = spyOn(Market, 'bet')
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
    await Bettor.updateAllPendingBet()

    // Then
    expect(await PlacedBetRepository.findAll($firestore)('won')).toHaveLength(1)
  })
})
