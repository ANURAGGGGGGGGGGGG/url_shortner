'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const EASE_OUT = [0.23, 1, 0.32, 1];

const fadeUp = (reduceMotion, y = 8) => ({
  initial: { opacity: 0, transform: reduceMotion ? 'translateY(0px)' : `translateY(${y}px)` },
  animate: { opacity: 1, transform: 'translateY(0px)' },
  exit: { opacity: 0, transform: reduceMotion ? 'translateY(0px)' : `translateY(${y}px)` },
});

export default function Home() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const reduceMotion = useReducedMotion();

  const isValidUrl = (string) => {
    try {
      const parsed = new URL(string);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  const isValidAlias = (alias) => {
    return /^[a-zA-Z0-9_-]{3,30}$/.test(alias);
  };

  const handleShorten = async () => {
    if (isGenerating) return;

    if (!url.trim()) {
      setError('Please enter a URL to shorten.');
      document.getElementById('url')?.focus();
      return;
    }

    if (!isValidUrl(url.trim())) {
      setError('That doesn’t look like a valid URL. It must start with http:// or https://');
      document.getElementById('url')?.focus();
      return;
    }

    if (customAlias && !isValidAlias(customAlias)) {
      setError('Custom alias must be 3–30 characters: letters, numbers, dashes, or underscores.');
      document.getElementById('customAlias')?.focus();
      return;
    }

    setError('');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalUrl: url.trim(),
          customAlias: customAlias || undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Couldn’t shorten that URL. Please try again.');
      }

      setShortUrl(data.shortUrl);
      setOriginalUrl(data.originalUrl);

      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({
          behavior: reduceMotion ? 'auto' : 'smooth',
          block: 'nearest',
        });
      }, 80);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      setError('Couldn’t copy to clipboard. You can select the link manually.');
    }
  };

  const handlePreview = () => {
    if (!shortUrl || !originalUrl) return;
    setPreviewUrl(originalUrl);
    setShowPreview(true);
  };

  // Auto-focus input on page load
  useEffect(() => {
    document.getElementById('url')?.focus();
  }, []);

  // Dismiss preview with Escape — keyboard action, no animation flourish
  useEffect(() => {
    if (!showPreview) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setShowPreview(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showPreview]);

  const urlInvalid = error && !isValidUrl(url.trim()) && url.trim().length > 0;
  const aliasInvalid = customAlias.length > 0 && !isValidAlias(customAlias);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header — rare/first-view moment, so a short staggered entrance is earned */}
          <motion.div
            initial={{ opacity: 0, transform: 'translateY(-8px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="text-center mb-10"
          >
            <p className="inline-flex items-center gap-1.5 text-[13px] font-medium text-blue-700 dark:text-blue-300 bg-blue-100/70 dark:bg-blue-900/30 border border-blue-200/60 dark:border-blue-800/50 rounded-full px-3 py-1 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              MongoDB · powered
            </p>
            <motion.h1
              initial={{ opacity: 0, transform: reduceMotion ? 'translateY(0px)' : 'translateY(8px)' }}
              animate={{ opacity: 1, transform: 'translateY(0px)' }}
              transition={{ duration: 0.25, delay: 0.05, ease: EASE_OUT }}
              className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-3 text-balance"
            >
              Fast URL Shortener
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, transform: reduceMotion ? 'translateY(0px)' : 'translateY(8px)' }}
              animate={{ opacity: 1, transform: 'translateY(0px)' }}
              transition={{ duration: 0.25, delay: 0.1, ease: EASE_OUT }}
              className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 mb-4"
            >
              Fast redirects with a MongoDB-backed short link
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.16 }}
              className="flex justify-center flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-gray-500 dark:text-gray-400"
            >
              <span className="inline-flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                Server-side redirects
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414 1.414L6.524 8.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" /></svg>
                Custom aliases
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" /><path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" /><path d="M17 5c0-1.657-3.134-3-7-3S3 3.343 3 5s3.134 3 7 3 7-1.343 7-3z" /></svg>
                Click tracking
              </span>
            </motion.div>
          </motion.div>

          {/* Main Form */}
          <motion.div
            initial={{ opacity: 0, transform: reduceMotion ? 'translateY(0px)' : 'translateY(12px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
            transition={{ duration: 0.28, delay: 0.16, ease: EASE_OUT }}
            className="bg-white dark:bg-gray-800/90 rounded-2xl shadow-xl shadow-indigo-950/5 ring-1 ring-gray-950/5 dark:ring-white/10 p-6 md:p-8 mb-6 transition-[box-shadow] duration-200 ease-out focus-within:shadow-lg"
          >
            <div className="space-y-5">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                  Enter your long URL
                </label>
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); if (error) setError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleShorten()}
                  placeholder="https://example.com/very/long/url/that/needs/shortening"
                  autoComplete="off"
                  spellCheck={false}
                  aria-invalid={Boolean(urlInvalid)}
                  aria-describedby={error ? 'form-error' : undefined}
                  className={`field w-full px-4 py-3 text-[15px] border rounded-xl dark:bg-gray-900/60 dark:text-white shadow-sm outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500 ${
                    urlInvalid
                      ? 'border-red-400 dark:border-red-500'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                />
              </div>

              <div>
                <div className="mb-1.5">
                  <label htmlFor="customAlias" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Custom alias <span className="font-normal text-gray-400">(optional)</span>
                  </label>
                </div>
                <input
                  type="text"
                  id="customAlias"
                  value={customAlias}
                  onChange={(e) => { setCustomAlias(e.target.value.trim()); if (error) setError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleShorten()}
                  placeholder="my-custom-alias"
                  autoComplete="off"
                  spellCheck={false}
                  aria-invalid={Boolean(aliasInvalid)}
                  aria-describedby={error ? 'form-error' : 'alias-hint'}
                  className={`field w-full px-4 py-3 text-[15px] border rounded-xl dark:bg-gray-900/60 dark:text-white shadow-sm outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500 ${
                    aliasInvalid
                      ? 'border-red-400 dark:border-red-500'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                />
                <p id="alias-hint" className="text-xs leading-relaxed text-amber-700 dark:text-amber-300 mt-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 px-2.5 py-2 rounded-lg">
                  <span className="font-semibold">Note:</span> custom aliases must be unique. Leave this blank for a random 7-character code.
                </p>
              </div>

              {/* Inline error — prevents the jarring alert() swap */}
              <AnimatePresence initial={false}>
                {error && (
                  <motion.p
                    id="form-error"
                    role="alert"
                    aria-live="polite"
                    {...fadeUp(reduceMotion, 4)}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 rounded-xl px-3.5 py-2.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                onClick={handleShorten}
                disabled={isGenerating}
                className={`pressable w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 shadow-md shadow-blue-600/20 transition-[filter,opacity] duration-200 ${
                  isGenerating
                    ? 'opacity-80 cursor-not-allowed'
                    : 'hover:brightness-[1.06]'
                }`}
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2.5 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating…
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 opacity-90" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                    Shorten URL
                  </span>
                )}
              </button>
            </div>
          </motion.div>

          {/* Result — transform + opacity only, never height */}
          <AnimatePresence initial={false}>
            {shortUrl && (
              <motion.div
                id="result-section"
                {...fadeUp(reduceMotion, 8)}
                transition={{ duration: 0.22, ease: EASE_OUT }}
                className="bg-white dark:bg-gray-800/90 rounded-2xl shadow-xl shadow-indigo-950/5 ring-1 ring-gray-950/5 dark:ring-white/10 p-6 md:p-8 mb-6 overflow-hidden"
              >
                <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Your shortened URL is ready
                </h2>

                <div className="bg-gray-50 dark:bg-gray-900/60 rounded-xl px-4 py-3.5 mb-4 border border-gray-200 dark:border-gray-700">
                  <code className="text-[15px] text-blue-700 dark:text-blue-300 break-all font-medium">
                    {shortUrl}
                  </code>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={copyToClipboard}
                    aria-live="polite"
                    className={`pressable flex-1 flex items-center justify-center text-white text-[15px] font-medium py-2.5 px-4 rounded-xl shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 transition-[background-color] duration-200 ${
                      copied
                        ? 'bg-green-600 focus-visible:ring-green-500 hover:bg-green-600'
                        : 'bg-gray-700 dark:bg-gray-600 focus-visible:ring-gray-500 hover:bg-gray-800 dark:hover:bg-gray-500'
                    }`}
                  >
                    {/* blur masks the icon/label swap so it reads as one morph */}
                    <span className={`flex items-center ${copied ? '' : 'swap'}`} key={copied ? 'copied' : 'copy'}>
                      {copied ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Copied
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 opacity-90" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                          </svg>
                          Copy link
                        </>
                      )}
                    </span>
                  </button>

                  <button
                    onClick={handlePreview}
                    className="pressable flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-[1.06] text-white text-[15px] font-medium py-2.5 px-4 rounded-xl shadow-sm shadow-indigo-600/20 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 transition-[filter] duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 opacity-90" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    Preview URL
                  </button>
                </div>

                <p className="mt-5 flex items-center text-[13px] text-gray-500 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-green-500 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Your link is live — no cookies, no visitor profiling
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Features — staggered once on first view; lift gated to fine pointers */}
          <div className="mt-8 grid md:grid-cols-3 gap-4" aria-label="Features">
            {[
              {
                title: 'Privacy first',
                body: 'Short codes are stored in MongoDB and resolved server-side.',
                bg: 'bg-blue-100 dark:bg-blue-900/30',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                ),
              },
              {
                title: 'Instant',
                body: 'Reserved in one round-trip, then redirects with a 302.',
                bg: 'bg-purple-100 dark:bg-purple-900/30',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                ),
              },
              {
                title: 'Universal',
                body: 'Works with any URL, and every visit increments a counter.',
                bg: 'bg-indigo-100 dark:bg-indigo-900/30',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.002 6.002 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2h-1a2 2 0 00-2 2v.512A5.999 5.999 0 014.332 8.027z" clipRule="evenodd" />
                  </svg>
                ),
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, transform: reduceMotion ? 'translateY(0px)' : 'translateY(10px)' }}
                whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.25, delay: i * 0.06, ease: EASE_OUT }}
                className="lift text-center bg-white dark:bg-gray-800/90 px-5 py-6 rounded-2xl shadow-md shadow-indigo-950/5 ring-1 ring-gray-950/5 dark:ring-white/10 hover:shadow-lg"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 ${f.bg} rounded-2xl mb-3.5`}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-[15px] tracking-tight text-gray-900 dark:text-white mb-1">{f.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{f.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview Modal — modals stay centered (origin exempt); enter 220ms, exit 160ms */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed inset-0 bg-gray-950/50 backdrop-blur-[2px] flex items-center justify-center p-4 z-50"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Destination preview"
              initial={{ opacity: 0, transform: 'scale(0.95) translateY(6px)' }}
              animate={{ opacity: 1, transform: 'scale(1) translateY(0px)' }}
              exit={{ opacity: 0, transform: 'scale(0.97) translateY(4px)' }}
              transition={{ duration: 0.22, ease: EASE_OUT }}
              style={{ transformOrigin: 'center' }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl ring-1 ring-gray-950/10 dark:ring-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
                  Destination preview
                </h3>
                <button
                  onClick={() => setShowPreview(false)}
                  aria-label="Close preview"
                  className="pressable inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-[background-color,color] duration-160"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                This short URL will redirect to:
              </p>

              <div className="bg-gray-50 dark:bg-gray-900/60 rounded-xl px-4 py-3 mb-5 border border-gray-200 dark:border-gray-700">
                <code className="text-blue-700 dark:text-blue-300 break-all text-sm font-medium">
                  {previewUrl}
                </code>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={() => setShowPreview(false)}
                  className="pressable flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 text-[15px] font-medium py-2.5 px-4 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 transition-[background-color] duration-160"
                >
                  Close
                </button>
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pressable flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-[1.06] text-white text-[15px] font-medium py-2.5 px-4 rounded-xl text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 transition-[filter] duration-200"
                  onClick={() => setShowPreview(false)}
                >
                  Visit URL
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
