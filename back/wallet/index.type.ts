import type { Brand } from 'ts-brand'
import type { Amount } from '../utils/index.type.ts'

export type TransactionId = Brand<string, 'TransactionId'>
export type TransactionType = 'deposit' | 'withdraw'
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type TransactionDescription = Record<string, any> | string | null

export type Transaction = {
  id: TransactionId
  amount: Amount
  type: TransactionType
  description: TransactionDescription
  createdAt: Date
}
