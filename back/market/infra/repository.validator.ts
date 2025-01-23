import { make } from 'ts-brand'
import type { PolymarketPrice as PolymarketPriceType } from './repository.type.ts'

export const PolymarketPrice = make<PolymarketPriceType>((value) => {
  if (value < 0) {
    throw new Error(`Percentage must be a non-negative integer: actual ${value}. Value accepted: 0-1`)
  }
  if (value > 1) {
    throw new Error(`Percentage must not exceed 1: actual ${value}. Value accepted: 0-1`)
  }
})
