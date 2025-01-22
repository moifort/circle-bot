import { make } from 'ts-brand'
import type { Limit as LimitType, Percentage as PercentageType } from './index.type.ts'

export const Limit = make<LimitType>((value) => {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error('Limit must be a positive integer')
  }
  if (value > 100) {
    throw new Error('Limit must not exceed 100')
  }
})

export const Percentage = make<PercentageType>((value) => {
  if (value < 0) {
    throw new Error(`Percentage must be a non-negative integer: actual ${value}. Value accepted: 0-1`)
  }
  if (value > 1) {
    throw new Error(`Percentage must not exceed 1: actual ${value}. Value accepted: 0-1`)
  }
})
