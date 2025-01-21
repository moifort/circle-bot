import { type ApiKeyCreds, Chain, ClobClient } from '@polymarket/clob-client'
import { ethers } from 'ethers'
import type { PolymarketConnector, PolymarketConnectorConfiguration } from './polymarket.type.ts'

export const getPolymarketConnector = ({
  etherWalletPrivateKey,
  polymarketClobApiKey,
  polymarketClobApiPassphrase,
  polymarketClobApiSecret,
  isTestChain,
}: PolymarketConnectorConfiguration) => {
  const credentials: ApiKeyCreds = {
    key: polymarketClobApiKey,
    secret: polymarketClobApiSecret,
    passphrase: polymarketClobApiPassphrase,
  }
  const signer = new ethers.Wallet(etherWalletPrivateKey)
  const client = new ClobClient(
    'https://clob.polymarket.com',
    isTestChain ? Chain.AMOY : Chain.POLYGON,
    signer,
    credentials,
  )
  return client as PolymarketConnector
}
