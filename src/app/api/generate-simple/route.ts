import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic || !topic.trim()) {
      return NextResponse.json(
        { blog: "", error: "Topic is required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { blog: "", error: "API key not configured" },
        { status: 500 }
      );
    }

    console.log("Starting blog generation for:", topic);

    // Simple model initialization
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Simplified prompt
    const prompt = `Write a detailed and informative blog post about ${topic}. Include an introduction, main content with key points, and a conclusion. Make it engaging and at least 400 words.`;

    console.log("Generating content...");
    const result = await model.generateContent(prompt);

    if (!result || !result.response) {
      throw new Error("No response from Gemini API");
    }

    const response = await result.response;

    if (!response) {
      throw new Error("Empty response object");
    }

    const text = response.text();

    if (!text || text.trim().length === 0) {
      throw new Error("Empty text response");
    }

    console.log("Blog generated successfully, length:", text.length);
    return NextResponse.json({ blog: text });
  } catch (error: unknown) {
    console.error("Blog generation error:", error);

    // More detailed error information
    let errorMessage = "Unknown error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
      console.error("Error details:", {
        message: error.message,
        type: error.constructor.name,
        stack: error.stack || "No stack trace",
      });
    }

    return NextResponse.json(
      {
        blog: "",
        error: `Blog generation failed: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
