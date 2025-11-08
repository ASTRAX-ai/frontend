// src/components/ConnectWallet.tsx
"use client";

import { X } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

interface ConnectWalletProps {
  onConnect: (address: string) => void;
  onClose: () => void;
}

export function ConnectWallet({ onConnect, onClose }: ConnectWalletProps) {
  const { publicKey, connecting, connected } = useWallet();

  // Auto close + kirim address
  if (connected && publicKey) {
    onConnect(publicKey.toBase58());
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass rounded-2xl p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-2">Connect Wallet</h2>
        <p className="text-gray-400 mb-6">Choose your wallet to get started with Astrax</p>

        <WalletMultiButton
          className="!w-full !flex !items-center !gap-3 !p-4 !rounded-lg !glass !hover:bg-white/15 !transition-all !mb-3 !bg-gradient-to-r !from-purple-600 !to-pink-600 !text-white !font-semibold"
          startIcon={
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600" />
          }
        >
          {connecting ? "Connecting..." : "Phantom"}
        </WalletMultiButton>

        <p className="text-xs text-gray-500 text-center">
          {connecting ? "Connecting..." : "Secure connection via Phantom"}
        </p>
      </div>
    </div>
  );
}