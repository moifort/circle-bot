import { describe, expect, it } from 'bun:test'
import { BetTitle } from './index.validator'

describe('BetTitle', () => {
  it('should throw if the value empty', () => {
    expect(() => BetTitle('')).toThrow('Non empty value')
  })

  it('should not throw for a valid BetTitle', () => {
    const validValue = 'Trump cryptocurrency executive order in first week?'
    expect(() => BetTitle(validValue)).not.toThrow()
  })
})
