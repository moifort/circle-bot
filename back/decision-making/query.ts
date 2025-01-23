import { BetOutcome } from '../bet/index.validator.ts'
import type { PolymarketPrice } from '../bet/infra/repository.type.ts'
import type { Amount as AmountType } from '../utils/index.type.ts'
import { Percentage } from '../utils/index.validator.ts'
import { decide } from './domain'

export namespace DecisionMaking {
  export const evaluate = (yes: PolymarketPrice, no: PolymarketPrice, totalCapital: AmountType) => {
    const yesEstimation = Percentage(yes + 0.05)
    const noEstimation = Percentage(no + 0.05)

    if (yesEstimation > noEstimation) {
      const betToTake = decide(yesEstimation, yes, totalCapital)
      if (betToTake === 'no-bet-to-take') return 'no-bet-to-take'
      return {
        outcome: BetOutcome('yes'),
        amountToBet: betToTake.amountToBet,
        expectedGain: betToTake.expectedGain,
      }
    }
    const betToTake = decide(noEstimation, no, totalCapital)
    if (betToTake === 'no-bet-to-take') return 'no-bet-to-take'
    return {
      outcome: BetOutcome('no'),
      amountToBet: betToTake.amountToBet,
      expectedGain: betToTake.expectedGain,
    }
  }
}
