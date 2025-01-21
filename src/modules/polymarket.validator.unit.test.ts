import { describe, expect, it } from 'bun:test'
import {
  EtherWalletPrivateKey,
  PolymarketClobApiKey,
  PolymarketClobApiPassphrase,
  PolymarketClobApiSecret,
} from './polymarket.validator'

describe('EtherWalletPrivateKey', () => {
  it('should throw if the value is null or empty', () => {
    expect(() => EtherWalletPrivateKey('')).toThrow('Non empty value')
  })

  it('should throw if the value is not 66 characters long', () => {
    expect(() => EtherWalletPrivateKey('0x123')).toThrow('Must be 66 characters long. Actual size 5')
  })

  it('should throw if the value does not start with 0x', () => {
    const invalidValue = '123456789012345678901234567890123456789012345678901234567890123456'
    expect(() => EtherWalletPrivateKey(invalidValue)).toThrow(`Must start with 0x: ${invalidValue}`)
  })

  it('should not throw for a valid EtherWalletPrivateKey', () => {
    const validValue = '0x1234567890123456789012345678901234567890123456789012345678901234'
    expect(() => EtherWalletPrivateKey(validValue)).not.toThrow()
  })
})

describe('PolymarketClobApiKey', () => {
  it('should throw if the value is null or empty', () => {
    expect(() => PolymarketClobApiKey('')).toThrow('Non empty value')
  })

  it('should throw if the value is not 36 characters long', () => {
    expect(() => PolymarketClobApiKey('123')).toThrow('Must be 36 characters long. Actual size 3')
  })

  it('should not throw for a valid PolymarketClobApiKey', () => {
    const validValue = '12345678-1234-1234-1234-123456789123'
    expect(() => PolymarketClobApiKey(validValue)).not.toThrow()
  })
})

describe('PolymarketClobApiSecret', () => {
  it('should throw if the value is null or empty', () => {
    expect(() => PolymarketClobApiSecret('')).toThrow('Non empty value')
  })

  it('should throw if the value is not 44 characters long', () => {
    expect(() => PolymarketClobApiSecret('123')).toThrow('Must be 44 characters long. Actual size 3')
  })

  it('should not throw for a valid PolymarketClobApiSecret', () => {
    const validValue = '12345678901234567890123456789012345678901234'
    expect(() => PolymarketClobApiSecret(validValue)).not.toThrow()
  })
})

describe('PolymarketClobApiPassphrase', () => {
  it('should throw if the value is null or empty', () => {
    expect(() => PolymarketClobApiPassphrase('')).toThrow('Non empty value')
  })

  it('should throw if the value is not 64 characters long', () => {
    expect(() => PolymarketClobApiPassphrase('123')).toThrow('Must be 64 characters long. Actual size 3')
  })

  it('should not throw for a valid PolymarketClobApiPassphrase', () => {
    const validValue = '1234567890123456789012345678901234567890123456789012345678901234'
    expect(() => PolymarketClobApiPassphrase(validValue)).not.toThrow()
  })
})
