import { describe, expect, it } from 'bun:test'
import { $firestore } from '../../index'
import { BetTitle } from '../../market/index.validator'
import { PolymarketPrice } from '../../market/infra/repository.validator'
import { Amount } from '../../utils/index.validator'
import { PlacedBetId } from '../index.validator'
import { PlacedBetRepository } from './repository'

describe('PlacedBetRepository', () => {
  it('upsert', async () => {
    // When
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

    // Then
    expect(await PlacedBetRepository.exist($firestore)(PlacedBetId('bet-id'))).toBe(true)
  })

  it('findAll', async () => {
    // Given
    await PlacedBetRepository.save($firestore)({
      id: PlacedBetId('bet-id-01'),
      status: 'pending',
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
      status: 'lost',
      title: BetTitle('Titok will be ban before 2022'),
      outcome: 'no',
      outcomePrice: PolymarketPrice(0.8),
      amountBet: Amount(100),
      potentialGain: Amount(10),
      betEndAt: new Date(),
      placedAt: new Date(),
    })

    // When
    const bets = await PlacedBetRepository.findAll($firestore)('no-filter')

    // Then
    expect(bets).toHaveLength(2)
  })

  it('findAll filtered by status', async () => {
    // Given
    await PlacedBetRepository.save($firestore)({
      id: PlacedBetId('bet-id-01'),
      status: 'pending',
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
      status: 'lost',
      title: BetTitle('Titok will be ban before 2022'),
      outcome: 'no',
      outcomePrice: PolymarketPrice(0.8),
      amountBet: Amount(100),
      potentialGain: Amount(10),
      betEndAt: new Date(),
      placedAt: new Date(),
    })

    // When
    const bets = await PlacedBetRepository.findAll($firestore)('pending')

    // Then
    expect(bets).toHaveLength(1)
  })

  it('exist', async () => {
    // Given
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
    const isExist = await PlacedBetRepository.exist($firestore)(PlacedBetId('bet-id'))

    // Then
    expect(isExist).toBe(true)
  })
})
