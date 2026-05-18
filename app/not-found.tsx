import Link from 'next/link';
import { GraduationCap, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#04040f] flex items-center justify-center p-4">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative text-center">
        <div className="text-8xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent mb-4">
          404
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Page not found</h1>
        <p className="text-white/50 text-sm mb-8 max-w-xs mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all"
          >
            <Home className="w-4 h-4" /> Go to Dashboard
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-white/60 hover:text-white border border-white/10 hover:border-white/20 px-5 py-2.5 rounded-xl transition-all"
          >
            <GraduationCap className="w-4 h-4" /> Home
          </Link>
        </div>
      </div>
    </div>
  );
}
