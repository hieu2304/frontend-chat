import React, { useState, KeyboardEvent, useEffect } from 'react';
import { Button, Input } from '@/components/ui';
import { Send, Paperclip } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isConnected: boolean;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  onTypingChange?: (isTyping: boolean) => void;
}

export default function MessageInput({ 
  onSendMessage, 
  isConnected, 
  isLoading = false,
  placeholder = "Type your message...",
  className,
  onTypingChange
}: MessageInputProps) {
  const [message, setMessage] = useState('');

  // Handle typing state
  useEffect(() => {
    if (onTypingChange) {
      onTypingChange(message.length > 0);
    }
  }, [message, onTypingChange]);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && isConnected && !isLoading) {
      onSendMessage(trimmedMessage);
      setMessage('');
      // Clear typing state when message is sent
      if (onTypingChange) {
        onTypingChange(false);
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isSendDisabled = !message.trim() || !isConnected || isLoading;

  return (
    <div className={`border-t border-gray-200 dark:border-gray-700 p-4 ${className || ''}`}>
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isConnected ? placeholder : "Connecting..."}
            disabled={!isConnected || isLoading}
            rightIcon={
              <button
                type="button"
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                disabled={!isConnected}
              >
                <Paperclip className="w-4 h-4 text-gray-500" />
              </button>
            }
          />
        </div>
        
        <Button
          onClick={handleSend}
          disabled={isSendDisabled}
          loading={isLoading}
          size="md"
          className="shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
      
      {!isConnected && (
        <p className="text-xs text-red-500 mt-2">
          Not connected. Trying to reconnect...
        </p>
      )}
    </div>
  );
}


