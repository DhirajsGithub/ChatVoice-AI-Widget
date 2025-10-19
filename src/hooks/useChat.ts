import { useState, useCallback } from 'react';
import { GeminiApiService } from '../services/geminiApi';
import { useVoice } from './useVoice';

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const useChat = (context?: string, enableVoice: boolean = true) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "👋 Hello! How can I help you?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Create API service instance with hardcoded API key
  const geminiApi = new GeminiApiService();
  
  // Initialize voice functionality
  const voice = useVoice();

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: userMessage.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Prepare conversation history for Sarvam API
      const conversationHistory = messages.map(msg => ({
        role: msg.isUser ? 'user' as const : 'assistant' as const,
        content: msg.text
      }));

      // Add current user message
      conversationHistory.push({
        role: 'user',
        content: userMessage.trim()
      });

      // Call Gemini API
      const response = await geminiApi.sendMessage(conversationHistory, context);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      
      // Auto-speak the response if voice is enabled
      if (enableVoice && voice.isSupported) {
        voice.speak(response);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Voice message handler
  const sendVoiceMessage = useCallback(async (transcript: string) => {
    if (transcript.trim()) {
      await sendMessage(transcript);
    }
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    sendVoiceMessage,
    voice: enableVoice ? voice : null,
  };
};
