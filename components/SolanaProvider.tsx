// src/components/solanaprovider.tsx
"use client";

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";
import { AuthProvider } from "@/lib/context/auth-context";

export function SolanaProvider({ children }: { children: React.ReactNode }) {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";
  const endpoint = useMemo(() => clusterApiUrl(network as any), [network]);

  const wallets = useMemo(() => {
    return [new PhantomWalletAdapter()];
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AuthProvider>{children}</AuthProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}