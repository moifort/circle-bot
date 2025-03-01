import dayjs from 'dayjs'
import { chain } from 'lodash'
import type { Limit } from '../../utils/index.type'
import type { BetId as BedIdType, ClosedBet, MarketId as MarketIdType, OpenBet } from '../index.type'
import { BetDescription, BetId, BetOutcome, BetTitle, MarketId } from '../index.validator'
import type { PolymarketMarket, PolymarketPriceHistory, PriceHistory } from './repository.type'
import { PolymarketPrice } from './repository.validator'

export namespace GammaApiRepository {
  export const findBy = async (id: BedIdType) => {
    const response = await fetch(`https://gamma-api.polymarket.com/markets/slug/${id}`)
    const { closed, slug, endDate, outcomePrices, question, description, updatedAt } =
      (await response.json()) as PolymarketMarket
    return closed
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
        }
  }

  export const findLatestOpenBet = async (limit: Limit, endDate: Date) => {
    const response = await fetch(
      `https://gamma-api.polymarket.com/markets?limit=${limit}&active=true&archived=false&closed=false&end_date_max=${endDate.toISOString()}&end_date_min=${new Date().toISOString()}`,
    )
    const data = (await response.json()) as PolymarketMarket[]
    return data
      .filter(({ outcomes }) => outcomes === '["Yes", "No"]')
      .filter(({ outcomePrices }) => outcomePrices)
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

  export const findHistoryPrices = async (marketId: MarketIdType, from: Date, to: Date) => {
    try {
      const response = await fetch(
        `https://clob.polymarket.com/prices-history?startTs=${Math.floor(from.getTime() / 1000)}&endTs=${Math.floor(to.getTime() / 1000)}&market=${marketId}&fidelity=1`,
      )
      const { history } = (await response.json()) as PolymarketPriceHistory
      return chain(history)
        .map<PriceHistory>(({ t, p }) => ({ date: dayjs.unix(t).toDate(), price: PolymarketPrice(p) }))
        .value()
    } catch (e) {
      console.error('Ban from API')
      return []
    }
  }
}
