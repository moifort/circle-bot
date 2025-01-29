import { v4 as uuid } from 'uuid'
import { $firestore } from '../index'
import type { Amount as AmountType } from '../utils/index.type'
import { Amount } from '../utils/index.validator'
import { log } from '../utils/logger'
import type { Transaction } from './index.type'
import { TransactionDescription, TransactionId } from './index.validator'
import { TransactionRepository } from './infra/repository'

export class Wallet {
  @log
  static async balance() {
    const transactions = await TransactionRepository.findAll($firestore)()
    return Amount(transactions.reduce((acc, { amount, type }) => acc + (type === 'withdraw' ? -amount : amount), 0))
  }

  @log
  static async deposit(amount: AmountType, description = TransactionDescription('no-description')) {
    const transaction: Transaction = {
      id: TransactionId(uuid()),
      amount,
      type: 'deposit',
      description,
      createdAt: new Date(),
    }
    await TransactionRepository.save($firestore)(transaction)
  }

  @log
  static async withdraw(amount: AmountType, description = TransactionDescription('no-description')) {
    const transaction: Transaction = {
      id: TransactionId(uuid()),
      amount,
      type: 'withdraw',
      description,
      createdAt: new Date(),
    }
    await TransactionRepository.save($firestore)(transaction)
  }

  @log
  static async history() {
    return await TransactionRepository.findAll($firestore)()
  }
}
