'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import {
  Code2,
  Coins,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Target,
  Sparkles,
  Terminal,
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-dev-border/60 bg-dev-bg/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-dev-purple to-dev-indigo p-0.5 flex items-center justify-center shadow-glow-purple group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-dev-bg rounded-[10px] flex items-center justify-center">
                <Code2 className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">
                DevPractice
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-dev-purple/15 text-purple-300 border border-dev-purple/30">
                MVP
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 text-sm font-medium text-dev-muted">
            <Link
              href="/#home"
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-dev-surface/50 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/#practice-modes"
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-dev-surface/50 transition-colors"
            >
              Practice Modes
            </Link>
            <Link
              href="/#ai-assistant"
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-dev-surface/50 transition-colors"
            >
              AI Assistant
            </Link>
            <Link
              href="/#placement-tracks"
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-dev-surface/50 transition-colors"
            >
              Placement Tracks
            </Link>
          </div>
        </div>

        {/* Right Section / Auth Controls */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full bg-dev-surface/80 border border-dev-border hover:border-dev-purple/40 text-sm transition-all focus:outline-none"
              >
                {/* Token Badge */}
                <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  <Coins className="w-3.5 h-3.5" />
                  <span>{user.tokenBalance.toLocaleString()}</span>
                </div>

                {/* User Info */}
                <span className="text-dev-text font-medium text-xs hidden md:inline">
                  {user.name}
                </span>

                {/* Avatar */}
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-dev-purple to-dev-indigo flex items-center justify-center text-xs font-bold text-white overflow-hidden ring-1 ring-dev-border">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-dev-muted mr-1" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-dev-card border border-dev-border shadow-2xl p-2 text-sm z-50">
                  <div className="px-3 py-2 border-b border-dev-border/60 mb-1">
                    <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-dev-muted truncate">{user.email}</p>
                    {user.goal && (
                      <div className="mt-1.5 flex items-center gap-1 text-[10px] text-purple-300 font-medium capitalize bg-dev-purple/10 px-2 py-0.5 rounded-md border border-dev-purple/20">
                        <Target className="w-3 h-3 text-dev-purple" />
                        <span>Track: {user.goal}</span>
                      </div>
                    )}
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-dev-text hover:bg-dev-surface/80 hover:text-white transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-purple-400" />
                    <span>Workspace Dashboard</span>
                  </Link>

                  <Link
                    href="/onboarding"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-dev-text hover:bg-dev-surface/80 hover:text-white transition-colors"
                  >
                    <Target className="w-4 h-4 text-dev-cyan" />
                    <span>Change Learning Goal</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-sm font-medium text-dev-text hover:text-white hover:bg-dev-surface/60 transition-colors border border-transparent hover:border-dev-border"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-dev-gradient hover:opacity-95 shadow-glow-purple transition-all duration-200 active:scale-95"
              >
                <span>Get Started</span>
                <span className="text-purple-200">→</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
