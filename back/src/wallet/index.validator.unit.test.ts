import { describe, expect, it } from 'bun:test'
import { TransactionDescription, TransactionId } from './index.validator'

describe('TransactionId', () => {
  it('should throw if the value empty', () => {
    expect(() => TransactionId('')).toThrow()
  })

  it('should not throw for a valid uuid TransactionId', () => {
    expect(() => TransactionId('78791cdb-f7aa-4abb-bc29-a381fc007cbd')).not.toThrow()
  })
})

describe('TransactionDescription', () => {
  it('should throw if the value empty', () => {
    expect(() => TransactionDescription('')).toThrow()
    expect(() => TransactionDescription(() => null)).toThrow()
  })

  it('should not throw for a valid BetDescription', () => {
    expect(() => TransactionDescription('First deposit')).not.toThrow()
    expect(() => TransactionDescription({ amount: 1000, date: new Date() })).not.toThrow()
  })
})
