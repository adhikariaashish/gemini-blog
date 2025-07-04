import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  const { topic } = await req.json();

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: `Write a detailed blog post about: ${topic}` }],
        },
      ],
    });

    const fullBlog = result.response.text();

    return NextResponse.json({ blog: fullBlog });
  } catch (error) {
    console.error('Gemini Blog Error:', error);
    return NextResponse.json({ blog: '', error: 'Failed to generate blog' }, { status: 500 });
  }
}
