import { clamp } from 'lodash'
import { Result } from 'typescript-result'
import { BetOutcome } from '../market/index.validator'
import type { PolymarketPrice } from '../market/infra/repository.type'
import type { Amount as AmountType } from '../utils/index.type'
import { Percentage } from '../utils/index.validator'
import { log } from '../utils/logger'
import { decide } from './business-rules'

export class Evaluator {
  @log
  static evaluate(yes: PolymarketPrice, no: PolymarketPrice, totalCapital: AmountType) {
    if (totalCapital < 10) return Result.error('funds-too-low' as const)
    const yesEstimation = Percentage(clamp(yes + 0.05, 0, 1))
    const noEstimation = Percentage(clamp(no + 0.05, 0, 1))
    if (yesEstimation > noEstimation) {
      return decide(yesEstimation, yes, totalCapital).map((action) => ({
        outcome: BetOutcome('yes'),
        amountToBet: action.amountToBet,
        expectedGain: action.expectedGain,
      }))
    }
    return decide(noEstimation, no, totalCapital).map((action) => ({
      outcome: BetOutcome('no'),
      amountToBet: action.amountToBet,
      expectedGain: action.expectedGain,
    }))
  }
}
