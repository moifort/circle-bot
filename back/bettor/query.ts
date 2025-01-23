import type { BetId, BetOutcome } from '../market/index.type.ts'
import type { Amount } from '../utils/index.type.ts'

export namespace Bettor {
  export const placeBet = (betId: BetId, selectedOutcome: BetOutcome, amountToBet: Amount) => {}
}
