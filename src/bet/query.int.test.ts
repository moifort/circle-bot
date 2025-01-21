import { expect, test } from 'bun:test'
import process from 'node:process'
import {
  EtherWalletPrivateKey,
  PolymarketClobApiKey,
  PolymarketClobApiPassphrase,
  PolymarketClobApiSecret,
} from '../modules/polymarket.validator.ts'
import { get5LatestPoliticalBets } from './query.ts'

test('get5LatestPoliticalBets', async () => {
  const bets = await get5LatestPoliticalBets({
    isTestChain: true,
    etherWalletPrivateKey: EtherWalletPrivateKey(process.env.ETHER_WALLET_PRIVATE_KEY!),
    polymarketClobApiKey: PolymarketClobApiKey(process.env.POLYMARKET_CLOB_API_KEY!),
    polymarketClobApiSecret: PolymarketClobApiSecret(process.env.POLYMARKET_CLOB_API_SECRET!),
    polymarketClobApiPassphrase: PolymarketClobApiPassphrase(process.env.POLYMARKET_CLOB_API_PASSPHRASE!),
  })()
  expect(bets).toHaveLength(1)
})
