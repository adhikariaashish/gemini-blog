"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface Blog {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  author: string;
}

const HomePage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedBlog, setExpandedBlog] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/blogs");
      const data = await response.json();

      if (response.ok) {
        setBlogs(data.blogs || []);
      } else {
        setError(data.error || "Failed to fetch blogs");
      }
    } catch (err) {
      setError("Failed to load blogs");
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + "...";
  };

  const toggleExpanded = (blogId: string) => {
    setExpandedBlog(expandedBlog === blogId ? null : blogId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                AI Blog Hub
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/write"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Write Blog
              </Link>
              
              <Link
                href="/login"
                className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-sm"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
              >
                Sign Up
              </Link>
              
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to AI Blog Hub
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discover amazing blogs written with AI assistance
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Loading blogs...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6">
            <p>{error}</p>
            <button
              onClick={fetchBlogs}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Blogs List */}
        {!loading && !error && (
          <div className="space-y-6">
            {blogs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">
                  📝
                </div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No blogs yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Be the first to write a blog and share your thoughts!
                </p>
                <Link
                  href="/write"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Write Your First Blog
                </Link>
              </div>
            ) : (
              blogs.map((blog) => (
                <article
                  key={blog.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {blog.title}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {formatDate(blog.publishedAt)}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                        <ReactMarkdown>
                          {expandedBlog === blog.id
                            ? blog.content
                            : truncateContent(blog.content)}
                        </ReactMarkdown>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {blog.author.charAt(0).toUpperCase()}
                        </div>
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                          by {blog.author}
                        </span>
                      </div>

                      {blog.content.length > 200 && (
                        <button
                          onClick={() => toggleExpanded(blog.id)}
                          className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                        >
                          {expandedBlog === blog.id ? "Show Less" : "Read More"}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        )}

        {/* Refresh Button */}
        {!loading && (
          <div className="text-center mt-8">
            <button
              onClick={fetchBlogs}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              Refresh blogs
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
