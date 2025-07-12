// src/app/api/list-models/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';


// Instantiate but do not use directly to avoid unused variable warning
const genAI = new GoogleGenerativeAI("YOUR_API_KEY_HERE");
// Reference genAI to avoid unused variable warning
void genAI;

export async function GET() {
  try {
    // The GoogleGenerativeAI SDK does not provide a listModels method.
    // Replace with a static list or fetch specific models as needed.
    const models = [
      { name: "gemini-pro", description: "Gemini Pro Model" },
      { name: "gemini-pro-vision", description: "Gemini Pro Vision Model" }
    ];
    return NextResponse.json(models);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
