import { describe, expect, it } from 'bun:test'
import { Limit } from '../../utils/index.validator'
import type { ClosedBet } from '../index.type'
import { BetId, BetOutcome, MarketId } from '../index.validator'
import { GammaApiRepository } from './repository'

describe('GammaApiRepository', () => {
  it('findBy', async () => {
    // When
    const closedBet = await GammaApiRepository.findBy(BetId('will-twitter-announce-bankruptcy-in-2023'))

    // Then
    expect(closedBet.isOk()).toBe(true)
    expect(closedBet.getOrThrow()).toEqual({
      id: BetId('will-twitter-announce-bankruptcy-in-2023'),
      status: 'closed',
      winningOutcome: BetOutcome('no'),
      endAt: new Date('2023-12-31T00:00:00.000Z'),
    } as ClosedBet)
  })

  it('findLatestPoliticalOpenBet', async () => {
    // When
    const [bet] = await GammaApiRepository.findLatestOpenBet(Limit(100))

    // Then
    expect(bet).toContainAllKeys([
      'id',
      'title',
      'description',
      'endAt',
      'updatedAt',
      'yes',
      'no',
      'status',
      'marketId',
    ])
  })

  it('findHistoryPrices', async () => {
    // When
    const history = await GammaApiRepository.findHistoryPrices(
      MarketId('53991205535397185196292444587899654425036926800380629851404142367998681248725'),
    )

    // Then
    expect(history.length).toBeGreaterThan(0)
    expect(history[0]).toEqual({
      date: expect.any(Date),
      price: expect.any(Number),
    })
  })
})
