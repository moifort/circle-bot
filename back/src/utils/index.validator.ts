import { make } from 'ts-brand'
import { z } from 'zod'
import type { Amount as AmountType, Limit as LimitType, Percentage as PercentageType } from './index.type'

export const Limit = make<LimitType>((value) => z.number().int().min(1).max(1000).parse(value))
export const Percentage = make<PercentageType>((value) => z.number().min(0).max(1).parse(value))
export const Amount = make<AmountType>((value) => z.number().min(0).parse(value))
