import React from 'react';
import { FALLBACK_BOT_AVATAR } from '../constants/avatars';

interface ChatHeaderProps {
  agent?: {
    name?: string;
    avatar?: string;
  };
  theme?: {
    primaryColor?: string;
  };
  onClose: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ agent, theme, onClose }) => {
  return (
    <div
      style={{
        background: theme?.primaryColor || '#4F46E5',
        color: '#fff',
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src={agent?.avatar || FALLBACK_BOT_AVATAR}
            alt="avatar"
            style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'contain' }}
          />
        <span>{agent?.name || 'HelperBot'}</span>
      </div>
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#fff',
          fontSize: '18px',
          cursor: 'pointer',
        }}
      >
        ×
      </button>
    </div>
  );
};
