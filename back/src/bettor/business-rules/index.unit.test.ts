import { describe, expect, it } from 'bun:test'
import { PolymarketPrice } from '../../market/infra/repository.validator'
import { Amount } from '../../utils/index.validator'
import { Percentage } from '../../utils/index.validator'
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

describe('totalNetGain', () => {
  it('should return positive net gain when gain exceeds loss', () => {
    // Given
    const gain = Amount(50)
    const loss = Amount(30)

    // When
    const totalNetGain = Rules.totalNetGain(gain, loss)

    // Then
    expect(totalNetGain).toBe(Amount(20))
  })

  it('should return 0 when loss equals gain', () => {
    // Given
    const gain = Amount(50)
    const loss = Amount(50)

    // When
    const totalNetGain = Rules.totalNetGain(gain, loss)

    // Then
    expect(totalNetGain).toBe(Amount(0))
  })

  it('should return 0 when loss exceeds gain', () => {
    // Given
    const gain = Amount(30)
    const loss = Amount(50)

    // When
    const totalNetGain = Rules.totalNetGain(gain, loss)

    // Then
    expect(totalNetGain).toBe(Amount(0))
  })
})

describe('bankroll', () => {
  it('should return initial amount plus net gain', () => {
    // Given
    const initialAmount = Amount(100)
    const gain = Amount(50)
    const loss = Amount(20)

    // When
    const bankroll = Rules.bankroll(initialAmount, gain, loss)

    // Then
    expect(bankroll).toBe(Amount(130)) // 100 + 50 - 20 = 130
  })

  it('should return 0 when losses exceed total', () => {
    // Given
    const initialAmount = Amount(100)
    const gain = Amount(50)
    const loss = Amount(200)

    // When
    const bankroll = Rules.bankroll(initialAmount, gain, loss)

    // Then
    expect(bankroll).toBe(Amount(0))
  })
})

describe('performance', () => {
  it('should calculate positive performance', () => {
    // Given
    const initialAmount = Amount(100)
    const gain = Amount(50)
    const loss = Amount(20)

    // When
    const performance = Rules.performance(initialAmount, gain, loss)

    // Then
    expect(performance).toBe(Percentage(0.3)) // (50 - 20) / 100 = 0.3 = 30%
  })

  it('should calculate negative performance', () => {
    // Given
    const initialAmount = Amount(100)
    const gain = Amount(10)
    const loss = Amount(50)

    // When
    const performance = Rules.performance(initialAmount, gain, loss)

    // Then
    expect(performance).toBe(Percentage(-0.4)) // (10 - 50) / 100 = -0.4 = -40%
  })

  it('should handle zero initial amount', () => {
    // Given
    const initialAmount = Amount(0)
    const gain = Amount(50)
    const loss = Amount(20)

    // When
    const performance = Rules.performance(initialAmount, gain, loss)

    // Then
    expect(performance).toBe(Percentage(0))
  })
})
