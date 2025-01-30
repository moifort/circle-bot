import { Result } from 'typescript-result'
import type { BetDescription, BetTitle } from '../market/index.type'
import type { PolymarketPrice } from '../market/infra/polymarket.type'
import type { Amount as AmountType } from '../utils/index.type'
import { log } from '../utils/logger'
import { decide } from './business-rules'
import { GeminiApi } from './infra/gemini'

export class Evaluator {
  @log
  static async evaluate(
    title: BetTitle,
    description: BetDescription,
    yes: PolymarketPrice,
    no: PolymarketPrice,
    totalCapital: AmountType,
  ) {
    if (totalCapital < 10) return Result.error('funds-too-low' as const)
    const { winningOutcome, probabilityToWin, why, sources } = await GeminiApi.generate(title, description)
    return decide(probabilityToWin, winningOutcome === 'yes' ? yes : no, totalCapital).map((action) => ({
      outcome: winningOutcome,
      amountToBet: action.amountToBet,
      expectedGain: action.expectedGain,
      probabilityToWin,
      reason: why,
      sources,
    }))
  }
}
