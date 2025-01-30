import type { BetId, BetOutcome, BetTitle } from '../market/index.type'
import type { PolymarketPrice } from '../market/infra/repository.type'
import type { Amount } from '../utils/index.type'

export type PlacedBetId = BetId
export type PlacedBetStatus = 'pending' | 'won' | 'lost'
export type PlacedBet = {
  id: PlacedBetId
  status: PlacedBetStatus
  title: BetTitle
  outcome: BetOutcome
  outcomePrice: PolymarketPrice
  amountBet: Amount
  potentialGain: Amount
  betEndAt: Date
  placedAt: Date
}
