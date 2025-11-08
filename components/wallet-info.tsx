"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Wallet, ArrowDownToLine, ArrowUpFromLine } from "lucide-react"
import { DepositModal } from "./deposit-modal"
import { WithdrawModal } from "./withdraw-modal"

// === EventBus для связи с TradingPanel ===
type TradeEvent = {
  type: "buy" | "sell"
  amount: number  // чистая сумма (без комиссии для продажи)
  fee: number
}

const tradeBus = new EventTarget()
export const emitTrade = (event: TradeEvent) => {
  tradeBus.dispatchEvent(new CustomEvent("trade", { detail: event }))
}

const INITIAL_BALANCE = 1000 // стартовый баланс

export function WalletInfo() {
  const [balance, setBalance] = useState(INITIAL_BALANCE)
  const [showDeposit, setShowDeposit] = useState(false)
  const [showWithdraw, setShowWithdraw] = useState(false)

  // Слушаем сделки из TradingPanel
  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent<TradeEvent>
      const { type, amount, fee } = ev.detail

      if (type === "buy") {
        setBalance(b => b - amount - fee)
      } else {
        setBalance(b => b + amount)
      }
    }

    tradeBus.addEventListener("trade", handler)
    return () => tradeBus.removeEventListener("trade", handler)
  }, [])

  const handleDeposit = (amount: number) => {
    setBalance(b => b + amount)
  }

  const handleWithdraw = (amount: number) => {
    setBalance(b => b - amount)
  }

  return (
    <>
      <Card className="p-3 sm:p-4 space-y-2 sm:space-y-3 bg-blue-50 border-blue-200">
        {/* Заглушка адреса */}
        <div className="flex items-center gap-2">
          <Wallet className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
          <span className="text-xs sm:text-sm font-medium text-blue-900">
            user...1234
          </span>
        </div>

        {/* Баланс */}
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm text-blue-700">Баланс:</span>
          <span className="text-base sm:text-lg font-bold text-blue-900">
            ${balance.toFixed(2)}
          </span>
        </div>

        {/* Кнопки */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => setShowDeposit(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-1 sm:gap-2 text-xs sm:text-sm"
            size="sm"
          >
            <ArrowDownToLine className="w-3 h-3 sm:w-4 sm:h-4" />
            Депозит
          </Button>
          <Button
            onClick={() => setShowWithdraw(true)}
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50 gap-1 sm:gap-2 text-xs sm:text-sm"
            size="sm"
          >
            <ArrowUpFromLine className="w-3 h-3 sm:w-4 sm:h-4" />
            Вывод
          </Button>
        </div>
      </Card>

      <DepositModal
        open={showDeposit}
        onOpenChange={setShowDeposit}
        onSuccess={handleDeposit}
      />
      <WithdrawModal
        open={showWithdraw}
        onOpenChange={setShowWithdraw}
        onSuccess={handleWithdraw}
        currentBalance={balance}
      />
    </>
  )
}
