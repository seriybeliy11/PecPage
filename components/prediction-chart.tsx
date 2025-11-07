"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function PredictionChart() {
  const [timeframe, setTimeframe] = useState("ВСЕ")

  const chartData = [
    { date: "1 Дек", yesPrice: 0.35, noPrice: 0.35 },
    { date: "15 Дек", yesPrice: 0.52, noPrice: 0.48 },
    { date: "1 Янв", yesPrice: 0.78, noPrice: 0.52 },
    { date: "15 Янв", yesPrice: 0.95, noPrice: 0.65 },
    { date: "1 Фев", yesPrice: 0.38, noPrice: 0.72 },
  ]

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Цена по данным рынка (USDT)</h3>
        <div className="flex gap-1">
          {["1Д", "1Н", "1М", "ВСЕ"].map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeframe(tf)}
              className="h-6 sm:h-7 px-2 sm:px-3 text-xs"
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>

      <div className="relative h-48 sm:h-64 w-full">
        <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1.0].map((y, i) => (
            <line
              key={i}
              x1="0"
              y1={200 - y * 200}
              x2="600"
              y2={200 - y * 200}
              stroke="currentColor"
              strokeOpacity="0.1"
              strokeWidth="1"
            />
          ))}

          {/* Yes price line (green) */}
          <polyline
            points={chartData
              .map((d, i) => `${(i / (chartData.length - 1)) * 600},${200 - d.yesPrice * 200}`)
              .join(" ")}
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
          />

          {/* No price line (purple) */}
          <polyline
            points={chartData.map((d, i) => `${(i / (chartData.length - 1)) * 600},${200 - d.noPrice * 200}`).join(" ")}
            fill="none"
            stroke="#a855f7"
            strokeWidth="2"
          />

          {/* Data points for Yes */}
          {chartData.map((d, i) => {
            const x = (i / (chartData.length - 1)) * 600
            const y = 200 - d.yesPrice * 200
            return <circle key={`yes-${i}`} cx={x} cy={y} r="4" fill="#10b981" />
          })}

          {/* Data points for No */}
          {chartData.map((d, i) => {
            const x = (i / (chartData.length - 1)) * 600
            const y = 200 - d.noPrice * 200
            return <circle key={`no-${i}`} cx={x} cy={y} r="4" fill="#a855f7" />
          })}
        </svg>

        <div className="absolute bottom-0 left-0 right-0 hidden sm:flex justify-between px-2 text-xs text-muted-foreground">
          {chartData.map((d) => (
            <span key={d.date}>{d.date}</span>
          ))}
        </div>

        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground">
          <span>1.0</span>
          <span className="hidden sm:inline">0.75</span>
          <span>0.5</span>
          <span className="hidden sm:inline">0.25</span>
          <span>0</span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm">
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-emerald-500" />
          <span className="text-muted-foreground">Да: {chartData[chartData.length - 1].yesPrice.toFixed(2)} USDT</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-purple-500" />
          <span className="text-muted-foreground">Нет: {chartData[chartData.length - 1].noPrice.toFixed(2)} USDT</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs sm:text-sm">
        <span className="text-muted-foreground">2025</span>
        <span className="text-muted-foreground">Объем</span>
        <span className="font-medium">64,534.98 USDT</span>
      </div>
    </div>
  )
}
