"use client"

import { useEffect } from "react"
import { useTonAddress } from "@tonconnect/ui-react"
import { useAppDispatch } from "@/lib/store/hooks"
import { connectWallet, disconnectWallet, updateBalance } from "@/lib/store/wallet-slice"
import { MOCK_INITIAL_BALANCE } from "@/lib/mock-data"

// Hook to sync TON Connect wallet with Redux - TO BE ENHANCED with API calls
export function useWalletSync() {
  const address = useTonAddress()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (address) {
      dispatch(connectWallet(address))

      // TODO: Replace with actual API call to fetch balance
      // fetchBalance(address).then(balance => {
      //   dispatch(updateBalance(balance))
      // })

      // Using mock balance for now
      dispatch(updateBalance(MOCK_INITIAL_BALANCE))
    } else {
      dispatch(disconnectWallet())
    }
  }, [address, dispatch])
}
