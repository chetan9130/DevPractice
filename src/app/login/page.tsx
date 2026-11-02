'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import SocialButtons from '@/components/auth/SocialButtons';
import { Code2, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, Sparkles, ArrowRight } from 'lucide-react';

function LoginForm() {
  const { login, isAuthenticated, isOnboarded } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      if (!isOnboarded) {
        router.push('/onboarding');
      } else {
        router.push(redirect);
      }
    }
  }, [isAuthenticated, isOnboarded, redirect, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.error || 'Failed to sign in. Please check your credentials.');
      } else {
        router.push(redirect);
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail('alex@devpractice.io');
    setPassword('DemoPass123!');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Auth Card */}
      <div className="glass-panel-glow rounded-3xl p-8 relative overflow-hidden">
        {/* Subtle top ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-2 bg-gradient-to-r from-dev-purple to-dev-indigo blur-sm" />

        {/* Card Header */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-dev-purple/30 to-dev-indigo/30 border border-dev-purple/40 mb-3 text-purple-300 shadow-glow-purple">
            <Code2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Welcome Back</h1>
          <p className="text-xs text-dev-muted mt-1.5">
            Log in to continue debugging real projects & practicing with AI
          </p>
        </div>

        {/* OAuth Buttons */}
        <SocialButtons />

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="w-full border-t border-dev-border/70" />
          <span className="bg-dev-card px-3 text-[11px] font-medium text-dev-muted uppercase tracking-wider absolute">
            Or sign in with email
          </span>
        </div>

        {/* Quick Demo Fill Pill */}
        <button
          type="button"
          onClick={fillDemoAccount}
          className="w-full mb-4 py-2 px-3 rounded-xl bg-dev-purple/10 hover:bg-dev-purple/15 border border-dev-purple/30 text-xs font-medium text-purple-300 flex items-center justify-center gap-1.5 transition-all group"
        >
          <Sparkles className="w-3.5 h-3.5 text-dev-purple group-hover:scale-110 transition-transform" />
          <span>Quick Fill: Demo Learner Account</span>
        </button>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-dev-text mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-dev-muted">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@college.edu or company.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dev-surface/90 border border-dev-border focus:border-dev-purple focus:ring-1 focus:ring-dev-purple text-sm text-white placeholder-dev-muted/60 transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-dev-text">Password</label>
              <button
                type="button"
                onClick={() => alert('Password reset link simulated! Please use the demo account or sign in directly.')}
                className="text-[11px] text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-dev-muted">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-dev-surface/90 border border-dev-border focus:border-dev-purple focus:ring-1 focus:ring-dev-purple text-sm text-white placeholder-dev-muted/60 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-dev-muted hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-dev-border bg-dev-surface text-dev-purple focus:ring-dev-purple focus:ring-offset-0"
            />
            <label htmlFor="remember-me" className="ml-2 block text-xs text-dev-muted cursor-pointer">
              Remember my session on this device
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-dev-gradient hover:opacity-95 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-glow-purple transition-all duration-200 active:scale-[0.99] disabled:opacity-50 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6 text-xs text-dev-muted">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="font-semibold text-purple-400 hover:text-purple-300 transition-colors"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-dev-purple/15 rounded-full blur-[130px] pointer-events-none" />

      <Suspense
        fallback={
          <div className="flex items-center justify-center text-dev-muted text-sm">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
