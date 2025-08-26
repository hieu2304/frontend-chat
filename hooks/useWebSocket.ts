import { useEffect, useRef, useCallback, useState } from 'react';
import { WebSocketMessage, ConnectionStatus } from '@/types/chat';
import { getWebSocketUrl } from '@/lib/api';

interface UseWebSocketProps {
  onMessage: (data: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  url?: string;
}

export function useWebSocket({ 
  onMessage, 
  onConnect, 
  onDisconnect, 
  url 
}: UseWebSocketProps) {
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isConnected: false,
    isConnecting: false
  });

  // Store callbacks in refs to avoid dependency issues
  const onMessageRef = useRef(onMessage);
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);

  // Update refs when callbacks change
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    onConnectRef.current = onConnect;
  }, [onConnect]);

  useEffect(() => {
    onDisconnectRef.current = onDisconnect;
  }, [onDisconnect]);

  // Mark as client-side only after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  const wsUrl = url || getWebSocketUrl();

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    try {
      setConnectionStatus(prev => ({ ...prev, isConnecting: true }));
      ws.current = new WebSocket(wsUrl);
      
      ws.current.onopen = () => {
        console.log('WebSocket connected to:', wsUrl);
        setConnectionStatus({
          isConnected: true,
          isConnecting: false,
          error: undefined
        });
        onConnectRef.current?.();
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessageRef.current(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.current.onclose = () => {
        console.log('WebSocket disconnected from:', wsUrl);
        setConnectionStatus({
          isConnected: false,
          isConnecting: false,
          error: undefined
        });
        onDisconnectRef.current?.();
        
        // Attempt to reconnect after 3 seconds
        if (reconnectTimeout.current) {
          clearTimeout(reconnectTimeout.current);
        }
        reconnectTimeout.current = setTimeout(() => {
          setConnectionStatus(prev => ({ ...prev, isConnecting: true }));
          connect();
        }, 3000);
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus({
          isConnected: false,
          isConnecting: false,
          error: 'Connection failed'
        });
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setConnectionStatus({
        isConnected: false,
        isConnecting: false,
        error: 'Failed to create connection'
      });
    }
  }, [wsUrl]);

  const sendMessage = useCallback((content: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type: 'user_message',
        content,
        timestamp: new Date().toISOString()
      };
      console.log('Sending message:', message);
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }
    if (ws.current) {
      ws.current.close();
    }
  }, []);

  // Only connect on client-side after hydration
  useEffect(() => {
    if (isClient) {
      connect();
      return () => {
        disconnect();
      };
    }
  }, [isClient, connect, disconnect]);

  return { 
    sendMessage, 
    connectionStatus: isClient ? connectionStatus : { isConnected: false, isConnecting: false },
    disconnect,
    reconnect: connect,
    wsUrl
  };
}
