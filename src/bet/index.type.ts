import type { Brand } from 'ts-brand'

export type BetTitle = Brand<string, 'BetTitle'>
export type Bet = {
  title: BetTitle
}
