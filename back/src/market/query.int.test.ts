import { describe, expect, it } from 'bun:test'
import dayjs from 'dayjs'
import { Limit } from '../utils/index.validator'
import { BetId, BetOutcome, MarketId } from './index.validator'
import { Market } from './query'

describe('Market', () => {
  it('getLatestOpenBets', async () => {
    // When
    const bets = await Market.getLatestOpenBets([], Limit(10))

    // Then
    expect(bets).toBeArray()
  })

  it('getBet', async () => {
    // When
    const bet = await Market.getBet(BetId('will-twitter-announce-bankruptcy-in-2023'))

    // Then
    expect(bet).toEqual({
      endAt: new Date('2023-12-31T00:00:00.000Z'),
      id: BetId('will-twitter-announce-bankruptcy-in-2023'),
      status: 'closed',
      winningOutcome: BetOutcome('no'),
      marketId: MarketId('44415361388259670318194555946269804118545473294573124528197499681209133814811'),
    })
  })

  it('getAllBet', async () => {
    // When
    const [bet] = await Market.getAllBet([BetId('will-twitter-announce-bankruptcy-in-2023')])

    // Then
    expect(bet).toEqual({
      endAt: new Date('2023-12-31T00:00:00.000Z'),
      id: BetId('will-twitter-announce-bankruptcy-in-2023'),
      status: 'closed',
      winningOutcome: BetOutcome('no'),
      marketId: MarketId('44415361388259670318194555946269804118545473294573124528197499681209133814811'),
    })
  })

  it('getPriceHistory', async () => {
    // When
    const priceHistory = await Market.getPriceHistory(
      MarketId('44415361388259670318194555946269804118545473294573124528197499681209133814811'),
      dayjs('2023-12-31T00:00:00.000Z').subtract(4, 'minutes').toDate(),
      dayjs('2023-12-31T00:00:00.000Z').toDate(),
    )

    // Then
    expect(priceHistory).toBeArray()
    expect(priceHistory[0]).toEqual({
      date: expect.any(Date),
      price: expect.any(Number),
    })
  })
})
