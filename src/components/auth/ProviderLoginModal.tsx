'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getStoredUsers, saveStoredUsers, generateToken, saveActiveSession } from '@/lib/session';
import { User, Session } from '@/types/auth';
import { X, Loader2, Check } from 'lucide-react';

interface ProviderLoginModalProps {
  provider: 'google' | 'github' | 'microsoft' | null;
  onClose: () => void;
  redirectUrl: string;
}

export default function ProviderLoginModal({
  provider,
  onClose,
  redirectUrl,
}: ProviderLoginModalProps) {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!provider) return null;

  // Defaults per provider
  const defaultEmail =
    provider === 'google'
      ? 'student.developer@gmail.com'
      : provider === 'github'
      ? 'student-coder@github.com'
      : 'student@university.edu';

  const defaultName =
    provider === 'google'
      ? 'Alex Rivera (Google)'
      : provider === 'github'
      ? 'Alex Rivera (GitHub)'
      : 'Alex Rivera (Microsoft 365)';

  const handleSimulatedOAuthLogin = async (customEmail?: string, customName?: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700)); // realistic authentication delay

    const finalEmail = (customEmail || email || defaultEmail).trim().toLowerCase();
    const finalName = (customName || name || defaultName).trim();

    const users = getStoredUsers();
    let existingUser = users.find((u) => u.email.toLowerCase() === finalEmail);

    if (!existingUser) {
      existingUser = {
        id: `usr_${provider}_${Date.now()}`,
        name: finalName,
        email: finalEmail,
        avatar:
          provider === 'google'
            ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
            : provider === 'github'
            ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        role: 'learner',
        provider,
        onboarded: false, // first-time users choose their placement track
        createdAt: new Date().toISOString(),
        tokenBalance: 15000,
      };
      users.push(existingUser);
      saveStoredUsers(users);
    }

    const newSession: Session = {
      token: generateToken(existingUser.id),
      user: existingUser,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };

    saveActiveSession(newSession);

    // Refresh state by using login helper or reload
    await login(existingUser.email);
    setLoading(false);
    onClose();
    router.push(existingUser.onboarded ? redirectUrl : '/onboarding');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-[#121124] rounded-3xl max-w-md w-full border border-dev-border/90 shadow-2xl overflow-hidden relative text-left">
        {/* Top close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-dev-muted hover:text-white p-1 rounded-lg hover:bg-dev-surface transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* -------------------- 1. GOOGLE MODAL DESIGN -------------------- */}
        {provider === 'google' && (
          <div className="p-7">
            {/* Google Logo */}
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.54 0 2.92.54 4.01 1.43l3.01-3.01C17.2 1.72 14.77 1 12 1 7.42 1 3.52 3.65 1.63 7.51l3.66 2.84C6.18 7.35 8.84 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.71 2.88c2.16-2 3.71-4.94 3.71-8.7z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.29 14.65c-.24-.72-.38-1.49-.38-2.28 0-.79.14-1.56.38-2.28L1.63 7.23C.59 9.3 0 11.59 0 14.01c0 2.42.59 4.71 1.63 6.78l3.66-2.84z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.71-2.88c-1.08.73-2.47 1.16-4.22 1.16-3.16 0-5.82-2.35-6.71-5.35L1.63 15.86C3.52 19.72 7.42 23 12 23z"
                />
              </svg>
              <span className="text-base font-bold text-white">Sign in with Google</span>
            </div>

            <p className="text-xs text-dev-muted mb-5">
              to continue to <strong className="text-purple-300">DevPractice SaaS</strong>
            </p>

            {/* Quick 1-Click Account Picker */}
            <div className="space-y-2 mb-4">
              <p className="text-[11px] font-semibold text-dev-subtle uppercase tracking-wider">
                Choose an account
              </p>

              <button
                type="button"
                onClick={() =>
                  handleSimulatedOAuthLogin('alex.student@gmail.com', 'Alex Rivera (Google)')
                }
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-dev-surface/80 hover:bg-dev-cardHover border border-dev-border hover:border-dev-purple/40 transition-all text-left group"
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs ring-1 ring-dev-border">
                  AR
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white group-hover:text-purple-300 transition-colors">
                    Alex Rivera
                  </p>
                  <p className="text-[11px] text-dev-muted truncate">alex.student@gmail.com</p>
                </div>
                <span className="text-[10px] text-dev-purple font-semibold bg-dev-purple/10 px-2 py-0.5 rounded-full">
                  1-Click Sign In
                </span>
              </button>
            </div>

            <div className="relative my-4 flex items-center justify-center">
              <div className="w-full border-t border-dev-border/60" />
              <span className="bg-[#121124] px-2 text-[10px] font-medium text-dev-muted uppercase absolute">
                Or enter custom Gmail
              </span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSimulatedOAuthLogin(email, name);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-[11px] font-medium text-dev-text mb-1">
                  Email or phone
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-dev-surface border border-dev-border text-xs text-white placeholder-dev-muted/60 focus:border-dev-purple outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-dev-text mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-3.5 py-2 rounded-xl bg-dev-surface border border-dev-border text-xs text-white placeholder-dev-muted/60 focus:border-dev-purple outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Next / Sign in'}
              </button>
            </form>
          </div>
        )}

        {/* -------------------- 2. GITHUB MODAL DESIGN -------------------- */}
        {provider === 'github' && (
          <div className="p-7">
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 mb-2">
                <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
              </div>
              <h3 className="text-base font-bold text-white">Sign in to GitHub</h3>
              <p className="text-xs text-dev-muted mt-0.5">to authorize DevPractice</p>
            </div>

            {/* Quick 1-Click GitHub Authorize */}
            <button
              type="button"
              onClick={() =>
                handleSimulatedOAuthLogin('alex-dev@github.com', 'Alex Rivera (OctoDev)')
              }
              className="w-full mb-4 p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/30 text-xs font-semibold text-emerald-300 flex items-center justify-center gap-2 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>1-Click Authorize as @alex-dev</span>
            </button>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSimulatedOAuthLogin(email, name);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-[11px] font-medium text-dev-text mb-1">
                  Username or email address
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="github-handle or user@email.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-dev-surface border border-dev-border text-xs text-white placeholder-dev-muted/60 focus:border-dev-purple outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-dev-text mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 rounded-xl bg-dev-surface border border-dev-border text-xs text-white placeholder-dev-muted/60 focus:border-dev-purple outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign in to GitHub'}
              </button>
            </form>
          </div>
        )}

        {/* -------------------- 3. MICROSOFT MODAL DESIGN -------------------- */}
        {provider === 'microsoft' && (
          <div className="p-7">
            <div className="flex items-center gap-2.5 mb-5">
              <svg className="w-6 h-6 shrink-0" viewBox="0 0 21 21">
                <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
              </svg>
              <div>
                <h3 className="text-base font-bold text-white">Sign in with Microsoft</h3>
                <p className="text-[11px] text-dev-muted">Student, College or Outlook Account</p>
              </div>
            </div>

            {/* Quick 1-Click Microsoft Campus Account */}
            <button
              type="button"
              onClick={() =>
                handleSimulatedOAuthLogin(
                  'alex.rivera@university.edu',
                  'Alex Rivera (University 365)'
                )
              }
              className="w-full mb-4 p-3 rounded-2xl bg-dev-surface/90 hover:bg-dev-cardHover border border-dev-border hover:border-dev-purple/40 text-xs font-semibold text-white flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center text-xs">
                  M365
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-white">Campus 365 Account</p>
                  <p className="text-[10px] text-dev-muted">alex.rivera@university.edu</p>
                </div>
              </div>
              <span className="text-[10px] text-dev-purple font-semibold bg-dev-purple/10 px-2 py-0.5 rounded-full">
                1-Click
              </span>
            </button>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSimulatedOAuthLogin(email, name);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-[11px] font-medium text-dev-text mb-1">
                  Email, phone, or Skype
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@college.edu or outlook.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-dev-surface border border-dev-border text-xs text-white placeholder-dev-muted/60 focus:border-dev-purple outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-dev-text mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-3.5 py-2 rounded-xl bg-dev-surface border border-dev-border text-xs text-white placeholder-dev-muted/60 focus:border-dev-purple outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-[#0067b8] hover:bg-[#005da6] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign in to Microsoft'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
