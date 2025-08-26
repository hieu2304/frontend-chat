import React, { useRef, useEffect } from 'react';
import { Message } from '@/types/chat';
import MessageBubble from './MessageBubble';
import { Spinner } from '@/components/ui';

interface ChatWindowProps {
  messages: Message[];
  isLoading?: boolean;
  className?: string;
}

export default function ChatWindow({ messages, isLoading, className }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={`flex-1 flex flex-col ${className || ''}`}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isLoading ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-lg font-semibold mb-2">Welcome to Real-time Chat Analytics</h3>
              <p className="text-sm">Start typing to see your message analytics in real-time!</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {isLoading && (
              <div className="flex items-center justify-center py-4">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Spinner size="sm" />
                  <span className="text-sm">Processing message...</span>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}


