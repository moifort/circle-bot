import dayjs from 'dayjs'
import { Limit } from '../utils/index.validator.ts'
import { findLatestPoliticalBet } from './infra/repository.ts'

export namespace Market {
  export const latestPoliticalBets = async () => {
    const bets = await findLatestPoliticalBet(Limit(200))
    return bets
      .filter(({ yes, no }) => yes > 0.15 || no > 0.15)
      .filter(({ endAt }) => dayjs(endAt).isBefore(dayjs().add(14, 'day')))
  }
}
