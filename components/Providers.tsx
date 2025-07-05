"use client"

import { ThemeProvider } from "@/components/ThemeProvider"
import { ApolloProvider } from "@apollo/client"
import { client } from "@/utils/graphql/apollo-client"
import { AppProvider } from "@/components/AppProvider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <AppProvider>
        <ApolloProvider client={client}>
          {children}
        </ApolloProvider>
      </AppProvider>
    </ThemeProvider>
  )
} 