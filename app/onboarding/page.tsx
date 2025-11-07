"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import * as Slider from "@radix-ui/react-slider"

export default function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter()

  const slides = [
    {
      title: "Что такое рынки предсказаний?",
      description:
        "Рынки предсказаний — это платформы, где люди могут делать ставки на исход будущих событий. Цены отражают коллективное мнение участников о вероятности события.",
    },
    {
      title: "Как это работает?",
      description:
        "Вы покупаете контракты «Да» или «Нет» на событие. Если ваш прогноз верен, вы получаете выплату. Цена контракта отражает текущую вероятность события.",
    },
    {
      title: "Начните торговать",
      description:
        "Выберите интересующее вас событие, купите контракты и следите за развитием ситуации. Торгуйте в любое время до закрытия рынка.",
    },
  ]

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      router.push("/")
    }
  }

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const handleSkip = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="space-y-12">
          {/* Slide Content */}
          <div className="text-center space-y-6 min-h-[400px] flex flex-col items-center justify-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-black text-balance">{slides[currentSlide].title}</h1>
            <p className="text-xl md:text-2xl text-black/80 text-balance max-w-2xl leading-relaxed">
              {slides[currentSlide].description}
            </p>
          </div>

          {/* Progress Indicator using Radix Slider */}
          <div className="space-y-4">
            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-5"
              value={[currentSlide]}
              max={slides.length - 1}
              step={1}
              disabled
            >
              <Slider.Track className="bg-muted relative grow rounded-full h-2">
                <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
              </Slider.Track>
            </Slider.Root>

            {/* Dots */}
            <div className="flex items-center justify-center gap-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`rounded-full transition-all ${
                    index === currentSlide ? "w-3 h-3 bg-blue-600" : "w-2.5 h-2.5 bg-blue-300 hover:bg-blue-400"
                  }`}
                  aria-label={`Перейти к слайду ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6">
            <Button
              variant="ghost"
              onClick={handlePrev}
              disabled={currentSlide === 0}
              className="gap-2 text-black/60 hover:text-black hover:bg-blue-100"
            >
              Назад
            </Button>

            <Button variant="link" onClick={handleSkip} className="text-black/60 hover:text-black hover:bg-blue-100">
              Пропустить
            </Button>

            <Button onClick={handleNext} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
              {currentSlide === slides.length - 1 ? "Начать" : "Далее"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
