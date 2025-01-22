import { expect, test } from 'bun:test'
import { Limit } from '../../utils/index.validator.ts'
import { findLatestPoliticalBet } from './repository.ts'

test('findLatestPoliticalBet', async () => {
  // Given

  // When
  const bets = await findLatestPoliticalBet(Limit(1))

  // Then
  expect(bets).toBeArray()
  expect(bets[0]).toContainAllKeys(['id', 'title', 'description', 'endDate'])
})
