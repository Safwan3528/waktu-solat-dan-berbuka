'use client'

import { useEffect, useState } from 'react'

interface CountdownProps {
  targetTime: string
  onComplete?: () => void
}

export default function Countdown({ targetTime, onComplete }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const calculateTimeLeft = () => {
      const [hours, minutes] = targetTime.split(':')
      const today = new Date()
      const target = new Date(today)
      target.setHours(parseInt(hours), parseInt(minutes), 0)

      if (target.getTime() < today.getTime()) {
        target.setDate(target.getDate() + 1)
      }

      const diff = target.getTime() - today.getTime()
      
      if (diff <= 0) {
        onComplete?.()
        return '00:00:00'
      }

      const hoursLeft = Math.floor(diff / (1000 * 60 * 60))
      const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000)

      return `${hoursLeft.toString().padStart(2, '0')}:${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetTime, onComplete])

  return (
    <div className="text-xl font-mono bg-gray-100 rounded-lg px-4 py-2">
      {timeLeft}
    </div>
  )
} 