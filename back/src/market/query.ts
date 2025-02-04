import dayjs from 'dayjs'
import { Limit } from '../utils/index.validator'
import { log } from '../utils/logger'
import type { BetId } from './index.type'
import { GammaApiRepository } from './infra/repository'

export class Market {
  @log
  static async getLatestOpenBets() {
    const bets = await GammaApiRepository.findLatestOpenBet(Limit(500))
    return bets
      .filter(({ yes, no }) => yes > 0.15 && no > 0.15)
      .filter(({ endAt }) => dayjs(endAt).isBefore(dayjs().add(20, 'day')))
  }

  @log
  static async getBet(id: BetId) {
    return GammaApiRepository.findBy(id)
  }

  @log
  static async getAllBet(filterBy: BetId[]) {
    return Promise.all(filterBy.map((id) => GammaApiRepository.findBy(id)))
  }
}
