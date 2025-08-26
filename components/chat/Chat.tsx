import React, { useState, useEffect } from 'react';
import { Message, SessionStats, WebSocketMessage } from '@/types/chat';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useApi } from '@/hooks/useApi';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import StatsPanel from './StatsPanel';
import { Badge, Button, Spinner } from '@/components/ui';
import { Wifi, WifiOff, Activity, RefreshCw, AlertCircle } from 'lucide-react';

export default function Chat() {
  // Main chat state - messages, stats, and UI states
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    totalMessages: 0,
    totalWords: 0,
    questionsAsked: 0,
    avgMessageLength: 0,
    sentimentBreakdown: { positive: 0, negative: 0, neutral: 0 }
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // API and WebSocket hooks for backend communication
  const { 
    checkHealth, 
    healthStatus, 
    isHealthLoading,
    createSession,
    error: apiError 
  } = useApi();

  // Prevent hydration mismatch by only running client-side code after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // WebSocket connection and message handling
  const { sendMessage, connectionStatus, wsUrl } = useWebSocket({
    onMessage: (data: WebSocketMessage) => {
      if (data.type === 'message_response') {
        // Transform backend snake_case data to frontend camelCase format
        const newMessage: Message = {
          id: isClient ? Date.now().toString() : 'temp-id',
          type: 'system',
          content: data.echo || '',
          analytics: data.analytics ? {
            wordCount: data.analytics.word_count,
            charCount: data.analytics.char_count,
            sentenceCount: data.analytics.sentence_count,
            isQuestion: data.analytics.is_question,
            sentiment: data.analytics.sentiment,
            processedAt: data.analytics.processed_at || new Date().toISOString()
          } : undefined,
          timestamp: isClient ? new Date().toISOString() : ''
        };
        
        setMessages(prev => [...prev, newMessage]);
        
        // Update session statistics with backend data
        if (data.session_stats) {
          setSessionStats({
            totalMessages: data.session_stats.total_messages,
            totalWords: data.session_stats.total_words,
            questionsAsked: data.session_stats.questions_asked,
            avgMessageLength: data.session_stats.avg_message_length || 0,
            sentimentBreakdown: data.session_stats.sentimentBreakdown || { positive: 0, negative: 0, neutral: 0 }
          });
        }
        setIsProcessing(false);
      }
    },
    onConnect: () => {
      console.log('Connected to WebSocket');
    },
    onDisconnect: () => {
      console.log('Disconnected from WebSocket');
    }
  });

  // Initialize backend connection and create session on component mount
  useEffect(() => {
    if (!isClient) return;
    
    const initBackend = async () => {
      const isHealthy = await checkHealth();
      if (isHealthy) {
        // Create a new session when backend is healthy
        const sessionResponse = await createSession();
        if (sessionResponse.data) {
          setSessionId(sessionResponse.data.id);
        }
      }
    };

    initBackend();
  }, [isClient, checkHealth, createSession]);

  // Handle sending messages to backend via WebSocket
  const handleSendMessage = (content: string) => {
    if (!content.trim() || !connectionStatus.isConnected || !isClient) return;

    // Add user message to chat immediately for better UX
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    sendMessage(content);
  };

  const handleRetryConnection = async () => {
    await checkHealth();
  };

  // Helper functions for connection status display
  const getConnectionStatusColor = () => {
    if (connectionStatus.isConnected) return 'bg-green-500';
    if (connectionStatus.isConnecting) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getConnectionStatusText = () => {
    if (connectionStatus.isConnected) return 'Connected';
    if (connectionStatus.isConnecting) return 'Connecting';
    return 'Disconnected';
  };

  const getConnectionStatusIcon = () => {
    if (connectionStatus.isConnected) return <Wifi className="w-4 h-4" />;
    if (connectionStatus.isConnecting) return <Activity className="w-4 h-4" />;
    return <WifiOff className="w-4 h-4" />;
  };

  // Get last user message for header preview
  const lastUserMessage = messages
    .filter(msg => msg.type === 'user')
    .pop();

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Loading state while checking backend health
  if (isHealthLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Checking Backend Connection
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Verifying connection to backend server...
          </p>
        </div>
      </div>
    );
  }

  // Error state when backend is unavailable
  if (healthStatus && healthStatus.status !== 200) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Backend Unavailable
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Unable to connect to the backend server. Please ensure the backend is running on port 8000.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Expected URL: {wsUrl}
            </p>
            {apiError && (
              <p className="text-sm text-red-500">
                Error: {apiError}
              </p>
            )}
          </div>
          <Button 
            onClick={handleRetryConnection}
            className="mt-4"
            loading={isHealthLoading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  // Main chat interface layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header with connection status and message preview */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">Real-time Chat Analytics</h1>
                  {sessionId && (
                    <p className="text-blue-100 text-sm mt-1">
                      Session: {sessionId.slice(0, 8)}...
                    </p>
                  )}
                </div>
                
                {/* Dynamic message preview or typing indicator */}
                {lastUserMessage && !isTyping && (
                  <div className="flex items-center gap-2">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{lastUserMessage.content}</span>
                        <span className="text-blue-100 text-xs">
                          {formatTime(lastUserMessage.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {isTyping && (
                  <div className="flex items-center gap-2">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-100">Typing...</span>
                        <div className="flex gap-1">
                          <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                          <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Connection status badges */}
              <div className="flex items-center gap-3">
                <Badge 
                  variant={connectionStatus.isConnected ? 'success' : 'danger'}
                  className="flex items-center gap-1"
                >
                  <div className={`w-2 h-2 rounded-full ${getConnectionStatusColor()}`}></div>
                  {getConnectionStatusIcon()}
                  <span className="text-xs">
                    {getConnectionStatusText()}
                  </span>
                </Badge>
                
                {healthStatus?.data && (
                  <Badge variant="secondary" className="text-xs">
                    {healthStatus.data.active_connections} active connections
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Main content area - chat and analytics side by side */}
          <div className="flex">
            {/* Chat interface with messages and input */}
            <div className="flex-1 flex flex-col">
              <ChatWindow 
                messages={messages} 
                isLoading={isProcessing}
              />
              <MessageInput 
                onSendMessage={handleSendMessage}
                isConnected={connectionStatus.isConnected}
                isLoading={isProcessing}
                onTypingChange={setIsTyping}
              />
            </div>

            {/* Real-time analytics panel */}
            <div className="w-80 border-l border-gray-200 dark:border-gray-700">
              <StatsPanel stats={sessionStats} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
