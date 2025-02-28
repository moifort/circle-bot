import { describe, expect, it } from 'bun:test'
import { BetOutcome } from '../../market/index.validator'
import { PolymarketPrice } from '../../market/infra/repository.validator'
import { Amount, Percentage } from '../../utils/index.validator'
import { decideFavorite, decideJump } from './index'

describe('decideFavorite', () => {
  it('should calculate bet amount using half Kelly criterion when below cap', () => {
    const decision = decideFavorite(Percentage(0.9), PolymarketPrice(0.6), Amount(200))

    expect(decision.isOk()).toBe(true)
    expect(decision.getOrThrow()).toEqual({ amountToBet: Amount(20) })
  })

  it('should cap bet at 10% of bankroll when Kelly suggests higher', () => {
    const decision = decideFavorite(Percentage(0.9), PolymarketPrice(0.6), Amount(10000))

    expect(decision.isOk()).toBe(true)
    expect(decision.getOrThrow()).toEqual({ amountToBet: Amount(1000) })
  })

  it('should not take bet when odds are unfavorable', () => {
    const decision = decideFavorite(Percentage(0.1), PolymarketPrice(0.6), Amount(1000))

    expect(decision.isError()).toBe(true)
    expect(decision.error).toBe('unprofitable-bet')
  })

  it('should not take bet when expected value is negative', () => {
    const decision = decideFavorite(Percentage(0.9), PolymarketPrice(0.95), Amount(1000))

    expect(decision.isError()).toBe(true)
    expect(decision.error).toBe('unprofitable-bet')
  })

  it('should round bet amount to nearest 10', () => {
    const decision = decideFavorite(Percentage(0.9), PolymarketPrice(0.6), Amount(123))

    expect(decision.isOk()).toBe(true)
    expect(decision.getOrThrow()).toEqual({ amountToBet: Amount(10) })
  })
})

describe('decideJump', () => {
  const now = new Date()
  const threeMinutesAgo = new Date(now.getTime() - 3 * 60 * 1000)
  const PRICE_JUMP_THRESHOLD = Percentage(0.05)
  const MAX_BANKROLL_AMOUNT_TO_BET = Percentage(0.1)

  it('should detect upward jump and bet yes', () => {
    const priceHistory = [
      { price: PolymarketPrice(0.5), date: threeMinutesAgo },
      { price: PolymarketPrice(0.53), date: now },
    ]

    const decision = decideJump(MAX_BANKROLL_AMOUNT_TO_BET, PRICE_JUMP_THRESHOLD)(priceHistory, Amount(1000))

    expect(decision.isOk()).toBe(true)
    expect(decision.getOrThrow()).toEqual({
      outcome: BetOutcome('yes'),
      amountToBet: Amount(100),
    })
  })

  it('should detect downward jump and bet no', () => {
    const priceHistory = [
      { price: PolymarketPrice(0.5), date: threeMinutesAgo },
      { price: PolymarketPrice(0.47), date: now },
    ]

    const decision = decideJump(MAX_BANKROLL_AMOUNT_TO_BET, PRICE_JUMP_THRESHOLD)(priceHistory, Amount(1000))

    expect(decision.isOk()).toBe(true)
    expect(decision.getOrThrow()).toEqual({
      outcome: BetOutcome('no'),
      amountToBet: Amount(100),
    })
  })

  it('should not bet if price change is below threshold', () => {
    const priceHistory = [
      { price: PolymarketPrice(0.5), date: threeMinutesAgo },
      { price: PolymarketPrice(0.51), date: now },
    ]

    const decision = decideJump(MAX_BANKROLL_AMOUNT_TO_BET, PRICE_JUMP_THRESHOLD)(priceHistory, Amount(1000))

    expect(decision.isError()).toBe(true)
    expect(decision.error).toBe('no-significant-jump')
  })

  it('should calculate bet amount as percentage of capital', () => {
    const priceHistory = [
      { price: PolymarketPrice(0.5), date: threeMinutesAgo },
      { price: PolymarketPrice(0.53), date: now },
    ]

    const decision = decideJump(MAX_BANKROLL_AMOUNT_TO_BET, PRICE_JUMP_THRESHOLD)(priceHistory, Amount(2000))

    expect(decision.isOk()).toBe(true)
    expect(decision.getOrThrow()).toEqual({
      outcome: BetOutcome('yes'),
      amountToBet: Amount(200), // 10% of 2000
    })
  })
})
