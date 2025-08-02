"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LandingPage() {
  const router = useRouter();

  // Redirect to home page after a brief delay
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/home");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          AI Blog Hub
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Create amazing blogs with the power of AI. Generate complete articles
          or get intelligent writing assistance as you type.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/write"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Writing
          </Link>

          <Link
            href="/home"
            className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Browse Blogs
          </Link>
        </div>

        {/* Authentication Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link
            href="/login"
            className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Sign Up
          </Link>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          Redirecting to home page in 3 seconds...
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              🤖 AI-Powered Generation
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Generate complete blog posts from just a topic using advanced AI.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              ✍️ Smart Writing Assistant
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Get real-time suggestions as you write, just like GitHub Copilot.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              🌍 Share & Discover
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Publish your blogs and discover amazing content from other
              writers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
