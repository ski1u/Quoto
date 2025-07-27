"use client"

import React, { useState } from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "@/components/ThemeProvider"
import { ApolloProvider } from "@apollo/client"
import { client } from "@/utils/graphql/apollo-client"
import { AuthProvider } from "./AuthProvider"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <AuthProvider>
        <ApolloProvider client={client}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </ApolloProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}