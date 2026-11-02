'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2, ShieldCheck } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarded?: boolean;
}

export default function ProtectedRoute({
  children,
  requireOnboarded = true,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading, isOnboarded } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Redirect to login with return path
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      } else if (requireOnboarded && !isOnboarded && pathname !== '/onboarding') {
        // User logged in but hasn't picked their goal yet
        router.push('/onboarding');
      }
    }
  }, [isLoading, isAuthenticated, isOnboarded, requireOnboarded, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dev-bg flex flex-col items-center justify-center text-dev-text">
        <div className="relative flex items-center justify-center mb-4">
          <div className="absolute w-16 h-16 rounded-full bg-dev-purple/20 animate-ping" />
          <div className="w-12 h-12 rounded-xl bg-dev-card border border-dev-border flex items-center justify-center text-dev-purple shadow-glow-purple">
            <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
          </div>
        </div>
        <p className="text-sm font-medium text-dev-muted">Verifying secure session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requireOnboarded && !isOnboarded && pathname !== '/onboarding') {
    return null;
  }

  return <>{children}</>;
}
