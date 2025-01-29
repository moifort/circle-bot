import { describe, expect, it } from 'bun:test'
import { BetOutcome } from '../market/index.validator'
import { PolymarketPrice } from '../market/infra/repository.validator'
import { Amount } from '../utils/index.validator'
import { Evaluator } from './query'

describe('Evaluate', () => {
  it('should return outcome YES and place the bet', async () => {
    // Given
    const yes = PolymarketPrice(0.6)
    const no = PolymarketPrice(0.4)
    const totalCapital = Amount(1000)

    // When
    const evaluation = Evaluator.evaluate(yes, no, totalCapital)

    // Then
    expect(evaluation.isOk()).toBe(true)
    expect(evaluation.getOrThrow()).toEqual({
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
    const evaluation = Evaluator.evaluate(yes, no, totalCapital)

    // Then
    expect(evaluation.isOk()).toBe(true)
    expect(evaluation.getOrThrow()).toEqual({
      outcome: BetOutcome('no'),
      amountToBet: Amount(220),
      expectedGain: Amount(50),
    })
  })

  it('should return error if funds too low', async () => {
    // Given
    const yes = PolymarketPrice(0.22)
    const no = PolymarketPrice(0.78)
    const lowCapital = Amount(1)

    // When
    const evaluation = Evaluator.evaluate(yes, no, lowCapital)

    // Then
    expect(evaluation.isError()).toBe(true)
    expect(evaluation.error).toEqual('funds-too-low')
  })
})
