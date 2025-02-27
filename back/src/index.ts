import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { setGlobalOptions } from 'firebase-functions'
import { onRequest } from 'firebase-functions/https'
import { onSchedule } from 'firebase-functions/scheduler'
import { graphQlServer } from './api'
import { BettorId } from './bettor/index.validator'
import { BettorQuery } from './bettor/query'
import { Bot } from './bot/command'
import { Amount } from './utils/index.validator'
import { toTable } from './utils/pretty'
import { WalletId } from './wallet/index.validator'
import { Wallet } from './wallet/query'

const app = initializeApp()
export const $firestore = getFirestore(app)

setGlobalOptions({
  region: 'europe-west3',
  memory: '256MiB',
  serviceAccount: 'function-invoker@circle-bot-a5808.iam.gserviceaccount.com',
})

export const api = onRequest(async (req, res) => {
  const app = await graphQlServer()
  return app(req, res)
})

const bettorIdFavorite = BettorId('19da3461-3e8e-4a58-823b-deed30dae53e')
const walletIdFavorite = WalletId('1b33c582-1ae2-41b6-a9b2-ad5db5c7dafe')
export const bot = process.env.FUNCTIONS_EMULATOR
  ? onRequest(async (_, response) => {
      await Bot.runWithFavoriteStrategy(bettorIdFavorite, walletIdFavorite)
      response.status(200).send('OK')
    })
  : onSchedule('every day 06:00', async () => Bot.runWithFavoriteStrategy(bettorIdFavorite, walletIdFavorite))

const bettorIdJump = BettorId('d3c7e2d5-d118-4d04-8e52-1f5e33c7de14')
const walletIdJump = WalletId('8132c695-2bcd-4d5a-aa49-3c0722a44956')
export const botJump = process.env.FUNCTIONS_EMULATOR
  ? onRequest(async (_, response) => {
      await Bot.runWithJumpStrategy(bettorIdJump, walletIdJump)
      response.status(200).send('OK')
    })
  : onSchedule('every minute', async () => Bot.runWithJumpStrategy(bettorIdJump, walletIdJump))

export const summarize = onRequest(async (request, response) => {
  const bettorId = BettorId(request.query.bettorId?.toString() ?? bettorIdFavorite)
  const walletId = WalletId(request.query.walletId?.toString() ?? walletIdFavorite)
  const [roi, totalLoss, totalGain, placedBets, transactions, balance] = await Promise.all([
    BettorQuery.getReturnOnInvestment(bettorId)(Amount(1000)),
    BettorQuery.getLoss(bettorId)(),
    BettorQuery.getGain(bettorId)(),
    BettorQuery.getAllBets(bettorId)(),
    Wallet.history(walletId)(),
    Wallet.balance(walletId)(),
  ])
  response.status(200).send(`
<!DOCTYPE html>
<html lang="fr">
  <head>
    <style>
        body {
            font-family: monospace;
            white-space: pre;
        }
    </style>
  </head>
  <body>
  <a href="?walletId=${walletIdFavorite}&bettorId=${bettorIdFavorite}">Bot favorite strategy</a>
  <a href="?walletId=${walletIdJump}&bettorId=${bettorIdJump}">Bot jump strategy</a>
  <br />
Total gain: ${totalGain}
Total loss: ${totalLoss}
Rendement: ${roi * 100}%
Actual balance: ${balance}  (Initial balance: 1000)
<br>
Placed bets
${toTable(placedBets)}

Wallet transactions history
${toTable(transactions)}
  </body>
</html>
`)
})
