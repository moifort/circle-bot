import { describe, expect, it } from 'bun:test'
import { Evaluation } from './index.validator'

describe('Evaluation', () => {
  it('should throw if the value empty', () => {
    expect(() => Evaluation('')).toThrow()
    expect(() => Evaluation({ winningOutcome: 'oui' })).toThrow()
  })

  it('should not throw for a valid BetId', () => {
    expect(() =>
      Evaluation({
        winningOutcome: 'yes',
        probabilityToWin: 0.1,
        why: 'because',
        sources: ['source1', 'source2'],
      }),
    ).not.toThrow()
  })
})
