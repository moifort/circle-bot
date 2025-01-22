import { describe, expect, it } from 'bun:test'
import { PolymarketApiKey } from './polymarket.validator.ts'

describe('PolymarketApiKey', () => {
  it('should throw if the value is null or empty', () => {
    expect(() => PolymarketApiKey('')).toThrow('Non empty value')
  })

  it('should throw if the value is not 36 characters long', () => {
    expect(() => PolymarketApiKey('123')).toThrow('Must be 36 characters long. Actual size 3')
  })

  it('should not throw for a valid PolymarketClobApiKey', () => {
    const validValue = '12345678-1234-1234-1234-123456789123'
    expect(() => PolymarketApiKey(validValue)).not.toThrow()
  })
})
