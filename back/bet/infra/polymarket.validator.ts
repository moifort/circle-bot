import { make } from 'ts-brand'
import type { PolymarketApiKey as PolymarketApiKeyType } from './polymarket.type.ts'

export const PolymarketApiKey = make<PolymarketApiKeyType>((value) => {
  if (!value) {
    throw new Error('Non empty value')
  }
  if (value.length !== 36) {
    throw new Error(`Must be 36 characters long. Actual size ${value.length}`)
  }
})
