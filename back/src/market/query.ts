import dayjs from 'dayjs'
import type { Limit } from '../utils/index.type'
import type { BetId, OpenBetWithPriceHistory } from './index.type'
import { GammaApiRepository } from './infra/repository'

export namespace Market {
  export const getLatestOpenBets = async (filterBy: BetId[], limit: Limit) => {
    const bets = await GammaApiRepository.findLatestOpenBet(limit, dayjs().add(20, 'day').toDate())
    return bets.filter(({ id }) => !filterBy.includes(id)).filter(({ yes, no }) => yes > 0.15 && no > 0.15)
  }

  export const getBet = (id: BetId) => GammaApiRepository.findBy(id)

  export const getOpenBet = async (id: BetId) => {
    const openBet = await GammaApiRepository.findBy(id)
    if (openBet.status === 'closed') throw new Error(`Bet closed. id: ${openBet.id}`)
    return openBet
  }

  export const getAllBet = (filterBy: BetId[]) => Promise.all(filterBy.map((id) => GammaApiRepository.findBy(id)))

  export const getOpenBetsWithPriceHistory = async (filterBy: BetId[], limit: Limit) => {
    const bets = await GammaApiRepository.findLatestOpenBet(limit, dayjs().add(20, 'day').toDate())
    const filteredBets = bets.filter(({ id }) => !filterBy.includes(id))
    const history: OpenBetWithPriceHistory[] = []
    for (const bet of filteredBets) {
      const priceHistory = await GammaApiRepository.findHistoryPrices(
        bet.marketId,
        dayjs().subtract(4, 'minutes').toDate(),
        dayjs().toDate(),
      )
      history.push({ ...bet, priceHistory })
    }
    return history
  }
}
