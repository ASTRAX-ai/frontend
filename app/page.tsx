"use client"

import { useState } from "react"
import { LandingPage } from "@/components/landing-page"
import { Dashboard } from "@/components/dashboard"

export default function Page() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  const handleConnect = (address: string) => {
    setWalletAddress(address)
    setIsConnected(true)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setWalletAddress(null)
  }

  if (isConnected && walletAddress) {
    return <Dashboard walletAddress={walletAddress} onDisconnect={handleDisconnect} />
  }

  return <LandingPage onConnect={handleConnect} />
}
