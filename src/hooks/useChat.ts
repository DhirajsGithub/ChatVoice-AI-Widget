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
        // Get saved voice settings
        const savedLanguage = localStorage.getItem('agent-widget-voice-language') || 'en-US';
        const savedRate = parseFloat(localStorage.getItem('agent-widget-speech-rate') || '1');
        const savedPitch = parseFloat(localStorage.getItem('agent-widget-speech-pitch') || '1');
        const autoSpeakEnabled = localStorage.getItem('agent-widget-auto-speak') !== 'false';
        
        if (autoSpeakEnabled) {
          voice.speak(response, {
            language: savedLanguage,
            rate: savedRate,
            pitch: savedPitch
          });
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      let errorText = "Sorry, I encountered an error. Please try again.";
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message === 'QUOTA_EXCEEDED') {
          errorText = "⚠️ API quota exceeded. Please try again after some time. We apologize for the inconvenience.";
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorText = "🌐 Network error. Please check your internet connection and try again.";
        } else if (error.message.includes('429')) {
          errorText = "⚠️ Too many requests. Please wait a moment and try again.";
        }
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText,
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
