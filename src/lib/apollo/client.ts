import { InMemoryCache } from '@apollo/client/cache'
import { ApolloClient } from '@apollo/client/core'
import { CombinedGraphQLErrors } from '@apollo/client/errors'
import { ApolloLink } from '@apollo/client/link'
import { ErrorLink } from '@apollo/client/link/error'
import { HttpLink } from '@apollo/client/link/http'
import { appEnv } from '../../config/env'

const httpLink = new HttpLink({
  uri: appEnv.graphqlApiUrl,
  credentials: 'omit',
})

const errorLink = new ErrorLink(({ error, operation }) => {
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message, path }) => {
      console.error(
        `[GraphQL error][${operation.operationName || 'anonymous'}] ${message}`,
        { path },
      )
    })
  } else {
    console.error(
      `[Network error][${operation.operationName || 'anonymous'}]`,
      error,
    )
  }
})

const defaultOptions: ApolloClient.DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  },
  query: {
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
  },
  mutate: {
    errorPolicy: 'all',
  },
}

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions,
  devtools: {
    enabled: import.meta.env.DEV,
    name: 'graphql-demo-client',
  },
})
