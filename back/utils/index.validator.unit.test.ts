import { describe, expect, it } from 'bun:test'
import { Amount, Limit, Percentage } from './index.validator'

describe('Limit', () => {
  it('should throw if the value is not an integer', () => {
    expect(() => Limit(1.5)).toThrow('Limit must be a positive integer')
  })

  it('should throw if the value is less than or equal to 0', () => {
    expect(() => Limit(0)).toThrow('Limit must be a positive integer')
    expect(() => Limit(-1)).toThrow('Limit must be a positive integer')
  })

  it('should throw if the value exceeds 100', () => {
    expect(() => Limit(101)).toThrow('Limit must not exceed 100')
  })

  it('should not throw for a valid limit', () => {
    expect(() => Limit(5)).not.toThrow()
  })
})

describe('Percentage', () => {
  it('should throw if the value is less than 0', () => {
    expect(() => Percentage(-1)).toThrow('Percentage must be a non-negative integer: actual -1. Value accepted: 0-1')
  })

  it('should throw if the value exceeds 1', () => {
    expect(() => Percentage(1.1)).toThrow('Percentage must not exceed 1: actual 1.1. Value accepted: 0-1')
  })

  it('should not throw for a valid percentage', () => {
    expect(() => Percentage(0)).not.toThrow()
    expect(() => Percentage(0.5)).not.toThrow()
    expect(() => Percentage(1)).not.toThrow()
  })
})

describe('Amount', () => {
  it('should throw if the value is less than or equal to 0', () => {
    expect(() => Amount(0)).toThrow('Amount must be a positive number')
    expect(() => Amount(-1)).toThrow('Amount must be a positive number')
  })

  it('should not throw for a valid amount', () => {
    expect(() => Amount(1)).not.toThrow()
    expect(() => Amount(100)).not.toThrow()
  })
})
