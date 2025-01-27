import _ from 'lodash'
import { make } from 'ts-brand'
import { match } from 'ts-pattern'
import type {
  BetDescription as BetDescriptionType,
  BetId as BetIdType,
  BetOutcome as BetOutcomeType,
  BetTitle as BetTitleType,
} from './index.type.ts'

export const BetId = make<BetIdType>((value) => {
  if (!_.isString(value)) {
    throw new Error(`value must be a string: Received: ${value}`)
  }
  if (_.isEmpty(value)) {
    throw new Error('Non empty value')
  }
})

export const BetTitle = make<BetTitleType>((value) => {
  if (!_.isString(value)) {
    throw new Error(`value must be a string: Received: ${value}`)
  }
  if (_.isEmpty(value)) {
    throw new Error('Non empty value')
  }
})

export const BetDescription = make<BetDescriptionType>((value) => {
  if (!_.isString(value)) {
    throw new Error(`value must be a string: Received: ${value}`)
  }
  if (_.isEmpty(value)) {
    throw new Error('Non empty value')
  }
})

export const BetOutcome = (value: string) =>
  match(value)
    .with('yes', () => 'yes' as BetOutcomeType)
    .with('no', () => 'no' as BetOutcomeType)
    .otherwise(() => {
      throw new Error(`BetOutcome must be one of: yes, no. Received: '${value}'`)
    })
