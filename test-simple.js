const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyCq1xUlzmVXEAOezOsQCp4s4CnSPKuktDA");

async function testGemini() {
  try {
    console.log("Testing Gemini API...");

    // Try the most common model name first
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log("Generating content...");
    const result = await model.generateContent(
      "Write a short paragraph about meditation."
    );

    console.log("Getting response...");
    const response = await result.response;
    const text = response.text();

    console.log("✅ Success!");
    console.log("Response:", text);
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Full error:", error);
  }
}

testGemini();
