import { make } from 'ts-brand'
import type { TransactionDescription as TransactionDescriptionType } from './index.type.ts'

export const TransactionDescription = make<TransactionDescriptionType>((value) => {
  if (!value) {
    throw new Error('Non empty value')
  }
})
