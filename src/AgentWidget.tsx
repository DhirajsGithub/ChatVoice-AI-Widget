import React, { useState, useRef, useEffect } from "react";
import { ChatHeader } from "./components/ChatHeader";
import { MessagesList } from "./components/MessagesList";
import { MessageInput } from "./components/MessageInput";
import { WidgetButton } from "./components/WidgetButton";
import { Toast } from "./components/Toast";
import { useChat } from "./hooks/useChat";

interface AgentWidgetProps {
  config: any;
}

export const AgentWidget: React.FC<AgentWidgetProps> = ({ config }) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' | 'warning' | 'info' } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const {
    position = "bottom-right",
    theme,
    agent,
    font,
    context,
    enableVoice = true,
  } = config || {};

  // Use the chat hook for message handling
  const { messages, isLoading, sendMessage, sendVoiceMessage, voice } = useChat(context, enableVoice);

  const positionStyles =
    position === "bottom-left"
      ? { left: "20px", bottom: "20px" }
      : { right: "20px", bottom: "20px" };

  const fontFamily =
    font?.family ||
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const fontStyles = {
    fontFamily,
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const messageText = inputValue.trim();
    setInputValue("");
    await sendMessage(messageText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleMicClick = async () => {
    if (!voice) {
      console.warn('Voice functionality not available');
      return;
    }

    if (isRecording) {
      // Stop recording
      voice.stopListening();
      setIsRecording(false);
      
      // Get the transcript and send it as a message
      const transcript = voice.getTranscript();
      if (transcript.trim()) {
        await sendVoiceMessage(transcript);
      }
    } else {
      // Start recording
      try {
        voice.startListening();
        setIsRecording(true);
      } catch (error) {
        console.error('Failed to start voice recording:', error);
        setIsRecording(false);
        
        // Show permission error toast
        setToast({
          message: 'Microphone permission denied. Please allow microphone access to use voice features.',
          type: 'error'
        });
      }
    }
  };

  // Listen for voice errors
  useEffect(() => {
    if (voice && voice.error) {
      if (voice.error.includes('permission') || voice.error.includes('not-allowed')) {
        setToast({
          message: 'Microphone permission denied. Please allow microphone access in your browser settings.',
          type: 'error'
        });
        setIsRecording(false);
      } else if (voice.error.includes('no-speech')) {
        setToast({
          message: 'No speech detected. Please try speaking closer to your microphone.',
          type: 'warning'
        });
        setIsRecording(false);
      } else if (voice.error.includes('audio-capture')) {
        setToast({
          message: 'Microphone not found. Please check your microphone connection.',
          type: 'error'
        });
        setIsRecording(false);
      }
    }
  }, [voice?.error]);

  return (
    <>
      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <div style={{ position: "fixed", zIndex: 9999, ...positionStyles }}>
        {open ? (
        <div
          style={{
            width: 360,
            height: 450,
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            ...fontStyles,
          }}
        >
          <ChatHeader
            agent={agent}
            theme={theme}
            onClose={() => setOpen(false)}
            voice={voice}
          />

          <MessagesList
            messages={messages}
            isLoading={isLoading}
            theme={theme}
            fontStyles={fontStyles}
            agentAvatar={agent?.avatar}
            messagesEndRef={messagesEndRef}
            voice={voice}
          />

          <MessageInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSendMessage}
            onKeyPress={handleKeyPress}
            onMicClick={handleMicClick}
            isLoading={isLoading}
            isRecording={isRecording}
            theme={theme}
            fontStyles={fontStyles}
          />
        </div>
      ) : (
        <WidgetButton 
          onClick={() => setOpen(true)} 
          agentAvatar={agent?.avatar} 
        />
      )}
      </div>
    </>
  );
};
