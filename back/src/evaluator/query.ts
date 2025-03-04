import dayjs from 'dayjs'
import { chain, clamp } from 'lodash'
import { Result } from 'typescript-result'
import { BetOutcome } from '../market/index.validator'
import type { PolymarketPrice, PriceHistory } from '../market/infra/repository.type'
import type { Amount as AmountType } from '../utils/index.type'
import { Amount, Minute, Percentage, PercentagePoint } from '../utils/index.validator'
import { decideFavorite, decideJump } from './business-rules'

export namespace Evaluator {
  const MINIMUM_BANKROLL = Amount(10)
  const PRICE_JUMP_THRESHOLD_POINTS = PercentagePoint(0.05) // 5 points jump (e.g., from 0.50 to 0.55)
  const MAX_BANKROLL_AMOUNT_TO_BET = Percentage(0.1)
  const HISTORY_WINDOW = Minute(4)

  export const evaluateWithFavoriteStrategy = (yes: PolymarketPrice, no: PolymarketPrice, bankroll: AmountType) => {
    if (bankroll < MINIMUM_BANKROLL) return Result.error('funds-too-low' as const)
    const yesEstimation = Percentage(clamp(yes + 0.05, 0, 1))
    const noEstimation = Percentage(clamp(no + 0.05, 0, 1))
    if (yesEstimation > noEstimation) {
      return decideFavorite(yesEstimation, yes, bankroll).map((action) => ({
        outcome: BetOutcome('yes'),
        amountToBet: action.amountToBet,
      }))
    }
    return decideFavorite(noEstimation, no, bankroll).map((action) => ({
      outcome: BetOutcome('no'),
      amountToBet: action.amountToBet,
    }))
  }

  export const evaluateWithJumpStrategy = (last5MinutesPriceHistory: PriceHistory[], bankroll: AmountType) => {
    if (bankroll < MINIMUM_BANKROLL) return Result.error('funds-too-low' as const)
    const cutoffTime = dayjs().subtract(HISTORY_WINDOW, 'minutes').toDate()
    const recentHistory = chain(last5MinutesPriceHistory)
      .filter(({ date }) => dayjs(date).isAfter(cutoffTime))
      .sortBy(({ date }) => date)
      .value()
    if (recentHistory.length < 2) return Result.error('insufficient-history' as const)
    return decideJump(MAX_BANKROLL_AMOUNT_TO_BET, PRICE_JUMP_THRESHOLD_POINTS)(recentHistory, bankroll)
  }
}
