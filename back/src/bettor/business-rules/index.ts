import { chain, floor } from 'lodash'
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

  export const totalNetGain = (gain: AmountType, loss: AmountType) => Amount(floor(Math.max(gain - loss, 0)))

  export const bankroll = (initialAmount: AmountType, gain: AmountType, loss: AmountType) =>
    Amount(floor(Math.max(initialAmount + gain - loss, 0)))
}
