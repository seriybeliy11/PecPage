"use client"

import { useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface WithdrawModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (amount: number) => void
  currentBalance: number
}

const FEE_PERCENT = 6

export function WithdrawModal({ open, onOpenChange, onSuccess, currentBalance }: WithdrawModalProps) {
  const [amount, setAmount] = useState("")
  const [address, setAddress] = useState("")
  const withdrawAmount = Number.parseFloat(amount) || 0
  const fee = withdrawAmount * (FEE_PERCENT / 100)
  const total = withdrawAmount - fee

  const handleWithdraw = () => {
    if (withdrawAmount <= 0 || !address || withdrawAmount > currentBalance) return
    onSuccess(withdrawAmount) // списываем полную сумму (комиссия уже учтена в UI)
    setAmount("")
    setAddress("")
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md z-50 shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Dialog.Title className="text-xl font-bold">Вывод</Dialog.Title>
              <Dialog.Close asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="w-4 h-4" />
                </Button>
              </Dialog.Close>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Адрес кошелька</label>
                <Input
                  type="text"
                  placeholder="UQD..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Сумма</label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    max={currentBalance}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Доступно: ${currentBalance.toFixed(2)}
                </p>
              </div>

              {withdrawAmount > 0 && (
                <div className="space-y-2 text-sm bg-blue-50 p-3 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Сумма:</span>
                    <span className="font-medium">${withdrawAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-orange-600">
                    <span>Комиссия ({FEE_PERCENT}%):</span>
                    <span className="font-medium">-${fee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-blue-200 pt-2">
                    <span className="font-semibold">Вы получите:</span>
                    <span className="font-bold">${total.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <Button
                onClick={handleWithdraw}
                disabled={
                  withdrawAmount <= 0 ||
                  !address ||
                  withdrawAmount > currentBalance
                }
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Вывести
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
