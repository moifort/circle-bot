import type { BetId, BetOutcome } from '../market/index.type'
import type { Amount } from '../utils/index.type'

export namespace Bettor {
  export const placeBet = (betId: BetId, selectedOutcome: BetOutcome, amountToBet: Amount) => {
    console.info(`[BETTOR] placeBet(betId=${betId}, selectedOutcome=${selectedOutcome}, amountToBet=${amountToBet})`)
  }
}
