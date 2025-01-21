import { make } from 'ts-brand'
import type { BetTitle as BetTitleType } from './index.type.ts'

export const BetTitle = make<BetTitleType>((value) => {
  if (!value) {
    throw new Error('Non empty value')
  }
})
