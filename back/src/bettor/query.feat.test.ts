import { describe, expect, it } from 'bun:test'
import { $firestore } from '../index'
import { BetTitle } from '../market/index.validator'
import { PolymarketPrice } from '../market/infra/repository.validator'
import { Amount } from '../utils/index.validator'
import { PlacedBetId } from './index.validator'
import { PlacedBetRepository } from './infra/repository'
import { BettorQuery } from './query'

describe('Bettor', () => {
  it('getAllBets', async () => {
    // Given
    await PlacedBetRepository.save($firestore)({
      id: PlacedBetId('bet-id'),
      status: 'pending' as const,
      title: BetTitle('Trump will win the election'),
      outcome: 'yes',
      outcomePrice: PolymarketPrice(0.8),
      amountBet: Amount(100),
      potentialGain: Amount(10),
      betEndAt: new Date(),
      placedAt: new Date(),
    })

    // When
    const bets = await BettorQuery.getAllBets()

    // Then
    expect(bets).toHaveLength(1)
  })

  it('getGain', async () => {
    // Given
    await PlacedBetRepository.save($firestore)({
      id: PlacedBetId('bet-id-01'),
      status: 'redeemed' as const,
      title: BetTitle('Trump will win the election'),
      outcome: 'yes',
      outcomePrice: PolymarketPrice(0.8),
      amountBet: Amount(100),
      potentialGain: Amount(10),
      betEndAt: new Date(),
      placedAt: new Date(),
    })
    await PlacedBetRepository.save($firestore)({
      id: PlacedBetId('bet-id-02'),
      status: 'redeemed' as const,
      title: BetTitle('Tiktok will be bankrupt in 2021'),
      outcome: 'no',
      outcomePrice: PolymarketPrice(0.8),
      amountBet: Amount(100),
      potentialGain: Amount(10),
      betEndAt: new Date(),
      placedAt: new Date(),
    })

    // When
    const total = await BettorQuery.getGain()

    // Then
    expect(total).toBe(Amount(50))
  })

  it('getEstimatedGain', async () => {
    // Given
    await PlacedBetRepository.save($firestore)({
      id: PlacedBetId('bet-id-01'),
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
      id: PlacedBetId('bet-id-02'),
      status: 'lost' as const,
      title: BetTitle('Tiktok will be bankrupt in 2021'),
      outcome: 'no',
      outcomePrice: PolymarketPrice(0.8),
      amountBet: Amount(100),
      potentialGain: Amount(10),
      betEndAt: new Date(),
      placedAt: new Date(),
    })
    await PlacedBetRepository.save($firestore)({
      id: PlacedBetId('bet-id-03'),
      status: 'pending' as const,
      title: BetTitle('Binance bought Tesla in 2029'),
      outcome: 'no',
      outcomePrice: PolymarketPrice(0.6),
      amountBet: Amount(100),
      potentialGain: Amount(10),
      betEndAt: new Date(),
      placedAt: new Date(),
    })

    // When
    const total = await BettorQuery.getEstimatedGain()

    // Then
    expect(total).toBe(Amount(10))
  })

  it('getComingEstimatedGain', async () => {
    // Given
    await PlacedBetRepository.save($firestore)({
      id: PlacedBetId('bet'),
      status: 'pending' as const,
      title: BetTitle('Trump will win the election'),
      outcome: 'yes',
      outcomePrice: PolymarketPrice(0.8),
      amountBet: Amount(100),
      potentialGain: Amount(10),
      betEndAt: new Date(),
      placedAt: new Date(),
    })

    // When
    const total = await BettorQuery.getComingEstimatedGain()

    // Then
    expect(total).toBe(Amount(10))
  })

  it('getLoss', async () => {
    // Given
    await PlacedBetRepository.save($firestore)({
      id: PlacedBetId('lost'),
      status: 'lost' as const,
      title: BetTitle('Trump will win the election'),
      outcome: 'yes',
      outcomePrice: PolymarketPrice(0.8),
      amountBet: Amount(100),
      potentialGain: Amount(10),
      betEndAt: new Date(),
      placedAt: new Date(),
    })

    // When
    const total = await BettorQuery.getLoss()

    // Then
    expect(total).toBe(Amount(100))
  })
})
