import { describe, expect, it } from 'bun:test'
import { Source, Why } from '../evaluator/index.validator'
import { $firestore } from '../index'
import { BetTitle } from '../market/index.validator'
import { PolymarketPrice } from '../market/infra/polymarket.validator'
import { Amount, Percentage } from '../utils/index.validator'
import { PlacedBetId } from './index.validator'
import { PlacedBetRepository } from './infra/repository'
import { Bettor } from './query'

describe('Bettor', () => {
  it('allPlacedBet', async () => {
    // Given
    await PlacedBetRepository.save($firestore)({
      id: PlacedBetId('bet-id'),
      status: 'pending',
      title: BetTitle('Trump will win the election'),
      reason: Why('Because the world is crazy'),
      sources: [Source('https://www.polymarket.com/market/will-trump-win-the-election')],
      probabilityToWin: Percentage(0.6),
      outcome: 'yes',
      outcomePrice: PolymarketPrice(0.8),
      amountBet: Amount(100),
      potentialGain: Amount(10),
      betEndAt: new Date(),
      placedAt: new Date(),
    })

    // When
    const bets = await Bettor.allPlacedBet()

    // Then
    expect(bets).toHaveLength(1)
  })

  it('totalGain', async () => {
    // Given
    await PlacedBetRepository.save($firestore)({
      id: PlacedBetId('bet-id-01'),
      status: 'won',
      title: BetTitle('Trump will win the election'),
      reason: Why('Because the world is crazy'),
      sources: [Source('https://www.polymarket.com/market/will-trump-win-the-election')],
      probabilityToWin: Percentage(0.6),
      outcome: 'yes',
      outcomePrice: PolymarketPrice(0.8),
      amountBet: Amount(100),
      potentialGain: Amount(10),
      betEndAt: new Date(),
      placedAt: new Date(),
    })
    await PlacedBetRepository.save($firestore)({
      id: PlacedBetId('bet-id-02'),
      status: 'won',
      title: BetTitle('Tiktok will be bankrupt in 2021'),
      reason: Why('Because the world is crazy'),
      sources: [Source('https://www.polymarket.com/market/will-trump-win-the-election')],
      probabilityToWin: Percentage(0.6),
      outcome: 'no',
      outcomePrice: PolymarketPrice(0.8),
      amountBet: Amount(100),
      potentialGain: Amount(10),
      betEndAt: new Date(),
      placedAt: new Date(),
    })

    // When
    const total = await Bettor.totalGain()

    // Then
    expect(total).toBe(Amount(50))
  })

  it('totalPotentialGain', async () => {
    // Given
    await PlacedBetRepository.save($firestore)({
      id: PlacedBetId('bet-id-01'),
      status: 'won',
      title: BetTitle('Trump will win the election'),
      outcome: 'yes',
      outcomePrice: PolymarketPrice(0.8),
      amountBet: Amount(100),
      potentialGain: Amount(10),
      reason: Why('Because the world is crazy'),
      sources: [Source('https://www.polymarket.com/market/will-trump-win-the-election')],
      probabilityToWin: Percentage(0.6),
      betEndAt: new Date(),
      placedAt: new Date(),
    })
    await PlacedBetRepository.save($firestore)({
      id: PlacedBetId('bet-id-02'),
      status: 'lost',
      title: BetTitle('Tiktok will be bankrupt in 2021'),
      outcome: 'no',
      outcomePrice: PolymarketPrice(0.8),
      amountBet: Amount(100),
      potentialGain: Amount(10),
      reason: Why('Because the world is crazy'),
      sources: [Source('https://www.polymarket.com/market/will-trump-win-the-election')],
      probabilityToWin: Percentage(0.6),
      betEndAt: new Date(),
      placedAt: new Date(),
    })
    await PlacedBetRepository.save($firestore)({
      id: PlacedBetId('bet-id-03'),
      status: 'pending',
      title: BetTitle('Binance bought Tesla in 2029'),
      outcome: 'no',
      outcomePrice: PolymarketPrice(0.6),
      amountBet: Amount(100),
      potentialGain: Amount(10),
      reason: Why('Because the world is crazy'),
      sources: [Source('https://www.polymarket.com/market/will-trump-win-the-election')],
      probabilityToWin: Percentage(0.6),
      betEndAt: new Date(),
      placedAt: new Date(),
    })

    // When
    const total = await Bettor.totalPotentialGain()

    // Then
    expect(total).toBe(Amount(20))
  })
})
