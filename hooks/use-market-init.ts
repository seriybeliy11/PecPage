"use client"

import { useEffect } from "react"
import { useAppDispatch } from "@/lib/store/hooks"
import { setMarkets, selectMarket } from "@/lib/store/market-slice"
import { MOCK_MARKET } from "@/lib/mock-data"

// Hook to initialize market data - TO BE REPLACED with API calls
export function useMarketInit() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // TODO: Replace with actual API call
    // fetchMarkets().then(markets => {
    //   dispatch(setMarkets(markets))
    //   if (markets.length > 0) {
    //     dispatch(selectMarket(markets[0].id))
    //   }
    // })

    // Using mock data for now
    dispatch(setMarkets([MOCK_MARKET]))
    dispatch(selectMarket(MOCK_MARKET.id))
  }, [dispatch])
}
