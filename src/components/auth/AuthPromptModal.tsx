'use client';

import React from 'react';
import Link from 'next/link';
import SocialButtons from '@/components/auth/SocialButtons';
import { Code2, X, Lock, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export default function AuthPromptModal({
  isOpen,
  onClose,
  title = 'Sign In to Access DevPractice Workspace',
  subtitle = 'Create a free account or log in with Google, GitHub, Microsoft, or Email to start debugging real projects.',
}: AuthPromptModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#353148]/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#121026] rounded-3xl p-7 max-w-md w-full border border-[#E4E0EC] dark:border-white/10 shadow-2xl relative text-left transition-colors duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8E8A9C] hover:text-[#353148] dark:hover:text-white p-1.5 rounded-lg hover:bg-[#F8F6FC] dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#7038F0]/10 dark:bg-[#8C60F3]/15 border border-[#7038F0]/20 dark:border-[#8C60F3]/30 mb-3 text-[#7038F0] dark:text-[#A78BFA]">
            <Lock className="w-6 h-6 text-[#7038F0] dark:text-[#8C60F3]" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#353148] dark:text-white mb-1.5">{title}</h2>
          <p className="text-xs text-[#8E8A9C] dark:text-slate-400 leading-relaxed">{subtitle}</p>
        </div>

        {/* OAuth Buttons (Google, GitHub, Microsoft) */}
        <div className="mb-5">
          <p className="text-[11px] font-semibold text-[#8E8A9C] dark:text-slate-400 uppercase tracking-wider mb-2 text-center">
            One-Click Student & Developer Sign In
          </p>
          <SocialButtons />
        </div>

        {/* Divider */}
        <div className="relative my-5 flex items-center justify-center">
          <div className="w-full border-t border-[#E4E0EC] dark:border-white/10" />
          <span className="bg-white dark:bg-[#121026] px-3 text-[10px] font-medium text-[#8E8A9C] dark:text-slate-400 uppercase tracking-wider absolute">
            Or choose action
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <Link
            href="/login"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-[#7038F0] hover:bg-[#5E26E5] dark:bg-[#8C60F3] dark:hover:bg-[#7A4AEB] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span>Sign In with Email / Demo Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/signup"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-[#F8F6FC] dark:bg-[#1A1830] hover:bg-[#E4E0EC]/60 dark:hover:bg-white/10 border border-[#E4E0EC] dark:border-white/10 text-[#353148] dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all hover:border-[#CCCAD2] dark:hover:border-white/20"
          >
            <span>Create New Free Student Account</span>
          </Link>
        </div>

        {/* Perks list */}
        <div className="mt-5 pt-4 border-t border-[#E4E0EC] dark:border-white/10 text-[11px] text-[#8E8A9C] dark:text-slate-400 space-y-1">
          <p className="flex items-center gap-1.5 text-[#353148] dark:text-slate-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#7038F0] dark:text-[#8C60F3]" />
            <span>15,000 free AI debugging tokens included</span>
          </p>
          <p className="flex items-center gap-1.5 text-[#353148] dark:text-slate-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#7038F0] dark:text-[#8C60F3]" />
            <span>Personalized AI Memory of your coding mistakes</span>
          </p>
        </div>
      </div>
    </div>
  );
}
