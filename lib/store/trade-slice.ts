import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Trade, Position } from "@/lib/types"

interface TradeState {
  trades: Trade[]
  positions: Position[]
  loading: boolean
  error: string | null
}

const initialState: TradeState = {
  trades: [],
  positions: [],
  loading: false,
  error: null,
}

export const tradeSlice = createSlice({
  name: "trade",
  initialState,
  reducers: {
    addTrade: (state, action: PayloadAction<Trade>) => {
      state.trades.unshift(action.payload)
    },
    updateTrade: (state, action: PayloadAction<{ id: string; status: Trade["status"] }>) => {
      const trade = state.trades.find((t) => t.id === action.payload.id)
      if (trade) {
        trade.status = action.payload.status
      }
    },
    setPositions: (state, action: PayloadAction<Position[]>) => {
      state.positions = action.payload
    },
    updatePosition: (state, action: PayloadAction<Position>) => {
      const index = state.positions.findIndex(
        (p) =>
          p.marketId === action.payload.marketId &&
          p.outcomeId === action.payload.outcomeId &&
          p.position === action.payload.position,
      )
      if (index >= 0) {
        state.positions[index] = action.payload
      } else {
        state.positions.push(action.payload)
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

export const { addTrade, updateTrade, setPositions, updatePosition, setLoading, setError } = tradeSlice.actions
export default tradeSlice.reducer
