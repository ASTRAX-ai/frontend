"use client"

import { useState } from "react"
import { LandingPage } from "@/components/landing-page"
import { Dashboard } from "@/components/dashboard"

export default function Page() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletPublicKey, setWalletPublicKey] = useState<string | null>(null)

  const handleConnect = (publicKey: string) => {
    setWalletPublicKey(publicKey)
    setIsConnected(true)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setWalletPublicKey(null)
  }

  if (isConnected && walletPublicKey) {
    return <Dashboard walletPublicKey={walletPublicKey} onDisconnect={handleDisconnect} />
  }

  return <LandingPage onConnect={handleConnect} />
}
