import type { Limit } from '../../utils/index.type.ts'
import type { Bet } from '../index.type.ts'
import { BetDescription, BetId, BetTitle } from '../index.validator.ts'
import type { PolymarketResponse } from './repository.type.ts'

export const findLatestPoliticalBet = async (limit: Limit) => {
  const response = await fetch(
    `https://gamma-api.polymarket.com/events/pagination?limit=${limit}&active=true&archived=false&tag_slug=politics&closed=false&order=volume24hr&ascending=false&offset=0`,
  )
  const { data }: PolymarketResponse = await response.json()
  return data
    .flatMap(({ markets }) => markets)
    .map<Bet>(({ id, question, description, endDate }) => ({
      id: BetId(id),
      title: BetTitle(question),
      description: BetDescription(description),
      endDate: new Date(endDate),
    }))
}
