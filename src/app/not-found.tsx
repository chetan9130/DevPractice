import Link from 'next/link';
import { Code2, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 text-center">
      <div className="glass-panel-glow p-8 rounded-3xl max-w-md w-full border border-dev-border">
        <div className="w-12 h-12 rounded-2xl bg-dev-purple/20 border border-dev-purple/40 flex items-center justify-center text-purple-300 mx-auto mb-4">
          <Code2 className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">404 - Page Not Found</h2>
        <p className="text-xs text-dev-muted mb-6">
          The requested practice challenge or page could not be found.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-dev-gradient hover:opacity-95 text-white font-semibold text-xs shadow-glow-purple transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
