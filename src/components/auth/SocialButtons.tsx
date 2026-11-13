'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import ProviderLoginModal from '@/components/auth/ProviderLoginModal';

interface ProvidersStatus {
  google: boolean;
  github: boolean;
  microsoft: boolean;
}

export default function SocialButtons() {
  const { loginWithOAuth } = useAuth();
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'github' | 'microsoft' | null>(null);
  const [providersStatus, setProvidersStatus] = useState<ProvidersStatus>({
    google: false,
    github: false,
    microsoft: false,
  });

  // Controls the realistic login modal
  const [activeLoginModal, setActiveLoginModal] = useState<'google' | 'github' | 'microsoft' | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/onboarding';

  useEffect(() => {
    fetch('/api/auth/providers-status')
      .then((res) => res.json())
      .then((data) => setProvidersStatus(data))
      .catch(() => {});
  }, []);

  const handleOAuthClick = async (provider: 'google' | 'github' | 'microsoft') => {
    const isConfigured = providersStatus[provider];

    if (isConfigured) {
      // Real live OAuth redirect with NextAuth
      setLoadingProvider(provider);
      try {
        const nextAuthProvider = provider === 'microsoft' ? 'azure-ad' : provider;
        await signIn(nextAuthProvider, { callbackUrl: redirect });
      } catch (err) {
        console.error('Real OAuth redirect failed:', err);
      } finally {
        setLoadingProvider(null);
      }
    } else {
      // Show authentic login dialog where user can enter email & password or choose account!
      setActiveLoginModal(provider);
    }
  };

  return (
    <>
      <div className="space-y-2.5 w-full">
        {/* 3 OAuth Buttons */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Google */}
          <button
            type="button"
            disabled={!!loadingProvider}
            onClick={() => handleOAuthClick('google')}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white dark:bg-[#1B1939] hover:bg-[#F8F6FC] dark:hover:bg-white/10 border border-[#E4E0EC] dark:border-white/10 hover:border-[#7038F0]/40 dark:hover:border-[#8C60F3]/40 text-xs font-semibold text-[#353148] dark:text-slate-200 transition-all duration-200 shadow-xs active:scale-[0.98] disabled:opacity-50"
            title="Sign in with Google"
          >
            {loadingProvider === 'google' ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#7038F0] dark:text-[#8C60F3]" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
            )}
            <span>Google</span>
          </button>

          {/* GitHub */}
          <button
            type="button"
            disabled={!!loadingProvider}
            onClick={() => handleOAuthClick('github')}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white dark:bg-[#1B1939] hover:bg-[#F8F6FC] dark:hover:bg-white/10 border border-[#E4E0EC] dark:border-white/10 hover:border-[#7038F0]/40 dark:hover:border-[#8C60F3]/40 text-xs font-semibold text-[#353148] dark:text-slate-200 transition-all duration-200 shadow-xs active:scale-[0.98] disabled:opacity-50"
            title="Sign in with GitHub"
          >
            {loadingProvider === 'github' ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#7038F0] dark:text-[#8C60F3]" />
            ) : (
              <svg className="w-4 h-4 shrink-0 fill-current text-[#353148] dark:text-white" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            )}
            <span>GitHub</span>
          </button>

          {/* Microsoft */}
          <button
            type="button"
            disabled={!!loadingProvider}
            onClick={() => handleOAuthClick('microsoft')}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white dark:bg-[#1B1939] hover:bg-[#F8F6FC] dark:hover:bg-white/10 border border-[#E4E0EC] dark:border-white/10 hover:border-[#7038F0]/40 dark:hover:border-[#8C60F3]/40 text-xs font-semibold text-[#353148] dark:text-slate-200 transition-all duration-200 shadow-xs active:scale-[0.98] disabled:opacity-50"
            title="Sign in with Microsoft"
          >
            {loadingProvider === 'microsoft' ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#7038F0] dark:text-[#8C60F3]" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 21 21">
                <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
              </svg>
            )}
            <span>Microsoft</span>
          </button>
        </div>
      </div>

      {/* Realistic Provider Login Dialog */}
      <ProviderLoginModal
        provider={activeLoginModal}
        onClose={() => setActiveLoginModal(null)}
        redirectUrl={redirect}
      />
    </>
  );
}
