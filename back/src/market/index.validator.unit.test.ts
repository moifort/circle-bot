import { describe, expect, it } from 'bun:test'
import { BetDescription, BetId, BetOutcome, BetTitle, MarketId } from './index.validator'

describe('BetId', () => {
  it('should throw if the value is empty', () => {
    expect(() => BetId('')).toThrow()
  })

  it('should not throw for a valid BetId', () => {
    expect(() => BetId('14178')).not.toThrow()
    expect(() => BetId('abc-123')).not.toThrow()
  })

  it('should return a branded type', () => {
    const value = '14178'
    const betId = BetId(value)
    expect(typeof betId).toBe('string')
    expect(String(betId)).toBe(value)
  })
})

describe('BetTitle', () => {
  it('should throw if the value is empty', () => {
    expect(() => BetTitle('')).toThrow()
  })

  it('should not throw for a valid BetTitle', () => {
    expect(() => BetTitle('Trump cryptocurrency executive order in first week?')).not.toThrow()
  })

  it('should return a branded type', () => {
    const value = 'Trump cryptocurrency executive order in first week?'
    const betTitle = BetTitle(value)
    expect(typeof betTitle).toBe('string')
    expect(String(betTitle)).toBe(value)
  })
})

describe('BetDescription', () => {
  it('should throw if the value is empty', () => {
    expect(() => BetDescription('')).toThrow()
  })

  it('should not throw for a valid BetDescription', () => {
    expect(() =>
      BetDescription("This is a market on predictions for the Federal Reserve's interest rates in January 2025."),
    ).not.toThrow()
  })

  it('should return a branded type', () => {
    const value = "This is a market on predictions for the Federal Reserve's interest rates in January 2025."
    const betDescription = BetDescription(value)
    expect(typeof betDescription).toBe('string')
    expect(String(betDescription)).toBe(value)
  })
})

describe('BetOutcome', () => {
  it('should throw if the value is not a valid outcome', () => {
    expect(() => BetOutcome('')).toThrow('value must be "yes" or "no"')
    expect(() => BetOutcome('lose')).toThrow('value must be "yes" or "no"')
    expect(() => BetOutcome('maybe')).toThrow('value must be "yes" or "no"')
  })

  it('should not throw for valid BetOutcomes', () => {
    expect(() => BetOutcome('yes')).not.toThrow()
    expect(() => BetOutcome('no')).not.toThrow()
  })

  it('should return the correct value', () => {
    const yes = BetOutcome('yes')
    const no = BetOutcome('no')
    expect(String(yes)).toBe('yes')
    expect(String(no)).toBe('no')
  })
})

describe('MarketId', () => {
  it('should validate numeric string', () => {
    expect(() =>
      MarketId('84888738552927367074645370589243532246434846262240067551074642775011167355434'),
    ).not.toThrow()
  })

  it('should throw error for non-numeric string', () => {
    expect(() => MarketId('abc123')).toThrow()
    expect(() => MarketId('')).toThrow()
    expect(() => MarketId('123abc')).toThrow()
    expect(() => MarketId('123.456')).toThrow()
    expect(() => MarketId('-123')).toThrow()
  })
})
