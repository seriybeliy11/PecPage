"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@supabase/supabase-js"

interface ChartData {
  date: string
  yesPrice: number
  noPrice: number
}

// Supabase конфигурация
const SUPABASE_URL = "https://vmkznbnsvswmaylobzdo.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZta3puYm5zdnN3bWF5bG9iemRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxMDQzMTQsImV4cCI6MjA3NzY4MDMxNH0.HZK8tYMVuocyLdYdGw99adWmQXUuxxcQmBvO6jHU4qo"

// Создаем Supabase клиент
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

export function PredictionChart() {
  const [timeframe, setTimeframe] = useState("ВСЕ")
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [volume, setVolume] = useState<number>(64534.98)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const subscriptionRef = useRef<any>(null)

  // Инициализация Supabase Realtime
  useEffect(() => {
    const initializeRealtime = async () => {
      try {
        // Загрузка начальных данных
        await fetchInitialData()

        // Подписка на изменения в реальном времени
        const subscription = supabase
          .channel('chart-data-updates')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'prediction_prices'
            },
            (payload: any) => {
              console.log('Realtime update received:', payload)
              handleRealtimeUpdate(payload)
            }
          )
          .subscribe((status: string) => {
            console.log('Supabase subscription status:', status)
            setIsConnected(status === 'SUBSCRIBED')
          })

        subscriptionRef.current = subscription

      } catch (error) {
        console.error('Error initializing realtime:', error)
        setIsConnected(false)
        // Используем fallback данные при ошибке
        setChartData(getDefaultData())
      } finally {
        setIsLoading(false)
      }
    }

    initializeRealtime()

    // Очистка подписки при размонтировании
    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current)
      }
    }
  }, [])

  // Загрузка начальных данных
  const fetchInitialData = async () => {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .order('date', { ascending: true })

      if (error) {
        throw error
      }

      if (data && data.length > 0) {
        setChartData(data)
      } else {
        // Fallback данные если в базе нет записей
        console.log('No data found, using default data')
        setChartData(getDefaultData())
      }
    } catch (error) {
      console.error('Error fetching initial data:', error)
      setChartData(getDefaultData())
    }
  }

  // Обработка обновлений в реальном времени
  const handleRealtimeUpdate = (payload: any) => {
    switch (payload.eventType) {
      case 'INSERT':
        setChartData(prev => {
          const newData = [...prev, payload.new]
          // Сортируем по дате и ограничиваем количество точек
          return newData
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(-100) // последние 100 точек
        })
        break

      case 'UPDATE':
        setChartData(prev => 
          prev.map(item => 
            item.date === payload.old.date ? { ...item, ...payload.new } : item
          )
        )
        break

      case 'DELETE':
        setChartData(prev => 
          prev.filter(item => item.date !== payload.old.date)
        )
        break

      default:
        console.log('Unknown event type:', payload.eventType)
    }
  }

  // Fallback данные
  const getDefaultData = (): ChartData[] => [
    { date: "2024-12-01", yesPrice: 0.35, noPrice: 0.65 },
    { date: "2024-12-15", yesPrice: 0.42, noPrice: 0.58 },
    { date: "2025-01-01", yesPrice: 0.38, noPrice: 0.62 },
    { date: "2025-01-15", yesPrice: 0.45, noPrice: 0.55 },
    { date: "2025-02-01", yesPrice: 0.48, noPrice: 0.52 },
  ]

  // Форматирование даты для отображения
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      const day = date.getDate()
      const month = date.toLocaleString('ru-RU', { month: 'short' })
      return `${day} ${month.charAt(0).toUpperCase() + month.slice(1, 3)}`
    } catch {
      return dateString
    }
  }

  // Получение данных для текущего timeframe
  const getFilteredData = () => {
    if (timeframe === "ВСЕ" || chartData.length === 0) return chartData
    
    const now = new Date()
    let filterDate = new Date()
    
    switch (timeframe) {
      case "1Д":
        filterDate.setDate(now.getDate() - 1)
        break
      case "1Н":
        filterDate.setDate(now.getDate() - 7)
        break
      case "1М":
        filterDate.setMonth(now.getMonth() - 1)
        break
      default:
        return chartData
    }
    
    return chartData.filter(item => new Date(item.date) >= filterDate)
  }

  const displayData = getFilteredData()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">Цена по данным рынка (USDT)</h3>
          <div className="flex gap-1">
            {["1Д", "1Н", "1М", "ВСЕ"].map((tf) => (
              <Button key={tf} variant="ghost" size="sm" className="h-7 px-3 text-xs" disabled>
                {tf}
              </Button>
            ))}
          </div>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="text-muted-foreground">Загрузка данных...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-muted-foreground">Цена по данным рынка (USDT)</h3>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs text-muted-foreground">
            {isConnected ? 'Подключено' : 'Отключено'}
          </span>
        </div>
        <div className="flex gap-1">
          {["1Д", "1Н", "1М", "ВСЕ"].map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeframe(tf)}
              className="h-7 px-3 text-xs"
              disabled={!isConnected}
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>

      <div className="relative h-64 w-full">
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
          {displayData.length > 1 && (
            <polyline
              points={displayData
                .map((d, i) => `${(i / (displayData.length - 1)) * 600},${200 - d.yesPrice * 200}`)
                .join(" ")}
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
            />
          )}

          {/* No price line (purple) */}
          {displayData.length > 1 && (
            <polyline
              points={displayData.map((d, i) => `${(i / (displayData.length - 1)) * 600},${200 - d.noPrice * 200}`).join(" ")}
              fill="none"
              stroke="#a855f7"
              strokeWidth="2"
            />
          )}

          {/* Data points for Yes */}
          {displayData.map((d, i) => {
            const x = (i / (displayData.length - 1)) * 600
            const y = 200 - d.yesPrice * 200
            return <circle key={`yes-${i}`} cx={x} cy={y} r="4" fill="#10b981" />
          })}

          {/* Data points for No */}
          {displayData.map((d, i) => {
            const x = (i / (displayData.length - 1)) * 600
            const y = 200 - d.noPrice * 200
            return <circle key={`no-${i}`} cx={x} cy={y} r="4" fill="#a855f7" />
          })}
        </svg>

        {/* X-axis labels */}
        {displayData.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs text-muted-foreground">
            {displayData.map((d, index) => (
              <span key={d.date}>
                {formatDate(d.date)}
              </span>
            ))}
          </div>
        )}

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground">
          <span>1.0</span>
          <span>0.75</span>
          <span>0.5</span>
          <span>0.25</span>
          <span>0</span>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-muted-foreground">
            Да: {displayData[displayData.length - 1]?.yesPrice?.toFixed(2) || "0.00"} USDT
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-muted-foreground">
            Нет: {displayData[displayData.length - 1]?.noPrice?.toFixed(2) || "0.00"} USDT
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">2025</span>
        <span className="text-muted-foreground">Объем</span>
        <span className="font-medium">{volume.toLocaleString('ru-RU')} USDT</span>
      </div>
    </div>
  )
}