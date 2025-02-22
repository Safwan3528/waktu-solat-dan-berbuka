'use client'

import { Tab } from '@headlessui/react'
import { useState } from 'react'
import PrayerTimes from './PrayerTimes'
import Iftar from './Iftar'
import ImsakTime from './ImsakTime'
import { FaClock, FaMoon, FaSun } from 'react-icons/fa'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function TabsComponent() {
  const [categories] = useState([
    { name: 'Waktu Solat', icon: FaClock },
    { name: 'Waktu Iftar', icon: FaSun },
    { name: 'Waktu Imsak', icon: FaMoon },
  ])

  return (
    <div className="w-full max-w-4xl mx-auto backdrop-blur-lg bg-white/10 rounded-2xl p-6 shadow-2xl">
      <Tab.Group>
        <Tab.List className="flex space-x-2 rounded-xl bg-blue-800/20 p-2">
          {categories.map((category) => (
            <Tab
              key={category.name}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-3 px-4 text-sm font-medium leading-5 flex items-center justify-center gap-2 transition-all duration-200',
                  selected
                    ? 'bg-white text-blue-900 shadow-lg'
                    : 'text-blue-100 hover:bg-white/[0.15] hover:text-white'
                )
              }
            >
              <category.icon className="w-4 h-4" />
              {category.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-6">
          <Tab.Panel className="focus:outline-none">
            <PrayerTimes />
          </Tab.Panel>
          <Tab.Panel className="focus:outline-none">
            <Iftar />
          </Tab.Panel>
          <Tab.Panel className="focus:outline-none">
            <ImsakTime />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
} 