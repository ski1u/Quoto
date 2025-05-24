"use client"

import React from "react";

import { ThemeProvider } from "@/components/ThemeProvider";

import { ApolloProvider } from "@apollo/client";
import { client } from "@/utils/graphql/apollo-client";

import { AppProvider } from "@/components/AppProvider";

export default function PreUpboarding({ children } : {
  children : React.ReactNode
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ApolloProvider client={client}>
        <AppProvider>
          {children}
        </AppProvider>
      </ApolloProvider>
    </ThemeProvider>
  )
}