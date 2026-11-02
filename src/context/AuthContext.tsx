'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { User, Session, AuthContextType, GoalType, ExperienceLevel, PreferredLanguage } from '@/types/auth';
import {
  getActiveSession,
  saveActiveSession,
  clearActiveSession,
  getStoredUsers,
  saveStoredUsers,
  generateToken,
  initMockDb,
} from '@/lib/session';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync NextAuth session if available
  const { data: nextAuthSession, status: nextAuthStatus } = useSession();

  // Load local session from storage on mount
  useEffect(() => {
    initMockDb();
    const currentSession = getActiveSession();
    if (currentSession) {
      setUser(currentSession.user);
      setSession(currentSession);
    }
    setIsLoading(false);
  }, []);

  // Sync NextAuth login into DevPractice session state
  useEffect(() => {
    if (nextAuthStatus === 'authenticated' && nextAuthSession?.user?.email) {
      const email = nextAuthSession.user.email.toLowerCase();
      const users = getStoredUsers();
      let existingUser = users.find((u) => u.email.toLowerCase() === email);

      if (!existingUser) {
        const providerName = (nextAuthSession.user as any).provider || 'oauth';
        existingUser = {
          id: (nextAuthSession.user as any).id || `usr_${Date.now()}`,
          name: nextAuthSession.user.name || email.split('@')[0],
          email,
          avatar: nextAuthSession.user.image || undefined,
          role: 'learner',
          provider: providerName,
          onboarded: false, // first-time oauth users choose goal
          createdAt: new Date().toISOString(),
          tokenBalance: 15000,
        };
        users.push(existingUser);
        saveStoredUsers(users);
      }

      const active: Session = {
        token: generateToken(existingUser.id),
        user: existingUser,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      };

      saveActiveSession(active);
      setUser(existingUser);
      setSession(active);
    }
  }, [nextAuthSession, nextAuthStatus]);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setIsLoading(false);
      return { success: false, error: 'Please enter a valid email address.' };
    }

    const users = getStoredUsers();
    let existingUser = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!existingUser) {
      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        role: 'learner',
        provider: 'email',
        onboarded: false,
        createdAt: new Date().toISOString(),
        tokenBalance: 10000,
      };
      users.push(newUser);
      saveStoredUsers(users);
      existingUser = newUser;
    }

    const newSession: Session = {
      token: generateToken(existingUser.id),
      user: existingUser,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };

    saveActiveSession(newSession);
    setUser(existingUser);
    setSession(newSession);
    setIsLoading(false);
    return { success: true };
  };

  const signup = async (
    name: string,
    email: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setIsLoading(false);
      return { success: false, error: 'Name is required.' };
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setIsLoading(false);
      return { success: false, error: 'Please provide a valid email address.' };
    }

    const users = getStoredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      setIsLoading(false);
      return { success: false, error: 'An account with this email already exists. Please log in.' };
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      role: 'learner',
      provider: 'email',
      onboarded: false,
      createdAt: new Date().toISOString(),
      tokenBalance: 12000,
    };

    users.push(newUser);
    saveStoredUsers(users);

    const newSession: Session = {
      token: generateToken(newUser.id),
      user: newUser,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };

    saveActiveSession(newSession);
    setUser(newUser);
    setSession(newSession);
    setIsLoading(false);
    return { success: true };
  };

  const loginWithOAuth = async (
    provider: 'google' | 'github' | 'microsoft'
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    let mockEmail = 'dev.learner@gmail.com';
    let mockName = 'Dev Learner';
    let mockAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

    if (provider === 'github') {
      mockEmail = 'codehero@github.com';
      mockName = 'OctoCoder';
      mockAvatar = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80';
    } else if (provider === 'microsoft') {
      mockEmail = 'student@university.onmicrosoft.com';
      mockName = 'Campus Developer';
      mockAvatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80';
    }

    const users = getStoredUsers();
    let existingUser = users.find((u) => u.email.toLowerCase() === mockEmail.toLowerCase());

    if (!existingUser) {
      existingUser = {
        id: `usr_${provider}_${Date.now()}`,
        name: mockName,
        email: mockEmail,
        avatar: mockAvatar,
        role: 'learner',
        provider,
        onboarded: false,
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
    setUser(existingUser);
    setSession(newSession);
    setIsLoading(false);
    return { success: true };
  };

  const setUserGoal = async (
    goal: GoalType,
    experienceLevel: ExperienceLevel,
    preferredLanguage: PreferredLanguage
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user || !session) {
      return { success: false, error: 'User is not authenticated.' };
    }

    const updatedUser: User = {
      ...user,
      goal,
      experienceLevel,
      preferredLanguage,
      onboarded: true,
    };

    const users = getStoredUsers();
    const index = users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      users[index] = updatedUser;
      saveStoredUsers(users);
    }

    const updatedSession: Session = {
      ...session,
      user: updatedUser,
    };
    saveActiveSession(updatedSession);

    setUser(updatedUser);
    setSession(updatedSession);
    return { success: true };
  };

  const logout = () => {
    clearActiveSession();
    setUser(null);
    setSession(null);
    try {
      signOut({ redirect: false });
    } catch (e) {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!user,
        isOnboarded: !!user?.onboarded,
        login,
        signup,
        loginWithOAuth,
        setUserGoal,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
