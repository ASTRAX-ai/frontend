// app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { SolanaProvider } from "../components/SolanaProvider";
import "@solana/wallet-adapter-react-ui/styles.css";

export const metadata: Metadata = {
  title: "Astrax - AI Solana Portfolio Manager",
  description: "AI-powered portfolio management for Solana",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased">
        <SolanaProvider>{children}</SolanaProvider> {/* ← WRAP SEMUA */}
      </body>
    </html>
  );
}