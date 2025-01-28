import { make } from 'ts-brand'
import { z } from 'zod'
import type {
  TransactionDescription as TransactionDescriptionType,
  TransactionId as TransactionIdType,
} from './index.type'

export const TransactionDescription = make<TransactionDescriptionType>((value) => {
  if (!value) {
    throw new Error('Non empty value')
  }
})

export const TransactionId = make<TransactionIdType>((value) => z.string().uuid().parse(value))
