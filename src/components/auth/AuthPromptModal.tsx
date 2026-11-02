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
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="glass-panel-glow bg-[#121128] rounded-3xl p-7 max-w-md w-full border border-dev-purple/40 shadow-2xl relative text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-dev-muted hover:text-white p-1 rounded-lg hover:bg-dev-surface transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-dev-purple/20 border border-dev-purple/40 mb-3 text-purple-300 shadow-glow-purple">
            <Lock className="w-6 h-6 text-purple-400" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white mb-1.5">{title}</h2>
          <p className="text-xs text-dev-muted leading-relaxed">{subtitle}</p>
        </div>

        {/* OAuth Buttons (Google, GitHub, Microsoft) */}
        <div className="mb-5">
          <p className="text-[11px] font-semibold text-dev-subtle uppercase tracking-wider mb-2 text-center">
            One-Click Student & Developer Sign In
          </p>
          <SocialButtons />
        </div>

        {/* Divider */}
        <div className="relative my-5 flex items-center justify-center">
          <div className="w-full border-t border-dev-border/70" />
          <span className="bg-[#121128] px-3 text-[10px] font-medium text-dev-muted uppercase tracking-wider absolute">
            Or choose action
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <Link
            href="/login"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-dev-gradient hover:opacity-95 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-glow-purple transition-all"
          >
            <span>Sign In with Email / Demo Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/signup"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-dev-surface/90 hover:bg-dev-cardHover border border-dev-border text-dev-text font-semibold text-xs flex items-center justify-center gap-2 transition-all hover:border-dev-purple/40"
          >
            <span>Create New Free Student Account</span>
          </Link>
        </div>

        {/* Perks list */}
        <div className="mt-5 pt-4 border-t border-dev-border/50 text-[11px] text-dev-muted space-y-1">
          <p className="flex items-center gap-1.5 text-purple-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-dev-purple" />
            <span>15,000 free AI debugging tokens included</span>
          </p>
          <p className="flex items-center gap-1.5 text-purple-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-dev-purple" />
            <span>Personalized AI Memory of your coding mistakes</span>
          </p>
        </div>
      </div>
    </div>
  );
}
