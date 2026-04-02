// Speech Recognition types for Web Speech API
export interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

export interface SpeechRecognitionType {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onstart: (() => void) | null;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  addEventListener: typeof EventTarget.prototype.addEventListener;
  dispatchEvent: typeof EventTarget.prototype.dispatchEvent;
  removeEventListener: typeof EventTarget.prototype.removeEventListener;
}

export interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition?: new () => SpeechRecognitionType;
  webkitSpeechRecognition?: new () => SpeechRecognitionType;
}
