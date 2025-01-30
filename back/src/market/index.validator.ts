import { make } from 'ts-brand'
import { z } from 'zod'
import type {
  BetDescription as BetDescriptionType,
  BetId as BetIdType,
  BetOutcome as BetOutcomeType,
  BetTitle as BetTitleType,
} from './index.type'

export const BetId = make<BetIdType>((value) => z.string().nonempty().parse(value))
export const BetTitle = make<BetTitleType>((value) => z.string().nonempty().parse(value))
export const BetDescription = make<BetDescriptionType>((value) => z.string().nonempty().parse(value))
export const BetOutcome = (value: string) => {
  if (!['yes', 'no'].includes(value)) throw new Error('value must be "yes" or "no"')
  return value as BetOutcomeType
}
