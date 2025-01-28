import { v4 as uuid } from 'uuid'
import { $firestore } from '../index'
import type { Amount as AmountType } from '../utils/index.type'
import { Amount } from '../utils/index.validator'
import type { Transaction } from './index.type'
import { TransactionDescription, TransactionId } from './index.validator'
import { TransactionRepository } from './infra/repository'

export namespace Wallet {
  export const balance = async () => {
    const transactions = await TransactionRepository.findAll($firestore)()
    return Amount(transactions.reduce((acc, { amount, type }) => acc + (type === 'withdraw' ? -amount : amount), 0))
  }

  export const deposit = async (amount: AmountType, description = TransactionDescription('no-description')) => {
    console.info(`[WALLET] deposit(amount=${amount}, description=${JSON.stringify(description)})`)
    const transaction: Transaction = {
      id: TransactionId(uuid()),
      amount,
      type: 'deposit',
      description,
      createdAt: new Date(),
    }
    await TransactionRepository.save($firestore)(transaction)
  }

  export const withdraw = async (amount: AmountType, description = TransactionDescription('no-description')) => {
    console.info(`[WALLET] withdraw(amount=${amount}, description=${JSON.stringify(description)})`)
    const transaction: Transaction = {
      id: TransactionId(uuid()),
      amount,
      type: 'withdraw',
      description,
      createdAt: new Date(),
    }
    await TransactionRepository.save($firestore)(transaction)
  }

  export const history = async () => {
    console.info('[WALLET] history()')
    return await TransactionRepository.findAll($firestore)()
  }
}
