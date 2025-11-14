"use client"

import { useState } from "react"
import { PortfolioOverview } from "./portfolio-overview"
import { ChatInterface } from "./chat-interface"
import { TransactionModal } from "./transaction-modal"
import { LogOut } from "lucide-react"

interface DashboardProps {
  walletPublicKey: string
  onDisconnect: () => void
}

export function Dashboard({ walletPublicKey, onDisconnect }: DashboardProps) {
  const [showTransaction, setShowTransaction] = useState(false)
  const [transactionData, setTransactionData] = useState<any>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleExecuteRebalance = (data: any) => {
    setTransactionData(data)
    setShowTransaction(true)
  }

  const handleConfirmTransaction = async () => {
    // Simulate Phantom sign + transaction execution
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setShowConfetti(true)
    setShowTransaction(false)

    // Hide confetti after 2s
    setTimeout(() => setShowConfetti(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-purple-950/20">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Astrax
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              {walletPublicKey.slice(0, 6)}...{walletPublicKey.slice(-4)}
            </div>
            <button
              onClick={onDisconnect}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Portfolio */}
          <div className="lg:col-span-1">
            <PortfolioOverview onExecute={handleExecuteRebalance} />
          </div>

          {/* Right: Chat */}
          <div className="lg:col-span-2">
            <ChatInterface onExecute={handleExecuteRebalance} />
          </div>
        </div>
      </main>

      {/* Transaction Modal */}
      {showTransaction && (
        <TransactionModal
          data={transactionData}
          onConfirm={handleConfirmTransaction}
          onCancel={() => setShowTransaction(false)}
        />
      )}

      {/* Confetti */}
      {showConfetti && <Confetti />}
    </div>
  )
}

function Confetti() {
  const confetti = Array.from({ length: 30 }).map((_, i) => (
    <div
      key={i}
      className="fixed pointer-events-none animate-confetti"
      style={{
        left: Math.random() * 100 + "%",
        top: "-10px",
        width: Math.random() * 8 + 4 + "px",
        height: Math.random() * 8 + 4 + "px",
        backgroundColor: ["#a855f7", "#06b6d4", "#ec4899", "#fbbf24"][Math.floor(Math.random() * 4)],
        borderRadius: Math.random() > 0.5 ? "50%" : "0",
        opacity: 0.8,
      }}
    />
  ))

  return <>{confetti}</>
}
