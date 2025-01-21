import type { PolymarketConnectorConfiguration } from '../modules/polymarket.type.ts'
import type { Bet } from './index.type.ts'
import { BetTitle } from './index.validator.ts'

export const get5LatestPoliticalBets = (configuration: PolymarketConnectorConfiguration) => async () => {
  return Promise.all([{ title: BetTitle('Trump cryptocurrency executive order in first week?') }] as Bet[])
}
