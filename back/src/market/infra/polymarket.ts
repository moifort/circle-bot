import { Result } from 'typescript-result'
import type { Limit } from '../../utils/index.type'
import type { ClosedBet, OpenBet } from '../index.type'
import type { BetId as BedIdType } from '../index.type'
import { BetDescription, BetId, BetOutcome, BetTitle } from '../index.validator'
import type { PolymarketEvent, PolymarketResponse } from './polymarket.type'
import { PolymarketPrice } from './polymarket.validator'

export namespace PolymarketApi {
  export const findBy = async (id: BedIdType) => {
    const response = await fetch(`https://gamma-api.polymarket.com/events/slug/${id}`)
    const { closed, slug, endDate, markets } = (await response.json()) as PolymarketEvent
    if (markets.length > 1) return Result.error('multiple-answer-bet-instead-of-yes-no' as const)
    const { outcomePrices, question, description, updatedAt } = markets[0]
    return Result.ok(
      closed
        ? <ClosedBet>{
            id: BetId(slug),
            status: 'closed',
            endAt: new Date(endDate),
            winningOutcome: BetOutcome(JSON.parse(outcomePrices)[0] === '1' ? 'yes' : 'no'),
          }
        : <OpenBet>{
            id: BetId(slug),
            status: 'open',
            title: BetTitle(question),
            description: BetDescription(description),
            endAt: new Date(endDate),
            updatedAt: new Date(updatedAt),
            yes: PolymarketPrice(Number.parseFloat(JSON.parse(outcomePrices)[0])),
            no: PolymarketPrice(Number.parseFloat(JSON.parse(outcomePrices)[1])),
          },
    )
  }

  export const findLatestOpenBet = async (limit: Limit) => {
    const response = await fetch(
      `https://gamma-api.polymarket.com/events/pagination?limit=${limit}&active=true&archived=false&closed=false&order=volume24hr&ascending=false&offset=0`,
    )
    const { data } = (await response.json()) as PolymarketResponse
    return data
      .filter(({ markets }) => markets.length === 1)
      .flatMap(({ markets }) => markets)
      .filter(({ active }) => active)
      .filter(({ outcomes }) => outcomes === '["Yes", "No"]')
      .slice(0, limit)
      .map<OpenBet>(({ slug, question, description, endDate, updatedAt, outcomePrices }) => ({
        id: BetId(slug),
        status: 'open',
        title: BetTitle(question),
        description: BetDescription(description),
        endAt: new Date(endDate),
        updatedAt: new Date(updatedAt),
        yes: PolymarketPrice(Number.parseFloat(JSON.parse(outcomePrices)[0])),
        no: PolymarketPrice(Number.parseFloat(JSON.parse(outcomePrices)[1])),
      }))
  }
}
