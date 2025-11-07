// Market Types
export interface Outcome {
  id: string
  label: string
  percentage: number
  color: string
  yesPrice: number // Price in USDT for "Yes" position
  noPrice: number // Price in USDT for "No" position
}

export interface ChartDataPoint {
  time: string
  yesPrice: number
  noPrice: number
}

export interface Market {
  id: string
  question: string
  description: string
  icon: string
  outcomes: Outcome[]
  chartData: ChartDataPoint[]
  endDate: string
  totalVolume: number
  status: "active" | "resolved" | "cancelled"
}

// Wallet Types
export interface WalletState {
  address: string | null
  connected: boolean
  balance: number // Internal balance in USDT
}

// Trade Types
export interface Trade {
  id: string
  marketId: string
  outcomeId: string
  side: "buy" | "sell"
  position: "yes" | "no"
  amount: number // USDT
  contracts: number
  price: number // Price per contract in USDT
  fee: number // USDT
  timestamp: string
  status: "pending" | "completed" | "failed"
}

export interface Position {
  marketId: string
  outcomeId: string
  position: "yes" | "no"
  contracts: number
  averagePrice: number
  currentValue: number
  profitLoss: number
}

// Transaction Types
export interface Transaction {
  id: string
  type: "deposit" | "withdraw" | "trade"
  amount: number // USDT
  fee: number // USDT
  status: "pending" | "completed" | "failed"
  timestamp: string
  txHash?: string
}
