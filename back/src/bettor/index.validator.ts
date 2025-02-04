import { z } from 'zod'
import { BetId } from '../market/index.validator'
import type { PlacedBetStatus as PlacedBetStatusType } from './index.type'

export const PlacedBetId = BetId
export const PlacedBetStatus = (value: string): PlacedBetStatusType =>
  z.enum(['pending', 'won', 'lost', 'redeemed']).parse(value)
