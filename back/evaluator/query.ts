import { clamp } from 'lodash'
import { BetOutcome } from '../market/index.validator.ts'
import type { PolymarketPrice } from '../market/infra/repository.type.ts'
import type { Amount as AmountType } from '../utils/index.type.ts'
import { Percentage } from '../utils/index.validator.ts'
import { decide } from './domain'

export namespace Evaluator {
  export const evaluate = (yes: PolymarketPrice, no: PolymarketPrice, totalCapital: AmountType) => {
    if (totalCapital < 15) return 'do-nothing'
    const yesEstimation = Percentage(clamp(yes + 0.05, 0, 1))
    const noEstimation = Percentage(clamp(no + 0.05, 0, 1))

    if (yesEstimation > noEstimation) {
      const action = decide(yesEstimation, yes, totalCapital)
      if (action === 'do-nothing') return 'do-nothing'
      return {
        outcome: BetOutcome('yes'),
        amountToBet: action.amountToBet,
        expectedGain: action.expectedGain,
      }
    }
    const action = decide(noEstimation, no, totalCapital)
    if (action === 'do-nothing') return 'do-nothing'
    return {
      outcome: BetOutcome('no'),
      amountToBet: action.amountToBet,
      expectedGain: action.expectedGain,
    }
  }
}
