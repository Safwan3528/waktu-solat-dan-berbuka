'use client'

import { useEffect, useRef } from 'react'

interface AudioPlayerProps {
  play: boolean
  onEnd?: () => void
}

export default function AudioPlayer({ play, onEnd }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/audio/azan.mp3')
      audioRef.current.addEventListener('ended', () => {
        onEnd?.()
      })
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', () => {
          onEnd?.()
        })
        audioRef.current = null
      }
    }
  }, [onEnd])

  useEffect(() => {
    if (play && audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error)
      })
    } else if (!play && audioRef.current) {
      audioRef.current.pause()
    }
  }, [play])

  return null
} 