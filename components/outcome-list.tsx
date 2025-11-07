"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { createClient } from "@supabase/supabase-js"

// Supabase конфигурация
const SUPABASE_URL = "https://vmkznbnsvswmaylobzdo.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZta3puYm5zdnN3bWF5bG9iemRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxMDQzMTQsImV4cCI6MjA3NzY4MDMxNH0.HZK8tYMVuocyLdYdGw99adWmQXUuxxcQmBvO6jHU4qo"

// Создаем Supabase клиент
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

interface Outcome {
  id: string
  name: string
  percentage: number
  change: string
  yesPrice: string
  noPrice: string
}

interface OutcomeListProps {
  selectedOutcome: string
  onSelectOutcome: (outcome: string) => void
}

export function OutcomeList({ selectedOutcome, onSelectOutcome }: OutcomeListProps) {
  // Локальное состояние для хранения данных
  const [outcomes, setOutcomes] = useState<Outcome[]>([
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
  ])

  // Подписка на обновления
  useEffect(() => {
    const channel = supabase
      .channel("outcomes_updates")
      .on(
        "postgres_changes",
        {
          event: "*", // Слушаем все события (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "outcomes",
        },
        (payload) => {
          // Обновляем локальное состояние при изменении данных
          if (payload.eventType === "UPDATE" || payload.eventType === "INSERT") {
            setOutcomes((prev) =>
              prev.map((outcome) =>
                outcome.id === payload.new.id ? { ...outcome, ...payload.new } : outcome
              )
            )
          }
        }
      )
      .subscribe()

    // Отписка при размонтировании компонента
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <Card className="divide-y">
      {outcomes.map((outcome) => (
        <div key={outcome.id} className="p-3 sm:p-4 hover:bg-muted/50 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4 flex-1">
              <span className="font-medium text-sm sm:text-base min-w-20 sm:min-w-24">
                {outcome.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold">{outcome.percentage}%</span>
                <span
                  className={`text-xs sm:text-sm ${
                    outcome.change.startsWith("+") ? "text-red-500" : "text-emerald-500"
                  }`}
                >
                  {outcome.change.startsWith("+") ? "▼" : "▲"} {outcome.change.replace(/[+-]/, "")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white flex-1 sm:flex-none sm:min-w-20 text-xs sm:text-sm"
              >
                Да {outcome.yesPrice}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-purple-300 text-purple-600 hover:bg-purple-50 flex-1 sm:flex-none sm:min-w-20 bg-transparent text-xs sm:text-sm"
              >
                Нет {outcome.noPrice}
              </Button>
            </div>
          </div>
        </div>
      ))}
      <div className="p-3 sm:p-4">
        <Button variant="link" className="text-xs sm:text-sm text-muted-foreground">
          Еще 6 рынков
        </Button>
      </div>
    </Card>
  )
}
