import { clamp } from 'lodash'
import { Result } from 'typescript-result'
import type { BetOutcome as BetOutcomeType } from '../market/index.type'
import { BetOutcome } from '../market/index.validator'
import type { PolymarketPrice, PriceHistory } from '../market/infra/repository.type'
import type { Amount as AmountType } from '../utils/index.type'
import { Percentage } from '../utils/index.validator'
import { decideFavorite } from './business-rules'

export namespace Evaluator {
  export const evaluateWithFavoriteStrategy = (yes: PolymarketPrice, no: PolymarketPrice, totalCapital: AmountType) => {
    if (totalCapital < 10) return Result.error('funds-too-low' as const)
    const yesEstimation = Percentage(clamp(yes + 0.05, 0, 1))
    const noEstimation = Percentage(clamp(no + 0.05, 0, 1))
    if (yesEstimation > noEstimation) {
      return decideFavorite(yesEstimation, yes, totalCapital).map((action) => ({
        outcome: BetOutcome('yes'),
        amountToBet: action.amountToBet,
      }))
    }
    return decideFavorite(noEstimation, no, totalCapital).map((action) => ({
      outcome: BetOutcome('no'),
      amountToBet: action.amountToBet,
    }))
  }

  export const evaluateWithJumpStrategy = (
    last5MinutesPriceHistory: PriceHistory[],
    yes: PolymarketPrice,
    no: PolymarketPrice,
    currentCapital: AmountType,
  ): Result<{ outcome: BetOutcomeType; amountToBet: AmountType }, string> => {
    throw new Error('Not implemented')
  }
}
