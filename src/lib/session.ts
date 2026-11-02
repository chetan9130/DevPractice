import { User, Session, GoalType, ExperienceLevel, PreferredLanguage } from '@/types/auth';

const SESSION_KEY = 'devpractice_session';
const USERS_DB_KEY = 'devpractice_users';

// Helper to get all registered users from storage
export function getStoredUsers(): User[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to parse stored users:', err);
    return [];
  }
}

// Helper to save users
export function saveStoredUsers(users: User[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users:', err);
  }
}

// Get active session
export function getActiveSession(): Session | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session: Session = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      clearActiveSession();
      return null;
    }
    return session;
  } catch (err) {
    console.error('Failed to read session:', err);
    return null;
  }
}

// Save active session
export function saveActiveSession(session: Session): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    // Also store simulated cookie for HTTP/SSR sync simulation
    document.cookie = `devpractice_token=${session.token}; path=/; max-age=604800; SameSite=Lax`;
  } catch (err) {
    console.error('Failed to save session:', err);
  }
}

// Clear session
export function clearActiveSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SESSION_KEY);
    document.cookie = 'devpractice_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  } catch (err) {
    console.error('Failed to clear session:', err);
  }
}

// Create mock session token
export function generateToken(userId: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
    })
  );
  const signature = btoa('devpractice_secret_sig_' + userId);
  return `${header}.${payload}.${signature}`;
}

// Create initial default mock users if not present
export function initMockDb(): void {
  if (typeof window === 'undefined') return;
  const users = getStoredUsers();
  if (users.length === 0) {
    const defaultUsers: User[] = [
      {
        id: 'usr_demo_learner',
        name: 'Alex Rivera',
        email: 'alex@devpractice.io',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'learner',
        provider: 'email',
        onboarded: true,
        goal: 'debugging',
        experienceLevel: 'intermediate',
        preferredLanguage: 'javascript',
        createdAt: new Date().toISOString(),
        tokenBalance: 15000,
      },
    ];
    saveStoredUsers(defaultUsers);
  }
}
