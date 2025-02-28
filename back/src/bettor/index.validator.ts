import { make } from 'ts-brand'
import { z } from 'zod'
import { BetId } from '../market/index.validator'
import type { PlacedBetStatus as PlacedBetStatusType } from './index.type'
import type { BettorId as BettorIdType } from './index.type'

export const BettorId = make<BettorIdType>((value) => z.string().nonempty().parse(value))
export const PlacedBetId = BetId
export const PlacedBetStatus = (value: string): PlacedBetStatusType =>
  z.enum(['pending', 'won', 'lost', 'redeemed']).parse(value)
