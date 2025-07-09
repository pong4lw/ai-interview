import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { answer } = await req.json();

  // OpenAI に会話的なプロンプトを送る
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: "あなたはプロの日本語面接官です。候補者の回答を評価し、丁寧なフィードバックを出し、その後に1つだけ次の面接質問を出してください。"
        },
        {
          role: "user",
          content: `面接の回答: ${answer}`
        }
      ]
    })
  });

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || "";

  // 回答から「次の質問」部分を取り出す（正規表現などで）
  const match = content.match(/(次の質問[:：]?\s*)(.+)/i);
  const nextQuestion = match ? match[2].trim() : "次の質問に進みましょう。";

  return NextResponse.json({
    feedback: content,
    nextQuestion
  });
}
