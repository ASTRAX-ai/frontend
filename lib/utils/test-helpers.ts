/**
 * Test helpers for chat integration
 * Untuk development dan testing purposes
 */

import type { RebalancePromptPayload, RebalanceCreatedEvent } from "@/lib/types/chat"

/**
 * Mock wallet balance response
 */
export function mockWalletBalance() {
  return {
    success: true,
    data: {
      token: "SOL DEVNET",
      amount: "10.5",
    },
  }
}

/**
 * Mock rebalance prompt response
 */
export function mockRebalanceResponse() {
  return {
    success: true,
    data: {
      jobId: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    },
  }
}

/**
 * Mock rebalance:created socket event
 */
export function mockRebalanceCreatedEvent(jobId?: string): RebalanceCreatedEvent {
  return {
    jobId: jobId || `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Simulate delay (untuk loading animation testing)
 */
export async function simulateDelay(ms: number = 2000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Mock chat message data
 */
export const mockChatMessages = [
  {
    id: "user-1",
    role: "user" as const,
    text: "Rebalance 10 SOL to 100% TOKEN A",
    timestamp: Date.now() - 5000,
  },
  {
    id: "assistant-1",
    role: "assistant" as const,
    text: "✓ Got it! Job ID: job_123abc\n\nProcessing your rebalance request...",
    timestamp: Date.now(),
    metadata: {
      jobId: "job_123abc",
    },
  },
]

/**
 * Mock rebalance payload untuk testing
 */
export function createMockPayload(prompt: string, amount: string = "10.5"): RebalancePromptPayload {
  return {
    prompt,
    balance: {
      token: "SOL DEVNET",
      amount,
    },
    mode: "rebalance",
  }
}

/**
 * Validate rebalance payload structure
 */
export function validateRebalancePayload(payload: any): boolean {
  return (
    typeof payload === "object" &&
    typeof payload.prompt === "string" &&
    typeof payload.mode === "string" &&
    payload.balance &&
    typeof payload.balance.token === "string" &&
    typeof payload.balance.amount === "string"
  )
}

/**
 * Validate socket event structure
 */
export function validateSocketEvent(event: any): boolean {
  return (
    typeof event === "object" &&
    typeof event.jobId === "string" &&
    event.jobId.startsWith("job_")
  )
}

/**
 * Get mock access token untuk testing
 */
export function getMockAccessToken(): string {
  return `Bearer_${btoa("test-token-" + Date.now()).slice(0, 50)}`
}

/**
 * Parse job ID dari chat message
 */
export function extractJobIdFromMessage(text: string): string | null {
  const match = text.match(/Job ID: (job_[a-zA-Z0-9_]+)/)
  return match ? match[1] : null
}
