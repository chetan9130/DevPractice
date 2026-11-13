import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

import NextAuthProvider from '@/components/providers/NextAuthProvider';
import StarrySky from '@/components/ui/starry-sky';

export const metadata: Metadata = {
  title: 'DevPractice – AI-Powered Real-World Engineering Practice & Assessment Platform',
  description:
    'Work on existing multi-file projects, fix bugs, implement features, and train with policy-controlled AI in an isolated browser IDE.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('devpractice-theme');
                  var root = document.documentElement;
                  if (theme === 'dark') {
                    root.classList.add('dark');
                    root.classList.remove('light');
                    root.setAttribute('data-theme', 'dark');
                    root.style.colorScheme = 'dark';
                  } else {
                    root.classList.remove('dark');
                    root.classList.add('light');
                    root.setAttribute('data-theme', 'light');
                    root.style.colorScheme = 'light';
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-[#F8F6FC] text-[#353148] dark:bg-[#0B0914] dark:text-slate-100 min-h-screen flex flex-col antialiased selection:bg-[#7038F0]/20 selection:text-[#353148] dark:selection:text-white transition-colors duration-200 relative">
        <NextAuthProvider>
          <AuthProvider>
            <ThemeProvider>
              <StarrySky />
              <Navbar />
              <main className="flex-1 relative z-10">{children}</main>
              <Footer />
            </ThemeProvider>
          </AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
