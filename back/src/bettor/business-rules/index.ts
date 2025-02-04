import { chain } from 'lodash'
import type { PolymarketPrice } from '../../market/infra/repository.type'
import type { Amount as AmountType } from '../../utils/index.type'

export type WinningBet = { outcomePrice: PolymarketPrice; amountBet: AmountType }

export namespace Rules {
  export const totalGain = (winningBets: WinningBet[]) =>
    chain(winningBets)
      .map(({ outcomePrice, amountBet }) => gain(outcomePrice, amountBet))
      .sum()
      .floor()
      .value()

  export const gain = (outcomePrice: PolymarketPrice, amountBet: AmountType) => amountBet / outcomePrice - amountBet
}
