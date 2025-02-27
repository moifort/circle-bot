import type { Brand } from 'ts-brand'
import type { Amount } from '../utils/index.type'

export type WalletId = Brand<string, 'WalletId'>
export type TransactionId = Brand<string, 'TransactionId'>
export type TransactionType = 'deposit' | 'withdraw'
export type TransactionDescription = Brand<
  Record<string, unknown> | string | 'no-description',
  'TransactionDescription'
>

export type Transaction = {
  id: TransactionId
  walletId: WalletId
  amount: Amount
  type: TransactionType
  description: TransactionDescription
  createdAt: Date
}
