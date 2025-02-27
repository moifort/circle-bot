import { describe, expect, it } from 'bun:test'
import { PolymarketPrice } from '../../market/infra/repository.validator'
import { Amount, Percentage } from '../../utils/index.validator'
import { decideFavorite } from './index'

describe('Evaluator', () => {
  it('should use half Kelly criterion when below cap', () => {
    // When
    const decision = decideFavorite(Percentage(0.9), PolymarketPrice(0.6), Amount(200))

    // Then
    expect(decision.isOk()).toBe(true)
    expect(decision.getOrThrow()).toEqual({ amountToBet: Amount(20) }) // 10% of 200 (cap is lower than half Kelly amount)
  })

  it('should cap the bet at 10% of the bankroll', () => {
    // When
    const decision = decideFavorite(Percentage(0.9), PolymarketPrice(0.6), Amount(10000))

    // Then
    expect(decision.isOk()).toBe(true)
    expect(decision.getOrThrow()).toEqual({ amountToBet: Amount(1000) }) // 10% of 10000
  })

  it('should not take the bet if odds are bad', () => {
    // When
    const decision = decideFavorite(Percentage(0.1), PolymarketPrice(0.6), Amount(1000))

    // Then
    expect(decision.isError()).toBe(true)
    expect(decision.error).toBe('unprofitable-bet')
  })

  it('should not take the bet if unprofitable bet', () => {
    // When
    const decision = decideFavorite(Percentage(0.9), PolymarketPrice(0.95), Amount(1000))

    // Then
    expect(decision.isError()).toBe(true)
    expect(decision.error).toBe('unprofitable-bet')
  })

  it('should use half Kelly criterion with very small bankroll', () => {
    // When
    const decision = decideFavorite(Percentage(0.9), PolymarketPrice(0.6), Amount(100))

    // Then
    expect(decision.isOk()).toBe(true)
    expect(decision.getOrThrow()).toEqual({ amountToBet: Amount(10) }) // Half Kelly: (0.9*0.4 - 0.1*0.6)/0.4/2 * 100 rounded to nearest 10
  })

  it('should apply 10% cap when half Kelly would exceed it', () => {
    // When
    const decision = decideFavorite(Percentage(0.9), PolymarketPrice(0.6), Amount(200))

    // Then
    expect(decision.isOk()).toBe(true)
    expect(decision.getOrThrow()).toEqual({ amountToBet: Amount(20) }) // 10% of 200 (cap is lower than half Kelly amount)
  })
})
