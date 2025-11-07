"use client"

import { useState } from "react"
import { useTonConnectUI } from "@tonconnect/ui-react"
import * as Dialog from "@radix-ui/react-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface DepositModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DepositModal({ open, onOpenChange }: DepositModalProps) {
  const [amount, setAmount] = useState("")
  const [tonConnectUI] = useTonConnectUI()
  const [loading, setLoading] = useState(false)

  const FEE_PERCENT = 6
  const depositAmount = Number.parseFloat(amount) || 0
  const fee = depositAmount * (FEE_PERCENT / 100)
  const total = depositAmount + fee

  const handleDeposit = async () => {
    if (!amount || depositAmount <= 0) return

    setLoading(true)
    try {
      // Convert USD to TON (simplified - you'd need real exchange rate)
      const tonAmount = (total * 1000000000).toString() // Convert to nanotons

      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [
          {
            address: "UQD_YOUR_DEPOSIT_ADDRESS", // Replace with your deposit address
            amount: tonAmount,
          },
        ],
      }

      await tonConnectUI.sendTransaction(transaction)

      // Here you would call your backend to credit the user's internal balance
      onOpenChange(false)
      setAmount("")
    } catch (error) {
      console.error("Deposit failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md z-50 shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Dialog.Title className="text-xl font-bold">Пополнение баланса</Dialog.Title>
              <Dialog.Close asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="w-4 h-4" />
                </Button>
              </Dialog.Close>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Сумма депозита</label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                </div>
              </div>

              {depositAmount > 0 && (
                <div className="space-y-2 text-sm bg-blue-50 p-3 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Сумма:</span>
                    <span className="font-medium">${depositAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-orange-600">
                    <span>Комиссия ({FEE_PERCENT}%):</span>
                    <span className="font-medium">${fee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-blue-200 pt-2">
                    <span className="font-semibold">Итого:</span>
                    <span className="font-bold">${total.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <Button
                onClick={handleDeposit}
                disabled={!amount || depositAmount <= 0 || loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Обработка..." : "Пополнить"}
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
