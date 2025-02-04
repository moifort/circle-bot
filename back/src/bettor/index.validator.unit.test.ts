import { describe, expect, it } from 'bun:test'
import { PlacedBetStatus } from './index.validator'

describe('PlacedBetStatus Validator', () => {
  it('should validate', () => {
    expect(() => PlacedBetStatus('pending')).not.toThrow()
    expect(() => PlacedBetStatus('won')).not.toThrow()
    expect(() => PlacedBetStatus('lost')).not.toThrow()
    expect(() => PlacedBetStatus('redeemed')).not.toThrow()
  })

  it('should throw', () => {
    expect(() => PlacedBetStatus('invalid')).toThrow()
    expect(() => PlacedBetStatus('')).toThrow()
    expect(() => PlacedBetStatus(' ')).toThrow()
  })
})
