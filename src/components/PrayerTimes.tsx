'use client'

import { useEffect, useState, useCallback } from 'react'
import { getPrayerTimes } from '@/services/prayerTimes'
import { ZoneData } from '@/types'
import LoadingSpinner from './LoadingSpinner'
import ZoneSelector from './ZoneSelector'

export default function PrayerTimes() {
  const [selectedState, setSelectedState] = useState('Selangor')
  const [selectedZone, setSelectedZone] = useState('SGR01')
  const [prayerData, setPrayerData] = useState<ZoneData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getPrayerTimes(
        selectedZone,
        currentDate.getFullYear(),
        currentDate.getMonth() + 1
      )
      setPrayerData(data)
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan')
    }
    setLoading(false)
  }, [selectedZone, currentDate])

  // Update current date every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  // Fetch new data when month changes or zone changes
  useEffect(() => {
    fetchData()
  }, [selectedZone, currentDate.getMonth(), fetchData])

  const isToday = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  return (
    <div className="space-y-6">
      <ZoneSelector
        selectedState={selectedState}
        selectedZone={selectedZone}
        onStateChange={(state, zone) => {
          setSelectedState(state)
          setSelectedZone(zone)
        }}
        onZoneChange={setSelectedZone}
      />

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center text-red-300 p-6 bg-red-900/20 backdrop-blur-sm rounded-xl">
          <p>{error}</p>
          <button 
            onClick={fetchData}
            className="mt-4 px-6 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
          >
            Cuba Lagi
          </button>
        </div>
      ) : prayerData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prayerData.times
            .filter(time => {
              const timeDate = new Date(time.date)
              const today = new Date()
              return timeDate >= new Date(today.setHours(0,0,0,0))
            })
            .slice(0, 1)
            .map((time) => (
              <div key={time.date} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
                <h3 className="text-xl font-semibold mb-4">
                  {new Date(time.date).toLocaleDateString('ms-MY', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'Subuh', time: time.fajr },
                    { name: 'Syuruk', time: time.syuruk },
                    { name: 'Zohor', time: time.dhuhr },
                    { name: 'Asar', time: time.asr },
                    { name: 'Maghrib', time: time.maghrib },
                    { name: 'Isyak', time: time.isha }
                  ].map(({ name, time: prayerTime }) => (
                    <div key={name} className="bg-white/5 rounded-lg p-3">
                      <div className="text-blue-200 text-sm">{name}</div>
                      <div className="text-xl font-bold">{prayerTime}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center text-blue-200">Tiada data</div>
      )}
    </div>
  )
} 