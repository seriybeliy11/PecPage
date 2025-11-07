import type { Market } from "./types"

// Mock market data - TO BE REPLACED with API calls
export const MOCK_MARKET: Market = {
  id: "ukraine-peace-2025",
  question: "Будет ли мирное соглашение в Украине в 2025 году?",
  description: "Если в 2025 году будет достигнуто мирное соглашение, рынок разрешается как Да.",
  icon: "🕊️",
  outcomes: [
    {
      id: "peace-deal",
      label: "Мирное соглашение к Q2 2025",
      percentage: 48,
      color: "bg-emerald-500",
      yesPrice: 0.47,
      noPrice: 0.53,
    },
    {
      id: "ceasefire",
      label: "Частичное перемирие к лету",
      percentage: 33,
      color: "bg-blue-500",
      yesPrice: 0.33,
      noPrice: 0.67,
    },
    {
      id: "no-agreement",
      label: "Нет соглашения до 2026",
      percentage: 19,
      color: "bg-gray-800",
      yesPrice: 0.19,
      noPrice: 0.81,
    },
  ],
  chartData: [
    { time: "Янв", yesPrice: 0.52, noPrice: 0.48 },
    { time: "Фев", yesPrice: 0.49, noPrice: 0.51 },
    { time: "Мар", yesPrice: 0.51, noPrice: 0.49 },
    { time: "Апр", yesPrice: 0.48, noPrice: 0.52 },
    { time: "Май", yesPrice: 0.45, noPrice: 0.55 },
    { time: "Июн", yesPrice: 0.43, noPrice: 0.57 },
    { time: "Июл", yesPrice: 0.47, noPrice: 0.53 },
  ],
  endDate: "2025-12-31",
  totalVolume: 125000,
  status: "active",
}

// Mock initial balance - TO BE REPLACED with API call
export const MOCK_INITIAL_BALANCE = 0

// Fee configuration
export const FEE_PERCENT = 6
