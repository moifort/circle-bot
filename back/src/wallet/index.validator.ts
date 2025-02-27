import { make } from 'ts-brand'
import { z } from 'zod'
import type {
  TransactionDescription as TransactionDescriptionType,
  TransactionId as TransactionIdType,
  WalletId as WalletIdType,
} from './index.type'

export const TransactionId = make<TransactionIdType>((value) => z.string().uuid().parse(value))

export const TransactionDescription = make<TransactionDescriptionType>((value) =>
  z.union([z.string().nonempty(), z.record(z.any())]).parse(value),
)

export const WalletId = make<WalletIdType>((value) => z.string().nonempty().parse(value))
