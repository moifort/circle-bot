import { describe, expect, it } from 'bun:test'
import { BetId, BetOutcome } from './index.validator'
import { Market } from './query'

describe('Market', () => {
  it('latestOpenBets', async () => {
    // When
    const bets = await Market.latestOpenBets()

    // Then
    expect(bets).toBeArray()
  })

  it('bet', async () => {
    // When
    const bet = await Market.bet(BetId('will-twitter-announce-bankruptcy-in-2023'))

    // Then
    expect(bet.isOk()).toBeTruthy()
    expect(bet.value).toEqual({
      endAt: new Date('2023-12-31T00:00:00.000Z'),
      id: BetId('will-twitter-announce-bankruptcy-in-2023'),
      status: 'closed',
      winningOutcome: BetOutcome('no'),
    })
  })

  it('bets', async () => {
    // When
    const [bet] = await Market.bets([BetId('will-twitter-announce-bankruptcy-in-2023')])

    // Then
    expect(bet.isOk()).toBeTruthy()
    expect(bet.value).toEqual({
      endAt: new Date('2023-12-31T00:00:00.000Z'),
      id: BetId('will-twitter-announce-bankruptcy-in-2023'),
      status: 'closed',
      winningOutcome: BetOutcome('no'),
    })
  })
})
