import type { PolymarketResponse } from './repository.type.ts'

export const find5LatestPoliticalBet = async () => {
  const response = await fetch(
    'https://polymarket.com/_next/data/PWkjyWX_kwEHnEuuRTAFb/en/markets/politics.json?slug=politics',
  )
  const data: PolymarketResponse = await response.json()
  return data.pageProps.dehydratedState.queries[0].state.data.events
}
