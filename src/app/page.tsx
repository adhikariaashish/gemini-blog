'use client';

import { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [input, setInput] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [loadingBlog, setLoadingBlog] = useState(false);

  const fetchSuggestion = debounce(async (text: string) => {
    if (!text.trim()) {
      setSuggestion('');
      return;
    }

    setLoadingSuggest(true);

    try {
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentText: text }),
      });

      const data = await res.json();
      setSuggestion(data.suggestion || '');
    } catch (err) {
      console.error('Suggestion error:', err);
    } finally {
      setLoadingSuggest(false);
    }
  }, 1000);

  useEffect(() => {
    fetchSuggestion(input);
  }, [input]);

  const applySuggestion = () => {
    if (suggestion) {
      setInput((prev) => prev + ' ' + suggestion.trim());
      setSuggestion('');
    }
  };

  const generateFullBlog = async () => {
    if (!topic.trim()) return;

    setLoadingBlog(true);
    setInput('');
    setSuggestion('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();
      setInput(data.blog || '');
    } catch (err) {
      console.error('Blog generation error:', err);
    } finally {
      setLoadingBlog(false);
    }
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🧠 Gemini Blog Assistant</h1>

      {/* Full Blog Generator */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter blog topic (e.g., Benefits of Meditation)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full p-3 border rounded mb-2"
        />
        <button
          onClick={generateFullBlog}
          disabled={loadingBlog}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loadingBlog ? 'Generating Blog...' : '✍️ Generate Full Blog'}
        </button>
      </div>

      {/* Blog Writing Box */}
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full p-4 border rounded mb-4"
        rows={12}
        placeholder="Start writing your blog..."
      />

      {/* Suggestion */}
      {suggestion && (
        <div className="bg-gray-100 border-l-4 border-blue-400 p-3 mb-4">
          <p className="text-sm text-gray-700">
            💡 <strong>AI Suggestion:</strong> {suggestion}
          </p>
          <button
            onClick={applySuggestion}
            className="mt-2 text-blue-600 underline"
          >
            Use Suggestion
          </button>
        </div>
      )}

      {/* Loading Suggestion */}
      {loadingSuggest && <p className="text-sm text-gray-500">💭 AI thinking...</p>}
    </main>
  );
}
