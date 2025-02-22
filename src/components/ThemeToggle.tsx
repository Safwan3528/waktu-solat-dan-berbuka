'use client'

import { useTheme } from 'next-themes'
import { FaSun, FaMoon } from 'react-icons/fa'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Tunggu sehingga komponen dimount untuk mengelakkan masalah hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // Tidak render apa-apa sehingga client-side
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="fixed top-4 right-4 p-3 rounded-full bg-white/10 backdrop-blur-lg shadow-lg hover:bg-white/20 transition-all duration-200"
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? (
        <FaSun className="w-5 h-5 text-yellow-400" />
      ) : (
        <FaMoon className="w-5 h-5 text-blue-900 dark:text-white" />
      )}
    </button>
  )
} 