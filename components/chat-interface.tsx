"use client"

import { useState, useEffect } from "react"
import { Send } from "lucide-react"
import { AIChart } from "./ai-chart"

const PREDEFINED_RESPONSES = {
  hello: {
    text: "Yo bro, I'm Jup, your AI portfolio manager. Looking at your holdings: 72% SOL, 28% USDC. Total value $12,420 with +2.8% 24h gain. Pretty solid, but why not try a 60/40 rebalance? That's the sweet spot for long-term hodlers.",
    hasChart: true,
    chartData: [
      { name: "Current", SOL: 72, USDC: 28 },
      { name: "Suggested", SOL: 60, USDC: 40 },
    ],
  },
  rebalance: {
    text: "Alright dude, let me break this down. Your portfolio is overweight in SOL right now. I suggest 60% SOL / 40% USDC because:\n\n• Reduces volatility by ~20%\n• Keeps growth potential high\n• Better risk/reward ratio\n\nEstimated fee: 0 SOL. Want me to execute this?",
    hasChart: true,
    chartData: [
      { name: "Current", risk: 85, return: 120 },
      { name: "After Rebalance", risk: 65, return: 100 },
    ],
  },
  default: {
    text: "Hey! I can help you with:\n• Portfolio analysis & insights\n• Smart rebalancing strategies\n• Risk assessment & metrics\n• Trade recommendations\n\nWhat do you need help with today, bro?",
    hasChart: false,
  },
}

interface ChatInterfaceProps {
  onExecute: (data: any) => void
}

export function ChatInterface({ onExecute }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Array<{ role: string; text: string; hasChart?: boolean; chartData?: any }>>(
    [],
  )
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      const firstMessage = {
        role: "jup",
        text: "Yo bro, I'm Jup, your AI portfolio manager. Looking at your holdings: 72% SOL, 28% USDC. Total value $12,420 with +2.8% 24h gain. Pretty solid, but why not try a 60/40 rebalance? That's the sweet spot for long-term hodlers.",
        hasChart: true,
        chartData: [
          { name: "Current", SOL: 72, USDC: 28 },
          { name: "Suggested", SOL: 60, USDC: 40 },
        ],
      }
      setMessages([firstMessage])
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = { role: "user", text: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const lowerInput = input.toLowerCase()
    let response = PREDEFINED_RESPONSES.default

    if (lowerInput.includes("balance") || lowerInput.includes("rebalance")) {
      response = PREDEFINED_RESPONSES.rebalance
    } else if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hey")) {
      response = PREDEFINED_RESPONSES.hello
    }

    const jupMessage = {
      role: "jup",
      text: response.text,
      hasChart: response.hasChart,
      chartData: response.chartData,
    }

    setMessages((prev) => [...prev, jupMessage])
    setIsLoading(false)
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
      <h2 className="text-lg font-bold mb-4">Chat with Jup</h2>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
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
        {isLoading && (
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

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask Jup anything..."
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/15 transition-all"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-teal-500 text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
