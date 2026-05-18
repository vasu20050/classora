'use client';

import Link from 'next/link';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#04040f] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/15 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-rose-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
        <p className="text-white/50 text-sm mb-2 max-w-xs mx-auto">
          An unexpected error occurred. Please try refreshing the page.
        </p>
        {error.digest && (
          <p className="text-xs text-white/20 font-mono mb-6">Error ID: {error.digest}</p>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Try again
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 text-white/60 hover:text-white border border-white/10 hover:border-white/20 px-5 py-2.5 rounded-xl transition-all"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
