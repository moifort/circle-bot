import { make } from 'ts-brand'
import { Percentage } from '../../utils/index.validator.ts'
import type { PolymarketPrice as PolymarketPriceType } from './repository.type.ts'

export const PolymarketPrice = make<PolymarketPriceType>(Percentage)
