// API utilities for backend communication
import { api } from './config';

const API_BASE_URL = api.baseUrl;
const WS_URL = api.wsUrl;

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

export interface HealthCheckResponse {
  status: string;
  active_connections: number;
  timestamp: string;
}

export interface SessionInfo {
  id: string;
  created_at: string;
  total_messages: number;
  total_words: number;
  questions_count: number;
}

export interface MessageHistory {
  messages: Array<{
    id: number;
    session_id: string;
    content: string;
    word_count: number;
    char_count: number;
    sentence_count: number;
    is_question: boolean;
    sentiment: string;
    timestamp: string;
  }>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.message || `HTTP ${response.status}`,
          status: response.status,
        };
      }

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
        status: 0,
      };
    }
  }

  // Health check endpoint
  async healthCheck(): Promise<ApiResponse<HealthCheckResponse>> {
    return this.request<HealthCheckResponse>('/health');
  }

  // Get session information
  async getSession(sessionId: string): Promise<ApiResponse<SessionInfo>> {
    return this.request<SessionInfo>(`/sessions/${sessionId}`);
  }

  // Get message history for a session
  async getMessageHistory(sessionId: string): Promise<ApiResponse<MessageHistory>> {
    return this.request<MessageHistory>(`/sessions/${sessionId}/messages`);
  }

  // Get session statistics
  async getSessionStats(sessionId: string): Promise<ApiResponse<any>> {
    return this.request(`/sessions/${sessionId}/stats`);
  }

  // Create a new session
  async createSession(): Promise<ApiResponse<SessionInfo>> {
    return this.request<SessionInfo>('/sessions', {
      method: 'POST',
    });
  }

  // Delete a session
  async deleteSession(sessionId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export WebSocket URL for use in hooks
export { WS_URL };

// Utility function to check if backend is available
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await apiClient.healthCheck();
    return response.status === 200 && response.data?.status === 'healthy';
  } catch {
    return false;
  }
}

// Utility function to get WebSocket URL with fallback
export function getWebSocketUrl(): string {
  return WS_URL;
}
