import { BetId } from '../market/index.validator'
import type { PlacedBetStatus as PlacedBetStatusType } from './index.type'

export const PlacedBetId = BetId
export const PlacedBetStatus = (value: string) => {
  if (!['pending', 'won', 'lost'].includes(value)) throw new Error('value must be one of "pending", "won", "lost"')
  return value as PlacedBetStatusType
}
