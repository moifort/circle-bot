import { test } from 'bun:test'
import { find5LatestPoliticalBet } from './repository.ts'

test('find5LatestPoliticalBet', async () => {
  // Given

  // When
  const bets = await find5LatestPoliticalBet()

  // Then
  // expect(bets).toMatch('')
  console.log(bets)
})
