"use client";

import { useState } from "react";

export default function TestPage() {
  const [topic, setTopic] = useState("meditation");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testAPI = async (endpoint: string) => {
    setLoading(true);
    setResult("");

    try {
      console.log(`Testing ${endpoint} with topic: ${topic}`);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();

      console.log("Response status:", res.status);
      console.log("Response data:", data);

      if (data.error) {
        setResult(`ERROR: ${data.error}`);
      } else if (data.blog) {
        setResult(`SUCCESS: ${data.blog.substring(0, 500)}...`);
      } else {
        setResult("UNKNOWN: No error or blog in response");
      }
    } catch (error) {
      console.error("Test error:", error);
      setResult(
        `FETCH ERROR: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>

      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter topic"
        className="w-full p-2 border rounded mb-4"
      />

      <div className="space-y-2 mb-4">
        <button
          onClick={() => testAPI("/api/generate")}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded mr-2 disabled:opacity-50"
        >
          Test Original API
        </button>

        <button
          onClick={() => testAPI("/api/generate-simple")}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          Test Simple API
        </button>
      </div>

      {loading && <p>Testing...</p>}

      {result && (
        <div className="mt-4 p-4 bg-gray-100 border rounded">
          <h3 className="font-bold mb-2">Result:</h3>
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
}
