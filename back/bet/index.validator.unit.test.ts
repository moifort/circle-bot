import { describe, expect, it } from 'bun:test'
import { BetDescription, BetId, BetOutcome, BetTitle } from './index.validator'

describe('BetId', () => {
  it('should throw if the value empty', () => {
    expect(() => BetId('')).toThrow('Non empty value')
  })

  it('should not throw for a valid BetId', () => {
    const id = '14178'
    expect(() => BetId(id)).not.toThrow()
  })
})

describe('BetTitle', () => {
  it('should throw if the value empty', () => {
    expect(() => BetTitle('')).toThrow('Non empty value')
  })

  it('should not throw for a valid BetTitle', () => {
    const validValue = 'Trump cryptocurrency executive order in first week?'
    expect(() => BetTitle(validValue)).not.toThrow()
  })
})

describe('BetDescription', () => {
  it('should throw if the value empty', () => {
    expect(() => BetDescription('')).toThrow('Non empty value')
  })

  it('should not throw for a valid BetDescription', () => {
    const validValue = "This is a market on predictions for the Federal Reserve's interest rates in January 2025. "
    expect(() => BetDescription(validValue)).not.toThrow()
  })
})

describe('BetOutcome', () => {
  it('should throw if the value is not a valid outcome', () => {
    expect(() => BetOutcome('')).toThrow("BetOutcome must be one of: yes, no. Received: ''")
    expect(() => BetOutcome('lose')).toThrow("BetOutcome must be one of: yes, no. Received: 'lose'")
  })

  it('should not throw for a valid BetOutcome', () => {
    expect(() => BetOutcome('yes')).not.toThrow()
    expect(() => BetOutcome('no')).not.toThrow()
  })
})
