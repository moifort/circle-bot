import type { BetId, BetOutcome, BetTitle } from '../market/index.type'
import type { PolymarketPrice } from '../market/infra/repository.type'
import type { Amount } from '../utils/index.type'

export type PlacedBetId = BetId
export type PlacedBetStatus = 'pending' | 'won' | 'lost' | 'redeemed'

export type RedeemedBet = {
  id: PlacedBetId
  status: 'redeemed'
  title: BetTitle
  outcome: BetOutcome
  outcomePrice: PolymarketPrice
  amountBet: Amount
  potentialGain: Amount
  betEndAt: Date
  placedAt: Date
}

export type WonBet = {
  id: PlacedBetId
  status: 'won'
  title: BetTitle
  outcome: BetOutcome
  outcomePrice: PolymarketPrice
  amountBet: Amount
  potentialGain: Amount
  betEndAt: Date
  placedAt: Date
}

export type LostBet = {
  id: PlacedBetId
  status: 'lost'
  title: BetTitle
  outcome: BetOutcome
  outcomePrice: PolymarketPrice
  amountBet: Amount
  potentialGain: Amount
  betEndAt: Date
  placedAt: Date
}

export type PendingBet = {
  id: PlacedBetId
  status: 'pending'
  title: BetTitle
  outcome: BetOutcome
  outcomePrice: PolymarketPrice
  amountBet: Amount
  potentialGain: Amount
  betEndAt: Date
  placedAt: Date
}

export type PlacedBet = WonBet | LostBet | PendingBet | RedeemedBet

export type PlacedBets<STATUS extends PlacedBetStatus | 'no-filter'> = STATUS extends 'pending'
  ? PendingBet[]
  : STATUS extends 'won'
    ? WonBet[]
    : STATUS extends 'lost'
      ? LostBet[]
      : STATUS extends 'redeemed'
        ? RedeemedBet[]
        : PlacedBet[]
