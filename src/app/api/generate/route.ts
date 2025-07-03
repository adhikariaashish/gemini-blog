import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  const { topic } = await req.json();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(
      `Write a detailed and informative blog post on the topic: "${topic}". The tone should be professional and easy to read.`
    );

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ blog: text });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json({ error: "Failed to generate blog" }, { status: 500 });
  }
}
