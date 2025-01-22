import type { Brand } from 'ts-brand'

export type BetId = Brand<string, 'BetId'>
export type BetTitle = Brand<string, 'BetTitle'>
export type BetDescription = Brand<string, 'BetDescription'>

export type Bet = {
  id: BetId
  title: BetTitle
  description: BetDescription
  endDate: Date
}
