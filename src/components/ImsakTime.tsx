'use client'

import { useEffect, useState } from 'react'
import { getPrayerTimes, zones } from '@/services/prayerTimes'
import { ZoneData } from '@/types'
import LoadingSpinner from './LoadingSpinner'
import ZoneSelector from './ZoneSelector'

export default function ImsakTime() {
  const [selectedState, setSelectedState] = useState('Selangor')
  const [selectedZone, setSelectedZone] = useState('SGR01')
  const [prayerData, setPrayerData] = useState<ZoneData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())

  const fetchData = async () => {
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
  }

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
  }, [selectedZone, currentDate.getMonth()])

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
        <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg">
          <p>{error}</p>
          <button 
            onClick={fetchData}
            className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg"
          >
            Cuba Lagi
          </button>
        </div>
      ) : prayerData ? (
        <div className="grid grid-cols-1 gap-4">
          {prayerData.times
            .filter(time => {
              const timeDate = new Date(time.date)
              const today = new Date()
              return timeDate >= new Date(today.setHours(0,0,0,0))
            })
            .slice(0, 7)
            .map((time) => (
              <div key={time.date} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    {new Date(time.date).toLocaleDateString('ms-MY', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h3>
                  <div className="text-xl font-bold text-purple-600">
                    {time.imsak}
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div className="text-sm">
                    <span className="text-gray-600">Waktu Imsak:</span>
                    <span className="ml-2 font-semibold">{time.imsak}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Waktu Subuh:</span>
                    <span className="ml-2 font-semibold">{time.fajr}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * Berhenti makan dan minum sebelum waktu Imsak
                </p>
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center">Tiada data</div>
      )}
    </div>
  )
} 