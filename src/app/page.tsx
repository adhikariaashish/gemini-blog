'use client';

import { useState } from 'react';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState('');

  const generateBlog = async () => {
    setLoading(true);
    setBlog('');

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
    });

    const data = await res.json();
    setBlog(data.blog || 'Error generating blog.');
    setLoading(false);
  };

  return (
    <main className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">✍️ AI Blog Writer (Gemini)</h1>
      <textarea
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full p-3 border rounded mb-4"
        rows={3}
        placeholder="Enter your blog topic here..."
      />
      <button
        onClick={generateBlog}
        disabled={loading || !topic.trim()}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Generating...' : 'Generate Blog'}
      </button>
      {blog && (
        <div className="mt-8 p-4 bg-white border rounded shadow">
          <h2 className="text-xl font-semibold mb-2">📝 Generated Blog</h2>
          <p className="whitespace-pre-wrap">{blog}</p>
        </div>
      )}
    </main>
  );
}
