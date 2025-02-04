import { chain } from 'lodash'
import type { PolymarketPrice } from '../../market/infra/repository.type'
import type { Amount as AmountType } from '../../utils/index.type'
import { Amount } from '../../utils/index.validator'

export type WinningBet = { outcomePrice: PolymarketPrice; amountBet: AmountType }

export namespace Rules {
  export const totalGain = (winningBets: WinningBet[]) => {
    const total = chain(winningBets)
      .map(({ outcomePrice, amountBet }) => gain(outcomePrice, amountBet))
      .sum()
      .floor()
      .value()
    return Amount(total)
  }

  export const gain = (outcomePrice: PolymarketPrice, amountBet: AmountType) =>
    Amount(amountBet / outcomePrice - amountBet)
}
