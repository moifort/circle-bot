import { describe, expect, it } from 'bun:test'
import { BetDescription, BetTitle } from '../../market/index.validator'
import { GeminiApi } from './gemini'

describe('GeminiApi', () => {
  it('evaluate', async () => {
    // When
    const evaluation = await GeminiApi.generate(
      BetTitle('North Korea missile test by February 14?'),
      BetDescription(
        'This market will resolve to "Yes" if North Korea (DPRK) launches a missile test between January 29, 3:00 PM ET and February 14, 2025, 11:59 PM ET. Otherwise, this market will resolve to "No".\n' +
          'The market resolution will be based on publicly available information from reliable sources such as official government statements, reports from international monitoring bodies like the United Nations, or reports from reputable international media.',
      ),
    )

    // Then
    expect(evaluation).toContainAllKeys(['winningOutcome', 'probabilityToWin', 'why', 'sources'])
  })
})
