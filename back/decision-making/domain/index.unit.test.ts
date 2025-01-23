import { describe, expect, it } from 'bun:test'
import { PolymarketPrice } from '../../bet/infra/repository.validator.ts'
import { Amount, Percentage } from '../../utils/index.validator.ts'
import { decide } from './index.ts'

describe('Decision making', () => {
  const totalCapital = Amount(1000)

  it('should take the bet if odds are good', () => {
    // When
    const decision = decide(Percentage(0.9), PolymarketPrice(0.6), totalCapital)

    // Then
    expect(decision).toEqual({
      amountToBet: Amount(750),
      expectedGain: Amount(300),
    })
  })

  it('should not take the bet if odds are bad', () => {
    // When
    const decision = decide(Percentage(0.1), PolymarketPrice(0.6), totalCapital)

    // Then
    expect(decision).toEqual('no-bet-to-take')
  })
})
