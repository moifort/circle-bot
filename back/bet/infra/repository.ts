import type { Limit } from '../../utils/index.type.ts'
import type { Bet } from '../index.type.ts'
import { BetDescription, BetId, BetTitle } from '../index.validator.ts'
import type { PolymarketResponse } from './repository.type.ts'
import { PolymarketPrice } from './repository.validator.ts'

export const findLatestPoliticalBet = async (limit: Limit) => {
  const response = await fetch(
    `https://gamma-api.polymarket.com/events/pagination?limit=${limit}&active=true&archived=false&tag_slug=politics&closed=false&order=volume24hr&ascending=false&offset=0`,
  )
  const { data }: PolymarketResponse = await response.json()
  return data
    .flatMap(({ markets }) => markets)
    .filter(({ active }) => active)
    .filter(({ outcomes }) => outcomes === '["Yes", "No"]')
    .slice(0, limit)
    .map<Bet>(({ id, question, description, endDate, updatedAt, outcomePrices }) => ({
      id: BetId(id),
      title: BetTitle(question),
      description: BetDescription(description),
      endAt: new Date(endDate),
      updatedAt: new Date(updatedAt),
      yes: PolymarketPrice(JSON.parse(outcomePrices)[0]),
      no: PolymarketPrice(JSON.parse(outcomePrices)[1]),
    }))
}
