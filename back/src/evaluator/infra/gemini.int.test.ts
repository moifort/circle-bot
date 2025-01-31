import { describe, expect, it } from 'bun:test'
import { DynamicRetrievalMode, GoogleGenerativeAI } from '@google/generative-ai'
import dayjs from 'dayjs'
import { BetDescription, BetTitle } from '../../market/index.validator'
import { GeminiApi } from './gemini'

describe('GeminiApi', () => {
  it.skip('evaluate', async () => {
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

  it.skip('evaluate', async () => {
    const model = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!).getGenerativeModel({
      model: 'gemini-1.5-pro',
      tools: [
        {
          googleSearchRetrieval: {
            dynamicRetrievalConfig: {
              mode: DynamicRetrievalMode.MODE_UNSPECIFIED,
              dynamicThreshold: 0.0,
            },
          },
        },
      ],
    })

    const result = await model.generateContent(`
      Answer to this question by making a research the web before ${dayjs().subtract(5, 'day').toISOString()}, and answer it by yes or no and give a brief explanation (300 characters):
         
         
      webSearchQueries:: Bitcoin above $105,000 on January 31?
      Rule: This market will resolve to \\"Yes\\" if the Binance 1 minute candle for BTCUSDT 31 Jan \'25 12:00 in the ET timezone (noon) has a final “Close” price of 105,000.01 or higher. Otherwise, this market will resolve to \\"No\\".\\n\\nThe resolution source for this market is Binance, specifically the BTCUSDT \\"Close\\" prices currently available at https://www.binance.com/en/trade/BTC_USDT with “1m” and “Candles” selected on the top bar.\\n\\nPlease note that this market is about the price according to Binance BTCUSDT, not according to other sources or spot markets.
      
      Answer type only in JSON format like below { "winningOutcome": "yes", "explanation": "Because the price is above $105,000", confidence: 0.8 }
      `)
    const response = result.response.candidates?.[0].content.parts[0].text!
    console.log(JSON.parse(response.replaceAll('```json', '').replaceAll('`', '')))
    // @ts-ignore
    expect(result).toBe('')
  })
})
