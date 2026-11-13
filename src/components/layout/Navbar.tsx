'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
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
  Sun,
  Moon,
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
    <nav className="sticky top-0 z-50 w-full border-b border-[#E4E0EC] dark:border-white/10 bg-[#F8F6FC]/90 dark:bg-[#0B0914]/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#7038F0] dark:bg-[#8C60F3] p-0.5 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#353148] dark:bg-[#121026] rounded-[10px] flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-[#353148] dark:text-white">
                DevPractice
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#7038F0]/10 dark:bg-[#8C60F3]/15 text-[#7038F0] dark:text-[#A78BFA] border border-[#7038F0]/20 dark:border-[#8C60F3]/30">
                MVP
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 text-sm font-medium text-[#8E8A9C] dark:text-slate-400">
            <Link
              href="/#home"
              className="px-3 py-1.5 rounded-lg hover:text-[#353148] dark:hover:text-white hover:bg-[#E4E0EC]/40 dark:hover:bg-white/[0.06] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/#practice-modes"
              className="px-3 py-1.5 rounded-lg hover:text-[#353148] dark:hover:text-white hover:bg-[#E4E0EC]/40 dark:hover:bg-white/[0.06] transition-colors"
            >
              Practice Modes
            </Link>
            <Link
              href="/#ai-assistant"
              className="px-3 py-1.5 rounded-lg hover:text-[#353148] dark:hover:text-white hover:bg-[#E4E0EC]/40 dark:hover:bg-white/[0.06] transition-colors"
            >
              AI Assistant
            </Link>
            <Link
              href="/#placement-tracks"
              className="px-3 py-1.5 rounded-lg hover:text-[#353148] dark:hover:text-white hover:bg-[#E4E0EC]/40 dark:hover:bg-white/[0.06] transition-colors"
            >
              Placement Tracks
            </Link>
          </div>
        </div>

        {/* Right Section / Theme Switcher & Auth Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleTheme();
            }}
            className="w-9 h-9 rounded-xl border border-[#E4E0EC] dark:border-white/10 bg-white dark:bg-[#121026] text-[#353148] dark:text-slate-200 hover:text-[#7038F0] dark:hover:text-[#A78BFA] hover:border-[#7038F0]/40 dark:hover:border-[#8C60F3]/40 flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer"
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-[#7038F0] hover:-rotate-12 transition-transform" />
            )}
          </button>

          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full bg-white dark:bg-[#121026] border border-[#E4E0EC] dark:border-white/10 hover:border-[#7038F0]/40 dark:hover:border-[#8C60F3]/40 text-sm transition-all focus:outline-none shadow-xs"
              >
                {/* Token Badge */}
                <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/40">
                  <Coins className="w-3.5 h-3.5" />
                  <span>{user.tokenBalance.toLocaleString()}</span>
                </div>

                {/* User Info */}
                <span className="text-[#353148] dark:text-slate-200 font-medium text-xs hidden md:inline">
                  {user.name}
                </span>

                {/* Avatar */}
                <div className="w-7 h-7 rounded-full bg-[#7038F0] dark:bg-[#8C60F3] flex items-center justify-center text-xs font-bold text-white overflow-hidden ring-1 ring-[#E4E0EC] dark:ring-white/20">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-[#8E8A9C] dark:text-slate-400 mr-1" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#121026] border border-[#E4E0EC] dark:border-white/10 shadow-xl p-2 text-sm z-50">
                  <div className="px-3 py-2 border-b border-[#E4E0EC] dark:border-white/10 mb-1">
                    <p className="text-xs font-semibold text-[#353148] dark:text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-[#8E8A9C] dark:text-slate-400 truncate">{user.email}</p>
                    {user.goal && (
                      <div className="mt-1.5 flex items-center gap-1 text-[10px] text-[#7038F0] dark:text-[#A78BFA] font-medium capitalize bg-[#7038F0]/10 dark:bg-[#8C60F3]/15 px-2 py-0.5 rounded-md border border-[#7038F0]/20 dark:border-[#8C60F3]/30">
                        <Target className="w-3 h-3 text-[#7038F0] dark:text-[#8C60F3]" />
                        <span>Track: {user.goal}</span>
                      </div>
                    )}
                  </div>

                  <Link
                    href="/dashboard?view=ide"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#353148] dark:text-slate-200 hover:bg-[#F8F6FC] dark:hover:bg-white/[0.06] transition-colors font-medium text-xs text-[#7038F0] dark:text-[#A78BFA]"
                  >
                    <Code2 className="w-4 h-4 text-[#7038F0] dark:text-[#8C60F3]" />
                    <span>Launch IDE Workspace</span>
                  </Link>

                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#353148] dark:text-slate-200 hover:bg-[#F8F6FC] dark:hover:bg-white/[0.06] transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#7038F0] dark:text-[#8C60F3]" />
                    <span>Dashboard & Analytics</span>
                  </Link>

                  <Link
                    href="/onboarding"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#353148] dark:text-slate-200 hover:bg-[#F8F6FC] dark:hover:bg-white/[0.06] transition-colors"
                  >
                    <Target className="w-4 h-4 text-[#7038F0] dark:text-[#8C60F3]" />
                    <span>Change Learning Goal</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors mt-1"
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
                className="px-4 py-2 rounded-xl text-sm font-medium text-[#353148] dark:text-slate-200 hover:text-[#7038F0] dark:hover:text-[#A78BFA] hover:bg-[#E4E0EC]/40 dark:hover:bg-white/[0.06] transition-colors border border-transparent"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#7038F0] hover:bg-[#5E26E5] dark:bg-[#8C60F3] dark:hover:bg-[#7A4AEB] shadow-md shadow-[#7038F0]/20 dark:shadow-lg dark:shadow-[#8C60F3]/30 transition-all duration-200 active:scale-95"
              >
                <span>Get Started</span>
                <span className="text-white/80">→</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
