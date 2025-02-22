'use client'

import TabsComponent from '@/components/Tabs'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4 font-[Poppins]">
              Waktu Solat Malaysia
            </h1>
            <p className="text-blue-100 text-lg">
              Jadual Waktu Solat, Berbuka & Imsak Seluruh Malaysia
            </p>
          </div>
          <TabsComponent />
        </div>
      </main>
      <Footer />
    </div>
  )
}
