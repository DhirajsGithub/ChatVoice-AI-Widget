import React from 'react';
import { MessageBubble } from './MessageBubble';
import { FALLBACK_BOT_AVATAR } from '../constants/avatars';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface MessagesListProps {
  messages: Message[];
  isLoading: boolean;
  theme?: {
    primaryColor?: string;
  };
  fontStyles?: {
    fontFamily: string;
  };
  agentAvatar?: string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  isLoading,
  theme,
  fontStyles,
  agentAvatar,
  messagesEndRef
}) => {
  return (
    <div style={{ flex: 1, padding: 12, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          theme={theme}
          fontStyles={fontStyles}
          agentAvatar={agentAvatar}
        />
      ))}
      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '8px' }}>
          <img
            src={agentAvatar || FALLBACK_BOT_AVATAR}
            alt="Bot Avatar"
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              objectFit: 'contain',
              flexShrink: 0,
              marginTop: '4px'
            }}
          />
          <div
            style={{
              padding: '8px 12px',
              borderRadius: '12px',
              backgroundColor: '#f1f3f4',
              color: '#666',
              fontSize: '14px',
              ...fontStyles
            }}
          >
            Typing...
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
