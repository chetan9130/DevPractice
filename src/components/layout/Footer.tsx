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
    <footer className="border-t border-[#E4E0EC] dark:border-white/10 bg-transparent py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#121026] border border-[#E4E0EC] dark:border-white/10 flex items-center justify-center text-[#7038F0] dark:text-[#8C60F3] shadow-xs">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-[#353148] dark:text-white text-base">DevPractice</span>
              <p className="text-xs text-[#8E8A9C] dark:text-slate-400">
                AI-powered real-project debugging & assessment platform
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#8E8A9C] dark:text-slate-400">
            <Link href="/login" className="hover:text-[#353148] dark:hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="hover:text-[#353148] dark:hover:text-white transition-colors">
              Create Account
            </Link>
            <Link href="/onboarding" className="hover:text-[#353148] dark:hover:text-white transition-colors">
              Placement Goals
            </Link>
            <span className="text-[#CCCAD2] dark:text-slate-700">•</span>
            <span className="text-[#8E8A9C] dark:text-slate-400">
              Based on DevPractice Technical Blueprint v1.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
