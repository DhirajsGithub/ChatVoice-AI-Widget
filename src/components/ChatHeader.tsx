import React, { useState, useEffect } from 'react';
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
  enableVoice?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ agent, theme, onClose, voice, enableVoice }) => {
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem('agent-widget-voice-language') || 'en-US';
  });
  
  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      const newLanguage = localStorage.getItem('agent-widget-voice-language') || 'en-US';
      setSelectedLanguage(newLanguage);
    };
    
    // Listen for storage changes
    window.addEventListener('storage', handleLanguageChange);
    
    // Also listen for custom language change events
    window.addEventListener('agent-widget-language-changed', handleLanguageChange);
    
    return () => {
      window.removeEventListener('storage', handleLanguageChange);
      window.removeEventListener('agent-widget-language-changed', handleLanguageChange);
    };
  }, []);
  
  // Language flag mapping
  const languageFlags: { [key: string]: string } = {
    'en-US': '🇺🇸',
    'hi-IN': '🇮🇳',
    'es-ES': '🇪🇸',
    'fr-FR': '🇫🇷',
    'de-DE': '🇩🇪',
    'it-IT': '🇮🇹',
    'pt-BR': '🇧🇷',
    'ja-JP': '🇯🇵',
    'ko-KR': '🇰🇷',
    'zh-CN': '🇨🇳'
  };
  
  const languageNames: { [key: string]: string } = {
    'en-US': 'Eng',
    'hi-IN': 'हिं',
    'es-ES': 'Esp',
    'fr-FR': 'Fra',
    'de-DE': 'Deu',
    'it-IT': 'Ita',
    'pt-BR': 'Por',
    'ja-JP': '日本語',
    'ko-KR': '한국어',
    'zh-CN': '中文'
  };

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
          {/* Voice Settings Button - Always show */}
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
              justifyContent: 'center',
              gap: '4px'
            }}
            title="Voice Settings"
          >
            ⚙️
            <span style={{ fontSize: '12px', fontWeight: '500' }}>
              {languageFlags[selectedLanguage]} {languageNames[selectedLanguage]}
            </span>
          </button>
          
          {/* Close Button - Bigger */}
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '26px',
              cursor: 'pointer',
              padding: '2px 6px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '28px',
              minHeight: '28px'
            }}
            title="Close"
          >
            ×
          </button>
        </div>
      </div>
      
      {/* Voice Settings Panel */}
      {showVoiceSettings && (
        <VoiceSettings
          voice={voice}
          theme={theme}
          enableVoice={enableVoice}
          onClose={() => setShowVoiceSettings(false)}
        />
      )}
    </div>
  );
};
