import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { title, currentText } = await req.json();

    // Add validation
    if (!title || !title.trim()) {
      return NextResponse.json(
        { suggestion: "", error: "Title is required" },
        { status: 400 }
      );
    }

    if (!currentText) {
      return NextResponse.json(
        { suggestion: "", error: "Current text is required" },
        { status: 400 }
      );
    }

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set");
      return NextResponse.json(
        { suggestion: "", error: "API key not configured" },
        { status: 500 }
      );
    }

    console.log("Generating suggestion for title:", title);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an AI writing assistant. Given a blog title and the current text being written, provide a natural continuation.

Blog Title: "${title}"

Current text: "${currentText}"

Provide ONLY a short continuation (5-15 words) that naturally follows the current text. Do not repeat what's already written. Make it relevant to the blog title. Do not include quotation marks or explanations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestion = response.text().trim();

    console.log("Generated suggestion:", suggestion);

    return NextResponse.json({ suggestion });
  } catch (error: unknown) {
    let message = "Unknown error";
    if (error instanceof Error) {
      message = error.message;
    }

    console.error("Suggestion Error:", error);
    console.error("Error message:", message);

    return NextResponse.json(
      { suggestion: "", error: message },
      { status: 500 }
    );
  }
}
