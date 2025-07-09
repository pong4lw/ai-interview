'use client';

import { useState } from 'react';
import { Recorder } from '../components/Recorder';

export default function Page() {
  const [step, setStep] = useState(1);
  const [question, setQuestion] = useState("まずは自己紹介をお願いします。");
  const [answer, setAnswer] = useState('');
  const [history, setHistory] = useState<{ q: string; a: string }[]>([]);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    setLoading(true);
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer }),
    });

    const text = await res.text();
    try {
      const data = JSON.parse(text);
      setHistory([...history, { q: question, a: answer }]);
      setQuestion(data.nextQuestion);
      setFeedback(data.feedback);
      setAnswer('');
      setStep(step + 1);
    } catch (err) {
      console.error("JSON parse error:", err, text);
      setFeedback("API応答の読み取りに失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">AI面接練習（Step {step}）</h1>
      <p className="mb-2 font-medium">質問: {question}</p>
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="w-full border p-2 rounded mb-2"
        placeholder="回答を入力してください"
      />
      <Recorder onText={(text) => setAnswer(text)} />
      <button
        onClick={handleNext}
        disabled={loading || !answer}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? '送信中...' : '回答を送信'}
      </button>

      {feedback && (
        <div className="mt-6 p-4 border rounded bg-gray-100">
          <h2 className="font-bold">フィードバック</h2>
          <p className="mt-2 whitespace-pre-line">{feedback}</p>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold">これまでのやりとり</h3>
          {history.map((h, i) => (
            <div key={i} className="mt-2 p-2 border rounded">
              <p><strong>Q{i + 1}:</strong> {h.q}</p>
              <p><strong>A:</strong> {h.a}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
