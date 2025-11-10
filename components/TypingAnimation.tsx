"use client"

import { useState, useEffect } from 'react'

interface TypingAnimationProps {
  text: string;
  delay?: number;
  speed?: number;
  onComplete?: () => void;
}

export function TypingAnimation({ 
  text, 
  delay = 500, 
  speed = 50,
  onComplete 
}: TypingAnimationProps) {
  const [displayText, setDisplayText] = useState('')
  const [isStarted, setIsStarted] = useState(false)

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setIsStarted(true)
    }, delay)

    return () => clearTimeout(startTimeout)
  }, [delay])

  useEffect(() => {
    if (!isStarted) return

    let currentIndex = 0
    const intervalId = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(intervalId)
        onComplete?.()
      }
    }, speed)

    return () => clearInterval(intervalId)
  }, [text, speed, isStarted, onComplete])

  return (
    <span className="typing-animation">
      {displayText}
      <span className="cursor">|</span>
      <style jsx>{`
        .typing-animation {
          display: inline-block;
          font-family: monospace;
        }
        .cursor {
          opacity: 1;
          animation: blink 1s infinite;
          color: currentColor;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  )
}