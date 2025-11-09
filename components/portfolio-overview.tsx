"use client";

import { useState, useEffect } from "react";
import { TrendingUp, ArrowUpRight } from "lucide-react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useMemo } from "react";

// USDC Mint Address (mainnet & devnet sama)
const USDC_MINT = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyK5wKC");

interface TokenInfo {
  symbol: string;
  name: string;
  amount: number;
  value: number;
  allocation: number;
  price: number;
  change: number;
}

interface PortfolioOverviewProps {
  onExecute: (data: any) => void;
}

export function PortfolioOverview({ onExecute }: PortfolioOverviewProps) {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();

  const [portfolio, setPortfolio] = useState<{
    totalValue: number;
    change24h: number;
    changePercent: number;
    tokens: TokenInfo[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // === FETCH REAL PORTFOLIO ===
  useEffect(() => {
    if (!connected || !publicKey) {
      setLoading(false);
      return;
    }

    const fetchPortfolio = async () => {
      try {
        setLoading(true);

        // 1. Get SOL Balance
        const solBalance = await connection.getBalance(publicKey);
        const solAmount = solBalance / LAMPORTS_PER_SOL;

        // 2. Get USDC Balance
        const usdcATA = await getAssociatedTokenAddress(USDC_MINT, publicKey);
        let usdcAmount = 0;
        try {
          const usdcAccount = await getAccount(connection, usdcATA);
          usdcAmount = Number(usdcAccount.amount) / 1e6; // USDC has 6 decimals
        } catch (e) {
          // No USDC account → balance 0
          usdcAmount = 0;
        }

        // 3. HARDCODE HARGA (nanti bisa dari API seperti Coingecko)
        const solPrice = 178.8; // USD
        const usdcPrice = 1.0;

        const solValue = solAmount * solPrice;
        const usdcValue = usdcAmount * usdcPrice;
        const totalValue = solValue + usdcValue;

        const solAllocation = totalValue > 0 ? (solValue / totalValue) * 100 : 0;
        const usdcAllocation = totalValue > 0 ? (usdcValue / totalValue) * 100 : 0;

        // Simulasi 24h change (bisa dari API nanti)
        const change24h = 342;
        const changePercent = 2.8;

        const tokens: TokenInfo[] = [
          {
            symbol: "SOL",
            name: "Solana",
            amount: solAmount,
            value: solValue,
            allocation: solAllocation,
            price: solPrice,
            change: 5.2,
          },
          {
            symbol: "USDC",
            name: "USD Coin",
            amount: usdcAmount,
            value: usdcValue,
            allocation: usdcAllocation,
            price: usdcPrice,
            change: 0,
          },
        ].filter(t => t.amount > 0); // hide token dengan 0 balance

        setPortfolio({
          totalValue,
          change24h,
          changePercent,
          tokens,
        });
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [publicKey, connected, connection]);

  const handleRebalance = () => {
    if (!portfolio) return;

    const newAllocation = { SOL: 60, USDC: 40 };
    onExecute({
      type: "rebalance",
      from: portfolio.tokens,
      to: newAllocation,
      estimatedFee: 0,
      riskLevel: "Medium",
    });
  };

  // === LOADING STATE ===
  if (!connected) {
    return (
      <div className="glass rounded-xl p-6 text-center">
        <p className="text-gray-400">Connect wallet to view portfolio</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="glass rounded-xl p-6 text-center">
        <p className="text-gray-400">Loading portfolio...</p>
      </div>
    );
  }

  if (!portfolio || portfolio.totalValue === 0) {
    return (
      <div className="glass rounded-xl p-6 text-center">
        <p className="text-gray-400">No tokens found in wallet</p>
      </div>
    );
  }

  // === RENDER REAL DATA ===
  return (
    <div className="space-y-6">
      {/* Portfolio Card */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Portfolio Value</h2>
          <TrendingUp className="w-5 h-5 text-green-400" />
        </div>

        <div className="mb-4">
          <div className="text-4xl font-bold mb-2">
            ${portfolio.totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-semibold">
              +${portfolio.change24h} ({portfolio.changePercent}%)
            </span>
            <span className="text-gray-400 text-sm">24h</span>
          </div>
        </div>

        <div className="space-y-3">
          {portfolio.tokens.map((token) => (
            <div
              key={token.symbol}
              className="flex items-center justify-between py-2 border-t border-white/10"
            >
              <div className="flex-1">
                <div className="font-semibold">{token.symbol}</div>
                <div className="text-xs text-gray-400">
                  {token.amount.toFixed(4)} tokens
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-green-400">
                  {token.allocation.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-400">
                  ${token.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Rebalance */}
      <div className="glass rounded-xl p-6 border border-purple-500/30">
        <h3 className="font-bold mb-3">astrax's Recommendation</h3>
        <p className="text-sm text-gray-400 mb-4">
          Increase SOL allocation ke 60% for better long-term growth
        </p>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span>Risk Level: Medium</span>
            <span className="text-purple-400">Optimal</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Est. Fee: 0</span>
            <span className="text-cyan-400">None</span>
          </div>
        </div>
        <button
          onClick={handleRebalance}
          className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
        >
          Execute Rebalance
        </button>
      </div>
    </div>
  );
}