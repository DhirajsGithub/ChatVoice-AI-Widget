import React, { useState } from 'react';

interface VoiceSettingsProps {
  voice: any; // useVoice hook return type
  theme?: {
    primaryColor?: string;
  };
  onClose: () => void;
  onLanguageChange?: (language: string) => void;
}

export const VoiceSettings: React.FC<VoiceSettingsProps> = ({ voice, theme, onClose, onLanguageChange }) => {
  // Load settings from localStorage or use defaults
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem('agent-widget-voice-language') || 'en-US';
  });
  const [speechRate, setSpeechRate] = useState(() => {
    return parseFloat(localStorage.getItem('agent-widget-speech-rate') || '1');
  });
  const [speechPitch, setSpeechPitch] = useState(() => {
    return parseFloat(localStorage.getItem('agent-widget-speech-pitch') || '1');
  });
  const [autoSpeak, setAutoSpeak] = useState(() => {
    return localStorage.getItem('agent-widget-auto-speak') !== 'false';
  });

  if (!voice || !voice.isSupported) {
    return (
      <div style={{
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: '8px',
        padding: '16px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        minWidth: '280px',
        zIndex: 1000
      }}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          <p>🎤 Voice features not supported in this browser</p>
          <p style={{ fontSize: '12px', marginTop: '8px' }}>
            Try using Chrome or Edge for full voice support
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            marginTop: '12px',
            padding: '8px 16px',
            backgroundColor: theme?.primaryColor || '#4F46E5',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Close
        </button>
      </div>
    );
  }

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'hi-IN', name: 'Hindi (India)' },
    { code: 'es-ES', name: 'Spanish (Spain)' },
    { code: 'fr-FR', name: 'French (France)' },
    { code: 'de-DE', name: 'German (Germany)' },
    { code: 'it-IT', name: 'Italian (Italy)' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)' },
    { code: 'ja-JP', name: 'Japanese (Japan)' },
    { code: 'ko-KR', name: 'Korean (South Korea)' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
  ];

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    localStorage.setItem('agent-widget-voice-language', language);
    // Notify parent component of language change
    if (onLanguageChange) {
      onLanguageChange(language);
    }
  };

  const handleRateChange = (rate: number) => {
    setSpeechRate(rate);
    localStorage.setItem('agent-widget-speech-rate', rate.toString());
  };

  const handlePitchChange = (pitch: number) => {
    setSpeechPitch(pitch);
    localStorage.setItem('agent-widget-speech-pitch', pitch.toString());
  };

  const handleAutoSpeakChange = (enabled: boolean) => {
    setAutoSpeak(enabled);
    localStorage.setItem('agent-widget-auto-speak', enabled.toString());
  };

  const testVoice = () => {
    // Multilingual test messages
    const testMessages: { [key: string]: string } = {
      'en-US': "Hello! This is a test of the voice settings.",
      'hi-IN': "नमस्ते! यह वॉइस सेटिंग्स का परीक्षण है।",
      'es-ES': "¡Hola! Esta es una prueba de la configuración de voz.",
      'fr-FR': "Bonjour! Ceci est un test des paramètres vocaux.",
      'de-DE': "Hallo! Dies ist ein Test der Spracheinstellungen.",
      'it-IT': "Ciao! Questo è un test delle impostazioni vocali.",
      'pt-BR': "Olá! Este é um teste das configurações de voz.",
      'ja-JP': "こんにちは！これは音声設定のテストです。",
      'ko-KR': "안녕하세요! 이것은 음성 설정 테스트입니다.",
      'zh-CN': "你好！这是语音设置的测试。"
    };
    
    const testText = testMessages[selectedLanguage] || testMessages['en-US'];
    voice.speak(testText, {
      language: selectedLanguage,
      rate: speechRate,
      pitch: speechPitch
    });
  };

  return (
    <div style={{
      position: 'absolute',
      top: '100%',
      right: 0,
      marginTop: '8px',
      padding: '16px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      minWidth: '300px',
      maxWidth: '320px',
      maxHeight: '70vh',
      overflowY: 'auto',
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>Voice Settings</h3>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          ×
        </button>
      </div>

      {/* Language Selection */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
          Language
        </label>
        <select
          value={selectedLanguage}
          onChange={(e) => handleLanguageChange(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Speech Rate */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
          Speech Rate: {speechRate.toFixed(1)}x
        </label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={speechRate}
          onChange={(e) => handleRateChange(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      {/* Speech Pitch */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
          Speech Pitch: {speechPitch.toFixed(1)}x
        </label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={speechPitch}
          onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      {/* Auto-speak toggle */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
          <input
            type="checkbox"
            checked={autoSpeak}
            onChange={(e) => handleAutoSpeakChange(e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          Auto-speak AI responses
        </label>
      </div>

      {/* Voice Control Buttons - Fixed height container */}
      <div style={{ 
        minHeight: '50px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '8px',
        marginBottom: '12px'
      }}>
        {voice.isSpeaking ? (
          <button
            onClick={() => voice.stopSpeaking()}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#ff4444',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ⏹️ Stop Speaking
          </button>
        ) : (
          <button
            onClick={testVoice}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: theme?.primaryColor || '#4F46E5',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🔊 Test Voice
          </button>
        )}
      </div>

      {/* Error Display */}
      {voice.error && (
        <div style={{
          padding: '8px',
          backgroundColor: '#fee',
          color: '#c33',
          borderRadius: '4px',
          fontSize: '12px',
          marginBottom: '12px'
        }}>
          {voice.error}
        </div>
      )}

      {/* Status */}
      <div style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
        {voice.isListening && '🎤 Listening...'}
        {voice.isSpeaking && '🔊 Speaking...'}
        {!voice.isListening && !voice.isSpeaking && 'Ready'}
      </div>
    </div>
  );
};
