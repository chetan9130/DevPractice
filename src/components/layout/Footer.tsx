'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Code2, Sparkles, Terminal } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/dashboard')) {
    return null;
  }
  return (
    <footer className="border-t border-dev-border/60 bg-dev-bg/90 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-dev-card border border-dev-purple/30 flex items-center justify-center text-purple-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-base">DevPractice</span>
              <p className="text-xs text-dev-muted">
                AI-powered real-project debugging & assessment platform
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-dev-muted">
            <Link href="/login" className="hover:text-purple-300 transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="hover:text-purple-300 transition-colors">
              Create Account
            </Link>
            <Link href="/onboarding" className="hover:text-purple-300 transition-colors">
              Placement Goals
            </Link>
            <span className="text-dev-subtle">•</span>
            <span className="text-dev-subtle">
              Based on DevPractice Technical Blueprint v1.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
