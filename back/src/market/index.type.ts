import type { Brand } from 'ts-brand'
import type { PolymarketPrice } from './infra/repository.type'

export type BetId = Brand<string, 'BetId'>
export type BetTitle = Brand<string, 'BetTitle'>
export type BetDescription = Brand<string, 'BetDescription'>
export type BetOutcome = 'yes' | 'no'
export type MarketId = Brand<string, 'MarketId'>

export type ClosedBet = {
  id: BetId
  status: 'closed'
  endAt: Date
  winningOutcome: BetOutcome
}

export type OpenBet = {
  id: BetId
  status: 'open'
  title: BetTitle
  description: BetDescription
  endAt: Date
  updatedAt: Date
  yes: PolymarketPrice
  no: PolymarketPrice
}
