'use client';
import { useState } from 'react';

export const Recorder = ({ onText }: { onText: (text: string) => void }) => {
  const [isRecording,setIsRecording] = useState(false);

  const startRecognition = () => {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      alert('このブラウザでは音声認識がサポートされていません。');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      console.log('音声認識結果:', text);
      onText(text);
    };

recognition.onerror = (event: any) => {
  console.error('🎤 音声認識エラー:', event.error);

  switch (event.error) {
    case 'aborted':
      alert('音声認識がキャンセルされました。もう一度お試しください。');
      break;
    case 'not-allowed':
      alert('マイクの使用が許可されていません。ブラウザの設定を確認してください。');
      break;
    case 'audio-capture':
      alert('マイクが見つかりません。接続をご確認ください。');
      break;
    case 'network':
      alert('ネットワークエラーにより音声認識が中断されました。');
      break;
    case 'no-speech':
      alert('音声が検出されませんでした。もう一度話してください。');
      break;
    default:
      alert(`音声認識中にエラーが発生しました: ${event.error}`);
  }
};

    recognition.onend = () => {
      console.log('音声認識終了');
      setIsRecording(false);
    };

    recognition.start();
    setIsRecording(true);
    console.log('音声認識開始');
  };

  return (
{isRecording ? "録音中...":"停止中"}
    <button
      onClick={startRecognition}
      className="text-sm bg-green-600 text-white px-3 py-1 rounded"
    >
      🎙 音声で回答
    </button>
  );
};
