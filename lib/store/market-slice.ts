import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Market, ChartDataPoint } from "@/lib/types"

interface MarketState {
  markets: Market[]
  selectedMarketId: string | null
  loading: boolean
  error: string | null
}

const initialState: MarketState = {
  markets: [],
  selectedMarketId: null,
  loading: false,
  error: null,
}

export const marketSlice = createSlice({
  name: "market",
  initialState,
  reducers: {
    setMarkets: (state, action: PayloadAction<Market[]>) => {
      state.markets = action.payload
    },
    selectMarket: (state, action: PayloadAction<string>) => {
      state.selectedMarketId = action.payload
    },
    updateMarketPrices: (
      state,
      action: PayloadAction<{ marketId: string; outcomeId: string; yesPrice: number; noPrice: number }>,
    ) => {
      const market = state.markets.find((m) => m.id === action.payload.marketId)
      if (market) {
        const outcome = market.outcomes.find((o) => o.id === action.payload.outcomeId)
        if (outcome) {
          outcome.yesPrice = action.payload.yesPrice
          outcome.noPrice = action.payload.noPrice
        }
      }
    },
    addChartDataPoint: (state, action: PayloadAction<{ marketId: string; dataPoint: ChartDataPoint }>) => {
      const market = state.markets.find((m) => m.id === action.payload.marketId)
      if (market) {
        market.chartData.push(action.payload.dataPoint)
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const { setMarkets, selectMarket, updateMarketPrices, addChartDataPoint, setLoading, setError } =
  marketSlice.actions
export default marketSlice.reducer
