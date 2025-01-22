import dayjs from 'dayjs'
import { Limit } from '../utils/index.validator.ts'
import { findLatestPoliticalBet } from './infra/repository.ts'

export namespace Bet {
  export const getLatestPoliticalClosingIn7Day = async () => {
    const bets = await findLatestPoliticalBet(Limit(10))
    return bets.filter(({ endDate }) => dayjs(endDate).isBefore(dayjs().add(7, 'day')))
  }
}
