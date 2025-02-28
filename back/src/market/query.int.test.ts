import { describe, expect, it } from 'bun:test'
import { Limit } from '../utils/index.validator'
import { BetId, BetOutcome } from './index.validator'
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
    expect(bet.isOk()).toBeTruthy()
    expect(bet.value).toEqual({
      endAt: new Date('2023-12-31T00:00:00.000Z'),
      id: BetId('will-twitter-announce-bankruptcy-in-2023'),
      status: 'closed',
      winningOutcome: BetOutcome('no'),
    })
  })

  it('getAllBet', async () => {
    // When
    const [bet] = await Market.getAllBet([BetId('will-twitter-announce-bankruptcy-in-2023')])

    // Then
    expect(bet.isOk()).toBeTruthy()
    expect(bet.value).toEqual({
      endAt: new Date('2023-12-31T00:00:00.000Z'),
      id: BetId('will-twitter-announce-bankruptcy-in-2023'),
      status: 'closed',
      winningOutcome: BetOutcome('no'),
    })
  })

  it('getOpenBetsWithPriceHistory', async () => {
    // When
    const bets = await Market.getOpenBetsWithPriceHistory(
      [BetId('will-twitter-announce-bankruptcy-in-2023')],
      Limit(15),
    )

    // Then
    expect(bets).toBeArray()
    expect(bets[0]).toContainAllKeys([
      'id',
      'status',
      'title',
      'description',
      'endAt',
      'updatedAt',
      'yes',
      'no',
      'marketId',
      'priceHistory',
    ])
    expect(bets[0].priceHistory).toBeArray()
    expect(bets[0].priceHistory[0]).toEqual({
      date: expect.any(Date),
      price: expect.any(Number),
    })
  })
})
