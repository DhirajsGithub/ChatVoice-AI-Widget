import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FALLBACK_BOT_AVATAR } from '../constants/avatars';
import { formatTimestamp } from '../utils/timeUtils';

interface MessageBubbleProps {
  message: {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
  };
  theme?: {
    primaryColor?: string;
  };
  fontStyles?: {
    fontFamily: string;
  };
  agentAvatar?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  theme, 
  fontStyles,
  agentAvatar 
}) => {

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: message.isUser ? 'flex-end' : 'flex-start',
        marginBottom: '8px',
        alignItems: 'flex-start',
        gap: '8px'
      }}
    >
      {/* Bot Avatar */}
      {!message.isUser && (
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
      )}

      {/* Message Bubble */}
      <div
        style={{
          maxWidth: '80%',
          padding: `8px 12px `,
          paddingTop: !message.isUser ? '0px' : '8px',
          borderRadius: '12px',
          backgroundColor: message.isUser 
            ? (theme?.primaryColor || '#4F46E5')
            : '#f1f3f4',
          color: message.isUser ? '#fff' : '#333',
          fontSize: '14px',
          lineHeight: '1.4',
          wordWrap: 'break-word',
          ...fontStyles
        }}
      >
        {message.isUser ? (
          message.text
        ) : (
          <ReactMarkdown>{message.text}</ReactMarkdown>
        )}
        
        {/* Timestamp */}
        <div style={{
          fontSize: '11px',
          color: message.isUser ? 'rgba(255,255,255,0.7)' : '#999',
          marginTop: '4px',
          textAlign: message.isUser ? 'right' : 'left'
        }}>
          {formatTimestamp(message.timestamp)}
        </div>
      </div>
    </div>
  );
};
