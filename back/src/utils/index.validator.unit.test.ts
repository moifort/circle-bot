import { describe, expect, it } from 'bun:test'
import { Amount, Limit, Minute, Percentage, PercentagePoint } from './index.validator'

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

describe('Minute', () => {
  it('should validate positive integers', () => {
    expect(() => Minute(5)).not.toThrow()
    expect(() => Minute(0)).not.toThrow()
    expect(() => Minute(60)).not.toThrow()
  })

  it('should reject negative numbers', () => {
    expect(() => Minute(-1)).toThrow()
    expect(() => Minute(-60)).toThrow()
  })

  it('should reject non-integer numbers', () => {
    expect(() => Minute(1.5)).toThrow()
    expect(() => Minute(0.1)).toThrow()
  })
})

describe('PercentagePoint', () => {
  it('should validate percentage points in decimal form', () => {
    expect(() => PercentagePoint(0.05)).not.toThrow() // 5 points
    expect(() => PercentagePoint(0.5)).not.toThrow() // 50 points
    expect(() => PercentagePoint(1)).not.toThrow() // 100 points
  })

  it('should throw error for invalid percentage points', () => {
    expect(() => PercentagePoint(-0.1)).toThrow()
    expect(() => PercentagePoint(1.1)).toThrow()
  })
})
