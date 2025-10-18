import React, { useState, useRef, useEffect } from "react";
import { ChatHeader } from "./components/ChatHeader";
import { MessagesList } from "./components/MessagesList";
import { MessageInput } from "./components/MessageInput";
import { WidgetButton } from "./components/WidgetButton";
import { useChat } from "./hooks/useChat";

interface AgentWidgetProps {
  config: any;
}

export const AgentWidget: React.FC<AgentWidgetProps> = ({ config }) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const {
    position = "bottom-right",
    theme,
    agent,
    font,
    context,
  } = config || {};

  // Use the chat hook for message handling
  const { messages, isLoading, sendMessage } = useChat(context);

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

  const handleMicClick = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      // TODO: Implement actual voice recording stop
      console.log("Stopping voice recording...");
    } else {
      // Start recording
      setIsRecording(true);
      // TODO: Implement actual voice recording start
      console.log("Starting voice recording...");
    }
  };

  return (
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
          />

          <MessagesList
            messages={messages}
            isLoading={isLoading}
            theme={theme}
            fontStyles={fontStyles}
            agentAvatar={agent?.avatar}
            messagesEndRef={messagesEndRef}
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
  );
};
