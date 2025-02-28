import { make } from 'ts-brand'
import { z } from 'zod'
import type {
  Amount as AmountType,
  Limit as LimitType,
  Minute as MinuteType,
  Percentage as PercentageType,
  PercentagePoint as PercentagePointType,
} from './index.type'

export const Limit = make<LimitType>((value) => z.number().int().min(1).max(1000).parse(value))
export const Percentage = make<PercentageType>((value) => z.number().parse(value))
export const Amount = make<AmountType>((value) => z.number().min(0).parse(value))
export const Minute = make<MinuteType>((value) => z.number().int().min(0).parse(value))
export const PercentagePoint = make<PercentagePointType>((value) => z.number().min(0).max(1).parse(value))
