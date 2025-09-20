/**
 * WebSocket Service for Real-time Updates
 * Senior-level implementation with reconnection and error handling
 */
class WebSocketService {
  constructor() {
    this.socket = null
    this.isConnected = false
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 1000
    this.heartbeatInterval = null
    this.subscriptions = new Set()
    this.messageHandlers = new Map()
    this.connectionHandlers = new Map()
  }

  /**
   * Connect to WebSocket server
   * @param {string} token - JWT authentication token
   * @param {string} type - WebSocket type ('attendance' or 'notifications')
   * @returns {Promise<void>}
   */
  async connect(token, type = 'attendance') {
    try {
      if (this.socket && this.isConnected) {
        console.log('WebSocket already connected')
        return
      }

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const host = window.location.host
      const wsUrl = `${protocol}//${host}/ws/${type}/?token=${token}`

      console.log(`Connecting to WebSocket: ${wsUrl}`)

      this.socket = new WebSocket(wsUrl)

      this.socket.onopen = () => {
        console.log('WebSocket connected')
        this.isConnected = true
        this.reconnectAttempts = 0
        this.startHeartbeat()
        this.notifyConnectionHandlers('connected')
      }

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.handleMessage(data)
        } catch (error) {
          console.error('WebSocket message parsing error:', error)
        }
      }

      this.socket.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason)
        this.isConnected = false
        this.stopHeartbeat()
        this.notifyConnectionHandlers('disconnected')

        // Attempt reconnection if not intentionally closed
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect(token, type)
        }
      }

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.notifyConnectionHandlers('error', error)
      }

    } catch (error) {
      console.error('WebSocket connection error:', error)
      throw error
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect() {
    if (this.socket) {
      this.socket.close(1000, 'Intentional disconnect')
      this.socket = null
    }
    this.isConnected = false
    this.stopHeartbeat()
    this.subscriptions.clear()
  }

  /**
   * Subscribe to a specific session
   * @param {number} sessionId - Session ID to subscribe to
   */
  subscribeToSession(sessionId) {
    if (!this.isConnected) {
      console.warn('WebSocket not connected')
      return
    }

    this.send({
      type: 'subscribe_session',
      session_id: sessionId
    })

    this.subscriptions.add(`session_${sessionId}`)
    console.log(`Subscribed to session ${sessionId}`)
  }

  /**
   * Unsubscribe from a specific session
   * @param {number} sessionId - Session ID to unsubscribe from
   */
  unsubscribeFromSession(sessionId) {
    if (!this.isConnected) {
      console.warn('WebSocket not connected')
      return
    }

    this.send({
      type: 'unsubscribe_session',
      session_id: sessionId
    })

    this.subscriptions.delete(`session_${sessionId}`)
    console.log(`Unsubscribed from session ${sessionId}`)
  }

  /**
   * Send message to WebSocket server
   * @param {Object} data - Message data
   */
  send(data) {
    if (this.socket && this.isConnected) {
      this.socket.send(JSON.stringify(data))
    } else {
      console.warn('WebSocket not connected, cannot send message')
    }
  }

  /**
   * Handle incoming WebSocket messages
   * @param {Object} data - Message data
   */
  handleMessage(data) {
    const { type, ...messageData } = data

    // Handle system messages
    switch (type) {
      case 'connection_established':
        console.log('WebSocket connection established:', messageData)
        break
      case 'subscription_confirmed':
        console.log('Subscription confirmed:', messageData)
        break
      case 'unsubscription_confirmed':
        console.log('Unsubscription confirmed:', messageData)
        break
      case 'pong':
        // Heartbeat response
        break
      case 'error':
        console.error('WebSocket error:', messageData)
        break
    }

    // Notify message handlers
    const handlers = this.messageHandlers.get(type) || []
    handlers.forEach(handler => {
      try {
        handler(messageData)
      } catch (error) {
        console.error(`Error in message handler for ${type}:`, error)
      }
    })
  }

  /**
   * Add message handler
   * @param {string} messageType - Type of message to handle
   * @param {Function} handler - Handler function
   */
  onMessage(messageType, handler) {
    if (!this.messageHandlers.has(messageType)) {
      this.messageHandlers.set(messageType, [])
    }
    this.messageHandlers.get(messageType).push(handler)
  }

  /**
   * Remove message handler
   * @param {string} messageType - Type of message
   * @param {Function} handler - Handler function to remove
   */
  offMessage(messageType, handler) {
    const handlers = this.messageHandlers.get(messageType)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  /**
   * Add connection handler
   * @param {string} event - Connection event ('connected', 'disconnected', 'error')
   * @param {Function} handler - Handler function
   */
  onConnection(event, handler) {
    if (!this.connectionHandlers.has(event)) {
      this.connectionHandlers.set(event, [])
    }
    this.connectionHandlers.get(event).push(handler)
  }

  /**
   * Remove connection handler
   * @param {string} event - Connection event
   * @param {Function} handler - Handler function to remove
   */
  offConnection(event, handler) {
    const handlers = this.connectionHandlers.get(event)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  /**
   * Notify connection handlers
   * @param {string} event - Connection event
   * @param {*} data - Event data
   */
  notifyConnectionHandlers(event, data = null) {
    const handlers = this.connectionHandlers.get(event) || []
    handlers.forEach(handler => {
      try {
        handler(data)
      } catch (error) {
        console.error(`Error in connection handler for ${event}:`, error)
      }
    })
  }

  /**
   * Start heartbeat to keep connection alive
   */
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected) {
        this.send({ type: 'ping' })
      }
    }, 30000) // Send ping every 30 seconds
  }

  /**
   * Stop heartbeat
   */
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  /**
   * Schedule reconnection attempt
   * @param {string} token - JWT token
   * @param {string} type - WebSocket type
   */
  scheduleReconnect(token, type) {
    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)

    console.log(`Scheduling reconnection attempt ${this.reconnectAttempts} in ${delay}ms`)

    setTimeout(() => {
      if (!this.isConnected) {
        this.connect(token, type)
      }
    }, delay)
  }

  /**
   * Get connection status
   * @returns {Object} Connection status
   */
  getStatus() {
    return {
      connected: this.isConnected,
      subscriptions: Array.from(this.subscriptions),
      reconnectAttempts: this.reconnectAttempts
    }
  }
}

// Create singleton instance
const webSocketService = new WebSocketService()

export default webSocketService
