import type { ClobClient } from '@polymarket/clob-client'
import type { Brand } from 'ts-brand'

export type EtherWalletPrivateKey = Brand<string, 'EtherWalletPrivateKey'>
export type PolymarketClobApiKey = Brand<string, 'PolymarketClobApiKey'>
export type PolymarketClobApiSecret = Brand<string, 'PolymarketClobApiSecret'>
export type PolymarketClobApiPassphrase = Brand<string, 'PolymarketClobApiPassphrase'>

export type PolymarketConnectorConfiguration = {
  etherWalletPrivateKey: EtherWalletPrivateKey
  polymarketClobApiKey: PolymarketClobApiKey
  polymarketClobApiSecret: PolymarketClobApiSecret
  polymarketClobApiPassphrase: PolymarketClobApiPassphrase
  isTestChain: boolean
}
export type PolymarketConnector = ClobClient
