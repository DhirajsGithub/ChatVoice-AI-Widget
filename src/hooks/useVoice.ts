import { useState, useRef, useCallback, useEffect } from 'react';

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

export interface VoiceOptions {
  language?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
}

export interface VoiceState {
  isListening: boolean;
  isSpeaking: boolean;
  isSupported: boolean;
  error: string | null;
  transcript: string;
  supportedLanguages: string[];
  availableVoices: SpeechSynthesisVoice[];
}

// Browser compatibility check
const isSpeechRecognitionSupported = (): boolean => {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
};

const isSpeechSynthesisSupported = (): boolean => {
  return 'speechSynthesis' in window;
};

export const useVoice = (defaultLanguage: string = 'en-US') => {
  const [state, setState] = useState<VoiceState>({
    isListening: false,
    isSpeaking: false,
    isSupported: isSpeechRecognitionSupported() && isSpeechSynthesisSupported(),
    error: null,
    transcript: '',
    supportedLanguages: ['en-US', 'es-ES', 'fr-FR'],
    availableVoices: [],
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech recognition
  const initializeRecognition = useCallback(() => {
    if (!isSpeechRecognitionSupported()) {
      setState(prev => ({ ...prev, error: 'Speech recognition not supported' }));
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = defaultLanguage;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setState(prev => ({ ...prev, isListening: true, error: null }));
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setState(prev => ({ 
        ...prev, 
        transcript: finalTranscript || interimTranscript 
      }));
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      let errorMessage = 'Speech recognition error';
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'Microphone not found or not accessible.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone permission denied.';
          break;
        case 'network':
          errorMessage = 'Network error occurred.';
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }

      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        isListening: false 
      }));
    };

    recognition.onend = () => {
      setState(prev => ({ ...prev, isListening: false }));
    };

    recognitionRef.current = recognition;
  }, [defaultLanguage]);

  // Initialize speech synthesis
  const initializeSynthesis = useCallback(() => {
    if (!isSpeechSynthesisSupported()) {
      setState(prev => ({ ...prev, error: 'Speech synthesis not supported' }));
      return;
    }

    synthesisRef.current = window.speechSynthesis;

    // Load available voices
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setState(prev => ({ ...prev, availableVoices: voices }));
    };

    // Load voices immediately and when they change
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeRecognition();
    initializeSynthesis();
  }, [initializeRecognition, initializeSynthesis]);

  // Start listening
  const startListening = useCallback((language?: string) => {
    if (!recognitionRef.current) {
      setState(prev => ({ ...prev, error: 'Speech recognition not initialized' }));
      return;
    }

    if (language) {
      recognitionRef.current.lang = language;
    }

    try {
      setState(prev => ({ ...prev, transcript: '', error: null }));
      recognitionRef.current.start();
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to start speech recognition',
        isListening: false 
      }));
    }
  }, []);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current && state.isListening) {
      recognitionRef.current.stop();
    }
  }, [state.isListening]);

  // Find best voice for language
  const findBestVoice = useCallback((language: string, voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
    // First try exact match
    let voice = voices.find(v => v.lang === language);
    if (voice) return voice;
    
    // Try language family match (e.g., 'en' for 'en-US')
    const langFamily = language.split('-')[0];
    voice = voices.find(v => v.lang.startsWith(langFamily));
    if (voice) return voice;
    
    // Try similar languages
    const languageMap: { [key: string]: string[] } = {
      'es-ES': ['es-MX', 'es-AR', 'es-CO'],
      'fr-FR': ['fr-CA', 'fr-BE'],
      'de-DE': ['de-AT', 'de-CH'],
      'it-IT': ['it-CH'],
      'pt-BR': ['pt-PT'],
      'en-US': ['en-GB', 'en-AU', 'en-CA', 'en-IN']
    };
    
    const alternatives = languageMap[language] || [];
    for (const alt of alternatives) {
      voice = voices.find(v => v.lang === alt);
      if (voice) return voice;
    }
    
    // Fallback to English
    voice = voices.find(v => v.lang.startsWith('en'));
    if (voice) return voice;
    
    // Last resort - any voice
    return voices[0] || null;
  }, []);

  // Speak text using the selected language from voice settings
  const speak = useCallback((text: string, options: VoiceOptions = {}) => {
    if (!synthesisRef.current) {
      setState(prev => ({ ...prev, error: 'Speech synthesis not available' }));
      return;
    }

    // Stop any current speech
    synthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Use the language from options (which comes from voice settings)
    const selectedLanguage = options.language || 'en-US';
    
    // Find the best voice for the selected language
    const voices = state.availableVoices;
    const bestVoice = findBestVoice(selectedLanguage, voices);
    
    if (bestVoice) {
      utterance.voice = bestVoice;
      utterance.lang = bestVoice.lang;
    } else {
      utterance.lang = selectedLanguage;
    }

    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

    utterance.onstart = () => {
      setState(prev => ({ ...prev, isSpeaking: true, error: null }));
    };

    utterance.onend = () => {
      setState(prev => ({ ...prev, isSpeaking: false }));
    };

    utterance.onerror = (event) => {
      if (event.error !== 'interrupted') {
        setState(prev => ({ 
          ...prev, 
          error: `Speech synthesis error: ${event.error}`,
          isSpeaking: false 
        }));
      } else {
        setState(prev => ({ ...prev, isSpeaking: false }));
      }
    };

    synthesisRef.current.speak(utterance);
  }, [state.availableVoices, findBestVoice]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setState(prev => ({ ...prev, isSpeaking: false }));
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Get final transcript and clear it
  const getTranscript = useCallback(() => {
    const transcript = state.transcript;
    setState(prev => ({ ...prev, transcript: '' }));
    return transcript;
  }, [state.transcript]);

  return {
    // State
    ...state,
    
    // Actions
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    clearError,
    getTranscript,
    
    // Utilities
    isSupported: state.isSupported,
  };
};
