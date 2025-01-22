import type { event } from './repository.data.ts'

export type PolymarketEvent = typeof event
export type PolymarketResponse = { data: PolymarketEvent[] }
