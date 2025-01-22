import type { Bet } from './index.type.ts'
import { BetTitle } from './index.validator.ts'
import type { PolymarketConnectorConfiguration } from './infra/polymarket.type.ts'

export const get5LatestPoliticalBets = (configuration: PolymarketConnectorConfiguration) => async () => {
  return Promise.all([{ title: BetTitle('Trump cryptocurrency executive order in first week?') }] as Bet[])
}
