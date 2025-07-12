import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    // Add validation
    if (!topic || !topic.trim()) {
      return NextResponse.json(
        { blog: "", error: "Topic is required" },
        { status: 400 }
      );
    }

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set");
      return NextResponse.json(
        { blog: "", error: "API key not configured" },
        { status: 500 }
      );
    }

    console.log("Generating blog for topic:", topic);

    // Try different model names as fallback
    const modelNames = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
    let model;
    let modelUsed = "";

    for (const modelName of modelNames) {
      try {
        console.log(`Trying model: ${modelName}`);
        model = genAI.getGenerativeModel({ model: modelName });
        modelUsed = modelName;
        break;
      } catch (error) {
        console.log(`Failed to create model ${modelName}:`, error);
        continue;
      }
    }

    if (!model) {
      return NextResponse.json(
        { blog: "", error: "Could not initialize any model" },
        { status: 500 }
      );
    }

    console.log(`Using model: ${modelUsed}`);

    const prompt = `Write a comprehensive and engaging blog post about "${topic}". 
    
    The blog should include:
    - An engaging title
    - An introduction that hooks the reader
    - Well-structured main content with multiple sections
    - Practical tips or insights
    - A compelling conclusion
    
    Make the content informative, engaging, and at least 500 words long.
    
    Topic: ${topic}`;

    console.log("Calling Gemini API...");
    const result = await model.generateContent(prompt);

    console.log("Getting response...");
    const response = await result.response;
    const fullBlog = response.text();

    console.log("Generated blog length:", fullBlog?.length || 0);

    if (!fullBlog || fullBlog.trim().length === 0) {
      console.error("Empty response from Gemini API");
      return NextResponse.json(
        { blog: "", error: "No content generated" },
        { status: 500 }
      );
    }

    return NextResponse.json({ blog: fullBlog });
  } catch (error: unknown) {
    let message = "Unknown error";
    if (error instanceof Error) {
      message = error.message;
    }

    console.error("Gemini Blog Error:", error);
    console.error("Error message:", message);

    return NextResponse.json({ blog: "", error: message }, { status: 500 });
  }
}
