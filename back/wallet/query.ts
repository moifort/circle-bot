import { v4 as uuid } from 'uuid'
import type { Amount as AmountType } from '../utils/index.type.ts'
import { Amount } from '../utils/index.validator.ts'
import type { Transaction, TransactionId } from './index.type.ts'
import { TransactionDescription } from './index.validator.ts'

let transactions: Transaction[] = []

export namespace Wallet {
  export const balance = () =>
    Amount(transactions.reduce((acc, { amount, type }) => acc + (type === 'withdraw' ? -amount : amount), 0))

  export const deposit = (amount: AmountType, description = TransactionDescription('no-description')) => {
    transactions = [
      ...transactions,
      {
        id: uuid() as TransactionId,
        amount,
        type: 'deposit',
        description,
        createdAt: new Date(),
      },
    ]
  }

  export const withdraw = (amount: AmountType, description = TransactionDescription('no-description')) => {
    transactions = [
      ...transactions,
      {
        id: uuid() as TransactionId,
        amount,
        type: 'withdraw',
        description,
        createdAt: new Date(),
      },
    ]
  }

  export const history = () => transactions
}
