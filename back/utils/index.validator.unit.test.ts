import { describe, expect, it } from 'bun:test'
import { Amount, Limit, Percentage } from './index.validator'

describe('Limit', () => {
  it('should throw if the value is not an integer', () => {
    expect(() => Limit(1.5)).toThrow()
  })

  it('should throw if the value is less than or equal to 0', () => {
    expect(() => Limit(-1)).toThrow()
  })

  it('should throw if the value exceeds 1000', () => {
    expect(() => Limit(1001)).toThrow()
  })

  it('should not throw for a valid limit', () => {
    expect(() => Limit(5)).not.toThrow()
  })
})

describe('Percentage', () => {
  it('should throw if the value is less than 0', () => {
    expect(() => Percentage(-1)).toThrow()
  })

  it('should throw if the value exceeds 1', () => {
    expect(() => Percentage(1.1)).toThrow()
  })

  it('should not throw for a valid percentage', () => {
    expect(() => Percentage(0)).not.toThrow()
    expect(() => Percentage(0.5)).not.toThrow()
    expect(() => Percentage(1)).not.toThrow()
  })
})

describe('Amount', () => {
  it('should throw if the value is less than or equal to 0', () => {
    expect(() => Amount(-1)).toThrow()
  })

  it('should not throw for a valid amount', () => {
    expect(() => Amount(0)).not.toThrow()
    expect(() => Amount(100)).not.toThrow()
  })
})
