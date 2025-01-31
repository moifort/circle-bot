import type { Source, Why } from '../evaluator/index.type'
import type { BetId, BetOutcome, BetTitle } from '../market/index.type'
import type { PolymarketPrice } from '../market/infra/polymarket.type'
import type { Amount, Percentage } from '../utils/index.type'

export type PlacedBetId = BetId
export type PlacedBetStatus = 'pending' | 'won' | 'lost'
export type PlacedBet = {
  id: PlacedBetId
  status: PlacedBetStatus
  title: BetTitle
  probabilityToWin: Percentage
  reason: Why
  sources: Source[]
  outcome: BetOutcome
  outcomePrice: PolymarketPrice
  amountBet: Amount
  potentialGain: Amount
  betEndAt: Date
  placedAt: Date
}
