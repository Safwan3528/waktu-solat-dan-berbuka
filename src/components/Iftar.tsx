'use client'

import { useEffect, useState, useCallback } from 'react'
import { getPrayerTimes } from '@/services/prayerTimes'
import { ZoneData } from '@/types'
import LoadingSpinner from './LoadingSpinner'
import Countdown from './Countdown'
import { FaFacebook, FaTwitter, FaWhatsapp } from 'react-icons/fa'
import AudioPlayer from './AudioPlayer'
import ZoneSelector from './ZoneSelector'

interface ShareData {
  maghrib: string
}

interface NotificationError extends Error {
  code?: string;
  response?: {
    status: number;
    message?: string;
  };
}

export default function Iftar() {
  const [selectedState, setSelectedState] = useState('Selangor')
  const [selectedZone, setSelectedZone] = useState('SGR01')
  const [prayerData, setPrayerData] = useState<ZoneData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthChanged = currentDate.getMonth()

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
      const err = error as NotificationError
      setError(err.message || 'Terjadi kesalahan')
    }
    setLoading(false)
  }, [selectedZone, currentDate])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData, monthChanged])

  useEffect(() => {
    // Check if browser supports notifications
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission)
    }
  }, [])

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
    }
  }

  const sendNotification = (time: string) => {
    if (notificationPermission === 'granted') {
      new Notification('Waktu Berbuka!', {
        body: `Sudah masuk waktu berbuka puasa (${time}). Selamat berbuka!`,
        icon: '/iftar-icon.png' // Add an icon for your app
      })
    }
  }

  const shareToSocial = (platform: 'facebook' | 'twitter' | 'whatsapp', time: ShareData) => {
    const text = `Waktu berbuka puasa hari ini di ${prayerData?.state} (${prayerData?.zone}) ialah pada ${time.maghrib}`
    const url = window.location.href

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodeURIComponent(text)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`
    }

    window.open(shareUrls[platform], '_blank')
  }

  const handleCountdownComplete = (time: string) => {
    setIsPlaying(true)
    sendNotification(time)
  }

  const handleAzanEnd = () => {
    setIsPlaying(false)
  }

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
      
      <AudioPlayer play={isPlaying} onEnd={handleAzanEnd} />
      
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
              <div key={time.date} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {new Date(time.date).toLocaleDateString('ms-MY', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {prayerData.state} - {prayerData.zone}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">
                      {time.maghrib}
                    </div>
                    <div className="text-sm text-gray-500">Waktu Berbuka</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">
                      {time.maghrib}
                    </div>
                    <div className="text-sm text-gray-500">Waktu Berbuka</div>
                  </div>
                  
                  {isToday(time.date) && (
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">Masa berbaki</div>
                      <Countdown 
                        targetTime={time.maghrib} 
                        onComplete={() => handleCountdownComplete(time.maghrib)}
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Imsak:</span>
                    <span className="ml-2 font-semibold">{time.imsak}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Subuh:</span>
                    <span className="ml-2 font-semibold">{time.fajr}</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="text-xs text-gray-500 italic">
                    * Diingatkan untuk berbuka puasa tepat pada waktunya
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => shareToSocial('facebook', { maghrib: time.maghrib })}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    >
                      <FaFacebook size={20} />
                    </button>
                    <button
                      onClick={() => shareToSocial('twitter', { maghrib: time.maghrib })}
                      className="p-2 text-blue-400 hover:bg-blue-50 rounded-full"
                    >
                      <FaTwitter size={20} />
                    </button>
                    <button
                      onClick={() => shareToSocial('whatsapp', { maghrib: time.maghrib })}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                    >
                      <FaWhatsapp size={20} />
                    </button>
                  </div>
                </div>

                {notificationPermission === 'default' && isToday(time.date) && (
                  <button
                    onClick={requestNotificationPermission}
                    className="mt-4 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Aktifkan Notifikasi Berbuka
                  </button>
                )}

                {isPlaying && isToday(time.date) && (
                  <div className="mt-4 flex items-center justify-between bg-green-50 p-3 rounded-lg">
                    <div className="text-sm text-green-700">
                      Azan Maghrib sedang berkumandang...
                    </div>
                    <button
                      onClick={() => setIsPlaying(false)}
                      className="text-green-700 hover:text-green-800"
                    >
                      Hentikan Azan
                    </button>
                  </div>
                )}
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center">Tiada data</div>
      )}
    </div>
  )
} 