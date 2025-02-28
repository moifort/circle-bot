import { first, floor, last } from 'lodash'
import { Result } from 'typescript-result'
import { BetOutcome } from '../../market/index.validator'
import type { PolymarketPrice, PriceHistory } from '../../market/infra/repository.type'
import type { Amount as AmountType, Percentage as PercentageType } from '../../utils/index.type'
import { Amount } from '../../utils/index.validator'

// Kelly algorithm
export const decideFavorite = (estimatedProbability: PercentageType, price: PolymarketPrice, bankroll: AmountType) => {
  const expectedValue = estimatedProbability - price
  const numerator = estimatedProbability * (1 - price) - (1 - estimatedProbability) * price
  const denominator = 1 - price
  const fractionToBet = denominator > 0 ? numerator / denominator : 0
  const halfFractionToBet = fractionToBet / 2
  const maxBet = bankroll * 0.1
  const amountToBet = floor(Math.min(halfFractionToBet * bankroll, maxBet), -1)
  const expectedGain = floor(expectedValue * bankroll, 0)
  if (amountToBet > 0 && expectedGain > 0) return Result.ok({ amountToBet: Amount(amountToBet) })
  return Result.error('unprofitable-bet' as const)
}

export const decideJump =
  (bankrollPercentage: PercentageType, jumpThreshold: PercentageType) =>
  (recentHistory: PriceHistory[], currentCapital: AmountType) => {
    const oldestPrice = first(recentHistory)?.price ?? 0
    const latestPrice = last(recentHistory)?.price ?? 0
    const progression = (latestPrice - oldestPrice) / oldestPrice

    if (Math.abs(progression) >= jumpThreshold) {
      const outcome = progression > 0 ? BetOutcome('yes') : BetOutcome('no')
      const amountToBet = Amount(Math.floor((currentCapital * bankrollPercentage) / 10) * 10)

      if (amountToBet > 0) {
        return Result.ok({ outcome, amountToBet })
      }
    }

    return Result.error('no-significant-jump' as const)
  }
