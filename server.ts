import express, { Application } from 'express'
import dotenv from 'dotenv'
import { ApolloServer } from 'apollo-server-express'
import { fieldAuthorizePlugin, makeSchema } from 'nexus'
import path from 'path'
import { createContext } from './graphql/context'

import * as allTypes from './graphql/types'
import * as allMutations from './graphql/mutations'
import * as allResolvers from './graphql/resolvers'

dotenv.config()
;(async () => {
  const schema = makeSchema({
    types: [allTypes, allMutations, allResolvers],
    outputs: {
      schema: path.join(process.cwd(), 'graphql/generated/schema.graphql'),
      typegen: path.join(process.cwd(), 'graphql/generated/nexus.ts'),
    },
    plugins: [fieldAuthorizePlugin()],
  })

  const apolloServer = new ApolloServer({
    schema,
    context: createContext,
  })

  const app: Application = express()
  const port = process.env.PORT ?? 8000

  await apolloServer.start()
  apolloServer.applyMiddleware({ app })

  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
  })
})()
