import { make } from 'ts-brand'
import type {
  BetDescription as BetDescriptionType,
  BetId as BetIdType,
  BetTitle as BetTitleType,
} from './index.type.ts'

export const BetId = make<BetIdType>((value) => {
  if (!value) {
    throw new Error('Non empty value')
  }
})

export const BetTitle = make<BetTitleType>((value) => {
  if (!value) {
    throw new Error('Non empty value')
  }
})

export const BetDescription = make<BetDescriptionType>((value) => {
  if (!value) {
    throw new Error('Non empty value')
  }
})
