'use client'

import { useState, useEffect } from 'react'
import { Clock, Flame } from 'lucide-react'

interface UrgencyTimerProps {
  stock?: number
  initialMinutes?: number
}

export default function UrgencyTimer({ stock = 47, initialMinutes = 23 }: UrgencyTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: initialMinutes,
    seconds: 42,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev

        if (seconds > 0) {
          seconds -= 1
        } else if (minutes > 0) {
          minutes -= 1
          seconds = 59
        } else if (hours > 0) {
          hours -= 1
          minutes = 59
          seconds = 59
        } else {
          // Reset timer
          hours = 0
          minutes = initialMinutes
          seconds = 59
        }

        return { hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [initialMinutes])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="space-y-3">
      {/* Stock urgency */}
      <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
        <Flame size={16} className="text-red-500 flex-shrink-0" />
        <span className="text-red-700 font-semibold text-sm">
          ⚡ Solo quedan <strong>{stock} unidades</strong> disponibles
        </span>
      </div>

      {/* Countdown timer */}
      <div className="flex items-center gap-3 bg-bordo/5 border border-bordo/20 rounded-lg px-4 py-3">
        <Clock size={16} className="text-bordo flex-shrink-0" />
        <div className="flex-1">
          <p className="text-bordo font-semibold text-sm">Oferta especial termina en:</p>
          <div className="flex items-center gap-1 mt-1">
            {timeLeft.hours > 0 && (
              <>
                <span className="bg-bordo text-cream font-mono font-bold text-base px-2 py-0.5 rounded">
                  {pad(timeLeft.hours)}
                </span>
                <span className="text-bordo font-bold">:</span>
              </>
            )}
            <span className="bg-bordo text-cream font-mono font-bold text-base px-2 py-0.5 rounded">
              {pad(timeLeft.minutes)}
            </span>
            <span className="text-bordo font-bold">:</span>
            <span className="bg-bordo text-cream font-mono font-bold text-base px-2 py-0.5 rounded">
              {pad(timeLeft.seconds)}
            </span>
            <span className="text-bordo/70 text-xs ml-1">
              {timeLeft.hours > 0 ? 'h:m:s' : 'min:seg'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
