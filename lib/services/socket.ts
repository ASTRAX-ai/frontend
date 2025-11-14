import { io, Socket } from "socket.io-client"
import type { RebalanceCreatedEvent } from "@/lib/types/chat"

let socket: Socket | null = null

export interface SocketConfig {
  url: string
  token: string
}

/**
 * Initialize Socket.IO connection with Bearer token authentication
 */
export function initializeSocket(config: SocketConfig): Socket {
  // Close existing connection if any
  if (socket) {
    closeSocket()
  }

  socket = io(config.url, {
    auth: {
      token: config.token,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ["websocket", "polling"],
  })

  console.log("[Socket] Initialized with url:", config.url)

  return socket
}

/**
 * Get current socket instance
 */
export function getSocket(): Socket | null {
  return socket
}

/**
 * Close socket connection
 */
export function closeSocket(): void {
  if (socket) {
    console.log("[Socket] Closing connection")
    socket.disconnect()
    socket = null
  }
}

/**
 * Register handler for rebalance:created event
 */
export function onRebalanceCreated(callback: (data: RebalanceCreatedEvent) => void): void {
  if (!socket) {
    console.warn("[Socket] Socket not initialized, cannot register rebalance:created listener")
    return
  }

  socket.on("rebalance:created", callback)
  console.log("[Socket] Registered rebalance:created listener")
}

/**
 * Unregister handler for rebalance:created event
 */
export function offRebalanceCreated(callback: (data: RebalanceCreatedEvent) => void): void {
  if (!socket) {
    console.warn("[Socket] Socket not initialized, cannot unregister rebalance:created listener")
    return
  }

  socket.off("rebalance:created", callback)
  console.log("[Socket] Unregistered rebalance:created listener")
}

/**
 * Register handler for any socket event
 */
export function onSocketEvent(event: string, callback: (data: any) => void): void {
  if (!socket) {
    console.warn(`[Socket] Socket not initialized, cannot register ${event} listener`)
    return
  }

  socket.on(event, callback)
}

/**
 * Unregister handler for any socket event
 */
export function offSocketEvent(event: string, callback: (data: any) => void): void {
  if (!socket) {
    console.warn(`[Socket] Socket not initialized, cannot unregister ${event} listener`)
    return
  }

  socket.off(event, callback)
}
