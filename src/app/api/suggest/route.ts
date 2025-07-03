import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  const { currentText } = await req.json();

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
      Continue this blog post intelligently and naturally:
      ---
      ${currentText}
      ---
      Continue writing the next sentence or paragraph:
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestion = response.text();

    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error('Gemini Suggestion Error:', error);
    return NextResponse.json({ suggestion: '', error: 'Failed to generate suggestion' }, { status: 500 });
  }
}
