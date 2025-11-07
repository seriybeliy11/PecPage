"use client"

import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Wallet, ArrowDownToLine, ArrowUpFromLine } from "lucide-react"
import { useState } from "react"
import { DepositModal } from "./deposit-modal"
import { WithdrawModal } from "./withdraw-modal"

export function WalletInfo() {
  const address = useTonAddress()
  const [tonConnectUI] = useTonConnectUI()
  const [showDeposit, setShowDeposit] = useState(false)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [balance] = useState(0)

  if (!address) {
    return null
  }

  const shortAddress = `${address.slice(0, 4)}...${address.slice(-4)}`

  return (
    <>
      <Card className="p-3 sm:p-4 space-y-2 sm:space-y-3 bg-blue-50 border-blue-200">
        {/* Wallet Address */}
        <div className="flex items-center gap-2">
          <Wallet className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
          <span className="text-xs sm:text-sm font-medium text-blue-900">{shortAddress}</span>
        </div>

        {/* Internal Balance */}
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm text-blue-700">Внутренний баланс:</span>
          <span className="text-base sm:text-lg font-bold text-blue-900">${balance.toFixed(2)}</span>
        </div>

        {/* Action Buttons */}
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

      <DepositModal open={showDeposit} onOpenChange={setShowDeposit} />
      <WithdrawModal open={showWithdraw} onOpenChange={setShowWithdraw} />
    </>
  )
}
