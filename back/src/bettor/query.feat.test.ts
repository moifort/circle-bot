import { describe, expect, it } from 'bun:test'
import { $firestore } from '../index'
import { BetTitle } from '../market/index.validator'
import { PolymarketPrice } from '../market/infra/repository.validator'
import { Amount, Percentage } from '../utils/index.validator'
import { BettorId, PlacedBetId } from './index.validator'
import { PlacedBetRepository } from './infra/repository'
import { BettorQuery } from './query'

describe('Bettor', () => {
  it('getAllBets', async () => {
    // Given
    await PlacedBetRepository.save($firestore)({
      id: PlacedBetId('bet-id'),
      bettorId: BettorId('bettor-id'),
      status: 'pending' as const,
      title: BetTitle('Trump will win the election'),
      outcome: 'yes',
      outcomePrice: PolymarketPrice(0.8),
      amountBet: Amount(100),
      betEndAt: new Date(),
      placedAt: new Date(),
    })

    // When
    const bets = await BettorQuery.getAllBets(BettorId('bettor-id'))()

    // Then
    expect(bets).toHaveLength(1)
  })

  it('getReturnOnInvestment', async () => {
    // Given
    await PlacedBetRepository.save($firestore)({
      id: PlacedBetId('bet-id-01'),
      bettorId: BettorId('bettor-id'),
      status: 'redeemed' as const,
      title: BetTitle('Trump will win the election'),
      outcome: 'yes',
      outcomePrice: PolymarketPrice(0.8),
      amountBet: Amount(100),
      betEndAt: new Date(),
      placedAt: new Date(),
    })
    await PlacedBetRepository.save($firestore)({
      id: PlacedBetId('bet-id-02'),
      bettorId: BettorId('bettor-id'),
      status: 'lost' as const,
      title: BetTitle('Tiktok will be bankrupt in 2021'),
      outcome: 'no',
      outcomePrice: PolymarketPrice(0.8),
      amountBet: Amount(10),
      betEndAt: new Date(),
      placedAt: new Date(),
    })

    // When
    const total = await BettorQuery.getReturnOnInvestment(BettorId('bettor-id'))(Amount(200))

    // Then
    expect(total).toBe(Percentage(0.075))
  })

  it('getGain', async () => {
    // Given
    await PlacedBetRepository.save($firestore)({
      id: PlacedBetId('bet-id-01'),
      bettorId: BettorId('bettor-id'),
      status: 'redeemed' as const,
      title: BetTitle('Trump will win the election'),
      outcome: 'yes',
      outcomePrice: PolymarketPrice(0.8),
      amountBet: Amount(100),
      betEndAt: new Date(),
      placedAt: new Date(),
    })
    await PlacedBetRepository.save($firestore)({
      id: PlacedBetId('bet-id-02'),
      bettorId: BettorId('bettor-id'),
      status: 'redeemed' as const,
      title: BetTitle('Tiktok will be bankrupt in 2021'),
      outcome: 'no',
      outcomePrice: PolymarketPrice(0.8),
      amountBet: Amount(100),
      betEndAt: new Date(),
      placedAt: new Date(),
    })

    // When
    const total = await BettorQuery.getGain(BettorId('bettor-id'))()

    // Then
    expect(total).toBe(Amount(50))
  })

  it('getLoss', async () => {
    // Given
    await PlacedBetRepository.save($firestore)({
      id: PlacedBetId('lost'),
      bettorId: BettorId('bettor-id'),
      status: 'lost' as const,
      title: BetTitle('Trump will win the election'),
      outcome: 'yes',
      outcomePrice: PolymarketPrice(0.8),
      amountBet: Amount(100),
      betEndAt: new Date(),
      placedAt: new Date(),
    })

    // When
    const total = await BettorQuery.getLoss(BettorId('bettor-id'))()

    // Then
    expect(total).toBe(Amount(100))
  })

  it('getNetGain', async () => {
    // Given
    await PlacedBetRepository.save($firestore)({
      id: PlacedBetId('winning-bet'),
      bettorId: BettorId('bettor-id'),
      status: 'redeemed' as const,
      title: BetTitle('Winning bet'),
      outcome: 'yes',
      outcomePrice: PolymarketPrice(0.8),
      amountBet: Amount(100),
      betEndAt: new Date(),
      placedAt: new Date(),
    })
    await PlacedBetRepository.save($firestore)({
      id: PlacedBetId('losing-bet'),
      bettorId: BettorId('bettor-id'),
      status: 'lost' as const,
      title: BetTitle('Losing bet'),
      outcome: 'no',
      outcomePrice: PolymarketPrice(0.8),
      amountBet: Amount(10),
      betEndAt: new Date(),
      placedAt: new Date(),
    })

    // When
    const netGain = await BettorQuery.getNetGain(BettorId('bettor-id'))()

    // Then
    expect(netGain).toBe(Amount(15)) // (100 * 0.25) - 10 = 15
  })

  it('getBankroll', async () => {
    // Given
    await PlacedBetRepository.save($firestore)({
      id: PlacedBetId('winning-bet'),
      bettorId: BettorId('bettor-id'),
      status: 'redeemed' as const,
      title: BetTitle('Winning bet'),
      outcome: 'yes',
      outcomePrice: PolymarketPrice(0.8),
      amountBet: Amount(100),
      betEndAt: new Date(),
      placedAt: new Date(),
    })
    await PlacedBetRepository.save($firestore)({
      id: PlacedBetId('losing-bet'),
      bettorId: BettorId('bettor-id'),
      status: 'lost' as const,
      title: BetTitle('Losing bet'),
      outcome: 'no',
      outcomePrice: PolymarketPrice(0.8),
      amountBet: Amount(10),
      betEndAt: new Date(),
      placedAt: new Date(),
    })

    // When
    const bankroll = await BettorQuery.getBankroll(BettorId('bettor-id'))(Amount(200))

    // Then
    expect(bankroll).toBe(Amount(215)) // 200 + (100 * 0.25) - 10 = 215
  })
})
