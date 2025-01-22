import { make } from 'ts-brand'
import type { Limit as LimitType } from './index.type.ts'

export const Limit = make<LimitType>((value) => {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error('Limit must be a positive integer')
  }
  if (value > 100) {
    throw new Error('Limit must not exceed 100')
  }
})
