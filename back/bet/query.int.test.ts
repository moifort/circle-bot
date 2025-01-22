import { expect, it } from 'bun:test'
import { Bet } from './query.ts'

it('getLatestPoliticalBets', async () => {
  // When
  const bets = await Bet.getLatestPoliticalClosingIn7Day()

  // Then
  expect(bets).toBeArray()
})
