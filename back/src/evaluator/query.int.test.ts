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
    const evaluation = Evaluator.evaluateWithFavoriteStrategy(yes, no, totalCapital)

    // Then
    expect(evaluation.isOk()).toBe(true)
    expect(evaluation.getOrThrow()).toEqual({
      outcome: BetOutcome('yes'),
      amountToBet: Amount(60),
    })
  })

  it('should return outcome NO and place the bet', async () => {
    // Given
    const yes = PolymarketPrice(0.22)
    const no = PolymarketPrice(0.78)
    const totalCapital = Amount(1000)

    // When
    const evaluation = Evaluator.evaluateWithFavoriteStrategy(yes, no, totalCapital)

    // Then
    expect(evaluation.isOk()).toBe(true)
    expect(evaluation.getOrThrow()).toEqual({
      outcome: BetOutcome('no'),
      amountToBet: Amount(100),
    })
  })

  it('should return error if funds too low', async () => {
    // Given
    const yes = PolymarketPrice(0.22)
    const no = PolymarketPrice(0.78)
    const lowCapital = Amount(1)

    // When
    const evaluation = Evaluator.evaluateWithFavoriteStrategy(yes, no, lowCapital)

    // Then
    expect(evaluation.isError()).toBe(true)
    expect(evaluation.error).toEqual('funds-too-low')
  })
})

describe('Evaluator', () => {
  describe('evaluateWithJumpStrategy', () => {
    it('should detect upward jump and bet on yes', () => {
      // Given
      const now = new Date()
      const threeMinutesAgo = new Date(now.getTime() - 3 * 60 * 1000)
      const priceHistory = [
        { price: PolymarketPrice(0.5), date: threeMinutesAgo },
        { price: PolymarketPrice(0.55), date: now },
      ]

      // When
      const decision = Evaluator.evaluateWithJumpStrategy(priceHistory, Amount(1000))

      // Then
      expect(decision.isOk()).toBe(true)
      expect(decision.getOrThrow()).toEqual({
        outcome: 'yes',
        amountToBet: Amount(100), // 10% of 1000
      })
    })

    it('should detect downward jump and bet on no', () => {
      // Given
      const now = new Date()
      const threeMinutesAgo = new Date(now.getTime() - 3 * 60 * 1000)
      const priceHistory = [
        { price: PolymarketPrice(0.5), date: threeMinutesAgo },
        { price: PolymarketPrice(0.44), date: now },
      ]

      // When
      const decision = Evaluator.evaluateWithJumpStrategy(priceHistory, Amount(1000))

      // Then
      expect(decision.isOk()).toBe(true)
      expect(decision.getOrThrow()).toEqual({
        outcome: 'no',
        amountToBet: Amount(100), // 10% of 1000
      })
    })

    it('should not bet if funds too low', () => {
      // Given
      const now = new Date()
      const threeMinutesAgo = new Date(now.getTime() - 3 * 60 * 1000)
      const priceHistory = [
        { price: PolymarketPrice(0.5), date: threeMinutesAgo },
        { price: PolymarketPrice(0.53), date: now },
      ]

      // When
      const decision = Evaluator.evaluateWithJumpStrategy(priceHistory, Amount(5))

      // Then
      expect(decision.isError()).toBe(true)
      expect(decision.error).toBe('funds-too-low')
    })
  })
})
