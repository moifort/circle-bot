import type { Brand } from 'ts-brand'
import type { market, priceHistory } from './repository.data'

export type PolymarketMarket = typeof market
export type PolymarketPriceHistory = typeof priceHistory

export type PolymarketPrice = Brand<number, 'PolymarketPrice'>
export type PriceHistory = { price: PolymarketPrice; date: Date }
