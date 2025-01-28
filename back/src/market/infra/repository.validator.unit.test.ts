import { describe, expect, it } from 'bun:test'
import { PolymarketPrice } from './repository.validator'

describe('PolymarketPrice', () => {
  it('should throw if the value is less than 0', () => {
    expect(() => PolymarketPrice(-1)).toThrow()
  })

  it('should throw if the value exceeds 1', () => {
    expect(() => PolymarketPrice(1.1)).toThrow()
  })

  it('should not throw for a valid percentage', () => {
    expect(() => PolymarketPrice(0)).not.toThrow()
    expect(() => PolymarketPrice(0.5)).not.toThrow()
    expect(() => PolymarketPrice(1)).not.toThrow()
  })
})
