"use client"

import { useState, useEffect } from "react"
import { Send } from "lucide-react"
import { AIChart } from "./ai-chart"
import { useWallet } from "@solana/wallet-adapter-react"
import { TypingAnimation } from "./TypingAnimation"
import { useAuth } from "@/lib/context/auth-context"
import { initializeSocket, onRebalanceCreated, offRebalanceCreated, closeSocket } from "@/lib/services/socket"
import { sendRebalancePrompt, fetchWalletBalance } from "@/lib/services/api"
import { useChat } from "@/lib/hooks/useChat"
import type { RebalanceCreatedEvent, RebalancePromptPayload } from "@/lib/types/chat"

interface ChatInterfaceProps {
  onExecute: (data: any) => void
}

export function ChatInterface({ onExecute }: ChatInterfaceProps) {
  const { connected, publicKey } = useWallet()
  const { accessToken } = useAuth()
  const chat = useChat({ persistHistory: true })
  const [input, setInput] = useState("")
  const [retryAttempt, setRetryAttempt] = useState(0)
  const [devEvents, setDevEvents] = useState<string[]>([])

  // Initialize Socket.IO connection
  useEffect(() => {
    console.log('[ChatInterface] initializing socket effect', { connected, accessToken: !!accessToken, retryAttempt })

    // fallback: if accessToken not available from context, try localStorage (helps after navigation)
    const tokenToUse = accessToken || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null)
    console.log('[ChatInterface] tokenToUse present?', !!tokenToUse, tokenToUse ? `preview: ${tokenToUse.slice(0, 20)}...` : '')

    if (!connected || !tokenToUse) {
      chat.setSocketConnected(false)
      return
    }

    try {
      // Ensure any previous socket is closed to avoid stale listeners
      try {
        closeSocket()
      } catch (e) {
        console.warn('[ChatInterface] closeSocket warning:', e)
      }

      const socket = initializeSocket({
        url: "https://astraxwallet.betheback.my.id",
        token: tokenToUse,
      })

      const handleConnect = () => {
        chat.setSocketConnected(true)
        console.log("[ChatInterface] Socket connected")
      }

      const handleDisconnect = () => {
        chat.setSocketConnected(false)
        console.log("[ChatInterface] Socket disconnected")
      }

      const handleConnectError = (err: any) => {
        console.error("[ChatInterface] Socket connect_error:", err)
        chat.setSocketConnected(false)
        // surface error to chat state for UI or further handling
        if (err && err.message) chat.setError(err.message)
        // dev event tracking
        setDevEvents((s) => [...s.slice(-19), `[connect_error] ${err?.message || String(err)}`])
      }

      const handleConnectTimeout = (err: any) => {
        console.error("[ChatInterface] Socket connect_timeout:", err)
        chat.setSocketConnected(false)
        chat.setError("Connection timed out")
        setDevEvents((s) => [...s.slice(-19), `[connect_timeout] ${err?.message || String(err)}`])
      }

      const handleRebalanceCreated = (data: any) => {
        console.log("[ChatInterface] Received rebalance:created event", data)
        chat.setLastJobId(data.jobId)
        chat.addJupMessage(
          `I've received your rebalance request. Processing now...`,
          { jobId: data.jobId },
        )
        chat.setIsLoading(false)
      }

  socket.on("connect", handleConnect)
  socket.on("disconnect", handleDisconnect)
  socket.on("connect_error", handleConnectError)
  socket.on("connect_timeout", handleConnectTimeout)
      onRebalanceCreated(handleRebalanceCreated)

      return () => {
        socket.off("connect", handleConnect)
        socket.off("disconnect", handleDisconnect)
        socket.off("connect_error", handleConnectError)
        socket.off("connect_timeout", handleConnectTimeout)
        offRebalanceCreated(handleRebalanceCreated)
      }
    } catch (error) {
      console.error("[ChatInterface] Socket initialization error:", error)
      chat.setSocketConnected(false)
    }
  }, [connected, accessToken, chat, retryAttempt])

  // Show welcome message after wallet connects
  useEffect(() => {
    if (!connected || chat.messages.length > 0) return

    const timer = setTimeout(() => {
      chat.addJupMessage(
        "Yo bro, I'm Jup, your AI portfolio manager. Looking at your holdings: 72% SOL, 28% USDC. Total value $12,420 with +2.8% 24h gain. Pretty solid, but why not try a 60/40 rebalance? That's the sweet spot for long-term hodlers.",
        {
          hasChart: true,
          chartData: [
            { name: "Current", SOL: 72, USDC: 28 },
            { name: "Suggested", SOL: 60, USDC: 40 },
          ],
        },
      )
    }, 600)

    return () => clearTimeout(timer)
  }, [connected, chat])

  const handleSend = async () => {
    if (!input.trim()) return
    if (!accessToken) {
      console.error("[ChatInterface] No access token")
      return
    }

    chat.addUserMessage(input)
    const userPrompt = input
    setInput("")
    chat.setIsLoading(true)
    chat.clearError()

    try {
      // Determine mode based on user prompt
      let mode: "rebalance" | "analysis" | "trade" = "rebalance"
      if (userPrompt.toLowerCase().includes("analysis")) {
        mode = "analysis"
      } else if (userPrompt.toLowerCase().includes("trade")) {
        mode = "trade"
      }

      // Fetch wallet balance from DEVNET
      console.log("[ChatInterface] Fetching wallet balance...")
      const balanceResponse = await fetchWalletBalance(publicKey?.toBase58() || "", accessToken)

      if (!balanceResponse.success) {
        chat.addJupMessage(`Oops! Could not fetch your balance:\n\n${balanceResponse.error || "Unknown error occurred"}`)
        chat.setIsLoading(false)
        return
      }

      const balanceData = balanceResponse.data!

      // Build the complete payload
      const payload: RebalancePromptPayload = {
        prompt: userPrompt,
        balance: {
          token: balanceData.token,
          amount: balanceData.amount,
        },
        mode,
      }

      console.log("[ChatInterface] Sending rebalance prompt with payload:", payload)

      // Send to backend
      const response = await sendRebalancePrompt(payload, accessToken)

      if (!response.success) {
        chat.addJupMessage(`Oops! Something went wrong:\n\n${response.error || "Unknown error occurred"}`)
        chat.setIsLoading(false)
        return
      }

      // Log success and wait for WebSocket event
      console.log("[ChatInterface] Prompt sent successfully, waiting for jobId from socket event...")
      //chat.addJupMessage("Processing your request...", { hasChart: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      console.error("[ChatInterface] Send error:", errorMessage)
      chat.addJupMessage(`Error: ${errorMessage}`)
      chat.setIsLoading(false)
    }
  }

  const handleExecuteFromChart = () => {
    onExecute({
      type: "rebalance",
      from: [
        { symbol: "SOL", allocation: 72 },
        { symbol: "USDC", allocation: 28 },
      ],
      to: { SOL: 60, USDC: 40 },
      estimatedFee: 0,
      riskLevel: "Medium",
    })
  }

  return (
    <div className="glass rounded-xl p-6 h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">
          {!connected ? "Connect Wallet to Chat with Jup" : "Chat with Jup"}
        </h2>
        {connected && (
          <div className="flex items-center gap-2 text-xs">
            <div
              className={`w-2 h-2 rounded-full ${chat.socketConnected ? "bg-green-500" : "bg-red-500"}`}
            />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{chat.socketConnected ? "Connected" : "Connecting..."}</span>
                    {!chat.socketConnected && (
                      <button
                        onClick={() => setRetryAttempt((s) => s + 1)}
                        className="text-xs text-slate-300 bg-white/5 px-2 py-0.5 rounded hover:bg-white/10"
                      >
                        Retry
                      </button>
                    )}
                  </div>
                  {chat.error && (
                    <span className="text-rose-400 text-[10px] mt-0.5">{chat.error}</span>
                  )}
                </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
        {chat.messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs rounded-lg p-3 ${msg.role === "user" ? "bg-purple-600/30 text-white" : "bg-white/5 text-slate-100"}`}
            >
              <div className="text-sm whitespace-pre-wrap">{msg.text}</div>
              {msg.hasChart && msg.chartData && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <AIChart data={msg.chartData} />
                  <button
                    onClick={handleExecuteFromChart}
                    className="w-full mt-2 py-2 text-xs rounded bg-gradient-to-r from-purple-600 to-teal-500 text-white hover:shadow-lg transition-all"
                  >
                    Execute This Plan
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {chat.isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
                <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dev-only socket event panel */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="mt-2 text-xs text-slate-400">
          <details className="text-left">
            <summary className="cursor-pointer">Socket Debug (dev)</summary>
            <div className="max-h-32 overflow-y-auto mt-2 p-2 bg-black/20 rounded">
              {devEvents.length === 0 ? (
                <div className="text-slate-500">No events yet</div>
              ) : (
                devEvents.slice().reverse().map((e, i) => (
                  <div key={i} className="py-0.5 border-b border-white/5">{e}</div>
                ))
              )}
            </div>
          </details>
        </div>
      )}

      {/* Helper Text */}
      {input.trim() === "" && chat.messages.length > 0 && !chat.isLoading && (
        <div className="mb-4 text-center text-sm text-slate-300">
          <TypingAnimation text={"How can I help you, OG?"} delay={0} speed={40} onComplete={() => {}} />
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder={
            !connected
              ? "Connect wallet to chat..."
              : !chat.socketConnected
                ? "Connecting to server..."
                : "Ask Jup anything..."
          }
          disabled={!connected || !chat.socketConnected}
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/15 transition-all disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={chat.isLoading || !input.trim() || !connected || !chat.socketConnected}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-teal-500 text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
