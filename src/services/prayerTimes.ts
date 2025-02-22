import axios, { AxiosError } from 'axios'
import { ZoneData, APIResponse, PrayerTimeResponse } from '@/types'

const BASE_URL = 'https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat'

export const zones = {
  'Johor': ['JHR01', 'JHR02', 'JHR03', 'JHR04'],
  'Kedah': ['KDH01', 'KDH02', 'KDH03', 'KDH04', 'KDH05', 'KDH06', 'KDH07'],
  'Kelantan': ['KTN01', 'KTN02'],
  'Melaka': ['MLK01'],
  'Negeri Sembilan': ['NGS01', 'NGS02'],
  'Pahang': ['PHG01', 'PHG02', 'PHG03', 'PHG04', 'PHG05', 'PHG06'],
  'Perak': ['PRK01', 'PRK02', 'PRK03', 'PRK04', 'PRK05', 'PRK06', 'PRK07'],
  'Perlis': ['PLS01'],
  'Pulau Pinang': ['PNG01'],
  'Sabah': ['SBH01', 'SBH02', 'SBH03', 'SBH04', 'SBH05', 'SBH06', 'SBH07', 'SBH08', 'SBH09'],
  'Sarawak': ['SWK01', 'SWK02', 'SWK03', 'SWK04', 'SWK05', 'SWK06', 'SWK07', 'SWK08', 'SWK09'],
  'Selangor': ['SGR01', 'SGR02', 'SGR03'],
  'Terengganu': ['TRG01', 'TRG02', 'TRG03', 'TRG04'],
  'Wilayah Persekutuan': ['WLY01', 'WLY02']
}

// Fungsi untuk menukar format zon JAKIM ke format API
function convertZoneFormat(zone: string): string {
  return zone // Gunakan kod zon asal untuk API JAKIM
}

function getStateFromZone(zone: string): string {
  for (const [state, zoneList] of Object.entries(zones)) { // Tukar nama variable untuk mengelakkan konflik
    if (zoneList.includes(zone)) {
      return state
    }
  }
  return ''
}

export async function getPrayerTimes(zone: string, year: number, month: number): Promise<ZoneData> {
  try {
    const formattedZone = convertZoneFormat(zone)
    const formattedMonth = month.toString().padStart(2, '0')
    
    const response = await axios.get<APIResponse>(BASE_URL, {
      params: {
        zone: formattedZone,
        year: year,
        month: formattedMonth,
        period: 'month'
      },
      timeout: 10000, // 10 saat timeout
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    })

    if (response.data && response.data.prayerTime) {
      return {
        zone: zone,
        state: getStateFromZone(zone),
        times: response.data.prayerTime.map((item: PrayerTimeResponse) => ({
          date: item.date,
          day: item.day,
          imsak: item.imsak,
          fajr: item.fajr,
          syuruk: item.syuruk,
          dhuhr: item.dhuhr,
          asr: item.asr,
          maghrib: item.maghrib,
          isha: item.isha
        }))
      }
    } else {
      throw new Error('Data tidak tersedia')
    }
  } catch (error) {
    console.error('Error fetching prayer times:', error)
    const err = error as AxiosError
    if (err.code === 'ECONNABORTED') {
      throw new Error('Sambungan terputus. Sila cuba lagi.')
    } else if (err.response) {
      switch (err.response.status) {
        case 404:
          throw new Error('Zon tidak dijumpai')
        case 429:
          throw new Error('Terlalu banyak permintaan. Sila cuba sebentar lagi.')
        default:
          throw new Error(`Ralat ${err.response.status}: Sila cuba lagi.`)
      }
    }
    throw new Error('Ralat tidak dijangka. Sila cuba lagi.')
  }
} 