import { describe, expect, it } from 'bun:test'
import { PolymarketPrice } from '../../market/infra/repository.validator'
import { Amount, Percentage } from '../../utils/index.validator'
import { decide } from './index'

describe('Evaluator', () => {
  it('should take the bet if odds are good', () => {
    // When
    const decision = decide(Percentage(0.9), PolymarketPrice(0.6), Amount(1000))

    // Then
    expect(decision.isOk()).toBe(true)
    expect(decision.getOrThrow()).toEqual({
      amountToBet: Amount(750),
      expectedGain: Amount(300),
    })
  })

  it('should not take the bet if odds are bad', () => {
    // When
    const decision = decide(Percentage(0.1), PolymarketPrice(0.6), Amount(1000))

    // Then
    expect(decision.isError()).toBe(true)
    expect(decision.error).toBe('unprofitable-bet')
  })

  it('should not take the bet if unprofitable bet', () => {
    // When
    const decision = decide(Percentage(0.9), PolymarketPrice(0.01), Amount(10))

    // Then
    expect(decision.isError()).toBe(true)
    expect(decision.error).toBe('unprofitable-bet')
  })
})
