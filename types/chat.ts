// Backend response format (snake_case)
export interface BackendMessageAnalytics {
  word_count: number;
  char_count: number;
  sentence_count: number;
  is_question: boolean;
  sentiment: 'positive' | 'negative' | 'neutral';
  processed_at?: string;
}

export interface MessageAnalytics {
  wordCount: number;
  charCount: number;
  sentenceCount: number;
  isQuestion: boolean;
  sentiment: 'positive' | 'negative' | 'neutral';
  processedAt: string;
}

export interface Message {
  id: string;
  type: 'user' | 'system';
  content: string;
  analytics?: MessageAnalytics;
  timestamp: string;
}

// Backend response format (snake_case)
export interface BackendSessionStats {
  total_messages: number;
  total_words: number;
  questions_asked: number;
  avg_message_length: number;
  sentimentBreakdown?: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

// Frontend format (camelCase)
export interface SessionStats {
  totalMessages: number;
  totalWords: number;
  questionsAsked: number;
  avgMessageLength: number;
  sentimentBreakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

export interface WebSocketMessage {
  type: 'user_message' | 'message_response';
  content?: string;
  original_message?: string;
  echo?: string;
  analytics?: BackendMessageAnalytics;
  session_stats?: BackendSessionStats;
  timestamp?: string;
}

export interface ConnectionStatus {
  isConnected: boolean;
  isConnecting: boolean;
  error?: string;
}

// Utility functions to transform backend data to frontend format
export function transformAnalytics(backendAnalytics: BackendMessageAnalytics): MessageAnalytics {
  return {
    wordCount: backendAnalytics.word_count,
    charCount: backendAnalytics.char_count,
    sentenceCount: backendAnalytics.sentence_count,
    isQuestion: backendAnalytics.is_question,
    sentiment: backendAnalytics.sentiment,
    processedAt: backendAnalytics.processed_at || new Date().toISOString()
  };
}

export function transformSessionStats(backendStats: BackendSessionStats): SessionStats {
  return {
    totalMessages: backendStats.total_messages,
    totalWords: backendStats.total_words,
    questionsAsked: backendStats.questions_asked,
    avgMessageLength: backendStats.avg_message_length,
    sentimentBreakdown: backendStats.sentimentBreakdown || { positive: 0, negative: 0, neutral: 0 }
  };
}


