import { Bettor } from '../bettor/query.ts'
import { DecisionMaking } from '../decision-making/query.ts'
import { Market } from '../market/query.ts'
import { Amount } from '../utils/index.validator.ts'
import type { TransactionDescription } from '../wallet/index.type.ts'
import { Wallet } from '../wallet/query.ts'

export namespace Bot {
  export const run = async () => {
    Wallet.deposit(Amount(1000), 'initial deposit' as TransactionDescription)
    const [{ id, title, yes, no }] = await Market.latestPoliticalBets()
    const action = DecisionMaking.evaluate(yes, no, Wallet.balance())
    if (action === 'do-nothing') {
      return
    }
    Bettor.placeBet(id, action.outcome, action.amountToBet)
    Wallet.withdraw(action.amountToBet, { betId: id, betTitle: title, action } as TransactionDescription)
  }
}
