import { Result } from 'typescript-result'
import { v4 as uuid } from 'uuid'
import { $firestore } from '../index'
import type { Amount as AmountType } from '../utils/index.type'
import { Amount } from '../utils/index.validator'
import type { Transaction, WalletId } from './index.type'
import { TransactionDescription, TransactionId } from './index.validator'
import { TransactionRepository } from './infra/repository'

export namespace Wallet {
  export const balance = (walletId: WalletId) => async () => {
    const transactions = await TransactionRepository.findAll($firestore, walletId)()
    return Amount(transactions.reduce((acc, { amount, type }) => acc + (type === 'withdraw' ? -amount : amount), 0))
  }

  export const deposit =
    (walletId: WalletId) =>
    async (amount: AmountType, description = TransactionDescription('no-description')) => {
      const transaction: Transaction = {
        id: TransactionId(uuid()),
        walletId,
        amount,
        type: 'deposit',
        description,
        createdAt: new Date(),
      }
      await TransactionRepository.save($firestore)(transaction)
    }

  export const withdraw =
    (walletId: WalletId) =>
    async (amount: AmountType, description = TransactionDescription('no-description')) => {
      const currentBalance = await Wallet.balance(walletId)()
      if (amount > currentBalance) return Result.error('insufficient-funds' as const)
      const transaction: Transaction = {
        id: TransactionId(uuid()),
        walletId,
        amount,
        type: 'withdraw',
        description,
        createdAt: new Date(),
      }
      await TransactionRepository.save($firestore)(transaction)
      return Result.ok(transaction)
    }

  export const history = (walletId: WalletId) => async () => {
    return await TransactionRepository.findAll($firestore, walletId)()
  }
}
