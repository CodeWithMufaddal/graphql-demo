const DEFAULT_GRAPHQL_API_URL = 'https://graphqlzero.almansi.me/api'

const configuredGraphqlApiUrl = import.meta.env.VITE_GRAPHQL_API_URL

if (!configuredGraphqlApiUrl && import.meta.env.DEV) {
  console.warn(
    `VITE_GRAPHQL_API_URL is not set. Falling back to ${DEFAULT_GRAPHQL_API_URL}.`,
  )
}

export const appEnv = {
  graphqlApiUrl: configuredGraphqlApiUrl ?? DEFAULT_GRAPHQL_API_URL,
} as const
