import { Bettor } from '../bettor/query.ts'
import { Evaluator } from '../evaluator/query.ts'
import { Market } from '../market/query.ts'
import { Amount } from '../utils/index.validator.ts'
import { TransactionDescription } from '../wallet/index.validator.ts'
import { Wallet } from '../wallet/query.ts'

export namespace Bot {
  export const run = async () => {
    Wallet.deposit(Amount(1000), TransactionDescription('initial deposit'))
    const [{ id, title, yes, no }] = await Market.latestPoliticalBets()
    const action = Evaluator.evaluate(yes, no, Wallet.balance())
    if (action === 'do-nothing') {
      return
    }
    Bettor.placeBet(id, action.outcome, action.amountToBet)
    Wallet.withdraw(action.amountToBet, TransactionDescription({ betId: id, betTitle: title, action }))
  }
}
