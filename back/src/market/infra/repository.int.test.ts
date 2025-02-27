import { describe, expect, it } from 'bun:test'
import { Limit } from '../../utils/index.validator'
import type { ClosedBet } from '../index.type'
import { BetId, BetOutcome } from '../index.validator'
import { GammaApiRepository } from './repository'

describe('GammaApiRepository', () => {
  it.skip('findBy', async () => {
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

  it.skip('findLatestPoliticalOpenBet', async () => {
    // When
    const [bet] = await GammaApiRepository.findLatestOpenBet(Limit(100))

    // Then
    expect(bet).toContainAllKeys(['id', 'title', 'description', 'endAt', 'updatedAt', 'yes', 'no', 'status'])
  })
})
