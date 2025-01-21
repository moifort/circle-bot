import { make } from 'ts-brand'
import type {
  EtherWalletPrivateKey as EtherWalletPrivateKeyType,
  PolymarketClobApiKey as PolymarketClobApiKeyType,
  PolymarketClobApiPassphrase as PolymarketClobApiPassphraseType,
  PolymarketClobApiSecret as PolymarketClobApiSecretType,
} from './polymarket.type.ts'

export const EtherWalletPrivateKey = make<EtherWalletPrivateKeyType>((value) => {
  if (!value) {
    throw new Error('Non empty value')
  }
  if (value.length !== 66) {
    throw new Error(`Must be 66 characters long. Actual size ${value.length}`)
  }
  if (!value.startsWith('0x')) {
    throw new Error(`Must start with 0x: ${value}`)
  }
})

export const PolymarketClobApiKey = make<PolymarketClobApiKeyType>((value) => {
  if (!value) {
    throw new Error('Non empty value')
  }
  if (value.length !== 36) {
    throw new Error(`Must be 36 characters long. Actual size ${value.length}`)
  }
})

export const PolymarketClobApiSecret = make<PolymarketClobApiSecretType>((value) => {
  if (!value) {
    throw new Error('Non empty value')
  }
  if (value.length !== 44) {
    throw new Error(`Must be 44 characters long. Actual size ${value.length}`)
  }
})

export const PolymarketClobApiPassphrase = make<PolymarketClobApiPassphraseType>((value) => {
  if (!value) {
    throw new Error('Non empty value')
  }
  if (value.length !== 64) {
    throw new Error(`Must be 64 characters long. Actual size ${value.length}`)
  }
})
