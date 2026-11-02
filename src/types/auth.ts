export type UserRole = 'learner' | 'instructor' | 'org_admin' | 'platform_admin';

export type GoalType = 'debugging' | 'fullstack' | 'interview';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type PreferredLanguage = 'javascript' | 'python' | 'java' | 'cpp';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  provider: 'google' | 'github' | 'microsoft' | 'email';
  onboarded: boolean;
  goal?: GoalType;
  experienceLevel?: ExperienceLevel;
  preferredLanguage?: PreferredLanguage;
  createdAt: string;
  tokenBalance: number;
}

export interface Session {
  token: string;
  user: User;
  expiresAt: number;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithOAuth: (provider: 'google' | 'github' | 'microsoft') => Promise<{ success: boolean; error?: string }>;
  setUserGoal: (
    goal: GoalType,
    experienceLevel: ExperienceLevel,
    preferredLanguage: PreferredLanguage
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}
