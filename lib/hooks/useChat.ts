"use client"

import { useState, useCallback, useRef } from "react"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  text: string
  timestamp: number
  hasChart?: boolean
  chartData?: Array<any>
  metadata?: {
    jobId?: string
    [key: string]: any
  }
}

export interface UseChatOptions {
  persistHistory?: boolean
  maxMessages?: number
}

/**
 * Custom hook for managing chat state and history
 */
export function useChat(options: UseChatOptions = {}) {
  const { persistHistory = false, maxMessages = 50 } = options

  // Initialize from localStorage if persistence is enabled
  const getInitialMessages = (): ChatMessage[] => {
    if (!persistHistory || typeof window === "undefined") {
      return []
    }
    try {
      const stored = localStorage.getItem("chatHistory")
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  const [messages, setMessages] = useState<ChatMessage[]>(getInitialMessages())
  const [isLoading, setIsLoading] = useState(false)
  const [socketConnected, setSocketConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastJobId, setLastJobId] = useState<string | null>(null)
  const messageIdCounter = useRef(0)

  // Persist messages to localStorage
  const persistMessages = useCallback((msgs: ChatMessage[]) => {
    if (persistHistory && typeof window !== "undefined") {
      try {
        localStorage.setItem("chatHistory", JSON.stringify(msgs))
      } catch (e) {
        console.error("[useChat] Failed to persist messages:", e)
      }
    }
  }, [persistHistory])

  // Add user message
  const addUserMessage = useCallback((text: string) => {
    const newMessage: ChatMessage = {
      id: `user-${Date.now()}-${messageIdCounter.current++}`,
      role: "user",
      text,
      timestamp: Date.now(),
    }

    setMessages((prev) => {
      const updated = [...prev, newMessage]
      if (updated.length > maxMessages) {
        updated.shift()
      }
      persistMessages(updated)
      return updated
    })
  }, [maxMessages, persistMessages])

  // Add assistant message
  const addJupMessage = useCallback(
    (
      text: string,
      metadata?: {
        hasChart?: boolean
        chartData?: Array<any>
        jobId?: string
        [key: string]: any
      },
    ) => {
      const newMessage: ChatMessage = {
        id: `assistant-${Date.now()}-${messageIdCounter.current++}`,
        role: "assistant",
        text,
        timestamp: Date.now(),
        hasChart: metadata?.hasChart,
        chartData: metadata?.chartData,
        metadata,
      }

      setMessages((prev) => {
        const updated = [...prev, newMessage]
        if (updated.length > maxMessages) {
          updated.shift()
        }
        persistMessages(updated)
        return updated
      })
    },
    [maxMessages, persistMessages],
  )

  // Clear chat history
  const clearHistory = useCallback(() => {
    setMessages([])
    setLastJobId(null)
    setError(null)
    if (persistHistory && typeof window !== "undefined") {
      try {
        localStorage.removeItem("chatHistory")
      } catch (e) {
        console.error("[useChat] Failed to clear persisted messages:", e)
      }
    }
  }, [persistHistory])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    // State
    messages,
    isLoading,
    socketConnected,
    error,
    lastJobId,

    // Setters
    setIsLoading,
    setSocketConnected,
    setError,
    setLastJobId,
    setMessages,

    // Methods
    addUserMessage,
    addJupMessage,
    clearHistory,
    clearError,
  }
}
