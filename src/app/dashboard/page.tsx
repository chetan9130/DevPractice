'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { StatsCounter } from '@/components/ui/stats-counter';
import {
  LayoutDashboard,
  Code2,
  Layers,
  ClipboardList,
  BarChart2,
  Sparkles,
  BookOpen,
  Users,
  Target,
  Headphones,
  Search,
  Bell,
  Calendar,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Clock,
  Database,
  CheckCircle2,
  Play,
  Zap,
  GraduationCap,
  Briefcase,
  Flame,
  Trophy,
  TrendingUp,
  LogOut,
  Sliders,
  Check,
  AlertTriangle,
  FileCode,
  Terminal,
  X,
  ExternalLink,
  Download,
  Filter,
  Send,
  FolderGit2,
  Upload,
  FileArchive,
  Info,
  Star,
  Settings,
  MoreHorizontal,
  ChevronUp,
  PanelLeftClose,
  PanelLeftOpen,
  ExternalLink as ExternalLinkIcon,
} from 'lucide-react';

// Project interface for Project Library
interface ProjectItem {
  id: string;
  title: string;
  category: 'web' | 'backend' | 'ai' | 'devops';
  stack: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  modes: string[];
  estTime: string;
  repo: string;
  rating: number;
}

const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'ecommerce-microservices',
    title: 'E-Commerce Distributed Microservices',
    category: 'backend',
    stack: ['Node.js', 'Express', 'MongoDB', 'Redis', 'Docker'],
    difficulty: 'Medium',
    description: 'Multi-service online store with checkout race conditions, Redis cart cache invalidation, and Stripe webhook handling.',
    modes: ['Debugging', 'Feature Dev'],
    estTime: '45m',
    repo: 'devpractice-org/ecommerce-microservices',
    rating: 4.8,
  },
  {
    id: 'realtime-canvas',
    title: 'Collaborative Real-time Canvas (WebSockets)',
    category: 'web',
    stack: ['React', 'TypeScript', 'Next.js', 'Socket.io', 'Tailwind'],
    difficulty: 'Medium',
    description: 'Multiplayer whiteboarding workspace with state synchronization lags, optimistic rendering bugs, and cursor delta compression.',
    modes: ['Debugging', 'Feature Dev'],
    estTime: '40m',
    repo: 'devpractice-org/realtime-canvas',
    rating: 4.9,
  },
  {
    id: 'rag-embeddings',
    title: 'RAG Document Search & Vector Embeddings',
    category: 'ai',
    stack: ['Python', 'FastAPI', 'PyTorch', 'ChromaDB', 'OpenAI'],
    difficulty: 'Hard',
    description: 'Semantic vector retrieval pipeline with chunking overlap regressions, hallucination guardrails, and cosine similarity ranking.',
    modes: ['Debugging', 'Interview Sim'],
    estTime: '60m',
    repo: 'devpractice-org/rag-embeddings-engine',
    rating: 4.9,
  },
  {
    id: 'k8s-gitops',
    title: 'Kubernetes Cluster GitOps & CI/CD Pipeline',
    category: 'devops',
    stack: ['Docker', 'Kubernetes', 'GitHub Actions', 'Helm', 'Prometheus'],
    difficulty: 'Hard',
    description: 'Automated delivery pipeline with container crash loops, ingress SSL termination bugs, and pod memory leak profiling.',
    modes: ['Environment Rescue', 'Debugging'],
    estTime: '50m',
    repo: 'devpractice-org/k8s-gitops-pipeline',
    rating: 4.7,
  },
  {
    id: 'url-shortener-go',
    title: 'High-Concurrency Distributed URL Shortener',
    category: 'backend',
    stack: ['Go', 'PostgreSQL', 'Redis', 'Docker', 'Base62'],
    difficulty: 'Easy',
    description: 'Scalable link redirect engine with database connection pool exhaustion, cache stampedes, and analytics telemetry.',
    modes: ['Feature Dev', 'Debugging'],
    estTime: '30m',
    repo: 'devpractice-org/url-shortener-go',
    rating: 4.8,
  },
  {
    id: 'social-analytics',
    title: 'Social Media Analytics Dashboard & Feed',
    category: 'web',
    stack: ['React', 'GraphQL', 'Node.js', 'PostgreSQL', 'Chart.js'],
    difficulty: 'Easy',
    description: 'Interactive engagement metrics dashboard with N+1 GraphQL query waterfalls, infinite scroll pagination, and memory leaks.',
    modes: ['Feature Dev', 'Debugging'],
    estTime: '35m',
    repo: 'devpractice-org/social-analytics-dashboard',
    rating: 4.6,
  },
  {
    id: 'fraud-detection',
    title: 'Financial Fraud Detection ML Pipeline',
    category: 'ai',
    stack: ['Python', 'scikit-learn', 'Pandas', 'FastAPI', 'Docker'],
    difficulty: 'Medium',
    description: 'Real-time transaction classification system with class imbalance degradation, feature drift, and latency bottlenecks.',
    modes: ['Debugging', 'Feature Dev'],
    estTime: '45m',
    repo: 'devpractice-org/fraud-detection-ml',
    rating: 4.9,
  },
  {
    id: 'db-migration',
    title: 'Zero-Downtime Database Migration & Replication',
    category: 'devops',
    stack: ['PostgreSQL', 'Docker', 'Bash', 'Flyway', 'Nginx'],
    difficulty: 'Hard',
    description: 'Live schema migration runner handling table lock contention, replica lag monitoring, and blue/green failovers.',
    modes: ['Environment Rescue'],
    estTime: '55m',
    repo: 'devpractice-org/db-zero-downtime-migration',
    rating: 4.8,
  },
  {
    id: 'saas-tenant-rbac',
    title: 'SaaS Multi-Tenant Authentication & RBAC',
    category: 'backend',
    stack: ['Node.js', 'TypeScript', 'Prisma', 'JWT', 'PostgreSQL'],
    difficulty: 'Medium',
    description: 'Enterprise multi-tenant auth with cross-tenant data leak bugs, JWT refresh rotation, and permission bitmasks.',
    modes: ['Debugging', 'Interview Sim'],
    estTime: '40m',
    repo: 'devpractice-org/saas-tenant-rbac',
    rating: 4.9,
  },
  {
    id: 'multi-agent-orchestrator',
    title: 'Autonomous Multi-Agent Task Orchestrator',
    category: 'ai',
    stack: ['Python', 'LangChain', 'FastAPI', 'Redis', 'Docker'],
    difficulty: 'Hard',
    description: 'Multi-agent planning loop with infinite recursive tool call bugs, context window overflow, and state rollback.',
    modes: ['Debugging', 'Feature Dev'],
    estTime: '60m',
    repo: 'devpractice-org/multi-agent-orchestrator',
    rating: 5.0,
  },
];

