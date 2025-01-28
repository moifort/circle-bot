import { describe, expect, it } from 'bun:test'
import { BetOutcome } from '../market/index.validator.ts'
import { PolymarketPrice } from '../market/infra/repository.validator.ts'
import { Amount } from '../utils/index.validator.ts'
import { Evaluator } from './query.ts'

describe('Evaluate', () => {
  it('should return outcome YES and place the bet', async () => {
    // Given
    const yes = PolymarketPrice(0.6)
    const no = PolymarketPrice(0.4)
    const totalCapital = Amount(1000)

    // When
    const bet = Evaluator.evaluate(yes, no, totalCapital)

    // Then
    expect(bet).toEqual({
      outcome: BetOutcome('yes'),
      amountToBet: Amount(120),
      expectedGain: Amount(50),
    })
  })

  it('should return outcome NO and place the bet', async () => {
    // Given
    const yes = PolymarketPrice(0.22)
    const no = PolymarketPrice(0.78)
    const totalCapital = Amount(1000)

    // When
    const bet = Evaluator.evaluate(yes, no, totalCapital)

    // Then
    expect(bet).toEqual({
      outcome: BetOutcome('no'),
      amountToBet: Amount(220),
      expectedGain: Amount(50),
    })
  })
})
