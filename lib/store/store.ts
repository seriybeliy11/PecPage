import { configureStore } from "@reduxjs/toolkit"
import walletReducer from "./wallet-slice"
import marketReducer from "./market-slice"
import tradeReducer from "./trade-slice"

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    market: marketReducer,
    trade: tradeReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
