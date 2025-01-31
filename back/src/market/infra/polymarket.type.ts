import type { Brand } from 'ts-brand'
import type { event } from './polymarket.data'

export type PolymarketEvent = typeof event
export type PolymarketResponse = { data: PolymarketEvent[] }

export type PolymarketPrice = Brand<number, 'PolymarketPrice'>
