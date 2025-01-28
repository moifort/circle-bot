import { make } from 'ts-brand'
import { z } from 'zod'
import type { PolymarketPrice as PolymarketPriceType } from './repository.type.ts'

export const PolymarketPrice = make<PolymarketPriceType>((value) => z.number().min(0).max(1).parse(value))
