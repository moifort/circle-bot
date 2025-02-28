import dayjs from 'dayjs'
import { Limit } from '../utils/index.validator'
import type { BetId, OpenBetWithPriceHistory } from './index.type'
import { GammaApiRepository } from './infra/repository'

export namespace Market {
  export const getLatestOpenBets = async () => {
    const bets = await GammaApiRepository.findLatestOpenBet(Limit(500))
    return bets
      .filter(({ yes, no }) => yes > 0.15 && no > 0.15)
      .filter(({ endAt }) => dayjs(endAt).isBefore(dayjs().add(20, 'day')))
  }

  export const getBet = (id: BetId) => GammaApiRepository.findBy(id)

  export const getAllBet = (filterBy: BetId[]) => Promise.all(filterBy.map((id) => GammaApiRepository.findBy(id)))

  export const getOpenBetsWithPriceHistory = async (filterBy: BetId[]) => {
    const bets = await GammaApiRepository.findLatestOpenBet(Limit(200))
    const filteredBets = bets
      .filter(({ id }) => filterBy.includes(id))
      .filter(({ yes, no }) => yes > 0.15 && no > 0.15)
      .filter(({ endAt }) => dayjs(endAt).isBefore(dayjs().add(20, 'day')))
    return await Promise.all<OpenBetWithPriceHistory>(
      filteredBets.map(async (bet) => ({
        ...bet,
        priceHistory: await GammaApiRepository.findHistoryPrices(bet.marketId),
      })),
    )
  }
}
