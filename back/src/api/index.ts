import * as path from 'node:path'
import { ApolloServer, type BaseContext } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'
import cors from 'cors'
import type { Express } from 'express'
import express from 'express'

let instance: Express | null = null
export const graphQlServer = async () => {
  if (instance) return instance
  const typeDefFiles = loadFilesSync(path.join(__dirname, '../**/graphql/typedefs.*'))
  const resolverFiles = loadFilesSync(path.join(__dirname, '../**/graphql/resolvers.*'))
  const server = new ApolloServer({
    typeDefs: mergeTypeDefs(typeDefFiles),
    resolvers: mergeResolvers<unknown, BaseContext>(resolverFiles),
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
  })
  const app = express()
  server.startInBackgroundHandlingStartupErrorsByLoggingAndFailingAllRequests()
  app.use('/', cors<cors.CorsRequest>(), express.json(), expressMiddleware(server))
  instance = app
  return instance
}
