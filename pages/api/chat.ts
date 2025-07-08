// app/api/chat/route.ts (Next.js App Router用)

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { answer } = await req.json();

console.log(`${process.env.OPENAI_API_KEY}`);
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // gpt-4 でも可
        messages: [
          {
            role: "system",
            content: "あなたは親切な日本語の面接官です。回答にフィードバックし、次の質問をしてください。"
          },
          {
            role: "user",
            content: `面接の回答: ${answer}`
          }
        ],
        temperature: 0.8
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("OpenAI API error:", errorText);
      return NextResponse.json({ feedback: "OpenAI APIエラー", nextQuestion: "もう一度お願いします。" }, { status: 500 });
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content ?? "";

    const match = text.match(/次の質問[:：]?\s*(.*)/);

    return NextResponse.json({
      feedback: text,
      nextQuestion: match ? match[1] : "次の質問に進みましょう。"
    });
  } catch (err) {
    console.error("APIエラー:", err);
    return NextResponse.json({ feedback: "サーバーエラーが発生しました。", nextQuestion: "もう一度お願いします。" }, { status: 500 });
  }
}
