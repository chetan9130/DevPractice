import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

import NextAuthProvider from '@/components/providers/NextAuthProvider';

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
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-dev-bg text-dev-text min-h-screen flex flex-col antialiased selection:bg-dev-purple selection:text-white">
        <NextAuthProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
