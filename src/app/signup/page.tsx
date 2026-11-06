'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import SocialButtons from '@/components/auth/SocialButtons';
import { Code2, User, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

function SignupForm() {
  const { signup, isAuthenticated, isOnboarded } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already authenticated and onboarded, redirect to dashboard; if not onboarded, redirect to onboarding
  React.useEffect(() => {
    if (isAuthenticated) {
      if (!isOnboarded) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isOnboarded, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!agreed) {
      setError('Please agree to the platform assessment terms & privacy policy.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await signup(name, email, password);
      if (!res.success) {
        setError(res.error || 'Failed to create account.');
      } else {
        // Redirect directly to goal selection!
        router.push('/onboarding');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Auth Card */}
      <div className="rounded-3xl p-8 relative overflow-hidden bg-white/95 dark:bg-[#121026]/90 border border-[#E4E0EC] dark:border-white/10 shadow-xl dark:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5),0_0_20px_-5px_rgba(140,96,243,0.25)] backdrop-blur-md transition-colors duration-200">
        {/* Subtle top ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1.5 bg-gradient-to-r from-[#7038F0] dark:from-[#8C60F3] to-[#6366F1] blur-xs" />

        {/* Card Header */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#7038F0]/10 dark:bg-[#8C60F3]/15 border border-[#7038F0]/20 dark:border-[#8C60F3]/30 mb-3 text-[#7038F0] dark:text-[#A78BFA] shadow-xs">
            <Code2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#353148] dark:text-white">Create Your Account</h1>
          <p className="text-xs text-[#8E8A9C] dark:text-slate-400 mt-1.5">
            Join DevPractice to master debugging, token efficiency & real assessments
          </p>
        </div>

        {/* OAuth Buttons */}
        <SocialButtons />

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="w-full border-t border-[#E4E0EC] dark:border-white/10" />
          <span className="bg-white dark:bg-[#121026] px-3 text-[11px] font-medium text-[#8E8A9C] dark:text-slate-400 uppercase tracking-wider absolute">
            Or sign up with email
          </span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#353148] dark:text-slate-200 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8E8A9C] dark:text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rahul Sharma"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8F6FC] dark:bg-[#1B1939]/80 border border-[#E4E0EC] dark:border-white/10 focus:border-[#7038F0] dark:focus:border-[#8C60F3] focus:ring-1 focus:ring-[#7038F0] dark:focus:ring-[#8C60F3] text-sm text-[#353148] dark:text-white placeholder-[#8E8A9C] dark:placeholder-slate-500 transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#353148] dark:text-slate-200 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8E8A9C] dark:text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@college.edu or gmail.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8F6FC] dark:bg-[#1B1939]/80 border border-[#E4E0EC] dark:border-white/10 focus:border-[#7038F0] dark:focus:border-[#8C60F3] focus:ring-1 focus:ring-[#7038F0] dark:focus:ring-[#8C60F3] text-sm text-[#353148] dark:text-white placeholder-[#8E8A9C] dark:placeholder-slate-500 transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#353148] dark:text-slate-200 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8E8A9C] dark:text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#F8F6FC] dark:bg-[#1B1939]/80 border border-[#E4E0EC] dark:border-white/10 focus:border-[#7038F0] dark:focus:border-[#8C60F3] focus:ring-1 focus:ring-[#7038F0] dark:focus:ring-[#8C60F3] text-sm text-[#353148] dark:text-white placeholder-[#8E8A9C] dark:placeholder-slate-500 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8E8A9C] hover:text-[#353148] dark:hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-start">
            <input
              id="terms"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-[#E4E0EC] dark:border-white/20 bg-white dark:bg-[#1B1939] text-[#7038F0] dark:text-[#8C60F3] focus:ring-[#7038F0] dark:focus:ring-[#8C60F3] focus:ring-offset-0"
            />
            <label htmlFor="terms" className="ml-2 block text-xs text-[#8E8A9C] dark:text-slate-400 cursor-pointer leading-tight">
              I agree to the assessment honor code, privacy policy, and isolated workspace guidelines.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-[#7038F0] hover:bg-[#5E26E5] dark:bg-[#8C60F3] dark:hover:bg-[#7A4AEB] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#7038F0]/20 dark:shadow-lg dark:shadow-[#8C60F3]/30 transition-all duration-200 active:scale-[0.99] disabled:opacity-50 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Continue to Goal Selection</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6 text-xs text-[#8E8A9C] dark:text-slate-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-[#7038F0] dark:text-[#A78BFA] hover:text-[#5E26E5] dark:hover:text-[#C4B5FD] transition-colors"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative bg-[#F8F6FC] dark:bg-[#0B0914] transition-colors duration-200">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#8C60F3]/10 dark:bg-[#8C60F3]/15 rounded-full blur-[130px] pointer-events-none" />

      <Suspense
        fallback={
          <div className="flex items-center justify-center text-[#8E8A9C] text-sm">
            <Loader2 className="w-5 h-5 animate-spin mr-2 text-[#8C60F3]" /> Loading...
          </div>
        }
      >
        <SignupForm />
      </Suspense>
    </div>
  );
}
