'use client'

import { zones } from '@/services/prayerTimes'
import { FaMapMarkerAlt, FaChevronDown } from 'react-icons/fa'

interface ZoneSelectorProps {
  selectedState: string
  selectedZone: string
  onStateChange: (state: string, zone: string) => void
  onZoneChange: (zone: string) => void
}

export default function ZoneSelector({
  selectedState,
  selectedZone,
  onStateChange,
  onZoneChange
}: ZoneSelectorProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-blue-900/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <div className="flex-1">
        <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
          <FaMapMarkerAlt className="text-blue-200" />
          Negeri
        </label>
        <div className="relative">
          <select
            className="w-full bg-white text-gray-900 font-medium rounded-lg py-3 px-4 pr-10 appearance-none 
                     focus:outline-none focus:ring-2 focus:ring-blue-400
                     hover:bg-gray-50 transition-all duration-200"
            value={selectedState}
            onChange={(e) => {
              const state = e.target.value
              onStateChange(state, zones[state as keyof typeof zones][0])
            }}
          >
            {Object.keys(zones).map((state) => (
              <option 
                key={state} 
                value={state} 
                className="bg-white text-gray-900"
              >
                {state}
              </option>
            ))}
          </select>
          <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600" />
        </div>
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-white mb-2">
          Zon
        </label>
        <div className="relative">
          <select
            className="w-full bg-white text-gray-900 font-medium rounded-lg py-3 px-4 pr-10 appearance-none 
                     focus:outline-none focus:ring-2 focus:ring-blue-400
                     hover:bg-gray-50 transition-all duration-200"
            value={selectedZone}
            onChange={(e) => onZoneChange(e.target.value)}
          >
            {zones[selectedState as keyof typeof zones].map((zone) => (
              <option 
                key={zone} 
                value={zone} 
                className="bg-white text-gray-900"
              >
                {zone}
              </option>
            ))}
          </select>
          <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600" />
        </div>
      </div>
    </div>
  )
} 