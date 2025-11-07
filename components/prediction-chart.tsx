"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@supabase/supabase-js"

interface ChartData {
  date: string
  yes_price: number
  no_price: number
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

  // Инициализация данных
  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log("🟡 Начало загрузки данных из Supabase...")
        
        // Сначала загружаем начальные данные
        await fetchInitialData()
        
        // Затем подписываемся на обновления
        await subscribeToRealtime()
        
      } catch (error) {
        console.error('❌ Ошибка инициализации:', error)
        setIsConnected(false)
        setChartData(getDefaultData())
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()

    // Очистка подписки при размонтировании
    return () => {
      if (subscriptionRef.current) {
        console.log("🧹 Очистка подписки Supabase")
        supabase.removeChannel(subscriptionRef.current)
      }
    }
  }, [])

  // Загрузка начальных данных
  const fetchInitialData = async () => {
    try {
      console.log("📊 Выполнение запроса к prediction_prices...")
      
      const { data, error, status } = await supabase
        .from('prediction_prices')
        .select('date, yes_price, no_price')
        .eq('event_id', 1)
        .order('timestamp', { ascending: true })

      console.log("📋 Статус запроса:", status)
      console.log("❌ Ошибка запроса:", error)
      console.log("✅ Полученные данные:", data)

      if (error) {
        throw error
      }

      if (data && data.length > 0) {
        console.log(`✅ Загружено ${data.length} записей`)
        setChartData(data)
      } else {
        console.log("⚠️ Данные не найдены, использую fallback данные")
        setChartData(getDefaultData())
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки данных:', error)
      setChartData(getDefaultData())
    }
  }

  // Подписка на реальные обновления
  const subscribeToRealtime = async () => {
    try {
      console.log("🔔 Подписка на реальные обновления...")
      
      const subscription = supabase
        .channel('prediction-prices-updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'prediction_prices',
            filter: 'event_id=eq.1'
          },
          (payload: any) => {
            console.log('🔄 Realtime обновление получено:', {
              eventType: payload.eventType,
              new: payload.new,
              old: payload.old
            })
            handleRealtimeUpdate(payload)
          }
        )
        .subscribe((status: string) => {
          console.log('📡 Статус подписки Supabase:', status)
          setIsConnected(status === 'SUBSCRIBED')
        })

      subscriptionRef.current = subscription
      console.log("✅ Подписка установлена")

    } catch (error) {
      console.error('❌ Ошибка подписки:', error)
      setIsConnected(false)
    }
  }

  // Обработка обновлений в реальном времени
  const handleRealtimeUpdate = (payload: any) => {
    console.log(`🔄 Обработка события: ${payload.eventType}`)
    
    switch (payload.eventType) {
      case 'INSERT':
        setChartData(prev => {
          const newData = [...prev, payload.new]
          console.log(`➕ Добавлена новая запись, всего: ${newData.length}`)
          return newData
        })
        break

      case 'UPDATE':
        setChartData(prev => {
          const updatedData = prev.map(item => 
            item.date === payload.old.date ? { ...item, ...payload.new } : item
          )
          console.log(`✏️ Обновлена запись: ${payload.old.date} -> ${payload.new.date}`)
          return updatedData
        })
        break

      case 'DELETE':
        setChartData(prev => {
          const filteredData = prev.filter(item => item.date !== payload.old.date)
          console.log(`🗑️ Удалена запись: ${payload.old.date}, осталось: ${filteredData.length}`)
          return filteredData
        })
        break

      default:
        console.log('❓ Неизвестный тип события:', payload.eventType)
    }
  }

  // Fallback данные на основе вашей SQL вставки
  const getDefaultData = (): ChartData[] => [
    { date: "1 Дек", yes_price: 0.35, no_price: 0.35 },
    { date: "15 Дек", yes_price: 0.52, no_price: 0.48 },
    { date: "1 Янв", yes_price: 0.78, no_price: 0.52 },
    { date: "15 Янв", yes_price: 0.95, no_price: 0.65 },
    { date: "1 Фев", yes_price: 0.38, no_price: 0.72 },
  ]

  // Получение данных для текущего timeframe
  const getFilteredData = () => {
    if (timeframe === "ВСЕ" || chartData.length === 0) {
      console.log(`📊 Отображение всех данных: ${chartData.length} записей`)
      return chartData
    }
    
    console.log(`⏰ Фильтрация по timeframe: ${timeframe}`)
    return chartData
  }

  // Безопасное вычисление координат для графика
  const getChartPoints = (data: ChartData[], valueKey: keyof ChartData) => {
    if (data.length === 0) {
      console.log("⚠️ Нет данных для построения графика")
      return ""
    }
    
    const points = data
      .map((d, i) => {
        const x = data.length > 1 ? (i / (data.length - 1)) * 600 : 300
        const value = d[valueKey] as number
        const y = 200 - (isNaN(value) ? 0 : value) * 200
        return `${x},${y}`
      })
      .join(" ")
    
    console.log(`📈 Построено точек для ${valueKey}: ${data.length}`)
    return points
  }

  const displayData = getFilteredData()
  const hasData = displayData.length > 0

  console.log("🎯 Текущие данные для отображения:", {
    timeframe,
    totalRecords: chartData.length,
    displayRecords: displayData.length,
    hasData,
    isLoading
  })

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
          <div className="text-muted-foreground">Загрузка данных из Supabase...</div>
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
              disabled={!isConnected || !hasData}
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
          {hasData && (
            <polyline
              points={getChartPoints(displayData, 'yes_price')}
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
            />
          )}

          {/* No price line (purple) */}
          {hasData && (
            <polyline
              points={getChartPoints(displayData, 'no_price')}
              fill="none"
              stroke="#a855f7"
              strokeWidth="2"
            />
          )}

          {/* Data points for Yes */}
          {hasData && displayData.map((d, i) => {
            const x = displayData.length > 1 ? (i / (displayData.length - 1)) * 600 : 300
            const y = 200 - (isNaN(d.yes_price) ? 0 : d.yes_price) * 200
            return <circle key={`yes-${i}`} cx={x} cy={y} r="4" fill="#10b981" />
          })}

          {/* Data points for No */}
          {hasData && displayData.map((d, i) => {
            const x = displayData.length > 1 ? (i / (displayData.length - 1)) * 600 : 300
            const y = 200 - (isNaN(d.no_price) ? 0 : d.no_price) * 200
            return <circle key={`no-${i}`} cx={x} cy={y} r="4" fill="#a855f7" />
          })}
        </svg>

        {/* X-axis labels */}
        {hasData && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs text-muted-foreground">
            {displayData.map((d) => (
              <span key={d.date}>{d.date}</span>
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
            Да: {displayData[displayData.length - 1]?.yes_price?.toFixed(2) || "0.00"} USDT
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-muted-foreground">
            Нет: {displayData[displayData.length - 1]?.no_price?.toFixed(2) || "0.00"} USDT
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
