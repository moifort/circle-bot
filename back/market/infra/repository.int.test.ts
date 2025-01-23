import { expect, test } from 'bun:test'
import { Limit } from '../../utils/index.validator.ts'
import { findLatestPoliticalBet } from './repository.ts'

test('findLatestPoliticalBet', async () => {
  // When
  const bets = await findLatestPoliticalBet(Limit(2))

  // Then
  expect(bets).toHaveLength(2)
  expect(bets[0]).toContainAllKeys(['id', 'title', 'description', 'endAt', 'updatedAt', 'yes', 'no'])
})
