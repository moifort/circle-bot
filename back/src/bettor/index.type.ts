import type { BetId, BetOutcome, BetTitle } from '../market/index.type'
import type { Amount } from '../utils/index.type'

export type PlacedBet = {
  id: BetId
  title: BetTitle
  outcome: BetOutcome
  amountBet: Amount
  potentialGain: Amount
  placedAt: Date
}
