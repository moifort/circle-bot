import { floor } from 'lodash'
import { Result } from 'typescript-result'
import type { PolymarketPrice } from '../../market/infra/repository.type'
import type { Amount as AmountType, Percentage as PercentageType } from '../../utils/index.type'
import { Amount } from '../../utils/index.validator'

// Kelly algorithm
export const decideFavorite = (estimatedProbability: PercentageType, price: PolymarketPrice, bankroll: AmountType) => {
  const expectedValue = estimatedProbability - price
  const numerator = estimatedProbability * (1 - price) - (1 - estimatedProbability) * price
  const denominator = 1 - price
  const fractionToBet = denominator > 0 ? numerator / denominator : 0
  const amountToBet = floor(fractionToBet * bankroll, -1)
  const expectedGain = floor(expectedValue * bankroll, 0)
  if (amountToBet > 0 && expectedGain > 0) return Result.ok({ amountToBet: Amount(amountToBet) })
  return Result.error('unprofitable-bet' as const)
}
