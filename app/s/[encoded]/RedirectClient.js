"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RedirectClient() {
  const params = useParams();
  const router = useRouter();
  const [decodedUrl, setDecodedUrl] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(5);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (params.encoded) {
      const encoded = params.encoded;
      
      const isCustomAlias = !/^[A-Za-z0-9+/\-_=]+$/.test(encoded) || encoded.length < 5;
      
      if (isCustomAlias) {
        // For custom aliases, we need to fetch the original URL from the server
        // Since this is a stateless app with no database, we can't actually resolve custom aliases
        // In a real app, you would fetch the URL from a database here
        setError('Custom aliases require a database to resolve. This demo app does not include database functionality.');
        return;
      }
      
      try {
        // Decode the URL (for Base64 encoded URLs)
        const padded = encoded.replace(/-/g, '+').replace(/_/g, '/');
        const padding = padded.length % 4;
        const decoded = atob(padded + '='.repeat(padding ? 4 - padding : 0));
        
        // Validate the decoded URL
        const url = new URL(decoded);
        if (url.protocol === 'http:' || url.protocol === 'https:') {
          setDecodedUrl(decoded);
          // Start countdown for auto-redirect
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                setRedirecting(true);
                window.location.href = decoded;
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          return () => clearInterval(timer);
        } else {
          setError('Invalid URL protocol');
        }
      } catch (err) {
        setError('Invalid or corrupted short URL');
      }
    }
  }, [params.encoded]);

  const handleRedirectNow = () => {
    if (decodedUrl) {
      setRedirecting(true);
      window.location.href = decodedUrl;
    }
  };

  const handleCancel = () => {
    setCountdown(0);
    router.push('/');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="max-w-md mx-auto p-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Invalid Short URL
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {error}
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Create New Short URL
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (redirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="max-w-md mx-auto p-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="animate-spin text-6xl mb-4">🔄</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Redirecting...
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Taking you to your destination
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="max-w-md mx-auto p-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">🚀</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Redirecting in {countdown}s
          </h1>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              Destination:
            </p>
            <code className="text-blue-600 dark:text-blue-400 break-all text-sm">
              {decodedUrl}
            </code>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleRedirectNow}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Go Now
            </button>
            <button
              onClick={handleCancel}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Cancel & Go Back
            </button>
          </div>
          <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
            🔒 This redirect is processed locally - no tracking
          </div>
        </div>
      </div>
    </div>
  );
}