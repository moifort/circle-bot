import { describe, it } from 'bun:test'
import { Bot } from './query.ts'

// biome-ignore lint/suspicious/noFocusedTests: <explanation>
describe.only('Run', () => {
  it('should place bet', async () => {
    // // Given
    // const spy = spyOn(Bet, 'getLatestPolitical')
    // spy.mockResolvedValue([
    //   {
    //     id: BetId('519681'),
    //     title: BetTitle('Will Trump say "reserve" during Fox News Oval Office interview?'),
    //     description: BetDescription('Fox News is scheduled to air an interview with Donald Trump'),
    //     endAt: new Date('2025-01-22T12:00:00.000Z'),
    //     updatedAt: new Date('2025-01-23T20:20:16.700Z'),
    //     yes: PolymarketPrice(0.205),
    //     no: PolymarketPrice(0.795),
    //   },
    // ])

    // When
    const result = await Bot.run()

    // Then
  })
})
