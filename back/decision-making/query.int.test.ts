import { describe, expect, it } from 'bun:test'
import { BetOutcome } from '../bet/index.validator.ts'
import { PolymarketPrice } from '../bet/infra/repository.validator.ts'
import { Amount } from '../utils/index.validator.ts'
import { DecisionMaking } from './query.ts'

describe('Evaluate', () => {
  it('should return outcome YES and place the bet', async () => {
    // Given
    const yes = PolymarketPrice(0.6)
    const no = PolymarketPrice(0.4)
    const totalCapital = Amount(1000)

    // When
    const bet = DecisionMaking.evaluate(yes, no, totalCapital)

    // Then
    expect(bet).toEqual({
      outcome: BetOutcome('yes'),
      amountToBet: Amount(125),
      expectedGain: Amount(50),
    })
  })

  it('should return outcome NO and place the bet', async () => {
    // Given
    const yes = PolymarketPrice(0.2)
    const no = PolymarketPrice(0.8)
    const totalCapital = Amount(1000)

    // When
    const bet = DecisionMaking.evaluate(yes, no, totalCapital)

    // Then
    expect(bet).toEqual({
      outcome: BetOutcome('no'),
      amountToBet: Amount(250),
      expectedGain: Amount(50),
    })
  })
})
