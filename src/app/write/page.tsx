"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import debounce from "lodash.debounce";
import ReactMarkdown from "react-markdown";

export default function WritePage() {
  const router = useRouter();

  // Full blog generation states
  const [topic, setTopic] = useState("");
  const [blog, setBlog] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // AI-assisted blog states
  const [blogTitle, setBlogTitle] = useState("");
  const [assistedBlogText, setAssistedBlogText] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Publishing states
  const [publishing, setPublishing] = useState(false);
  const [authorName, setAuthorName] = useState("");

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
    [getSuggestion]
  );

  const handleAssistedBlogChange = (value: string) => {
    setAssistedBlogText(value);
    setShowSuggestion(false);

    if (blogTitle.trim() && value.trim().length >= 10) {
      debouncedGetSuggestion(blogTitle, value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab" && showSuggestion && suggestion) {
      e.preventDefault();
      acceptSuggestion();
    }
    if (e.key === "Escape" && showSuggestion) {
      e.preventDefault();
      rejectSuggestion();
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

  // Publishing functions
  const publishBlog = async (title: string, content: string) => {
    if (!title.trim() || !content.trim()) {
      alert("Please provide both title and content to publish.");
      return;
    }

    setPublishing(true);
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          author: authorName.trim() || "Anonymous",
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Blog published successfully!");
        router.push("/home");
      } else {
        alert(data.error || "Failed to publish blog");
      }
    } catch (error) {
      console.error("Publish error:", error);
      alert("Failed to publish blog");
    } finally {
      setPublishing(false);
    }
  };

  const publishGeneratedBlog = () => {
    publishBlog(topic, blog);
  };

  const publishAssistedBlog = () => {
    publishBlog(blogTitle, assistedBlogText);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link
              href="/home"
              className="text-2xl font-bold text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
            >
              AI Blog Hub
            </Link>
            <div className="flex gap-3 items-center">
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Your name (optional)"
                className="px-3 py-1 border rounded text-black dark:text-white dark:bg-gray-700 dark:border-gray-600 text-sm"
              />
              
              <Link
                href="/home"
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-sm"
              >
                View Blogs
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-black dark:text-white">
          Write Your Blog
        </h1>

        {/* Full Blog Generation Section */}
        <section className="mb-12 p-6 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
            Generate Full Blog
          </h2>

          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a blog topic, e.g. meditation"
            className="w-full p-2 border dark:border-gray-600 rounded mb-4 text-black dark:text-white dark:bg-gray-700"
          />

          <div className="flex gap-2 mb-4">
            <button
              onClick={handleGenerateBlog}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Full Blog"}
            </button>

            {blog && (
              <button
                onClick={publishGeneratedBlog}
                className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50 hover:bg-green-700"
                disabled={publishing}
              >
                {publishing ? "Publishing..." : "Publish Blog"}
              </button>
            )}
          </div>

          {error && (
            <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
          )}

          {blog && (
            <div className="whitespace-pre-wrap p-4 bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 rounded mt-4 text-black dark:text-white">
              <ReactMarkdown>{blog}</ReactMarkdown>
            </div>
          )}
        </section>

        {/* AI-Assisted Blog Section */}
        <section className="p-6 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
            AI-ASSISTED BLOG
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-black dark:text-white">
              Blog Title
            </label>
            <input
              type="text"
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
              placeholder="Enter your blog title"
              className="w-full p-2 border dark:border-gray-600 rounded text-black dark:text-white dark:bg-gray-700"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-black dark:text-white">
              Blog Content
            </label>
            <div className="relative font-mono">
              {/* Background div that shows the suggestion */}
              <div
                className="absolute top-0 left-0 w-full p-3 border border-gray-300 dark:border-gray-600 rounded min-h-[300px] whitespace-pre-wrap break-words text-black dark:text-white pointer-events-none bg-white dark:bg-gray-700 overflow-hidden"
                style={{
                  font: "inherit",
                  fontSize: "inherit",
                  lineHeight: "inherit",
                  fontFamily: "inherit",
                }}
              >
                {assistedBlogText}
                {showSuggestion && suggestion && (
                  <span className="text-gray-500 dark:text-gray-400">
                    {" " + suggestion}
                  </span>
                )}
              </div>

              {/* Actual textarea on top */}
              <textarea
                ref={textareaRef}
                value={assistedBlogText}
                onChange={(e) => handleAssistedBlogChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Start writing your blog... (AI will suggest completions as you type)"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded min-h-[300px] text-black dark:text-white resize-y relative z-10 bg-transparent dark:bg-transparent"
                disabled={!blogTitle.trim()}
                style={{
                  font: "inherit",
                  fontSize: "inherit",
                  lineHeight: "inherit",
                  fontFamily: "inherit",
                }}
              />

              {/* Loading indicator for suggestions */}
              {loadingSuggestion && (
                <div className="absolute top-2 right-2 bg-yellow-100 dark:bg-yellow-800 border border-yellow-300 dark:border-yellow-600 rounded px-2 py-1 z-20">
                  <div className="text-xs text-black dark:text-white">
                    Getting suggestion...
                  </div>
                </div>
              )}
            </div>

            {!blogTitle.trim() && (
              <p className="text-sm text-black dark:text-white mt-2">
                Please enter a blog title first to enable AI assistance.
              </p>
            )}

            {showSuggestion && suggestion && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                💡 Press{" "}
                <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">
                  Tab
                </kbd>{" "}
                to accept suggestion or{" "}
                <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">
                  Esc
                </kbd>{" "}
                to dismiss
              </p>
            )}
          </div>

          <div className="flex gap-2 mb-4">
            {assistedBlogText.trim() && (
              <button
                onClick={publishAssistedBlog}
                className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50 hover:bg-green-700"
                disabled={publishing || !blogTitle.trim()}
              >
                {publishing ? "Publishing..." : "Publish Blog"}
              </button>
            )}
          </div>

          <div className="text-sm text-black dark:text-white">
            <p>
              💡 <strong>How it works:</strong> As you type, AI will suggest
              completions based on your title and content. Suggestions appear
              after you&apos;ve written at least 10 characters as grayed-out
              text. Press{" "}
              <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs mx-1">
                Tab
              </kbd>{" "}
              to accept or{" "}
              <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs mx-1">
                Esc
              </kbd>{" "}
              to dismiss.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
