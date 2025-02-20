import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import cors from 'cors'
import type { Express } from 'express'
import express from 'express'

const typeDefs = `#graphql
type Book {
    title: String
    author: String
}

type Query {
    books: [Book]
}
`

const resolvers = {
  Query: {
    books: () => [
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
      { title: 'Moby', author: 'Herman Melville' },
    ],
  },
}

let instance: Express | null = null
export const graphQlServer = async () => {
  if (instance) return instance
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
  })
  const app = express()
  server.startInBackgroundHandlingStartupErrorsByLoggingAndFailingAllRequests()
  app.use('/', cors<cors.CorsRequest>(), express.json(), expressMiddleware(server))
  instance = app
  return instance
}
