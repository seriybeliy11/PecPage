"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronDown } from "lucide-react"
import { WalletInfo } from "./wallet-info"
import { useTonAddress } from "@tonconnect/ui-react"

interface TradingPanelProps {
  selectedOutcome: string
}

export function TradingPanel({ selectedOutcome }: TradingPanelProps) {
  const [side, setSide] = useState<"buy" | "sell">("buy")
  const [position, setPosition] = useState<"yes" | "no">("yes")
  const [amount, setAmount] = useState("")
  const address = useTonAddress()

  const FEE_PERCENT = 6
  const price = position === "yes" ? 0.47 : 0.58
  const amountValue = Number.parseFloat(amount) || 0
  const contracts = amountValue > 0 ? Math.floor(amountValue / price) : 0
  const fee = amountValue * (FEE_PERCENT / 100)
  const payout = contracts * 1.0 // $1 per contract if correct

  const handleTrade = () => {
    if (!address) {
      alert("Пожалуйста, подключите кошелек")
      return
    }
    if (amountValue <= 0) {
      alert("Введите сумму")
      return
    }
    // Here you would call your backend API to execute the trade
    console.log("Executing trade:", { side, position, amount: amountValue, contracts, fee })
    alert(`Сделка выполнена: ${contracts} контрактов`)
  }

  return (
    <div className="space-y-4">
      <WalletInfo />

      <Card className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">🕊️</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground">Будет ли мирное соглашение...</p>
            <p className="font-medium text-sm">
              <span className={side === "buy" ? "text-blue-600" : "text-orange-600"}>
                {side === "buy" ? "Купить" : "Продать"}
              </span>{" "}
              ·{" "}
              <span className={position === "yes" ? "text-emerald-600" : "text-purple-600"}>
                {position === "yes" ? "Да" : "Нет"}
              </span>{" "}
              · Мирное соглашение
            </p>
          </div>
        </div>

        {/* Buy/Sell Tabs */}
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setSide("buy")}
            className={`flex-1 pb-2 text-sm font-medium transition-colors ${
              side === "buy"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Купить
          </button>
          <button
            onClick={() => setSide("sell")}
            className={`flex-1 pb-2 text-sm font-medium transition-colors ${
              side === "sell"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Продать
          </button>
        </div>

        {/* Pick a side */}
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Выберите сторону 💡</label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={position === "yes" ? "default" : "outline"}
              className={position === "yes" ? "bg-blue-500 hover:bg-blue-600" : ""}
              onClick={() => setPosition("yes")}
            >
              Да 47¢
            </Button>
            <Button
              variant={position === "no" ? "default" : "outline"}
              className={position === "no" ? "bg-purple-500 hover:bg-purple-600" : "border-purple-300 text-purple-600"}
              onClick={() => setPosition("no")}
            >
              Нет 58¢
            </Button>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Сумма</label>
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

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Контракты</span>
          <span className="font-medium">{contracts}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Средняя цена</span>
          <span className="font-medium">{(price * 100).toFixed(0)}¢</span>
        </div>

        {amountValue > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-orange-600">Комиссия ({FEE_PERCENT}%)</span>
            <span className="font-medium text-orange-600">${fee.toFixed(2)}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Выплата если {position === "yes" ? "Да" : "Нет"}</span>
            <span className="text-blue-500 cursor-help">💡</span>
          </div>
          <span className="font-medium">${payout.toFixed(2)}</span>
        </div>

        <Button
          onClick={handleTrade}
          disabled={!address || amountValue <= 0}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white h-12 text-base font-semibold disabled:opacity-50"
        >
          {!address ? "Подключите кошелек" : side === "buy" ? "Купить" : "Продать"}
        </Button>
      </Card>
    </div>
  )
}
