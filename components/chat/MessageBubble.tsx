import React from 'react';
import { Message } from '@/types/chat';
import { Badge, Avatar } from '@/components/ui';
import { cn } from '@/lib/utils';
import { 
  MessageSquare, 
  Hash, 
  Type, 
  FileText, 
  HelpCircle, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Clock
} from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.type === 'user';
  const analytics = message.analytics;

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'negative':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={cn(
      'flex gap-3',
      isUser ? 'justify-end' : 'justify-start'
    )}>
      {!isUser && (
        <Avatar 
          size="sm" 
          fallback="AI" 
          className="mt-1"
        />
      )}
      
      <div className={cn(
        'max-w-[80%] rounded-2xl px-4 py-3',
        isUser 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
      )}>
        {/* Message Content */}
        <div className="mb-2">
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>

        {/* Analytics (only for system messages) */}
        {!isUser && analytics && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Hash className="w-3 h-3" />
                <span>{analytics.wordCount} words</span>
              </div>
              <div className="flex items-center gap-1">
                <Type className="w-3 h-3" />
                <span>{analytics.charCount} chars</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                <span>{analytics.sentenceCount} sentences</span>
              </div>
              <div className="flex items-center gap-1">
                {analytics.isQuestion ? (
                  <HelpCircle className="w-3 h-3 text-blue-500" />
                ) : (
                  <MessageSquare className="w-3 h-3 text-gray-500" />
                )}
                <span>{analytics.isQuestion ? 'Question' : 'Statement'}</span>
              </div>
            </div>
            
            {/* Sentiment */}
            <div className="mt-2 flex items-center gap-2">
              {getSentimentIcon(analytics.sentiment)}
              <Badge 
                variant={analytics.sentiment === 'positive' ? 'success' : 
                        analytics.sentiment === 'negative' ? 'danger' : 'secondary'}
                size="sm"
              >
                {analytics.sentiment}
              </Badge>
            </div>
          </div>
        )}

        {/* Timestamp */}
        <div className={cn(
          'flex items-center gap-1 text-xs mt-2 opacity-70',
          isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
        )}>
          <Clock className="w-3 h-3" />
          {formatTime(message.timestamp)}
        </div>
      </div>

      {isUser && (
        <Avatar 
          size="sm" 
          fallback="You" 
          className="mt-1"
        />
      )}
    </div>
  );
}


