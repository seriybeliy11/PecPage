"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface OutcomeListProps {
  selectedOutcome: string
  onSelectOutcome: (outcome: string) => void
}

export function OutcomeList({ selectedOutcome, onSelectOutcome }: OutcomeListProps) {
  const outcomes = [
    {
      id: "peace-deal",
      name: "Мирное соглашение",
      percentage: 48,
      change: "+2",
      yesPrice: "0.47",
      noPrice: "0.58",
    },
    {
      id: "ceasefire",
      name: "Перемирие",
      percentage: 33,
      change: "+45",
      yesPrice: "0.80",
      noPrice: "0.66",
    },
    {
      id: "no-agreement",
      name: "Нет соглашения",
      percentage: 19,
      change: "-58",
      yesPrice: "0.29",
      noPrice: "0.83",
    },
  ]

  return (
    <Card className="divide-y">
      {outcomes.map((outcome) => (
        <div key={outcome.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-4 flex-1">
            <span className="font-medium min-w-24">{outcome.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{outcome.percentage}%</span>
              <span className={`text-sm ${outcome.change.startsWith("+") ? "text-red-500" : "text-emerald-500"}`}>
                {outcome.change.startsWith("+") ? "▼" : "▲"} {outcome.change.replace(/[+-]/, "")}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="default" size="sm" className="bg-blue-500 hover:bg-blue-600 text-white min-w-24">
              Да {outcome.yesPrice} USDT
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-purple-300 text-purple-600 hover:bg-purple-50 min-w-24 bg-transparent"
            >
              Нет {outcome.noPrice} USDT
            </Button>
          </div>
        </div>
      ))}
      <div className="p-4">
        <Button variant="link" className="text-sm text-muted-foreground">
          Еще 6 рынков
        </Button>
      </div>
    </Card>
  )
}
