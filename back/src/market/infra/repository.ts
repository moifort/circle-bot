import { Result } from 'typescript-result'
import type { Limit } from '../../utils/index.type'
import type { BetId as BedIdType, ClosedBet, OpenBet, MarketId as MarketIdType } from '../index.type'
import { BetDescription, BetId, BetOutcome, BetTitle, MarketId } from '../index.validator'
import type { PolymarketEvent, PolymarketEventResponse, PolymarketPriceHistory, PriceHistory } from './repository.type'
import { PolymarketPrice } from './repository.validator'
import dayjs from 'dayjs'
import { chain } from 'lodash'

export namespace GammaApiRepository {
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
    const { data } = (await response.json()) as PolymarketEventResponse
    return data
      .filter(({ markets }) => markets.length === 1)
      .flatMap(({ markets }) => markets)
      .filter(({ active }) => active)
      .filter(({ outcomes }) => outcomes === '["Yes", "No"]')
      .slice(0, limit)
      .map<OpenBet>(({ slug, question, description, endDate, updatedAt, outcomePrices, clobTokenIds }) => ({
        id: BetId(slug),
        status: 'open',
        title: BetTitle(question),
        description: BetDescription(description),
        endAt: new Date(endDate),
        updatedAt: new Date(updatedAt),
        yes: PolymarketPrice(Number.parseFloat(JSON.parse(outcomePrices)[0])),
        no: PolymarketPrice(Number.parseFloat(JSON.parse(outcomePrices)[1])),
        marketId: MarketId(JSON.parse(clobTokenIds)[0]),
      }))
  }

  export const findHistoryPrices = async (marketId: MarketIdType) => {
    const response = await fetch(`https://clob.polymarket.com/prices-history?interval=1h&market=${marketId}&fidelity=1`)
    const { history } = (await response.json()) as PolymarketPriceHistory
    return chain(history)
      .map<PriceHistory>(({ t, p }) => ({ date: dayjs.unix(t).toDate(), price: PolymarketPrice(p) }))
      .value()
  }
}