function DashboardView() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Navigation and sidebar collapse states
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activeChallengeModal, setActiveChallengeModal] = useState<string | null>(null);

  // Project Library state
  const [projectFilterChip, setProjectFilterChip] = useState<'all' | 'web' | 'backend' | 'ai' | 'devops'>('all');
  const [projectSearch, setProjectSearch] = useState('');
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importTab, setImportTab] = useState<'github' | 'zip'>('github');
  const [importGithubUrl, setImportGithubUrl] = useState('');
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  // Daily goals state
  const [dailyGoals, setDailyGoals] = useState([
    { id: '1', title: 'Solve 1 debugging challenge', completed: true },
    { id: '2', title: 'Use AI hints efficiently (≤ 3 hints)', completed: true },
    { id: '3', title: 'Complete one test-based challenge', completed: false },
  ]);

  // Practice section state
  const [selectedPracticeMode, setSelectedPracticeMode] = useState<'debugging' | 'rescue' | 'feature' | 'interview'>('debugging');
  const [selectedLanguage, setSelectedLanguage] = useState('all');

  // Challenges section state
  const [challengeSearch, setChallengeSearch] = useState('');

  // AI Assistant section state
  const [aiPolicyMode, setAiPolicyMode] = useState<'learning' | 'guided' | 'strict'>('guided');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: 'Hello Alex! I am your DevPractice AI Coach. You have 14,250 tokens remaining in your placement practice budget. How can I guide your debugging today?',
      time: 'Just now',
    },
  ]);
  const [inputChat, setInputChat] = useState('');

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleGoal = (id: string) => {
    setDailyGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  };

  const completedGoalsCount = dailyGoals.filter((g) => g.completed).length;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // User display name
  const displayName = user?.name || 'Alex Rivera';
  const firstName = displayName.split(' ')[0] || 'Alex';
  const displayRole = user?.role === 'instructor' || user?.role === 'org_admin' ? 'Instructor' : 'Student';

  // Dynamic greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputChat.trim()) return;

    const userMsg = inputChat.trim();
    setInputChat('');
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userMsg, time: 'Just now' },
    ]);

    setTimeout(() => {
      let aiReply = "I noticed you asked about the JWT verification error. Rather than giving you the exact line, check if the secret key in jwt.verify() matches process.env.JWT_SECRET used in token generation.";
      if (aiPolicyMode === 'strict') {
        aiReply = "[Policy: Strict Assessment] Hint restricted: Direct syntax suggestions are disabled during proctored practice. Review the HTTP 401 error code in your test runner.";
      }
      setChatMessages((prev) => [
        ...prev,
        { sender: 'ai', text: aiReply, time: 'Just now' },
      ]);
    }, 700);
  };

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail.trim()) return;
    setWaitlistSuccess(true);
    setTimeout(() => {
      setWaitlistSuccess(false);
      setWaitlistEmail('');
      setImportModalOpen(false);
    }, 2200);
  };

  // Submenu open/close state matching media_1793615717485.png
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    Projects: true,
    Practice: false,
  });

  const toggleSubmenu = (menuName: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  // Navigation items with count badges and expandable sub-menus
  const navItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      badge: '24',
    },
    {
      name: 'Projects',
      icon: FolderGit2,
      badge: '10',
      hasSubmenu: true,
      subItems: [
        { label: 'All Projects', action: () => { setActiveNav('Projects'); setProjectFilterChip('all'); } },
        { label: 'Web Dev', action: () => { setActiveNav('Projects'); setProjectFilterChip('web'); } },
        { label: 'Backend', action: () => { setActiveNav('Projects'); setProjectFilterChip('backend'); } },
        { label: 'AI / ML', action: () => { setActiveNav('Projects'); setProjectFilterChip('ai'); } },
        { label: 'DevOps', action: () => { setActiveNav('Projects'); setProjectFilterChip('devops'); } },
      ],
    },
    {
      name: 'Practice',
      icon: Code2,
      badge: '4',
      hasSubmenu: true,
      subItems: [
        { label: 'Debugging Round', action: () => { setActiveNav('Practice'); setSelectedPracticeMode('debugging'); } },
        { label: 'Environment Rescue', action: () => { setActiveNav('Practice'); setSelectedPracticeMode('rescue'); } },
        { label: 'Feature Dev', action: () => { setActiveNav('Practice'); setSelectedPracticeMode('feature'); } },
        { label: 'Interview Simulation', action: () => { setActiveNav('Practice'); setSelectedPracticeMode('interview'); } },
      ],
    },
    {
      name: 'Challenges',
      icon: Layers,
      badge: '500+',
    },
    {
      name: 'Assessments',
      icon: ClipboardList,
      badge: 'TCS',
    },
    {
      name: 'Progress',
      icon: BarChart2,
      badge: '68%',
    },
    {
      name: 'AI Assistant',
      icon: Sparkles,
      badge: 'PRO',
    },
    {
      name: 'Resources',
      icon: BookOpen,
    },
    {
      name: 'Community',
      icon: Users,
    },
  ];

  // Filtered projects for Project Library
  const filteredProjects = PROJECTS_DATA.filter((p) => {
    const matchesChip = projectFilterChip === 'all' || p.category === projectFilterChip;
    const matchesSearch =
      !projectSearch.trim() ||
      p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.stack.some((s) => s.toLowerCase().includes(projectSearch.toLowerCase()));
    return matchesChip && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F4F6FC] flex font-sans antialiased text-slate-800">
      {/* ========================================================================= */}
      {/* 1. SIDEBAR (Matching media_1793615717485.png: Multi-Level & 64px Rail)   */}
      {/* ========================================================================= */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 68 : 248 }}
        transition={{ duration: 0.26, ease: [0.25, 0.1, 0.25, 1] }}
        className={`bg-[#0A091E] border-r border-[#1B173B] flex-shrink-0 flex flex-col justify-between ${
          sidebarCollapsed ? 'px-2 py-4' : 'p-3.5'
        } min-h-screen select-none relative z-30 transition-all font-sans`}
      >
        <div>
          {/* Top Brand Header */}
          {!sidebarCollapsed ? (
            <div className="flex items-center justify-between px-2 py-1.5 mb-4">
              <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-xl bg-[#5B48EE] flex items-center justify-center text-white font-mono font-bold text-xs shadow-md shadow-indigo-500/25 shrink-0">
                  {'</>'}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-[15px] tracking-tight truncate">DevPractice</span>
                  <span className="text-[10px] font-semibold bg-[#221A4B] text-[#9D8EFF] px-1.5 py-0.2 rounded border border-[#3C2D7B]">
                    Student
                  </span>
                </div>
              </Link>

              {/* Collapse Trigger */}
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#181538] transition-colors"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2.5 mb-4">
              <Link href="/" title="DevPractice">
                <div className="w-8 h-8 rounded-xl bg-[#5B48EE] flex items-center justify-center text-white font-mono font-bold text-xs shadow-md shadow-indigo-500/25">
                  {'</>'}
                </div>
              </Link>

              {/* Expand Trigger */}
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#181538] transition-colors"
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <PanelLeftOpen className="w-4 h-4 text-[#A69BFF]" />
              </button>
            </div>
          )}

          {/* Navigation Links */}
          {!sidebarCollapsed ? (
            <nav className="space-y-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.name;
                const isSubOpen = openSubmenus[item.name];

                return (
                  <div key={item.name} className="space-y-0.5">
                    <button
                      onClick={() => {
                        setActiveNav(item.name);
                        if (item.hasSubmenu) {
                          toggleSubmenu(item.name);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-[13px] font-medium transition-all group ${
                        isActive
                          ? 'bg-[#181534] text-white border border-[#2B2554] shadow-xs'
                          : 'text-[#8F8CAE] hover:text-white hover:bg-[#14112E]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#8F8CAE] group-hover:text-white transition-colors'}`} />
                        <span className="truncate">{item.name}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.badge && (
                          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                            isActive
                              ? 'bg-[#25204E] text-[#B8AEFF] border border-[#3C357A]'
                              : 'bg-[#14122E] text-slate-400 border border-[#211E44]'
                          }`}>
                            {item.badge}
                          </span>
                        )}

                        {item.hasSubmenu && (
                          <ChevronDown
                            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                              isSubOpen ? 'rotate-180 text-white' : ''
                            }`}
                          />
                        )}
                      </div>
                    </button>

                    {/* Expandable nested submenu links */}
                    {item.hasSubmenu && isSubOpen && item.subItems && (
                      <div className="pl-8 pr-2 py-0.5 space-y-0.5 overflow-hidden">
                        {item.subItems.map((sub, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={sub.action}
                            className="w-full text-left py-1 px-2.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-[#161338] transition-colors truncate block"
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          ) : (
            /* Collapsed Rail Column */
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.name;

                return (
                  <div key={item.name} className="relative group flex justify-center">
                    <button
                      onClick={() => setActiveNav(item.name)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-[#181534] text-white border border-[#2B2554] shadow-xs'
                          : 'text-[#8F8CAE] hover:text-white hover:bg-[#14112E]'
                      }`}
                    >
                      <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-[#8F8CAE] group-hover:text-white'}`} />
                    </button>

                    {/* Floating tooltip */}
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#120F30] text-white text-xs font-semibold rounded-xl shadow-2xl border border-[#302B68] opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 transform -translate-x-1 group-hover:translate-x-0 z-50 whitespace-nowrap flex items-center gap-2">
                      <span>{item.name}</span>
                      {item.badge && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#25204E] text-[#B8AEFF] border border-[#3C357A]">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </nav>
          )}
        </div>

        {/* Bottom Section (Inbox, Settings, User Profile) */}
        {!sidebarCollapsed ? (
          <div className="pt-3 border-t border-[#1C173E] space-y-1.5">
            {/* Inbox / Notifications with badge */}
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-[13px] font-medium text-[#8F8CAE] hover:text-white hover:bg-[#14112E] transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-[#8F8CAE] group-hover:text-white transition-colors" />
                <span>Inbox</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-[#14122E] text-slate-400 border border-[#211E44]">
                3
              </span>
            </button>

            {/* Settings */}
            <button
              onClick={() => alert('Settings: Workspace preferences, keybindings, and AI API keys.')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-[13px] font-medium text-[#8F8CAE] hover:text-white hover:bg-[#14112E] transition-all group"
            >
              <Settings className="w-4 h-4 text-[#8F8CAE] group-hover:text-white transition-colors" />
              <span>Settings</span>
            </button>

            {/* User Profile Card with vibrant iridescent gradient avatar */}
            <div
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center justify-between p-2 rounded-2xl bg-[#13102C] border border-[#241E4E] hover:border-[#3A3378] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0">
                  {firstName.slice(0, 1)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate leading-tight">{displayName}</p>
                  <p className="text-[10px] text-slate-400 truncate">{displayRole}</p>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-slate-400 group-hover:text-white shrink-0" />
            </div>
          </div>
        ) : (
          <div className="pt-3 border-t border-[#1C173E] flex flex-col items-center gap-2">
            {/* Inbox icon */}
            <div className="relative group">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[#8F8CAE] hover:text-white hover:bg-[#14112E] transition-colors"
                aria-label="Inbox"
              >
                <Bell className="w-4.5 h-4.5" />
              </button>
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#120F30] text-white text-xs font-semibold rounded-xl shadow-2xl border border-[#302B68] opacity-0 pointer-events-none group-hover:opacity-100 transition-all z-50 whitespace-nowrap">
                Inbox (3)
              </div>
            </div>

            {/* Settings icon */}
            <div className="relative group">
              <button
                onClick={() => alert('Settings: Workspace preferences, keybindings, and AI API keys.')}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[#8F8CAE] hover:text-white hover:bg-[#14112E] transition-colors"
                aria-label="Settings"
              >
                <Settings className="w-4.5 h-4.5" />
              </button>
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#120F30] text-white text-xs font-semibold rounded-xl shadow-2xl border border-[#302B68] opacity-0 pointer-events-none group-hover:opacity-100 transition-all z-50 whitespace-nowrap">
                Settings
              </div>
            </div>

            {/* User Avatar with vibrant gradient */}
            <div
              onClick={() => setProfileOpen(!profileOpen)}
              className="relative group cursor-pointer my-1"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs shadow-md hover:scale-105 transition-transform">
                {firstName.slice(0, 1)}
              </div>
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#120F30] text-white text-xs font-semibold rounded-xl shadow-2xl border border-[#302B68] opacity-0 pointer-events-none group-hover:opacity-100 transition-all z-50 whitespace-nowrap">
                {displayName} ({displayRole})
              </div>
            </div>
          </div>
        )}
      </motion.aside>

      {/* ========================================================================= */}
      {/* 2. MAIN APP CONTENT CONTAINER                                             */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#E7EAF3] px-6 sm:px-8 flex items-center justify-between sticky top-0 z-40">
          {/* Global Search Bar with Ctrl+K shortcut */}
          <div className="relative w-full max-w-lg">
            <div className="bg-[#F4F6FC] rounded-xl px-4 py-2 flex items-center gap-3 border border-transparent focus-within:border-[#5B48EE]/40 focus-within:bg-white transition-all shadow-xs">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search challenges, projects, or topics..."
                className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none"
              />
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-500 bg-white border border-slate-200 rounded shadow-xs flex-shrink-0">
                Ctrl K
              </kbd>
            </div>
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-[#F4F6FC] transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                    <span className="font-bold text-xs text-slate-800">Notifications</span>
                    <span className="text-[10px] text-[#5B48EE] font-semibold cursor-pointer">Mark all read</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded-xl bg-purple-50/60 border border-purple-100/50">
                      <p className="font-semibold text-slate-800">New challenge assigned</p>
                      <p className="text-[11px] text-slate-500">Fix Broken JWT Authentication recommended for you.</p>
                      <span className="text-[10px] text-purple-600 mt-1 block">15 mins ago</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50">
                      <p className="font-semibold text-slate-800">Streak Updated 🔥</p>
                      <p className="text-[11px] text-slate-500">You hit a 5-day continuous debugging streak!</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">3 hours ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Calendar Icon Button */}
            <button
              onClick={() => alert('Calendar: Next placement mock assessment is scheduled for this Friday at 4:00 PM.')}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-[#F4F6FC] transition-colors"
              aria-label="Calendar"
            >
              <Calendar className="w-4 h-4" />
            </button>

            {/* User Profile Badge */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-xl hover:bg-[#F4F6FC] transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#5B48EE] to-[#8E7CFF] flex items-center justify-center text-white font-bold text-xs shadow-xs ring-2 ring-purple-100 overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-mono">
                      {displayName.split(' ').map((n) => n[0]).join('')}
                    </span>
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight">{displayName}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{displayRole}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs font-bold text-slate-800">{displayName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <Link
                    href="/onboarding"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 hover:text-[#5B48EE] transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Change Placement Goal</span>
                  </Link>
                  <Link
                    href="/"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 hover:text-[#5B48EE] transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Landing Page</span>
                  </Link>
                  <div className="h-px bg-slate-100 my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* 3. DYNAMIC WORKSPACE VIEW SWITCHER                                        */}
        {/* ========================================================================= */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* ------------------------------------------------------------------- */}
            {/* TAB 1: DASHBOARD VIEW (Matching media_1793594609449.png)            */}
            {/* ------------------------------------------------------------------- */}
            {activeNav === 'Dashboard' && (
              <motion.div
                key="dashboard-view"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Greeting Header */}
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <span>{getGreeting()}, {firstName}</span>
                    <span className="text-2xl">👋</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                    Continue your practice and get closer to your placement goal.
                  </p>
                </div>

                {/* ROW 1: Hero Challenge Card + Your Progress */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                  {/* Hero Challenge Card (Clean Obsidian/Violet, No BorderBeam) */}
                  <div className="xl:col-span-8 bg-gradient-to-br from-[#1E0D4C] via-[#1B0F43] to-[#120833] rounded-3xl p-7 text-white relative overflow-hidden shadow-lg flex flex-col justify-between border border-[#3C287A]/40">
                    <div className="relative z-10">
                      {/* Pill Badge */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5B48EE]/30 border border-[#7D6BFF]/40 text-[#D4CDFF] text-xs font-semibold mb-4">
                        <Sparkles className="w-3.5 h-3.5 text-[#A69BFF]" />
                        <span>Recommended for You</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-7">
                          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                            Fix Broken JWT Authentication
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
                            A Node.js API returns 401 for valid users. Investigate and fix the authentication flow.
                          </p>

                          {/* Metadata Badges */}
                          <div className="flex flex-wrap items-center gap-2 text-xs mb-6">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              Medium
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/25">
                              <span className="w-2 h-2 rounded-full bg-emerald-400" />
                              Node.js
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-200 font-medium border border-purple-500/30">
                              <Clock className="w-3 h-3 text-purple-300" />
                              25-35 min
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-200 font-medium border border-indigo-500/30">
                              <Code2 className="w-3 h-3 text-indigo-300" />
                              Debugging
                            </span>
                          </div>

                          {/* CTA Button */}
                          <button
                            onClick={() => setActiveChallengeModal('Fix Broken JWT Authentication')}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#5B48EE] hover:bg-[#6D5CF6] text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-indigo-500/35 hover:translate-x-0.5 active:scale-98"
                          >
                            <span>Start Challenge</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Stylized IDE Graphic with Caterpillar Bug */}
                        <div className="md:col-span-5 flex justify-center">
                          <div className="w-full max-w-[260px] bg-[#0E0720]/90 border border-[#3A2870] rounded-2xl p-4 shadow-2xl relative">
                            {/* Window header */}
                            <div className="flex items-center justify-between pb-3 border-b border-purple-900/40 mb-3">
                              <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                              </div>
                              <span className="text-[10px] font-mono text-slate-400">jwt.verify.js</span>
                            </div>

                            {/* Mini code lines */}
                            <div className="space-y-1.5 font-mono text-[9px] text-slate-500 mb-3 select-none">
                              <div className="h-1.5 bg-purple-900/40 rounded w-3/4" />
                              <div className="h-1.5 bg-purple-900/40 rounded w-1/2" />
                            </div>

                            {/* Glowing centered bug frame */}
                            <div className="h-28 rounded-xl bg-[#160B30] border border-[#523B9E]/50 flex flex-col items-center justify-center p-3 text-center shadow-inner relative overflow-hidden group">
                              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-1 text-2xl shadow-lg shadow-emerald-500/10 animate-bounce">
                                🐛
                              </div>
                              <span className="text-[11px] font-mono font-semibold text-emerald-400">
                                401 Unauthorized
                              </span>
                              <span className="text-[9px] text-slate-400">Secret key mismatch</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Your Progress Card */}
                  <div className="xl:col-span-4 bg-white rounded-3xl p-6 border border-[#E7EAF3] shadow-sm flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 mb-5">Your Progress</h3>

                      <div className="flex items-center gap-6 mb-6">
                        {/* Radial Progress Ring */}
                        <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" stroke="#F0F2FA" strokeWidth="8" fill="transparent" />
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              stroke="#5B48EE"
                              strokeWidth="8"
                              fill="transparent"
                              strokeDasharray={2 * Math.PI * 40}
                              strokeDashoffset={2 * Math.PI * 40 * (1 - 0.68)}
                              strokeLinecap="round"
                              className="transition-all duration-1000 ease-out"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-extrabold text-slate-900 leading-none">68%</span>
                            <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Overall</span>
                          </div>
                        </div>

                        {/* Skill Bars */}
                        <div className="flex-1 space-y-2.5">
                          {[
                            { skill: 'Debugging', val: 85, color: '#5B48EE', icon: '</>' },
                            { skill: 'Testing', val: 62, color: '#8E7CFF', icon: '🧪' },
                            { skill: 'API & Backend', val: 70, color: '#5B48EE', icon: '⚡' },
                            { skill: 'Code Quality', val: 55, color: '#8E7CFF', icon: '📊' },
                          ].map((s) => (
                            <div key={s.skill} className="space-y-1">
                              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                                <span className="flex items-center gap-1.5">
                                  <span className="font-mono text-[10px]">{s.icon}</span>
                                  {s.skill}
                                </span>
                                <span className="text-slate-800">{s.val}%</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-[#F0F2FA] overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-700"
                                  style={{ width: `${s.val}%`, backgroundColor: s.color }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Placement readiness target: 80%</span>
                      <span className="text-[#5B48EE] font-bold">On track (+4% this week)</span>
                    </div>
                  </div>
                </div>

                {/* ROW 2: 4 Metric Tiles with StatsCounter */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* Card 1: Challenges Solved */}
                  <div className="bg-white rounded-2xl p-5 border border-[#E7EAF3] shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-[#5B48EE] font-mono font-bold text-base flex-shrink-0">
                      {'</>'}
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900 tracking-tight">
                        <StatsCounter value={24} duration={1.2} />
                      </div>
                      <p className="text-xs text-slate-500 font-medium">Challenges Solved</p>
                    </div>
                  </div>

                  {/* Card 2: Current Streak */}
                  <div className="bg-white rounded-2xl p-5 border border-[#E7EAF3] shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 flex-shrink-0">
                      <Flame className="w-6 h-6 fill-amber-400 text-amber-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900 tracking-tight flex items-baseline gap-1">
                        <StatsCounter value={5} duration={1.2} />
                        <span className="text-sm font-bold text-slate-700">Days</span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">Current Streak</p>
                    </div>
                  </div>

                  {/* Card 3: Avg. Score */}
                  <div className="bg-white rounded-2xl p-5 border border-[#E7EAF3] shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
                      <Trophy className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900 tracking-tight flex items-baseline">
                        <StatsCounter value={82} duration={1.2} />
                        <span>%</span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">Avg. Score</p>
                    </div>
                  </div>

                  {/* Card 4: Improvement */}
                  <div className="bg-white rounded-2xl p-5 border border-[#E7EAF3] shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900 tracking-tight flex items-baseline">
                        <span>+</span>
                        <StatsCounter value={12} duration={1.2} />
                        <span>%</span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">Improvement</p>
                    </div>
                  </div>
                </div>

                {/* ROW 3: Continue Practicing (Left) + Weakness & Goals (Right) */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                  {/* Continue Practicing Queue */}
                  <div className="xl:col-span-7 bg-white rounded-3xl p-6 border border-[#E7EAF3] shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-base font-bold text-slate-900">Continue Practicing</h3>
                      <button
                        onClick={() => setActiveNav('Projects')}
                        className="text-xs font-bold text-[#5B48EE] hover:text-[#4A37D6] flex items-center gap-1"
                      >
                        <span>View Project Library</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {[
                        {
                          id: 'ecommerce-debug',
                          title: 'E-Commerce API – Debugging Round',
                          track: 'Debugging Round',
                          time: 'Last worked 2 hours ago',
                          progress: 60,
                        },
                        {
                          id: 'rate-limiter',
                          title: 'Implement Redis Token Bucket Rate Limiter',
                          track: 'Feature Implementation',
                          time: 'Last worked Yesterday',
                          progress: 45,
                        },
                        {
                          id: 'docker-env',
                          title: 'Fix Docker Compose Port Collision & Postgres Init',
                          track: 'Environment Rescue',
                          time: 'Last worked 2 days ago',
                          progress: 80,
                        },
                      ].map((item) => (
                        <div
                          key={item.id}
                          className="p-4 rounded-2xl border border-slate-100 hover:border-purple-200 bg-slate-50/50 hover:bg-white transition-all flex items-center justify-between gap-4 group"
                        >
                          <div className="flex items-center gap-3.5 flex-1 min-w-0">
                            <button
                              onClick={() => setActiveChallengeModal(item.title)}
                              className="w-10 h-10 rounded-xl bg-[#5B48EE]/10 group-hover:bg-[#5B48EE] text-[#5B48EE] group-hover:text-white flex items-center justify-center transition-all flex-shrink-0"
                            >
                              <Play className="w-4 h-4 fill-current ml-0.5" />
                            </button>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                {item.title}
                              </h4>
                              <p className="text-[11px] text-slate-400 font-medium mt-0.5">{item.time}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="w-24 hidden sm:block">
                              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                                <span>Progress</span>
                                <span>{item.progress}%</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-[#5B48EE]"
                                  style={{ width: `${item.progress}%` }}
                                />
                              </div>
                            </div>
                            <button
                              onClick={() => setActiveChallengeModal(item.title)}
                              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-[#5B48EE] hover:text-[#5B48EE] transition-colors"
                            >
                              Resume
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weakness Areas & Daily Goal */}
                  <div className="xl:col-span-5 space-y-6">
                    {/* Your Weakness Areas */}
                    <div className="bg-white rounded-3xl p-6 border border-[#E7EAF3] shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">Your Weakness Areas</h3>
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">Focus for this week</span>
                      </div>

                      <div className="space-y-3.5">
                        {[
                          { area: 'Database & Query', pct: 48, barColor: '#F59E0B' },
                          { area: 'Automated Testing', pct: 55, barColor: '#EC4899' },
                          { area: 'Error Handling', pct: 58, barColor: '#8B5CF6' },
                        ].map((w) => (
                          <div key={w.area} className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                              <span className="flex items-center gap-2">
                                <Database className="w-3.5 h-3.5 text-slate-400" />
                                {w.area}
                              </span>
                              <span className="font-mono text-slate-900">{w.pct}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${w.pct}%`, backgroundColor: w.barColor }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 p-3 rounded-xl bg-purple-50/70 border border-purple-100 text-[11px] text-purple-900 flex items-center justify-between">
                        <span>💡 Practice 2 Database questions to boost readiness +6%</span>
                        <button
                          onClick={() => setActiveNav('Projects')}
                          className="font-bold text-[#5B48EE] hover:underline flex-shrink-0 ml-2"
                        >
                          Solve Now →
                        </button>
                      </div>
                    </div>

                    {/* Daily Goal Checklist */}
                    <div className="bg-white rounded-3xl p-6 border border-[#E7EAF3] shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-[#5B48EE]" />
                          <h3 className="text-base font-bold text-slate-900">Daily Goal</h3>
                        </div>
                        <span className="text-xs font-bold text-slate-500">
                          {completedGoalsCount} of {dailyGoals.length} completed
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {dailyGoals.map((g) => (
                          <button
                            key={g.id}
                            onClick={() => toggleGoal(g.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl text-left text-xs font-medium transition-all ${
                              g.completed
                                ? 'bg-emerald-50/60 border border-emerald-100 text-emerald-950'
                                : 'bg-slate-50 border border-slate-100 text-slate-700 hover:bg-slate-100/70'
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors flex-shrink-0 ${
                                g.completed
                                  ? 'bg-emerald-500 text-white'
                                  : 'border-2 border-slate-300 bg-white'
                              }`}
                            >
                              {g.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <span className={g.completed ? 'line-through text-slate-500' : 'text-slate-800'}>
                              {g.title}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ROW 4: Quick Actions 2x2 Grid */}
                <div className="bg-white rounded-3xl p-6 border border-[#E7EAF3] shadow-sm">
                  <h3 className="text-base font-bold text-slate-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        title: 'Daily Challenge',
                        desc: 'Solve today’s curated placement problem',
                        icon: Zap,
                        color: 'from-amber-500 to-amber-600',
                        action: () => setActiveChallengeModal('Daily Challenge: Cache Invalidation in Redis'),
                      },
                      {
                        title: 'Project Library',
                        desc: 'Explore 10+ real-world repositories',
                        icon: FolderGit2,
                        color: 'from-purple-500 to-[#5B48EE]',
                        action: () => setActiveNav('Projects'),
                      },
                      {
                        title: 'AI Mock Interview',
                        desc: '45-min timed technical screening round',
                        icon: Briefcase,
                        color: 'from-indigo-500 to-blue-600',
                        action: () => setActiveNav('Assessments'),
                      },
                      {
                        title: 'Import Repository',
                        desc: 'Import GitHub repository or ZIP archive',
                        icon: Upload,
                        color: 'from-emerald-500 to-teal-600',
                        action: () => setImportModalOpen(true),
                      },
                    ].map((act) => {
                      const Icon = act.icon;
                      return (
                        <button
                          key={act.title}
                          onClick={act.action}
                          className="p-4 rounded-2xl border border-slate-100 hover:border-purple-200 bg-slate-50/50 hover:bg-white transition-all text-left group hover:shadow-md"
                        >
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${act.color} text-white flex items-center justify-center mb-3 shadow-md shadow-purple-500/10 group-hover:scale-105 transition-transform`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#5B48EE] transition-colors">
                            {act.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{act.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* TAB 2: PROJECT LIBRARY (MVP - Task 2)                               */}
            {/* ------------------------------------------------------------------- */}
            {activeNav === 'Projects' && (
              <motion.div
                key="projects-view"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Header with Title and "Import Your Own Project" CTA */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                      <FolderGit2 className="w-7 h-7 text-[#5B48EE]" />
                      <span>Project Library (MVP)</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                      Search multi-file production repositories. Choose your stack, inspect bugs, and push pull requests.
                    </p>
                  </div>

                  {/* "Import Your Own Project" Trigger Button */}
                  <button
                    onClick={() => setImportModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5B48EE] to-[#7D6BFF] text-white text-xs font-bold shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all flex-shrink-0"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Import Your Own Project</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-semibold uppercase tracking-wider">
                      Coming Soon
                    </span>
                  </button>
                </div>

                {/* Search & Filter Toolbar */}
                <div className="bg-white rounded-3xl p-5 border border-[#E7EAF3] shadow-sm space-y-4">
                  {/* Top Bar: Search Input */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search projects by name, keywords, or tech stack (e.g. React, Docker, Python)..."
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-[#F4F6FC] border border-transparent focus:border-[#5B48EE]/40 focus:bg-white rounded-2xl text-xs text-slate-800 placeholder-slate-400 outline-none transition-all"
                    />
                    {projectSearch && (
                      <button
                        onClick={() => setProjectSearch('')}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Filter Chips: All, Web Dev, Backend, AI/ML, DevOps */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
                        <Filter className="w-3.5 h-3.5" />
                        Domain:
                      </span>
                      {[
                        { id: 'all', label: 'All Projects', count: PROJECTS_DATA.length },
                        { id: 'web', label: 'Web Dev', count: PROJECTS_DATA.filter((p) => p.category === 'web').length },
                        { id: 'backend', label: 'Backend', count: PROJECTS_DATA.filter((p) => p.category === 'backend').length },
                        { id: 'ai', label: 'AI/ML', count: PROJECTS_DATA.filter((p) => p.category === 'ai').length },
                        { id: 'devops', label: 'DevOps', count: PROJECTS_DATA.filter((p) => p.category === 'devops').length },
                      ].map((chip) => {
                        const isSelected = projectFilterChip === chip.id;
                        return (
                          <button
                            key={chip.id}
                            onClick={() => setProjectFilterChip(chip.id as any)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-[#5B48EE] text-white shadow-md shadow-indigo-500/25'
                                : 'bg-[#F4F6FC] text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                            }`}
                          >
                            <span>{chip.label}</span>
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {chip.count}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <span className="text-xs font-semibold text-slate-400">
                      Showing {filteredProjects.length} of {PROJECTS_DATA.length} projects
                    </span>
                  </div>
                </div>

                {/* Project Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-white rounded-3xl p-6 border border-[#E7EAF3] shadow-xs hover:shadow-xl hover:border-purple-200 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Card Top: Category, Rating & Difficulty Badge */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wider">
                            {project.category === 'ai' ? 'AI / ML' : project.category.toUpperCase()}
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              {project.rating}
                            </span>

                            {/* Difficulty Badge (Easy / Medium / Hard) */}
                            <span
                              className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${
                                project.difficulty === 'Easy'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : project.difficulty === 'Medium'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              {project.difficulty}
                            </span>
                          </div>
                        </div>

                        {/* Project Title */}
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-[#5B48EE] transition-colors leading-snug mb-2">
                          {project.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                          {project.description}
                        </p>

                        {/* Tech Stack Badges */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.stack.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 rounded-md bg-[#F4F6FC] text-[#5B48EE] text-[11px] font-medium border border-indigo-100/60"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Footer: Metadata & Launch Action */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Est: {project.estTime}</span>
                        </div>

                        <button
                          onClick={() => setActiveChallengeModal(project.title)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5B48EE] hover:bg-[#4A37D6] text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all group-hover:translate-x-0.5"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Launch Sandbox</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {filteredProjects.length === 0 && (
                  <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                    <FolderGit2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-slate-800">No projects found</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      No repository matched "{projectSearch}" in the "{projectFilterChip}" category. Try adjusting your search query or clear filters.
                    </p>
                    <button
                      onClick={() => {
                        setProjectSearch('');
                        setProjectFilterChip('all');
                      }}
                      className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* TAB 3: PRACTICE VIEW (Blueprint Modes & Live Repos)                 */}
            {/* ------------------------------------------------------------------- */}
            {activeNav === 'Practice' && (
              <motion.div
                key="practice-view"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Practice Arena
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                    Hands-on engineering sandboxes. Practice under realistic repo conditions with policy-governed AI.
                  </p>
                </div>

                {/* 4 Blueprint Practice Mode Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      id: 'debugging',
                      title: 'Debugging Round',
                      icon: '🪲',
                      desc: 'Diagnose runtime errors, HTTP 500s, JWT bypasses, and race conditions.',
                      count: '48 Challenges',
                    },
                    {
                      id: 'rescue',
                      title: 'Environment Rescue',
                      icon: '🛠️',
                      desc: 'Fix broken Docker configs, port collisions, and package lock regressions.',
                      count: '24 Scenarios',
                    },
                    {
                      id: 'feature',
                      title: 'Feature Implementation',
                      icon: '⚡',
                      desc: 'Implement pagination, rate limiting, and RBAC without breaking existing tests.',
                      count: '36 Projects',
                    },
                    {
                      id: 'interview',
                      title: 'Interview Simulation',
                      icon: '⏱️',
                      desc: 'Timed 45-min technical rounds with token caps and strict AI skepticism.',
                      count: '18 Mocks',
                    },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setSelectedPracticeMode(mode.id as any)}
                      className={`p-5 rounded-2xl border text-left transition-all ${
                        selectedPracticeMode === mode.id
                          ? 'bg-white border-[#5B48EE] shadow-md ring-2 ring-[#5B48EE]/20'
                          : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                      }`}
                    >
                      <div className="text-2xl mb-2">{mode.icon}</div>
                      <h3 className="text-sm font-bold text-slate-900">{mode.title}</h3>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">{mode.desc}</p>
                      <span className="text-[10px] font-bold text-[#5B48EE] mt-3 block">{mode.count}</span>
                    </button>
                  ))}
                </div>

                {/* Mode Filter Strip */}
                <div className="bg-white rounded-2xl p-4 border border-[#E7EAF3] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-700">Filter Stack:</span>
                    {['all', 'Node.js', 'Python', 'Java', 'Docker', 'PostgreSQL'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLanguage(lang)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          selectedLanguage === lang
                            ? 'bg-[#5B48EE] text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {lang.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  <span className="text-xs font-medium text-slate-400">
                    Showing active challenges for {selectedPracticeMode.toUpperCase()}
                  </span>
                </div>

                {/* Practice Challenges Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[
                    {
                      title: 'Fix Broken JWT Authentication',
                      mode: 'debugging',
                      lang: 'Node.js',
                      diff: 'Medium',
                      time: '30m',
                      desc: 'A Node.js Express API returns 401 Unauthorized for valid credentials. Diagnose the secret key mismatch in auth middleware.',
                    },
                    {
                      title: 'Docker Compose Port 5432 Collision',
                      mode: 'rescue',
                      lang: 'Docker',
                      diff: 'Easy',
                      time: '20m',
                      desc: 'Host port 5432 is already bound by local PostgreSQL. Reconfigure compose env vars and healthchecks without breaking the web service.',
                    },
                    {
                      title: 'Implement Redis Token Bucket Rate Limiter',
                      mode: 'feature',
                      lang: 'Node.js',
                      diff: 'Hard',
                      time: '45m',
                      desc: 'Enforce 60 requests per minute per IP using Redis atomic operations and sliding window algorithms.',
                    },
                    {
                      title: 'Async Race Condition in Cart Checkout',
                      mode: 'debugging',
                      lang: 'Python',
                      diff: 'Hard',
                      time: '40m',
                      desc: 'Concurrent inventory decrements lead to negative stock levels during simulated flash sales. Implement pessimistic locking.',
                    },
                    {
                      title: 'Spring Boot REST API Pagination & Sort',
                      mode: 'feature',
                      lang: 'Java',
                      diff: 'Medium',
                      time: '35m',
                      desc: 'Add zero-indexed Pageable metadata and dynamic criteria filters to the catalog microservice.',
                    },
                    {
                      title: 'TCS Placement Simulated Technical Screening',
                      mode: 'interview',
                      lang: 'Java',
                      diff: 'Medium',
                      time: '45m',
                      desc: 'Full timed assessment: 2 debugging tasks + 1 algorithmic round under strict 5-token AI prompt limit.',
                    },
                  ]
                    .filter((c) => selectedPracticeMode === c.mode || selectedPracticeMode === 'debugging')
                    .map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-3xl p-6 border border-[#E7EAF3] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-[#5B48EE] border border-purple-200">
                              {item.lang}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-400">{item.time}</span>
                          </div>

                          <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                            {item.title}
                          </h3>
                          <p className="text-xs text-slate-500 leading-relaxed mb-4">{item.desc}</p>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                            {item.diff}
                          </span>
                          <button
                            onClick={() => setActiveChallengeModal(item.title)}
                            className="px-4 py-1.5 rounded-xl bg-[#5B48EE] hover:bg-[#4A37D6] text-white text-xs font-semibold shadow-sm transition-colors"
                          >
                            Launch Sandbox →
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* TAB 4: CHALLENGES CATALOG                                           */}
            {/* ------------------------------------------------------------------- */}
            {activeNav === 'Challenges' && (
              <motion.div
                key="challenges-view"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Challenge Catalog
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                      Browse 500+ curated real-world repository challenges.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Filter by challenge name..."
                      value={challengeSearch}
                      onChange={(e) => setChallengeSearch(e.target.value)}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#5B48EE] w-64 shadow-xs"
                    />
                  </div>
                </div>

                {/* Challenges Table */}
                <div className="bg-white rounded-3xl border border-[#E7EAF3] shadow-sm overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span className="w-1/2">Challenge Name</span>
                    <span className="w-1/6">Category</span>
                    <span className="w-1/6">Difficulty</span>
                    <span className="w-1/6 text-right">Action</span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {[
                      { name: 'Fix Broken JWT Authentication', cat: 'Security & Auth', diff: 'Medium', solved: true },
                      { name: 'E-Commerce Cart Async Race Condition', cat: 'Concurrency', diff: 'Hard', solved: false },
                      { name: 'Docker Compose Postgres Port Conflict', cat: 'DevOps & Env', diff: 'Easy', solved: true },
                      { name: 'Redis Token Bucket Rate Limiter', cat: 'Backend Systems', diff: 'Hard', solved: false },
                      { name: 'REST API Pagination & SQL N+1 Query Fix', cat: 'Database', diff: 'Medium', solved: false },
                      { name: 'Null Pointer Exception in Kafka Consumer', cat: 'Distributed Systems', diff: 'Hard', solved: false },
                      { name: 'CORS Headers Misconfiguration in Gateway', cat: 'Networking', diff: 'Easy', solved: true },
                      { name: 'Implement OAuth2 PKCE Authorization Flow', cat: 'Security & Auth', diff: 'Hard', solved: false },
                    ]
                      .filter((c) => !challengeSearch || c.name.toLowerCase().includes(challengeSearch.toLowerCase()))
                      .map((c, i) => (
                        <div key={i} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50/70 transition-colors">
                          <div className="w-1/2 flex items-center gap-3">
                            <span className={`w-2 h-2 rounded-full ${c.solved ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                            <span className="font-bold text-slate-800 text-sm">{c.name}</span>
                          </div>
                          <div className="w-1/6 text-slate-500 font-medium">{c.cat}</div>
                          <div className="w-1/6">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                c.diff === 'Easy'
                                  ? 'bg-emerald-50 text-emerald-600'
                                  : c.diff === 'Medium'
                                  ? 'bg-amber-50 text-amber-600'
                                  : 'bg-rose-50 text-rose-600'
                              }`}
                            >
                              {c.diff}
                            </span>
                          </div>
                          <div className="w-1/6 text-right">
                            <button
                              onClick={() => setActiveChallengeModal(c.name)}
                              className="px-3 py-1.5 rounded-lg bg-[#5B48EE] hover:bg-[#4A37D6] text-white font-semibold transition-colors shadow-xs"
                            >
                              Solve →
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* TAB 5: ASSESSMENTS (TCS, Infosys, Wipro, Product Mocks)             */}
            {/* ------------------------------------------------------------------- */}
            {activeNav === 'Assessments' && (
              <motion.div
                key="assessments-view"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Placement Assessments
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                    Proctored company-specific recruitment rounds simulating exact timing, constraints, and AI rules.
                  </p>
                </div>

                {/* Readiness Score Banner */}
                <div className="bg-gradient-to-r from-[#180E38] via-[#241355] to-[#180E38] rounded-3xl p-6 text-white border border-[#43278A]/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                  <div className="relative z-10">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-[#A69BFF]">Placement Readiness Meter</span>
                    <h2 className="text-3xl font-extrabold mt-1">72% Ready for Campus Hiring</h2>
                    <p className="text-xs text-slate-300 mt-1 max-w-xl">
                      Based on your average test accuracy (82%), streak consistency, and debugging efficiency. Complete 2 more mock tests to hit the 80% tier benchmark.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 relative z-10 flex-shrink-0">
                    <div className="text-center px-4 py-2 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md">
                      <span className="text-2xl font-black text-emerald-400">Top 15%</span>
                      <p className="text-[10px] text-slate-300">Cohort Ranking</p>
                    </div>
                  </div>
                </div>

                {/* Mock Rounds Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      company: 'TCS NQT National Qualifier Mock',
                      duration: '90 Minutes',
                      sections: 'Debugging (30m) • Hands-on Coding (60m)',
                      passingScore: '75%',
                      badge: 'Campus Drive 2026',
                    },
                    {
                      company: 'Infosys SP / DSE Specialist Round',
                      duration: '120 Minutes',
                      sections: 'Full Stack REST Bugfix • DSA Optimization',
                      passingScore: '70%',
                      badge: 'Specialist Programmer',
                    },
                    {
                      company: 'Wipro Elite National Talent Hunt Mock',
                      duration: '60 Minutes',
                      sections: 'Code Analysis • Error Diagnosis • Logic',
                      passingScore: '70%',
                      badge: 'Elite Hiring',
                    },
                    {
                      company: 'Tier-1 Product Company Timed Screening',
                      duration: '60 Minutes',
                      sections: 'Concurrency Bugs • System Design • Unit Tests',
                      passingScore: '85%',
                      badge: 'Product Track',
                    },
                  ].map((exam, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-3xl p-6 border border-[#E7EAF3] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-[#5B48EE] border border-purple-200">
                            {exam.badge}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">{exam.duration}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{exam.company}</h3>
                        <p className="text-xs text-slate-500 mb-4">{exam.sections}</p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-600">
                          Cutoff Target: <strong className="text-slate-900">{exam.passingScore}</strong>
                        </span>
                        <button
                          onClick={() => alert(`Starting proctored assessment: ${exam.company}. Fullscreen lock will engage.`)}
                          className="px-5 py-2 bg-[#5B48EE] hover:bg-[#4A37D6] text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                        >
                          Start Mock Test →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* TAB 6: PROGRESS & PERFORMANCE ANALYTICS                             */}
            {/* ------------------------------------------------------------------- */}
            {activeNav === 'Progress' && (
              <motion.div
                key="progress-view"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Performance Analytics
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                    Comprehensive metrics covering accuracy, AI prompt skepticism calibration, and skill velocity.
                  </p>
                </div>

                {/* Metrics Breakdown Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-3xl p-6 border border-[#E7EAF3] shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 mb-4">Skill Competency Radar</h3>
                    <div className="space-y-3">
                      {[
                        { skill: 'Debugging & Diagnosis', score: 85, color: '#5B48EE' },
                        { skill: 'Test Suite Implementation', score: 62, color: '#8E7CFF' },
                        { skill: 'API Architecture & REST', score: 70, color: '#5B48EE' },
                        { skill: 'Code Quality & Refactoring', score: 55, color: '#8E7CFF' },
                        { skill: 'Database Optimization', score: 48, color: '#F59E0B' },
                      ].map((item) => (
                        <div key={item.skill} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold text-slate-700">
                            <span>{item.skill}</span>
                            <span className="font-mono">{item.score}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${item.score}%`, backgroundColor: item.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Prompt Efficiency Meter */}
                  <div className="bg-white rounded-3xl p-6 border border-[#E7EAF3] shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-bold text-slate-900">AI Skepticism & Trust</h3>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Excellent
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-4">
                        Evaluates whether you critically verify AI responses instead of blindly pasting suggestions.
                      </p>

                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center mb-4">
                        <span className="text-3xl font-black text-[#5B48EE]">84%</span>
                        <p className="text-[11px] font-semibold text-slate-600 mt-1">
                          Surgical Prompt Efficiency Score
                        </p>
                      </div>

                      <div className="text-[11px] space-y-1.5 text-slate-600">
                        <p>✓ 0 Hallucinated dependencies accepted</p>
                        <p>✓ 14,250 tokens conserved (85% budget remaining)</p>
                        <p>✓ Avoided 3 synthetic trap rounds</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 text-[11px] text-[#5B48EE] font-bold">
                      Placement Benchmark: &gt; 80% (Achieved)
                    </div>
                  </div>

                  {/* Weekly Velocity */}
                  <div className="bg-white rounded-3xl p-6 border border-[#E7EAF3] shadow-sm flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-2">Weekly Solving Velocity</h3>
                      <p className="text-xs text-slate-500 mb-4">Challenges completed per day over the last week.</p>

                      <div className="flex items-end justify-between h-36 gap-2 pt-4">
                        {[
                          { day: 'Mon', h: '60%', count: 3 },
                          { day: 'Tue', h: '80%', count: 4 },
                          { day: 'Wed', h: '40%', count: 2 },
                          { day: 'Thu', h: '100%', count: 5 },
                          { day: 'Fri', h: '75%', count: 4 },
                          { day: 'Sat', h: '90%', count: 4 },
                          { day: 'Sun', h: '50%', count: 2 },
                        ].map((bar) => (
                          <div key={bar.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                            <span className="text-[10px] font-bold text-slate-600">{bar.count}</span>
                            <div
                              className="w-full bg-[#5B48EE] rounded-t-lg transition-all duration-500 hover:bg-[#4A37D6]"
                              style={{ height: bar.h }}
                            />
                            <span className="text-[10px] font-medium text-slate-400">{bar.day}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                      Total: 24 challenges solved (+12% improvement)
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* TAB 7: AI ASSISTANT & PROMPT EFFICIENCY LAB                         */}
            {/* ------------------------------------------------------------------- */}
            {activeNav === 'AI Assistant' && (
              <motion.div
                key="ai-assistant-view"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <Sparkles className="w-7 h-7 text-[#5B48EE]" />
                    <span>AI Engineering Mentor & Prompt Lab</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                    Practice surgical prompting and receive policy-governed hints without leaking solution answers.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* AI Policy Controls */}
                  <div className="lg:col-span-4 space-y-6">
                    {/* Policy Mode Selector */}
                    <div className="bg-white rounded-3xl p-6 border border-[#E7EAF3] shadow-sm">
                      <h3 className="text-sm font-bold text-slate-900 mb-2">Server-Side Policy Level</h3>
                      <p className="text-xs text-slate-500 mb-4">
                        Governs how direct the AI's responses are permitted to be.
                      </p>

                      <div className="space-y-2.5">
                        {[
                          {
                            id: 'learning',
                            name: 'Learning Mode',
                            desc: 'Conceptual explanations and code analogies.',
                          },
                          {
                            id: 'guided',
                            name: 'Guided Practice',
                            desc: 'Socratic questioning, directs to error lines.',
                          },
                          {
                            id: 'strict',
                            name: 'Strict Assessment',
                            desc: 'Hints restricted, token consumption penalised.',
                          },
                        ].map((m) => (
                          <button
                            key={m.id}
                            onClick={() => setAiPolicyMode(m.id as any)}
                            className={`w-full p-3 rounded-2xl border text-left transition-all ${
                              aiPolicyMode === m.id
                                ? 'bg-purple-50/70 border-[#5B48EE] text-[#5B48EE]'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <p className="text-xs font-bold">{m.name}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{m.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Token Budget Tracker */}
                    <div className="bg-white rounded-3xl p-6 border border-[#E7EAF3] shadow-sm">
                      <h3 className="text-sm font-bold text-slate-900 mb-2">Token Allowance</h3>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-extrabold text-slate-900">14,250</span>
                        <span className="text-xs text-slate-500 font-semibold">/ 15,000 Tokens</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden mb-3">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '95%' }} />
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Remaining balance renews in 6 days. Surgical prompts cost 60% fewer tokens.
                      </p>
                    </div>
                  </div>

                  {/* Interactive Chat Window */}
                  <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E7EAF3] shadow-sm flex flex-col h-[560px]">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#5B48EE] flex items-center justify-center text-white">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">DevPractice Mentor</p>
                          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Online • Socratic Engine
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Messages Scroll Area */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-4">
                      {chatMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                              msg.sender === 'user'
                                ? 'bg-[#5B48EE] text-white rounded-br-none'
                                : 'bg-[#F4F6FC] text-slate-800 border border-slate-200 rounded-bl-none'
                            }`}
                          >
                            <p>{msg.text}</p>
                            <span
                              className={`text-[9px] mt-1.5 block ${
                                msg.sender === 'user' ? 'text-purple-200' : 'text-slate-400'
                              }`}
                            >
                              {msg.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Chat Input Bar */}
                    <form onSubmit={handleSendChat} className="p-4 border-t border-slate-100 flex items-center gap-3">
                      <input
                        type="text"
                        value={inputChat}
                        onChange={(e) => setInputChat(e.target.value)}
                        placeholder="Ask a surgical question about your active challenge..."
                        className="flex-1 bg-[#F4F6FC] rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none border border-transparent focus:border-[#5B48EE]"
                      />
                      <button
                        type="submit"
                        className="p-2.5 rounded-xl bg-[#5B48EE] hover:bg-[#4A37D6] text-white transition-colors shadow-xs"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* TAB 8: RESOURCES & CHEATSHEETS                                      */}
            {/* ------------------------------------------------------------------- */}
            {activeNav === 'Resources' && (
              <motion.div
                key="resources-view"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Engineering Resources & Playbooks
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                    Curated cheatsheets, architectural patterns, and placement interview roadmaps.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: 'System Design Interview Cheatsheet',
                      cat: 'Architecture',
                      pages: '12 Pages PDF',
                      desc: 'Caching strategies, SQL vs NoSQL sharding, and message broker backpressure patterns.',
                    },
                    {
                      title: 'Docker & Microservices Emergency Kit',
                      cat: 'DevOps',
                      pages: '8 Pages PDF',
                      desc: 'Port collision resolution, volume persistent storage, and multi-stage build optimization.',
                    },
                    {
                      title: 'Top 50 Backend Placement Questions',
                      cat: 'Placement',
                      pages: '24 Pages Guide',
                      desc: 'Real company questions from TCS Digital, Infosys SP, and Product engineering rounds.',
                    },
                    {
                      title: 'Git Merge Conflicts & Rebasing Playbook',
                      cat: 'Version Control',
                      pages: '6 Pages PDF',
                      desc: 'Interactive guide to resolving three-way merge collisions and bisecting regressions.',
                    },
                    {
                      title: 'PostgreSQL Indexing & Explain Analyze',
                      cat: 'Database',
                      pages: '10 Pages PDF',
                      desc: 'B-Tree vs GIN indexes, query plans, and fixing sequential scans on large tables.',
                    },
                    {
                      title: 'Resume & Portfolio Guide for Engineers',
                      cat: 'Career',
                      pages: '15 Pages PDF',
                      desc: 'How to showcase real debugging achievements and practical repos to hiring managers.',
                    },
                  ].map((res, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-3xl p-6 border border-[#E7EAF3] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200">
                            {res.cat}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-400">{res.pages}</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mb-2">{res.title}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4">{res.desc}</p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => alert(`Opening resource: ${res.title}`)}
                          className="flex items-center gap-1.5 text-xs font-bold text-[#5B48EE] hover:underline"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Guide</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* TAB 9: COMMUNITY & LEADERBOARD                                      */}
            {/* ------------------------------------------------------------------- */}
            {activeNav === 'Community' && (
              <motion.div
                key="community-view"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Placement Community & Leaderboard
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                    Collaborate with peers, participate in weekly debugging hackathons, and attend mentor office hours.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Leaderboard */}
                  <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#E7EAF3] shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-500" />
                        <h3 className="text-base font-bold text-slate-900">Weekly Top Solvers</h3>
                      </div>
                      <span className="text-xs font-bold text-slate-400">Campus Cohort 2026</span>
                    </div>

                    <div className="space-y-3">
                      {[
                        { rank: 1, name: 'Priya Sharma', college: 'IIT Bombay', solved: 42, points: '2,840 pts' },
                        { rank: 2, name: 'Rohan Mehta', college: 'BITS Pilani', solved: 38, points: '2,610 pts' },
                        { rank: 3, name: 'Alex Rivera (You)', college: 'National Inst of Tech', solved: 24, points: '1,980 pts', isUser: true },
                        { rank: 4, name: 'Ananya Rao', college: 'VIT Vellore', solved: 22, points: '1,820 pts' },
                        { rank: 5, name: 'Karthik S', college: 'DTU Delhi', solved: 21, points: '1,750 pts' },
                      ].map((lead) => (
                        <div
                          key={lead.rank}
                          className={`p-3.5 rounded-2xl flex items-center justify-between transition-all ${
                            lead.isUser
                              ? 'bg-purple-50/80 border border-[#5B48EE]/30 shadow-xs'
                              : 'bg-slate-50/60 border border-slate-100 hover:bg-slate-100/60'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                                lead.rank === 1
                                  ? 'bg-amber-400 text-amber-950 shadow-xs'
                                  : lead.rank === 2
                                  ? 'bg-slate-300 text-slate-800'
                                  : lead.rank === 3
                                  ? 'bg-amber-700/80 text-white'
                                  : 'bg-white text-slate-600'
                              }`}
                            >
                              {lead.rank}
                            </span>
                            <div>
                              <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                {lead.name}
                                {lead.isUser && (
                                  <span className="text-[10px] bg-[#5B48EE] text-white px-1.5 py-0.2 rounded font-semibold">
                                    You
                                  </span>
                                )}
                              </p>
                              <p className="text-[10px] text-slate-400">{lead.college}</p>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-xs font-bold text-slate-900">{lead.points}</p>
                            <p className="text-[10px] text-slate-400">{lead.solved} solved</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Discussion Feed & Events */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white rounded-3xl p-6 border border-[#E7EAF3] shadow-sm">
                      <h3 className="text-base font-bold text-slate-900 mb-3">Live Mentor Office Hours</h3>
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-200">
                        <span className="text-[10px] font-bold text-[#5B48EE] uppercase">Today • 6:00 PM IST</span>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">Debugging Distributed Systems at Scale</h4>
                        <p className="text-xs text-slate-500 mt-1">
                          Hosted by Vikram Sen (Senior Staff Engineer, ex-Amazon).
                        </p>
                        <button
                          onClick={() => alert('RSVP confirmed! Calendar invite sent.')}
                          className="mt-3 px-4 py-1.5 bg-[#5B48EE] hover:bg-[#4A37D6] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                        >
                          Join Session
                        </button>
                      </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-[#E7EAF3] shadow-sm">
                      <h3 className="text-base font-bold text-slate-900 mb-3">Recent Peer Discussions</h3>
                      <div className="space-y-3 text-xs">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <p className="font-bold text-slate-800">
                            How did you solve the race condition in challenge #4?
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">8 replies • Last active 12m ago</p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <p className="font-bold text-slate-800">
                            TCS NQT cutoff trends and hands-on coding difficulty
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">24 replies • Last active 45m ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* ========================================================================= */}
      {/* 4. "IMPORT YOUR OWN PROJECT" MODAL (Coming Soon in MVP)                   */}
      {/* ========================================================================= */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0C0B24] border border-[#2B2360] text-white rounded-3xl w-full max-w-xl p-7 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setImportModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-[#1C1844] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#5B48EE] flex items-center justify-center text-white">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">Import Your Own Project</h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold">
                    Coming Soon in v1.1
                  </span>
                </div>
                <p className="text-xs text-slate-400">Bring your GitHub repository or local ZIP archive into DevPractice.</p>
              </div>
            </div>

            {/* Tabs: GitHub vs ZIP */}
            <div className="flex border-b border-[#251E52] my-4 gap-4 text-xs font-bold">
              <button
                onClick={() => setImportTab('github')}
                className={`pb-2.5 flex items-center gap-2 border-b-2 transition-all ${
                  importTab === 'github'
                    ? 'border-[#5B48EE] text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub Repository</span>
              </button>
              <button
                onClick={() => setImportTab('zip')}
                className={`pb-2.5 flex items-center gap-2 border-b-2 transition-all ${
                  importTab === 'zip'
                    ? 'border-[#5B48EE] text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileArchive className="w-4 h-4" />
                <span>ZIP Codebase Archive</span>
              </button>
            </div>

            {/* Tab 1: GitHub URL Form */}
            {importTab === 'github' && (
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1.5">
                    Repository URL:
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/username/repository"
                    value={importGithubUrl}
                    onChange={(e) => setImportGithubUrl(e.target.value)}
                    className="w-full bg-[#151239] border border-[#2D2568] focus:border-[#5B48EE] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1.5">Default Branch:</label>
                    <input
                      type="text"
                      defaultValue="main"
                      className="w-full bg-[#151239] border border-[#2D2568] rounded-xl px-3 py-2 text-xs text-slate-300 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1.5">Primary Runtime:</label>
                    <select className="w-full bg-[#151239] border border-[#2D2568] rounded-xl px-3 py-2 text-xs text-slate-300 outline-none">
                      <option>Auto-Detect (Dockerfile/package.json)</option>
                      <option>Node.js 20 LTS</option>
                      <option>Python 3.11</option>
                      <option>Java 17 OpenJDK</option>
                      <option>Go 1.22</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: ZIP File Drag & Drop */}
            {importTab === 'zip' && (
              <div className="border-2 border-dashed border-[#342A75] rounded-2xl p-6 text-center bg-[#151239]/60 hover:bg-[#151239] transition-colors cursor-pointer">
                <FileArchive className="w-10 h-10 text-[#8E7CFF] mx-auto mb-2" />
                <p className="text-xs font-bold text-white">Drag and drop your project .zip archive here</p>
                <p className="text-[10px] text-slate-400 mt-1">Maximum file size: 50MB. node_modules should be excluded.</p>
                <button
                  type="button"
                  onClick={() => alert('ZIP Upload: Will be enabled in v1.1. Enter your email below to get early access.')}
                  className="mt-3 px-4 py-1.5 bg-[#251E56] hover:bg-[#322872] text-xs font-bold text-white rounded-lg border border-[#3E338A] transition-colors"
                >
                  Browse Local Files
                </button>
              </div>
            )}

            {/* "Coming Soon" Feature Explanation & Early Access Notification */}
            <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-[#3C2E7D] text-xs">
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#A69BFF] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">How Custom Repository Import Works:</p>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    DevPractice's container engine isolates your repository, automatically scans route definitions and tests, and synthesizes <strong>synthetic bugs</strong> and <strong>prompt challenges</strong> tailored to your code.
                  </p>
                </div>
              </div>

              {/* Waitlist Box */}
              <div className="mt-4 pt-3 border-t border-[#31256E]">
                {waitlistSuccess ? (
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center">
                    ✓ You're on the early access list! We'll notify you when custom imports go live.
                  </div>
                ) : (
                  <form onSubmit={handleJoinWaitlist} className="flex gap-2">
                    <input
                      type="email"
                      required
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      placeholder="Enter email to get notified when v1.1 launches..."
                      className="flex-1 bg-[#0E0A2A] border border-[#2D2568] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-[#5B48EE]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#5B48EE] hover:bg-[#6D5CF6] text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-indigo-500/30 flex-shrink-0"
                    >
                      Join Waitlist
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 mt-5">
              <button
                onClick={() => setImportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert('Custom project import is currently in private beta testing. You will be notified when public beta opens in v1.1.');
                  setImportModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-[#5B48EE] hover:bg-[#6D5CF6] text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/25 flex items-center gap-1.5"
              >
                <span>Request Early Access</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE CHALLENGE MODAL                                            */}
      {/* ========================================================================= */}
      {activeChallengeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0C0B24] border border-[#2B2360] text-white rounded-3xl w-full max-w-2xl p-7 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setActiveChallengeModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-[#1C1844] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#5B48EE] flex items-center justify-center text-white">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#A69BFF] uppercase tracking-wider">
                  Interactive Workspace Sandbox
                </span>
                <h3 className="text-xl font-bold text-white">{activeChallengeModal}</h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              You are about to launch an isolated ephemeral Linux micro-container. Your objective is to run unit tests, locate the bug, use AI responsibly under policy limits, and push a passing commit.
            </p>

            <div className="bg-[#151239] border border-[#2D2568] rounded-2xl p-4 mb-6 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Target Repository:</span>
                <span className="font-mono text-[#A69BFF]">devpractice-org/jwt-auth-challenge</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Environment:</span>
                <span className="font-semibold text-emerald-400">Node.js 20 LTS • Jest Test Runner</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">AI Policy:</span>
                <span className="font-semibold text-amber-400">Guided Socratic Hints (Max 3 hints)</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setActiveChallengeModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Spawning container workspace for "${activeChallengeModal}". Redirecting to IDE sandbox...`);
                  setActiveChallengeModal(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#5B48EE] hover:bg-[#6D5CF6] text-white text-xs font-bold shadow-lg shadow-indigo-500/40 transition-all flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch Isolated Workspace</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardView />
    </ProtectedRoute>
  );
}
