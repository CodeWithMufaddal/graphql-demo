import type { PropsWithChildren } from 'react'
import { ApolloProvider } from '@apollo/client/react'

import { GlobalConfirmationDialogHost } from '@/components/ui/global-confirmation-dialog'
import { TooltipProvider } from '@/components/ui/tooltip'
import { apolloClient } from '@/lib/apollo/client'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ApolloProvider client={apolloClient}>
      <TooltipProvider>
        {children}
        <GlobalConfirmationDialogHost />
      </TooltipProvider>
    </ApolloProvider>
  )
}
