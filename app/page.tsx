"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Share2 } from "lucide-react"
import { PredictionChart } from "@/components/prediction-chart"
import { TradingPanel } from "@/components/trading-panel"
import { OutcomeList } from "@/components/outcome-list"
import { useRouter } from "next/navigation"

export default function PredictionMarketPage() {
  const [selectedOutcome, setSelectedOutcome] = useState<string>("peace-deal")
  const [showMobileTrading, setShowMobileTrading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding")
    if (!hasSeenOnboarding) {
      localStorage.setItem("hasSeenOnboarding", "true")
      router.push("/onboarding")
    }
  }, [router])

  const outcomes = [
    { id: "peace-deal", label: "Мирное соглашение к Q2 2025", percentage: 48, color: "bg-emerald-500" },
    { id: "ceasefire", label: "Частичное перемирие к лету", percentage: 33, color: "bg-blue-500" },
    { id: "no-agreement", label: "Нет соглашения до 2026", percentage: 19, color: "bg-gray-800" },
  ]

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-4 lg:gap-6">
          {/* Main Content */}
          <div className="space-y-4 lg:space-y-6">
            {/* Header */}
            <div className="flex items-start gap-2 sm:gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xl sm:text-2xl">🕊️</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 sm:gap-4">
                  <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-balance">
                    Будет ли мирное соглашение в 2025 году?
                  </h1>
                  <Button variant="ghost" size="icon" className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </div>
                <div className="hidden sm:flex flex-wrap items-center gap-4 mt-4">
                  {outcomes.map((outcome) => (
                    <div key={outcome.id} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${outcome.color}`} />
                      <span className="text-sm text-muted-foreground">
                        {outcome.label.split(" ").slice(0, 3).join(" ")} {outcome.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart */}
            <Card className="p-3 sm:p-6">
              <PredictionChart />
            </Card>

            {/* Outcome List */}
            <OutcomeList selectedOutcome={selectedOutcome} onSelectOutcome={setSelectedOutcome} />

            {/* Rules Summary */}
            <Card className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="w-full">
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Краткое описание правил</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                    Если в 2025 году будет достигнуто мирное соглашение, рынок разрешается как{" "}
                    <span className="text-emerald-500 font-medium">Да</span>. Результат проверяется из{" "}
                    <span className="text-blue-500">официальных источников</span>.
                  </p>
                  <p className="hidden sm:block text-xs text-muted-foreground leading-relaxed">
                    Мирное соглашение определяется как официально подписанный документ между сторонами конфликта,
                    предусматривающий прекращение военных действий и урегулирование территориальных вопросов...
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4">
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm bg-transparent">
                      Полные правила
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm bg-transparent">
                      Правила рынка
                    </Button>
                  </div>
                </div>
                <Button variant="link" className="text-xs sm:text-sm hidden sm:inline-flex">
                  Узнать больше
                </Button>
              </div>
            </Card>

            {/* Timeline and Payout */}
            <Card className="p-4 sm:p-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-foreground rounded flex items-center justify-center">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-foreground rounded-sm" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base">График и выплаты</h3>
              </div>
            </Card>
          </div>

          {/* Trading Panel - Desktop */}
          <div className="hidden lg:block lg:sticky lg:top-8 lg:self-start">
            <TradingPanel selectedOutcome={selectedOutcome} />
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
        <Button
          onClick={() => setShowMobileTrading(!showMobileTrading)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white h-12 text-base font-semibold"
        >
          {showMobileTrading ? "Закрыть панель" : "Открыть торговлю"}
        </Button>
      </div>

      {showMobileTrading && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background overflow-y-auto">
          <div className="p-4">
            <Button variant="ghost" onClick={() => setShowMobileTrading(false)} className="mb-4">
              ← Назад
            </Button>
            <TradingPanel selectedOutcome={selectedOutcome} />
          </div>
        </div>
      )}
    </div>
  )
}
