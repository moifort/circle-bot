import _ from 'lodash'
import { make } from 'ts-brand'
import type { PolymarketPrice as PolymarketPriceType } from './repository.type.ts'

export const PolymarketPrice = make<PolymarketPriceType>((value) => {
  if (!_.isNumber(value)) {
    throw new Error(`PolymarketPrice must be a number: actual ${value}`)
  }
  if (value < 0) {
    throw new Error(`Percentage must be a non-negative integer: actual ${value}. Value accepted between 0.0 to 1.0`)
  }
  if (value > 1) {
    throw new Error(`Percentage must not exceed 1: actual ${value}. Value accepted between 0.0 to 1.0`)
  }
})
