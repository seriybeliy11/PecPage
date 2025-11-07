"use client"

import type React from "react"

import { TonConnectUIProvider } from "@tonconnect/ui-react"

export function TonConnectProvider({ children }: { children: React.ReactNode }) {
  return (
    <TonConnectUIProvider manifestUrl="https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json">
      {children}
    </TonConnectUIProvider>
  )
}
