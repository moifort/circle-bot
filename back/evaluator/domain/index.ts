import { floor } from 'lodash'
import type { PolymarketPrice } from '../../market/infra/repository.type.ts'
import type { Amount as AmountType, Percentage as PercentageType } from '../../utils/index.type.ts'
import { Amount } from '../../utils/index.validator.ts'

export const decide = (estimatedProbability: PercentageType, price: PolymarketPrice, totalCapital: AmountType) => {
  const expectedValue = estimatedProbability - price

  // Kelly algorithm
  const numerator = estimatedProbability * (1 - price) - (1 - estimatedProbability) * price
  const denominator = 1 - price
  const fractionToBet = denominator > 0 ? numerator / denominator : 0
  const amountToBet = floor(fractionToBet * totalCapital, -1)
  const expectedGain = floor(expectedValue * totalCapital, 0)
  if (amountToBet > 0 && expectedGain > 0) {
    return {
      amountToBet: Amount(amountToBet),
      expectedGain: Amount(expectedGain),
    }
  }
  return 'do-nothing'
}
