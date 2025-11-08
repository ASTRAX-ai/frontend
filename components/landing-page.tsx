"use client"

import { useState, useEffect } from "react"
import { ConnectWallet } from "./connect-wallet"
import { Wallet, MessageSquare, Zap } from "lucide-react"

interface LandingPageProps {
  onConnect: (address: string) => void
}

export function LandingPage({ onConnect }: LandingPageProps) {
  const [showConnect, setShowConnect] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; duration: number }>>([])

  useEffect(() => {
    // Generate random particles for animated background
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 3 + Math.random() * 4,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-foreground overflow-hidden">
      <div className="fixed inset-0 -z-20 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-purple-500/40 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animation: `float-particle ${particle.duration}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="fixed inset-0 -z-10 bg-gradient-radial from-purple-900/20 via-transparent to-teal-900/20 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 via-pink-500 to-teal-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-teal-400 bg-clip-text text-transparent">
              Astrax
            </h1>
          </div>
          <button
            onClick={() => setShowConnect(true)}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            Connect
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm italic text-slate-400 mb-6 tracking-wide">From USDT to Any</p>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Your AI Portfolio
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-teal-400 bg-clip-text text-transparent drop-shadow-lg">
                Manager on Solana
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
              Connect → Ask → Trade. All in one chat.
            </p>

            <button
              onClick={() => setShowConnect(true)}
              className="px-8 sm:px-10 py-4 sm:py-5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-teal-500 text-white font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105 active:scale-95 animate-pulse-glow"
            >
              Connect Wallet & Start
            </button>
          </div>
        </div>

        <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 mb-20">
              <div className="group glass rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:border-purple-400/50 cursor-pointer">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-purple-500/30 transition-all">
                  <Wallet className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Connect Wallet</h3>
                <p className="text-slate-400 leading-relaxed">Phantom. Secure. No keys exposed.</p>
              </div>

              <div className="group glass rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:border-pink-400/50 cursor-pointer">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500/20 to-pink-600/20 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-pink-500/30 transition-all">
                  <MessageSquare className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Ask AI</h3>
                <p className="text-slate-400 leading-relaxed">Natural language: "Rebalance to 50/50"</p>
              </div>

              <div className="group glass rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:border-teal-400/50 cursor-pointer">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500/20 to-teal-600/20 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-teal-500/30 transition-all">
                  <Zap className="w-6 h-6 text-teal-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Trade Instantly</h3>
                <p className="text-slate-400 leading-relaxed">Jupiter best route. One click.</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-8 pt-12 border-t border-white/5">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                Jupiter
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span className="w-2 h-2 rounded-full bg-pink-400" />
                MCP Server
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span className="w-2 h-2 rounded-full bg-teal-400" />
                x402
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                Devnet
              </div>
            </div>
          </div>
        </section>

        <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-white/5">
          <div className="max-w-6xl mx-auto flex justify-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">
              Docs
            </a>
            <span>·</span>
            <a href="#" className="hover:text-slate-300 transition-colors">
              GitHub
            </a>
            <span>·</span>
            <a href="#" className="hover:text-slate-300 transition-colors">
              Twitter
            </a>
          </div>
        </footer>
      </main>

      {/* Connect Modal */}
      {showConnect && <ConnectWallet onConnect={onConnect} onClose={() => setShowConnect(false)} />}

      <style jsx>{`
        @keyframes float-particle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-100vh) translateX(${Math.random() > 0.5 ? 100 : -100}px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
