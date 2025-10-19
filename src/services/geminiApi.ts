interface GeminiMessage {
  role: "user" | "model";
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

import { API_CONFIG } from "../config/api";
import { GEMINI_API_KEY_FOR_WIDGET } from "../constants/apiKeys";

export class GeminiApiService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || GEMINI_API_KEY_FOR_WIDGET;
    this.baseUrl = "https://generativelanguage.googleapis.com/v1beta";
  }

  async sendMessage(
    messages: Array<{ role: "user" | "assistant"; content: string }>,
    context?: string
  ): Promise<string> {
    try {
      // Prepare the messages for Gemini API
      const geminiMessages: GeminiMessage[] = [];

      // Create system prompt with XML structure for concise responses
      const systemPrompt = this.createSystemPrompt(context);
      geminiMessages.push({
        role: "user",
        parts: [{ text: systemPrompt }],
      });

      // Convert conversation messages to Gemini format
      messages.forEach((msg) => {
        if (msg.role === "user") {
          geminiMessages.push({
            role: "user",
            parts: [{ text: msg.content }],
          });
        } else if (msg.role === "assistant") {
          geminiMessages.push({
            role: "model",
            parts: [{ text: msg.content }],
          });
        }
      });

      const response = await fetch(
        `${this.baseUrl}/models/${API_CONFIG.MODEL}:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
        if (response.status === 429) {
          throw new Error('QUOTA_EXCEEDED');
        }
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data: GeminiApiResponse = await response.json();

      if (data.candidates && data.candidates.length > 0) {
        const candidate = data.candidates[0];
        if (
          candidate.content &&
          candidate.content.parts &&
          candidate.content.parts.length > 0
        ) {
          const rawResponse = candidate.content.parts[0].text;
          return rawResponse;
        }
      }

      throw new Error("No response from Gemini API");
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  private createSystemPrompt(context?: string): string {
    const baseContext = context || "You are a knowledgeable and versatile assistant, ready to help with any topic.";
  
    return `${baseContext}
  
  You excel at clear, helpful communication. Your goal: understand what users need and deliver it perfectly.
  
  Response Strategy:
  - Simple questions → Brief, direct answers (2-4 sentences)
  - Complex questions → Structured, detailed responses
  - Technical questions → Code examples + clear explanations
  - Always prioritize what's most useful to the user
  
  Markdown Mastery:
  Use markdown thoughtfully to enhance clarity and visual appeal:
  - **Bold** key takeaways, important terms, and main concepts
  - *Italic* for subtle emphasis or foreign terms
  - \`code\` for technical terms, commands, file names, or values
  - Code blocks (\`\`\`language) for examples - always specify the language
  - Tables for comparisons, options, pros/cons, or structured data
  - Lists (- or 1.) for steps, options, features, or breaking down information
  - > Blockquotes for warnings, tips, important notes, or quotes
  - Emojis sparingly for visual markers (✅ ❌ 🚀 ⚠️ 💡)
  - Links [with descriptive text](url) when referencing external resources
  - Headers (## ###) to structure longer responses into clear sections
  
  Excellence Standards:
  ✓ Code examples should be complete, runnable, and properly formatted
  ✓ Explanations should be clear without being condescending
  ✓ Anticipate follow-up questions and address them proactively
  ✓ Admit uncertainty rather than guessing - it's okay to say "I don't know"
  ✓ Suggest better approaches or alternatives when relevant
  ✓ Use examples, analogies, and metaphors for complex concepts
  ✓ Structure information visually for easier scanning
  ✓ Balance brevity with completeness
  
  Adapt to the user: Match their technical level, tone, and communication style. Be conversational yet professional.`;
  }
}

// Export a singleton instance
export const geminiApi = new GeminiApiService();
