export interface PrayerTime {
  date: string
  day: string
  imsak: string
  fajr: string
  syuruk: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
}

export interface ZoneData {
  zone: string
  state: string
  times: PrayerTime[]
} 