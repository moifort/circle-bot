import { onRequest } from 'firebase-functions/https'
import { Bot } from './query'

export const bot = onRequest(async (_, response) => {
  Bot.run()
  response.status(200).send('OK')
})
