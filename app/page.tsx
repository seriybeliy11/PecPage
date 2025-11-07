"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Share2 } from "lucide-react"
import { PredictionChart } from "@/components/prediction-chart"
import { TradingPanel } from "@/components/trading-panel"
import { OutcomeList } from "@/components/outcome-list"
import { TonConnect } from "@/components/ton-connect-button"
import { useRouter } from "next/navigation"

export default function PredictionMarketPage() {
  const [selectedOutcome, setSelectedOutcome] = useState<string>("peace-deal")
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
    <div className="min-h-screen bg-background p-4 md:p-8">
      <TonConnect />

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-2xl">🕊️</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-2xl md:text-3xl font-bold text-balance">
                    Будет ли мирное соглашение в Украине в 2025 году?
                  </h1>
                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-4">
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
            <Card className="p-6">
              <PredictionChart />
            </Card>

            {/* Outcome List */}
            <OutcomeList selectedOutcome={selectedOutcome} onSelectOutcome={setSelectedOutcome} />

            {/* Rules Summary */}
            <Card className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Краткое описание правил</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Если в 2025 году будет достигнуто мирное соглашение, рынок разрешается как{" "}
                    <span className="text-emerald-500 font-medium">Да</span>. Результат проверяется из{" "}
                    <span className="text-blue-500">официальных источников</span>.
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Мирное соглашение определяется как официально подписанный документ между сторонами конфликта,
                    предусматривающий прекращение военных действий и урегулирование территориальных вопросов...
                  </p>
                  <div className="flex gap-4 mt-4">
                    <Button variant="outline" size="sm">
                      Полные правила
                    </Button>
                    <Button variant="outline" size="sm">
                      Правила рынка
                    </Button>
                  </div>
                </div>
                <Button variant="link" className="text-sm">
                  Узнать больше
                </Button>
              </div>
            </Card>

            {/* Timeline and Payout */}
            <Card className="p-6">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-foreground rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-foreground rounded-sm" />
                </div>
                <h3 className="font-semibold">График и выплаты</h3>
              </div>
            </Card>
          </div>

          {/* Trading Panel */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <TradingPanel selectedOutcome={selectedOutcome} />
          </div>
        </div>
      </div>
    </div>
  )
}
