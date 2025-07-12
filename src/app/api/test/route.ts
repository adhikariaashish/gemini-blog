import { GoogleGenerativeAI } from "@google/generative-ai";

// Test the API directly
const testAPI = async () => {
  try {
    const genAI = new GoogleGenerativeAI(
      "AIzaSyCq1xUlzmVXEAOezOsQCp4s4CnSPKuktDA"
    );
    console.log("API initialized...");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("Model created...");

    const result = await model.generateContent(
      "Write a short sentence about meditation."
    );
    console.log("Content generated...");

    const response = await result.response;
    console.log("Response obtained...");

    const text = response.text();
    console.log("Text extracted:", text);
  } catch (error) {
    console.error("API test failed:", error);
  }
};

testAPI();
