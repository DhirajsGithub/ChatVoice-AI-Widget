import React, { useState } from 'react';
import { FALLBACK_BOT_AVATAR } from '../constants/avatars';
import { VoiceSettings } from './VoiceSettings';

interface ChatHeaderProps {
  agent?: {
    name?: string;
    avatar?: string;
  };
  theme?: {
    primaryColor?: string;
  };
  onClose: () => void;
  voice?: any; // useVoice hook return type
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ agent, theme, onClose, voice }) => {
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
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
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Voice Settings Button */}
          {voice && voice.isSupported && (
            <button
              onClick={() => setShowVoiceSettings(!showVoiceSettings)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '16px',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Voice Settings"
            >
              🎤
            </button>
          )}
          
          {/* Close Button */}
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
      </div>
      
      {/* Voice Settings Panel */}
      {showVoiceSettings && voice && (
        <VoiceSettings
          voice={voice}
          theme={theme}
          onClose={() => setShowVoiceSettings(false)}
        />
      )}
    </div>
  );
};
