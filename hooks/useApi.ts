import { useState, useCallback } from 'react';
import { apiClient, ApiResponse, HealthCheckResponse, SessionInfo, MessageHistory } from '@/lib/api';

interface UseApiReturn {
  // Health check
  checkHealth: () => Promise<boolean>;
  healthStatus: ApiResponse<HealthCheckResponse> | null;
  isHealthLoading: boolean;
  
  // Session management
  createSession: () => Promise<ApiResponse<SessionInfo>>;
  getSession: (sessionId: string) => Promise<ApiResponse<SessionInfo>>;
  deleteSession: (sessionId: string) => Promise<ApiResponse<void>>;
  
  // Message history
  getMessageHistory: (sessionId: string) => Promise<ApiResponse<MessageHistory>>;
  
  // Session stats
  getSessionStats: (sessionId: string) => Promise<ApiResponse<any>>;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

export function useApi(): UseApiReturn {
  const [healthStatus, setHealthStatus] = useState<ApiResponse<HealthCheckResponse> | null>(null);
  const [isHealthLoading, setIsHealthLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = useCallback(async (): Promise<boolean> => {
    setIsHealthLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.healthCheck();
      setHealthStatus(response);
      return response.status === 200 && response.data?.status === 'healthy';
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Health check failed';
      setError(errorMessage);
      return false;
    } finally {
      setIsHealthLoading(false);
    }
  }, []);

  const createSession = useCallback(async (): Promise<ApiResponse<SessionInfo>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.createSession();
      if (response.error) {
        setError(response.error);
      }
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create session';
      setError(errorMessage);
      return { error: errorMessage, status: 0 };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getSession = useCallback(async (sessionId: string): Promise<ApiResponse<SessionInfo>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getSession(sessionId);
      if (response.error) {
        setError(response.error);
      }
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get session';
      setError(errorMessage);
      return { error: errorMessage, status: 0 };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteSession = useCallback(async (sessionId: string): Promise<ApiResponse<void>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.deleteSession(sessionId);
      if (response.error) {
        setError(response.error);
      }
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete session';
      setError(errorMessage);
      return { error: errorMessage, status: 0 };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getMessageHistory = useCallback(async (sessionId: string): Promise<ApiResponse<MessageHistory>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getMessageHistory(sessionId);
      if (response.error) {
        setError(response.error);
      }
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get message history';
      setError(errorMessage);
      return { error: errorMessage, status: 0 };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getSessionStats = useCallback(async (sessionId: string): Promise<ApiResponse<any>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getSessionStats(sessionId);
      if (response.error) {
        setError(response.error);
      }
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get session stats';
      setError(errorMessage);
      return { error: errorMessage, status: 0 };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    checkHealth,
    healthStatus,
    isHealthLoading,
    createSession,
    getSession,
    deleteSession,
    getMessageHistory,
    getSessionStats,
    isLoading,
    error
  };
}


