interface GeminiMessage {
  role: 'user' | 'model';
  parts: Array<{
    text: string;
  }>;
}

interface GeminiApiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

import { API_CONFIG } from '../config/api';
import { GEMINI_API_KEY_FOR_WIDGET } from '../constants/apiKeys';

export class GeminiApiService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || GEMINI_API_KEY_FOR_WIDGET;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
  }

  async sendMessage(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    context?: string
  ): Promise<string> {
    try {
      // Prepare the messages for Gemini API
      const geminiMessages: GeminiMessage[] = [];
      
      // Add system context as the first user message if provided
      if (context) {
        geminiMessages.push({
          role: 'user',
          parts: [{ text: `System: ${context}` }]
        });
      }

      // Convert conversation messages to Gemini format
      messages.forEach(msg => {
        if (msg.role === 'user') {
          geminiMessages.push({
            role: 'user',
            parts: [{ text: msg.content }]
          });
        } else if (msg.role === 'assistant') {
          geminiMessages.push({
            role: 'model',
            parts: [{ text: msg.content }]
          });
        }
      });

      const response = await fetch(
        `${this.baseUrl}/models/${API_CONFIG.MODEL}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: geminiMessages,
            generationConfig: {
              maxOutputTokens: API_CONFIG.MAX_TOKENS,
              temperature: API_CONFIG.TEMPERATURE,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data: GeminiApiResponse = await response.json();
      
      if (data.candidates && data.candidates.length > 0) {
        const candidate = data.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          return candidate.content.parts[0].text;
        }
      }
      
      throw new Error('No response from Gemini API');
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const geminiApi = new GeminiApiService();
