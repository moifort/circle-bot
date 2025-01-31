import type { Brand } from 'ts-brand'
import type { BetOutcome } from '../market/index.type'
import type { Percentage } from '../utils/index.type'

export type Why = Brand<string, 'Why'>
export type Source = Brand<string, 'Source'>

export type Evaluation = {
  winningOutcome: BetOutcome
  probabilityToWin: Percentage
  why: Why
  sources: Source[]
}
