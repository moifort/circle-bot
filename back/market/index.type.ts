import type { Brand } from 'ts-brand'
import type { PolymarketPrice } from './infra/repository.type.ts'

export type BetId = Brand<string, 'BetId'>
export type BetTitle = Brand<string, 'BetTitle'>
export type BetDescription = Brand<string, 'BetDescription'>
export type BetOutcome = 'yes' | 'no'

export type Bet = {
  id: BetId
  title: BetTitle
  description: BetDescription
  endAt: Date
  updatedAt: Date
  yes: PolymarketPrice
  no: PolymarketPrice
}
