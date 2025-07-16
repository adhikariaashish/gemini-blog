"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Blog {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  author: string;
}

export default function HomePage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setError(data.error || "Failed to load blogs");
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to load blogs");
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
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-black">AI Blog Hub</h1>
            <div className="flex gap-3 items-center">
              <Link
                href="/login"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Sign Up
              </Link>
              <Link
                href="/write"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Write Blog
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-black mb-2">Latest Blogs</h2>
          <p className="text-gray-600">
            Discover amazing content written with AI assistance
          </p>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="text-gray-600">Loading blogs...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {!loading && !error && blogs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No blogs published yet</div>
            <Link
              href="/write"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Be the first to publish!
            </Link>
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-black mb-3 line-clamp-2">
                  {blog.title}
                </h3>

                <p className="text-gray-700 mb-4 line-clamp-3">
                  {truncateContent(blog.content)}
                </p>

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>By {blog.author}</span>
                  <time>{formatDate(blog.publishedAt)}</time>
                </div>

                <button
                  onClick={() => {
                    // TODO: Implement blog detail view
                    alert("Blog detail view coming soon!");
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Read more →
                </button>
              </div>
            </article>
          ))}
        </div>

        {blogs.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={fetchBlogs}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Refresh
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
