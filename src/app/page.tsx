"use client";

import { useState, useCallback, useRef } from "react";
import debounce from "lodash.debounce";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [blog, setBlog] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // AI-Assisted Blog states
  const [blogTitle, setBlogTitle] = useState("");
  const [assistedBlogText, setAssistedBlogText] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerateBlog = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setError("");
    setBlog("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate blog");
      }

      if (data.error) {
        setError(data.error);
        return;
      }

      if (!data.blog || data.blog.trim().length === 0) {
        setError("No content returned from the AI service.");
        return;
      }

      setBlog(data.blog);
    } catch (err: unknown) {
      console.error("Blog generation error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong while generating the blog.");
      }
    } finally {
      setLoading(false);
    }
  };

  // AI-assisted blog functions
  const getSuggestion = async (title: string, currentText: string) => {
    if (!title.trim() || !currentText.trim() || currentText.length < 10) {
      setSuggestion("");
      setShowSuggestion(false);
      return;
    }

    setLoadingSuggestion(true);
    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, currentText }),
      });

      const data = await res.json();
      if (data.suggestion && !data.error) {
        setSuggestion(data.suggestion);
        setShowSuggestion(true);
      } else {
        setSuggestion("");
        setShowSuggestion(false);
      }
    } catch (error) {
      console.error("Suggestion error:", error);
      setSuggestion("");
      setShowSuggestion(false);
    } finally {
      setLoadingSuggestion(false);
    }
  };

  // Debounced suggestion function
  const debouncedGetSuggestion = useCallback(
    debounce((title: string, currentText: string) => {
      getSuggestion(title, currentText);
    }, 1000),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleAssistedBlogChange = (value: string) => {
    setAssistedBlogText(value);
    setShowSuggestion(false);

    if (blogTitle.trim() && value.trim().length >= 10) {
      debouncedGetSuggestion(blogTitle, value);
    }
  };

  const acceptSuggestion = () => {
    if (suggestion) {
      const newText = assistedBlogText + " " + suggestion;
      setAssistedBlogText(newText);
      setSuggestion("");
      setShowSuggestion(false);

      // Focus back to textarea
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newText.length, newText.length);
      }
    }
  };

  const rejectSuggestion = () => {
    setSuggestion("");
    setShowSuggestion(false);
  };

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">AI Blog Generator</h1>

      {/* Full Blog Generation Section */}
      <section className="mb-12 p-6 bg-white border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Generate Full Blog</h2>

        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a blog topic, e.g. meditation"
          className="w-full p-2 border rounded mb-4"
        />

        <button
          onClick={handleGenerateBlog}
          className="px-4 py-2 bg-blue-600 text-white rounded mb-4 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Full Blog"}
        </button>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {blog && (
          <div className="whitespace-pre-wrap p-4 bg-gray-100 border rounded mt-4 text-black">
            {blog}
          </div>
        )}
      </section>

      {/* AI-Assisted Blog Section */}
      <section className="p-6 bg-white border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">AI-ASSISTED BLOG</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Blog Title</label>
          <input
            type="text"
            value={blogTitle}
            onChange={(e) => setBlogTitle(e.target.value)}
            placeholder="Enter your blog title"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Blog Content</label>
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={assistedBlogText}
              onChange={(e) => handleAssistedBlogChange(e.target.value)}
              placeholder="Start writing your blog... (AI will suggest completions as you type)"
              className="w-full p-3 border rounded min-h-[300px] text-black resize-y"
              disabled={!blogTitle.trim()}
            />

            {/* AI Suggestion Overlay */}
            {showSuggestion && suggestion && (
              <div className="absolute bottom-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-sm shadow-lg">
                <div className="text-sm text-gray-600 mb-2">AI Suggestion:</div>
                <div className="text-sm text-blue-800 mb-3 italic">
                  &ldquo;{suggestion}&rdquo;
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={acceptSuggestion}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={rejectSuggestion}
                    className="px-3 py-1 bg-gray-400 text-white text-xs rounded hover:bg-gray-500"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}

            {/* Loading indicator for suggestions */}
            {loadingSuggestion && (
              <div className="absolute bottom-4 right-4 bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                <div className="text-xs text-yellow-800">
                  Getting suggestion...
                </div>
              </div>
            )}
          </div>

          {!blogTitle.trim() && (
            <p className="text-sm text-gray-500 mt-2">
              Please enter a blog title first to enable AI assistance.
            </p>
          )}
        </div>

        <div className="text-sm text-gray-600">
          <p>
            💡 <strong>How it works:</strong> As you type, AI will suggest
            completions based on your title and content. Suggestions appear
            after you&apos;ve written at least 10 characters.
          </p>
        </div>
      </section>
    </main>
  );
}
