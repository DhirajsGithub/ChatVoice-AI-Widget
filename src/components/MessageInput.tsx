import React, { useEffect, useRef } from 'react';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onMicClick: () => void;
  isLoading: boolean;
  isRecording: boolean;
  theme?: {
    primaryColor?: string;
  };
  fontStyles?: {
    fontFamily: string;
  };
}

export const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  onKeyPress,
  onMicClick,
  isLoading,
  isRecording,
  theme,
  fontStyles
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 100; // maxHeight from CSS
      textarea.style.height = Math.min(scrollHeight, maxHeight) + 'px';
    }
  }, [value]);
  return (
    <div style={{ padding: '12px', borderTop: '1px solid #e0e0e0' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Type your message..."
          disabled={isLoading}
          rows={1}
          style={{
            flex: 1,
            minHeight: '40px',
            maxHeight: '100px',
            padding: '10px 12px',
            border: '1px solid #ddd',
            borderRadius: '20px',
            resize: 'none',
            outline: 'none',
            fontSize: '14px',
            lineHeight: '20px',
            overflow: 'hidden',
            ...fontStyles
          }}
        />
        <button
          onClick={onMicClick}
          disabled={isLoading}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: isRecording ? '2px solid #ff4444' : '2px solid transparent',
            backgroundColor: isRecording 
              ? '#fff'
              : (theme?.primaryColor || '#4F46E5'),
            color: isRecording ? '#ff4444' : '#fff',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            transition: 'all 0.3s ease',
            transform: isRecording ? 'scale(1.05)' : 'scale(1)',
            boxShadow: isRecording 
              ? '0 0 15px rgba(255, 68, 68, 0.4), inset 0 0 10px rgba(255, 68, 68, 0.1)'
              : '0 2px 8px rgba(0,0,0,0.15)',
            position: 'relative',
            overflow: 'hidden'
          }}
          title={isRecording ? 'Stop recording' : 'Start voice recording'}
        >
          {isRecording ? (
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#ff4444',
              borderRadius: '2px'
            }} />
          ) : (
            '🎤'
          )}
          {isRecording && (
            <div style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '8px',
              height: '8px',
              backgroundColor: '#ff4444',
              borderRadius: '50%',
              animation: 'pulse 1.5s infinite'
            }} />
          )}
        </button>
        <button
          onClick={onSend}
          disabled={!value.trim() || isLoading}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: value.trim() && !isLoading 
              ? (theme?.primaryColor || '#4F46E5')
              : '#ccc',
            color: '#fff',
            cursor: value.trim() && !isLoading ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px'
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
};
