/**
 * API Service for backend communication
 */

import type { RebalancePromptPayload, RebalanceResponse, WalletBalance, JobStatus } from '@/lib/types/chat'

export type { RebalancePromptPayload, RebalanceResponse, WalletBalance, JobStatus }

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://astraxwallet.betheback.my.id/api/v1"

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * Send rebalance prompt to backend
 * Sends to POST /api/v1  with Bearer token
 */
export async function sendRebalancePrompt(
  payload: RebalancePromptPayload,
  accessToken: string,
): Promise<ApiResponse<RebalanceResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/agent/rebalance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: `HTTP ${response.status}`,
      }))
      return {
        success: false,
        error: errorData.error || errorData.message || "Failed to send rebalance prompt",
      }
    }

    const data = await response.json()
    return {
      success: true,
      data: {
        jobId: data.jobId || data.job_id,
        timestamp: data.timestamp || new Date().toISOString(),
      },
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("[API] sendRebalancePrompt error:", errorMessage)
    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Fetch SOL balance from wallet on DEVNET
 */
export async function fetchWalletBalance(
  publicKey: string,
  accessToken: string,
): Promise<ApiResponse<WalletBalance>> {
  try {
    const response = await fetch(`${API_BASE_URL}/wallet/balance`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: `HTTP ${response.status}`,
      }))
      return {
        success: false,
        error: errorData.error || errorData.message || "Failed to fetch balance",
      }
    }

    const data = await response.json()
    return {
      success: true,
      data: {
        token: data.token || "SOL DEVNET",
        amount: String(data.amount || 0),
      },
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("[API] fetchWalletBalance error:", errorMessage)
    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Get job status by job ID
 */
export async function getJobStatus(
  jobId: string,
  accessToken: string,
): Promise<ApiResponse<JobStatus>> {
  try {
    const response = await fetch(`${API_BASE_URL}/agent/job/${jobId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: `HTTP ${response.status}`,
      }))
      return {
        success: false,
        error: errorData.error || errorData.message || "Failed to fetch job status",
      }
    }

    const data = await response.json()
    return {
      success: true,
      data,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("[API] getJobStatus error:", errorMessage)
    return {
      success: false,
      error: errorMessage,
    }
  }
}
