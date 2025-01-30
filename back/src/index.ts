import 'source-map-support/register'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { setGlobalOptions } from 'firebase-functions'
import { onRequest } from 'firebase-functions/https'
import { onSchedule } from 'firebase-functions/scheduler'
import { Bettor } from './bettor/query'
import { Bot } from './bot/command'
import { toTable } from './utils/pretty'
import { Wallet } from './wallet/query'

const app = initializeApp()
export const $firestore = getFirestore(app)

setGlobalOptions({ region: 'europe-west9' })

export const bot = onSchedule('every day 06:00', async () => Bot.run())

export const summarize = onRequest(async (_, response) => {
  const [totalGain, estimatedGain, placedBets, transactions, balance] = await Promise.all([
    Bettor.totalGain(),
    Bettor.totalPotentialGain(),
    Bettor.allPlacedBet(),
    Wallet.history(),
    Wallet.balance(),
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
Total gain: ${totalGain} (Estimated gain: ${estimatedGain})
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
