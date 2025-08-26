// Configuration for API endpoints and environment variables

export const config = {
  // Backend API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000', // only for dev environment
    wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws/chat', // only for dev environment
  },
  
  // Environment
  env: {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  },
  
  // Feature flags
  features: {
    enableHealthCheck: true,
    enableSessionManagement: true,
    enableMessageHistory: true,
  },
  
  // WebSocket configuration
  websocket: {
    reconnectInterval: 3000, // 3 seconds
    maxReconnectAttempts: 5,
  },
  
  // UI configuration
  ui: {
    maxMessageLength: 1000,
    autoScrollDelay: 100, // milliseconds
    typingIndicatorDelay: 1000, // milliseconds
  },
} as const;

// Export individual config sections for easier imports
export const { api, env, features, websocket, ui } = config;


