import type { Brand } from 'ts-brand'
import type { event, priceHistory } from './repository.data'

export type PolymarketEvent = typeof event
export type PolymarketPriceHistory = typeof priceHistory

export type PolymarketPrice = Brand<number, 'PolymarketPrice'>
export type PriceHistory = { price: PolymarketPrice; date: Date }
