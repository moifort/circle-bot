import { describe, expect, it } from 'bun:test'
import { PolymarketPrice } from '../../market/infra/polymarket.validator'
import { Amount } from '../../utils/index.validator'
import { Rules, type WinningBet } from './index'

describe('totalGain', () => {
  it('should return total', () => {
    // Given
    const winningBets: WinningBet[] = [
      { outcomePrice: PolymarketPrice(0.8), amountBet: Amount(100) },
      { outcomePrice: PolymarketPrice(0.9), amountBet: Amount(100) },
    ]

    // When
    const total = Rules.totalGain(winningBets)

    // Then
    expect(total).toBe(Amount(36.111111111111114))
  })

  it('should return 0 if empty', () => {
    // Given

    // When
    const total = Rules.totalGain([])

    // Then
    expect(total).toBe(Amount(0))
  })
})
