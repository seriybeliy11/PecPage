import type { Transaction } from "@/lib/types"

// API functions for wallet operations - TO BE IMPLEMENTED with real backend

export async function fetchBalance(address: string): Promise<number> {
  // TODO: Replace with actual API call
  // return fetch(`/api/wallet/${address}/balance`).then(res => res.json())
  throw new Error("API not implemented - use mock data from Redux")
}

export async function deposit(address: string, amount: number, txHash: string): Promise<Transaction> {
  // TODO: Replace with actual API call to credit internal balance
  // return fetch('/api/wallet/deposit', {
  //   method: 'POST',
  //   body: JSON.stringify({ address, amount, txHash })
  // }).then(res => res.json())
  throw new Error("API not implemented")
}

export async function withdraw(address: string, amount: number, destinationAddress: string): Promise<Transaction> {
  // TODO: Replace with actual API call to debit internal balance and send TON
  // return fetch('/api/wallet/withdraw', {
  //   method: 'POST',
  //   body: JSON.stringify({ address, amount, destinationAddress })
  // }).then(res => res.json())
  throw new Error("API not implemented")
}

export async function fetchTransactions(address: string): Promise<Transaction[]> {
  // TODO: Replace with actual API call
  // return fetch(`/api/wallet/${address}/transactions`).then(res => res.json())
  return []
}
