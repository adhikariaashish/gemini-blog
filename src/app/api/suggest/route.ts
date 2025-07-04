import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  const { currentText } = await req.json();

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: `Continue this blog post:\n${currentText}` }],
        },
      ],
    });

    const suggestion = result.response.text();

    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error('Gemini Suggestion Error:', error);
    return NextResponse.json({ suggestion: '', error: 'Gemini API failed' }, { status: 500 });
  }
}
