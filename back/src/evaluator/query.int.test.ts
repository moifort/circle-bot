import { describe, expect, it } from 'bun:test'
import { BetDescription, BetTitle } from '../market/index.validator'
import { PolymarketPrice } from '../market/infra/polymarket.validator'
import { Amount } from '../utils/index.validator'
import { Evaluator } from './query'

describe('Evaluate', () => {
  it('should return value', async () => {
    // Given
    const title = BetTitle('Will the price of ETH be above $3000 on 2021-12-31?')
    const description = BetDescription('Will the price of ETH be above $3000 on 2021-12-31?')
    const yes = PolymarketPrice(0.6)
    const no = PolymarketPrice(0.4)
    const totalCapital = Amount(1000)

    // When
    const evaluation = await Evaluator.evaluate(title, description, yes, no, totalCapital)

    // Then
    expect(evaluation.isOk()).toBe(true)
    expect(evaluation.getOrThrow()).toContainAllKeys([
      'outcome',
      'amountToBet',
      'expectedGain',
      'probabilityToWin',
      'reason',
      'sources',
    ])
  })
})
