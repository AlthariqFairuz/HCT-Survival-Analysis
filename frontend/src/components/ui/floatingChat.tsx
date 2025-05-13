'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Send, X, Loader2, Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ChatMessage from '@/types/ChatMessage';

const STORAGE_KEY = 'hct-chat-history';

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [message, setMessage] = useState('');
  
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedHistory = localStorage.getItem(STORAGE_KEY);
        if (savedHistory) {
          return JSON.parse(savedHistory);
        }
      } catch (error) {
        console.error('Failed to load chat history from localStorage:', error);
      }
    }
    
    return [{ role: 'assistant', content: 'Hi, how can I assist you today?' }];
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && chatHistory.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
      } catch (error) {
        console.error('Failed to save chat history to localStorage:', error);
      }
    }
  }, [chatHistory]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    
    if (!isOpen) {
      setTimeout(() => {
        chatInputRef.current?.focus();
      }, 100);
    }
  };

  const clearChatHistory = () => {
    const newChatHistory = [{ role: 'assistant', content: 'Hi, how can I assist you today?' }];
    setChatHistory(newChatHistory);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newChatHistory));
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: message };
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/rag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          history: chatHistory,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      setChatHistory((prev) => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setChatHistory((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const ChatHeader = () => (
    <div className="flex items-center justify-between">
      <CardTitle className="text-lg">Chat Assistant</CardTitle>
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearChatHistory}
          aria-label="Clear chat history"
        >
          <Trash size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleChat}
          aria-label="Close chat"
        >
          <X size={18} />
        </Button>
      </div>
    </div>
  );

  if (isOpen && isMobile) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Chat Assistant</h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearChatHistory}
              aria-label="Clear chat history"
            >
              <Trash size={18} />
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleChat} aria-label="Close chat">
              <X size={20} />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 break-words ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-lg px-3 py-2 bg-muted flex items-center">
                <Loader2 className="animate-spin mr-2" size={16} />
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-3 border-t flex gap-2 bg-background">
          <Input
            ref={chatInputRef}
            className="flex-1"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            disabled={isLoading || !message.trim()}
            aria-label="Send message"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-80 sm:w-96 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between p-3">
            <ChatHeader />
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="h-80 overflow-y-auto mb-3 space-y-3">
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 break-words ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-lg px-3 py-2 bg-muted flex items-center">
                    <Loader2 className="animate-spin mr-2" size={16} />
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex gap-2">
              <Input
                ref={chatInputRef}
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                size="icon"
                disabled={isLoading || !message.trim()}
                aria-label="Send message"
              >
                <Send size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button 
          onClick={toggleChat} 
          size="icon" 
          className="h-12 w-12 rounded-full shadow-lg"
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
        </Button>
      )}
    </div>
  );
};

export default FloatingChat;