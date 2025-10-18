import React, { useState, useRef, useEffect } from 'react';
import { ChatHeader } from './components/ChatHeader';
import { MessagesList } from './components/MessagesList';
import { MessageInput } from './components/MessageInput';

interface AgentWidgetProps {
  config: any;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const AgentWidget: React.FC<AgentWidgetProps> = ({ config }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '👋 Hello! How can I help you?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { position = 'bottom-right', theme, agent, font, context } = config || {};

  const positionStyles =
    position === 'bottom-left'
      ? { left: '20px', bottom: '20px' }
      : { right: '20px', bottom: '20px' };

  const fontFamily = font?.family || 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const fontStyles = {
    fontFamily
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // TODO: Replace with actual LLM API call
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `I received your message: "${userMessage.text}". This is a placeholder response. LLM integration coming next!`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      // TODO: Implement actual voice recording stop
      console.log('Stopping voice recording...');
    } else {
      // Start recording
      setIsRecording(true);
      // TODO: Implement actual voice recording start
      console.log('Starting voice recording...');
    }
  };

  return (
    <div style={{ position: 'fixed', zIndex: 9999, ...positionStyles }}>
      {open ? (
        <div
          style={{
            width: 360,
            height: 450,
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
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
        <button
          onClick={() => setOpen(true)}
          style={{
            background: theme?.primaryColor || '#4F46E5',
            color: '#fff',
            borderRadius: '50%',
            width: 60,
            height: 60,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          💬
        </button>
      )}
    </div>
  );
};
