/**
 * Chat and API related types
 */

export interface RebalancePromptPayload {
  prompt: string
  balance?: {
    token: string
    amount: string
  }
  mode: "rebalance" | "analysis" | "trade"
}

export interface RebalanceResponse {
  jobId: string
  timestamp: string
}

export interface WalletBalance {
  token: string
  amount: string
}

export interface JobStatus {
  jobId: string
  status: "pending" | "processing" | "completed" | "failed"
  result?: any
  error?: string
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  text: string
  timestamp: number
  hasChart?: boolean
  chartData?: Array<any>
  metadata?: {
    jobId?: string
    [key: string]: any
  }
}

export interface RebalanceCreatedEvent {
  jobId: string
  timestamp?: string
  [key: string]: any
}

export interface ApiErrorResponse {
  error: string
  message?: string
  code?: string
}

export interface ApiSuccessResponse<T> {
  success: true
  data: T
}

export interface ApiFailureResponse {
  success: false
  error: string
  message?: string
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiFailureResponse
