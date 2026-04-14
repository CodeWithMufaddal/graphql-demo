import { ApolloProvider } from '@apollo/client/react'
import type { PropsWithChildren } from 'react'
import { apolloClient } from '../lib/apollo/client'

export function AppProviders({ children }: PropsWithChildren) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}

