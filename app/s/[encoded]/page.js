'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RedirectClient({ decodedUrl, error }) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [redirecting, setRedirecting] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (error) return;

    if (decodedUrl) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setRedirecting(true);
            setTimeout(() => {
              window.location.href = decodedUrl;
            }, 500);
            return 0;
          }
          return prev - 1;
        });
        setProgress((prev) => prev - 20);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [decodedUrl, error]);

  const handleRedirectNow = () => {
    if (decodedUrl) {
      setRedirecting(true);
      setTimeout(() => {
        window.location.href = decodedUrl;
      }, 500);
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center transition-all duration-300 hover:shadow-2xl">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full mb-6 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Invalid Short URL
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              {error || 'The URL you requested could not be found'}
            </p>
            
            <div className="bg-gray-100 dark:bg-gray-700/50 rounded-xl p-4 mb-8 animate-pulse">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This could be because:
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-300 mt-2 text-left space-y-1">
                <li className="flex items-start">
                  <span className="inline-block mr-2">•</span>
                  <span>The URL was mistyped</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block mr-2">•</span>
                  <span>The link has expired</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block mr-2">•</span>
                  <span>The custom alias doesn't exist</span>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Go Back
              </button>
              
              <Link
                href="/"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Create New URL
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (redirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-blue-100 dark:bg-blue-900/20 animate-ping absolute"></div>
                <div className="w-24 h-24 rounded-full bg-blue-200 dark:bg-blue-900/30"></div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500 relative z-10 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Taking You There!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Redirecting to your destination...
            </p>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center transition-all duration-300 hover:shadow-2xl"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="relative w-40 h-40 mx-auto mb-6">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="8"
                strokeLinecap="round"
                className="dark:stroke-gray-700"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 * (1 - countdown/5)}
                transform="rotate(-90 50 50)"
                className="transition-all duration-1000 ease-out"
              />
              <text
                x="50"
                y="50"
                textAnchor="middle"
                dy="7"
                fontSize="24"
                fontWeight="bold"
                className="text-gray-800 dark:text-white"
              >
                {countdown}s
              </text>
            </svg>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`transition-transform duration-300 ${isHovering ? 'scale-110' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Redirecting Soon!
          </h1>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-8 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              You're being redirected to:
            </p>
            <a 
              href={decodedUrl} 
              target="_blank"
              className="text-blue-600 dark:text-blue-400 break-all text-sm font-medium hover:underline inline-block max-w-full overflow-hidden text-ellipsis"
            >
              {decodedUrl}
            </a>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleRedirectNow}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Go Now
            </button>
            
            <button
              onClick={handleCancel}
              className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 9a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Cancel Redirect
            </button>
          </div>

          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Your privacy is protected - no tracking
          </div>
        </div>
      </div>
    </div>
  );
}