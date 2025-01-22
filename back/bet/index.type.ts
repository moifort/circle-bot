import type { Brand } from 'ts-brand'
import type { Percentage } from '../utils/index.type.ts'

export type BetId = Brand<string, 'BetId'>
export type BetTitle = Brand<string, 'BetTitle'>
export type BetDescription = Brand<string, 'BetDescription'>

export type Bet = {
  id: BetId
  title: BetTitle
  description: BetDescription
  endAt: Date
  updatedAt: Date
  yes: Percentage
  no: Percentage
}
