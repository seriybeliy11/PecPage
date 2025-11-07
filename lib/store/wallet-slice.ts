import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { WalletState, Transaction } from "@/lib/types"

interface WalletSliceState extends WalletState {
  transactions: Transaction[]
}

const initialState: WalletSliceState = {
  address: null,
  connected: false,
  balance: 0,
  transactions: [],
}

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    connectWallet: (state, action: PayloadAction<string>) => {
      state.address = action.payload
      state.connected = true
    },
    disconnectWallet: (state) => {
      state.address = null
      state.connected = false
      state.balance = 0
    },
    updateBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload)
    },
    updateTransaction: (
      state,
      action: PayloadAction<{ id: string; status: Transaction["status"]; txHash?: string }>,
    ) => {
      const transaction = state.transactions.find((tx) => tx.id === action.payload.id)
      if (transaction) {
        transaction.status = action.payload.status
        if (action.payload.txHash) {
          transaction.txHash = action.payload.txHash
        }
      }
    },
  },
})

export const { connectWallet, disconnectWallet, updateBalance, addTransaction, updateTransaction } = walletSlice.actions
export default walletSlice.reducer
