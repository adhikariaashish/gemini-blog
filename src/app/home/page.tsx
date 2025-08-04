"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/contexts/AuthContext";

interface Blog {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  author: string;
}

interface SearchFilters {
  keyword: string;
  dateFrom: string;
  dateTo: string;
  author: string;
  sortBy: "newest" | "oldest" | "title";
}

const HomePage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedBlog, setExpandedBlog] = useState<string | null>(null);
  const [showSearchFilters, setShowSearchFilters] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    keyword: "",
    dateFrom: "",
    dateTo: "",
    author: "",
    sortBy: "newest",
  });

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

  const applyFilters = useCallback(() => {
    let filtered = [...blogs];

    // Filter by keyword (search in title and content)
    if (searchFilters.keyword.trim()) {
      const keyword = searchFilters.keyword.toLowerCase();
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(keyword) ||
          blog.content.toLowerCase().includes(keyword)
      );
    }

    // Filter by author
    if (searchFilters.author.trim()) {
      const author = searchFilters.author.toLowerCase();
      filtered = filtered.filter((blog) =>
        blog.author.toLowerCase().includes(author)
      );
    }

    // Filter by date range
    if (searchFilters.dateFrom) {
      const fromDate = new Date(searchFilters.dateFrom);
      filtered = filtered.filter(
        (blog) => new Date(blog.publishedAt) >= fromDate
      );
    }

    if (searchFilters.dateTo) {
      const toDate = new Date(searchFilters.dateTo);
      toDate.setHours(23, 59, 59, 999); // Include the entire day
      filtered = filtered.filter(
        (blog) => new Date(blog.publishedAt) <= toDate
      );
    }

    // Sort blogs
    filtered.sort((a, b) => {
      switch (searchFilters.sortBy) {
        case "newest":
          return (
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.publishedAt).getTime() -
            new Date(b.publishedAt).getTime()
          );
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredBlogs(filtered);
  }, [blogs, searchFilters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setSearchFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setSearchFilters({
      keyword: "",
      dateFrom: "",
      dateTo: "",
      author: "",
      sortBy: "newest",
    });
  };

  const getUniqueAuthors = () => {
    const authors = blogs.map((blog) => blog.author);
    return [...new Set(authors)].sort();
  };

  const hasActiveFilters = () => {
    return (
      searchFilters.keyword.trim() ||
      searchFilters.dateFrom ||
      searchFilters.dateTo ||
      searchFilters.author.trim() ||
      searchFilters.sortBy !== "newest"
    );
  };

  const deleteBlog = async (blogId: string) => {
    if (!user?.isAdmin) {
      alert("You don't have permission to delete blogs.");
      return;
    }

    if (
      !confirm(
        "Are you sure you want to delete this blog? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/api/blogs", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blogId,
          isAdmin: user.isAdmin,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Remove the blog from local state
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId));
        alert("Blog deleted successfully!");
      } else {
        alert(data.error || "Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog. Please try again.");
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
              {isAuthenticated ? (
                <>
                  <Link
                    href="/write"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Write Blog
                  </Link>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user?.email.charAt(0).toUpperCase()}
                    </div>
                    <button
                      onClick={logout}
                      className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}
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

        {/* Search and Filter Section */}
        <div className="mb-8">
          {/* Quick Search Bar */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search blogs by title or content..."
                value={searchFilters.keyword}
                onChange={(e) => handleFilterChange("keyword", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowSearchFilters(!showSearchFilters)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showSearchFilters || hasActiveFilters()
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
              }`}
            >
              {showSearchFilters ? "Hide Filters" : "More Filters"}
              {hasActiveFilters() && !showSearchFilters && (
                <span className="ml-1 w-2 h-2 bg-white rounded-full inline-block"></span>
              )}
            </button>
          </div>

          {/* Advanced Filters */}
          {showSearchFilters && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Author Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Filter by Author
                  </label>
                  <select
                    value={searchFilters.author}
                    onChange={(e) =>
                      handleFilterChange("author", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Authors</option>
                    {getUniqueAuthors().map((author) => (
                      <option key={author} value={author}>
                        {author}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date From */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={searchFilters.dateFrom}
                    onChange={(e) =>
                      handleFilterChange("dateFrom", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Date To */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={searchFilters.dateTo}
                    onChange={(e) =>
                      handleFilterChange("dateTo", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                  </label>
                  <select
                    value={searchFilters.sortBy}
                    onChange={(e) =>
                      handleFilterChange(
                        "sortBy",
                        e.target.value as "newest" | "oldest" | "title"
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title">Title A-Z</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters() && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:underline"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Search Results Summary */}
          {!loading && blogs.length > 0 && (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              {hasActiveFilters() ? (
                <span>
                  Showing {filteredBlogs.length} of {blogs.length} blogs
                  {searchFilters.keyword && (
                    <span> matching &ldquo;{searchFilters.keyword}&rdquo;</span>
                  )}
                </span>
              ) : (
                <span>Showing all {blogs.length} blogs</span>
              )}
            </div>
          )}
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
            {filteredBlogs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">
                  {blogs.length === 0 ? "📝" : "🔍"}
                </div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {blogs.length === 0 ? "No blogs yet" : "No blogs found"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {blogs.length === 0
                    ? isAuthenticated
                      ? "Be the first to write a blog and share your thoughts!"
                      : "Sign in to write and share your thoughts!"
                    : hasActiveFilters()
                    ? "Try adjusting your search filters or clearing them to see more results."
                    : "No blogs match your current filters."}
                </p>
                {blogs.length === 0 ? (
                  isAuthenticated ? (
                    <Link
                      href="/write"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Write Your First Blog
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Sign In to Write
                    </Link>
                  )
                ) : (
                  <button
                    onClick={clearFilters}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              filteredBlogs.map((blog) => (
                <article
                  key={blog.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {blog.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {formatDate(blog.publishedAt)}
                        </span>
                        {user?.isAdmin && (
                          <button
                            onClick={() => deleteBlog(blog.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Delete blog"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
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
                        {user?.isAdmin && (
                          <span className="ml-2 text-xs text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20 px-2 py-1 rounded">
                            Admin View
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {blog.content.length > 200 && (
                          <button
                            onClick={() => toggleExpanded(blog.id)}
                            className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                          >
                            {expandedBlog === blog.id
                              ? "Show Less"
                              : "Read More"}
                          </button>
                        )}
                      </div>
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
