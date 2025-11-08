"use client"

import { useState } from "react"
import { X, Zap, AlertCircle } from "lucide-react"

interface TransactionModalProps {
  data: any
  onConfirm: () => void
  onCancel: () => void
}

export function TransactionModal({ data, onConfirm, onCancel }: TransactionModalProps) {
  const [isConfirming, setIsConfirming] = useState(false)

  const handleConfirm = async () => {
    setIsConfirming(true)
    await onConfirm()
    setIsConfirming(false)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass rounded-2xl p-8 max-w-md w-full mx-4 relative">
        <button onClick={onCancel} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Review Rebalance</h2>

        {/* Current vs Suggested */}
        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-lg bg-white/5">
            <div className="text-sm text-gray-400 mb-2">Current Allocation</div>
            <div className="flex justify-between">
              <span className="font-semibold">SOL: 72%</span>
              <span className="text-purple-400">$8,940</span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="font-semibold">USDC: 28%</span>
              <span className="text-cyan-400">$3,480</span>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="text-gray-500">↓</div>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30">
            <div className="text-sm text-gray-400 mb-2">Suggested Allocation</div>
            <div className="flex justify-between">
              <span className="font-semibold text-purple-400">SOL: 60%</span>
              <span className="text-purple-400">+5% allocation</span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="font-semibold text-cyan-400">USDC: 40%</span>
              <span className="text-cyan-400">-5% allocation</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-6 p-4 bg-white/5 rounded-lg text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Est. Gas Fee</span>
            <span className="font-semibold">0.002 SOL</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Risk Change</span>
            <span className="font-semibold text-green-400">Lower</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Expected Return</span>
            <span className="font-semibold text-purple-400">8-12% APY</span>
          </div>
        </div>

        {/* Warning */}
        <div className="flex gap-2 mb-6 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
          <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-yellow-200">Transactions lu akan di-sign pake Phantom wallet</div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isConfirming}
            className="flex-1 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isConfirming}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50"
          >
            {isConfirming ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Execute
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
