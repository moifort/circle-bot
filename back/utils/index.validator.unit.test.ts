import { describe, expect, it } from 'bun:test'
import { Limit } from './index.validator'

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
