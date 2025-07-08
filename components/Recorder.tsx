'use client';
import { useEffect, useState } from 'react';

export const Recorder = ({ onText }: { onText: (text: string) => void }) => {
  const [isRecording, setIsRecording] = useState(false);

  const startRecognition = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) return alert('音声認識に非対応のブラウザです');

    const recognition = new SpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      onText(text);
    };

    recognition.onerror = (event: any) => {
      console.error("音声認識エラー:", event.error);
    };

    recognition.start();
    setIsRecording(true);

    recognition.onend = () => {
      setIsRecording(false);
    };
  };

  return (
    <button
      onClick={startRecognition}
      className="mt-2 px-4 py-1 text-sm text-white bg-green-600 rounded"
    >
      {isRecording ? '録音中...' : '音声で回答'}
    </button>
  );
};
