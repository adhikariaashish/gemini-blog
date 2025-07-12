const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("your_api_key_here");

async function testGemini() {
  try {
    console.log("Testing Gemini API...");

    // Try different model names
    const modelNames = ["gemini-1.5-flash", "gemini-pro", "models/gemini-pro"];

    for (const modelName of modelNames) {
      try {
        console.log(`\nTesting model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });

        const result = await model.generateContent(
          "Write a short paragraph about meditation."
        );
        const response = await result.response;
        const text = response.text();

        console.log(`✅ Success with ${modelName}`);
        console.log("Response:", text.substring(0, 100) + "...");
        break;
      } catch (error) {
        console.log(`❌ Failed with ${modelName}:`, error.message);
      }
    }
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testGemini();
