import { describe, expect, it } from 'bun:test'
import dayjs from 'dayjs'
import { Limit } from '../../utils/index.validator'
import type { ClosedBet } from '../index.type'
import { BetId, BetOutcome, MarketId } from '../index.validator'
import { GammaApiRepository } from './repository'

describe('GammaApiRepository', () => {
  it('findBy', async () => {
    // When
    const closedBet = await GammaApiRepository.findBy(
      BetId('oscars-best-picture-will-a-real-pain-win-best-picture-at-the-2025-oscars'),
    )

    // Then
    expect(closedBet).toEqual({
      id: BetId('oscars-best-picture-will-a-real-pain-win-best-picture-at-the-2025-oscars'),
      status: 'closed',
      winningOutcome: BetOutcome('no'),
      endAt: new Date('2025-03-02T12:00:00.000Z'),
      marketId: MarketId('88942380507873651655507052880064767806931754741348674990584484300669490055611'),
    } as ClosedBet)
  })

  it('findLatestPoliticalOpenBet', async () => {
    // When
    const bets = await GammaApiRepository.findLatestOpenBet(Limit(2), dayjs().add(10, 'day').toDate())

    // Then
    expect(bets[0]).toContainAllKeys([
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
      MarketId('44415361388259670318194555946269804118545473294573124528197499681209133814811'),
      dayjs('2023-12-31T00:00:00.000Z').subtract(4, 'minutes').toDate(),
      dayjs('2023-12-31T00:00:00.000Z').toDate(),
    )

    // Then
    expect(history.length).toBeGreaterThan(3)
    expect(history[0]).toEqual({
      date: expect.any(Date),
      price: expect.any(Number),
    })
  })
})
