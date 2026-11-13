'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  Challenge,
  EditorSettings,
  ExecutionResult,
  IDEFile,
  SupportedLanguage,
} from '@/types/ide';
import { DEFAULT_CHALLENGES } from '@/lib/ide/defaultChallenges';
import { ideStorage } from '@/lib/ide/storage';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import TopToolbar from './TopToolbar';
import FileExplorer from './FileExplorer';
import EditorTabs from './EditorTabs';
import BottomPanel from './BottomPanel';
import AIAssistantPanel from './AIAssistantPanel';
import {
  Loader2,
  Trophy,
  CheckCircle2,
  Check,
  Home,
  FolderGit2,
  BarChart2,
  Sparkles,
  Flame,
  Bell,
  Files,
  Play,
  GitBranch,
  Settings,
  HelpCircle,
  Code2,
  Sun,
  Moon,
  X,
  Search,
  Filter,
  Clock,
  Star,
  Zap,
  Award,
} from 'lucide-react';

// Dynamically import Monaco components to prevent SSR hydration issues in Next.js App Router
const MonacoCodeEditor = dynamic(() => import('./MonacoCodeEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full bg-[#FAFAFE] dark:bg-[#0A0818] text-[#7038F0] dark:text-[#A69BFF] gap-2 text-xs">
      <Loader2 className="w-4 h-4 animate-spin text-[#7038F0]" />
      <span>Loading Monaco Editor...</span>
    </div>
  ),
});

const MonacoDiffViewer = dynamic(() => import('./MonacoDiffViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full bg-[#FAFAFE] dark:bg-[#0A0818] text-[#7038F0] dark:text-[#A69BFF] gap-2 text-xs">
      <Loader2 className="w-4 h-4 animate-spin text-[#7038F0]" />
      <span>Loading Monaco Diff Engine...</span>
    </div>
  ),
});

interface InIDEProject {
  id: string;
  title: string;
  category: string;
  stack: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  associatedChallengeId: string;
  estTime: string;
}

const IN_IDE_PROJECTS: InIDEProject[] = [
  {
    id: 'ecommerce-microservices',
    title: 'E-Commerce Distributed Microservices',
    category: 'Backend',
    stack: ['Node.js', 'Express', 'MongoDB', 'Redis', 'Docker'],
    difficulty: 'Medium',
    description: 'Multi-service online store with checkout race conditions, Redis cart cache invalidation, and Stripe webhook handling.',
    associatedChallengeId: 'jwt-auth-challenge',
    estTime: '45m',
  },
  {
    id: 'python-race-cond',
    title: 'High-Concurrency Inventory Engine',
    category: 'Concurrency',
    stack: ['Python', 'Flask', 'Redis', 'PostgreSQL', 'Docker'],
    difficulty: 'Hard',
    description: 'Flash sale checkout system with database row lock timeouts, optimistic locking conflicts, and inventory overselling bugs.',
    associatedChallengeId: 'python-race-condition',
    estTime: '40m',
  },
  {
    id: 'spring-boot-api',
    title: 'Enterprise Spring Boot Paginated REST Gateway',
    category: 'Enterprise',
    stack: ['Java', 'Spring Boot', 'PostgreSQL', 'Hibernate'],
    difficulty: 'Medium',
    description: 'High-throughput enterprise API gateway suffering from N+1 query waterfalls and inconsistent cursor pagination.',
    associatedChallengeId: 'java-pagination-api',
    estTime: '35m',
  },
  {
    id: 'cpp-lru-cache-service',
    title: 'Low-Latency In-Memory LRU Cache',
    category: 'Systems',
    stack: ['C++', 'STL', 'Pthreads', 'POSIX Sockets'],
    difficulty: 'Hard',
    description: 'Sub-millisecond thread-safe in-memory key-value cache with eviction stampedes and lock contention under 100K QPS.',
    associatedChallengeId: 'cpp-lru-cache',
    estTime: '50m',
  },
  {
    id: 'c-packet-validator',
    title: 'Network Packet Validator & Protocol Decoder',
    category: 'Networking',
    stack: ['C', 'Sockets', 'Wireshark', 'Valgrind'],
    difficulty: 'Hard',
    description: 'Raw binary telemetry parser with buffer overflows, endianness mismatches, and checksum verification faults.',
    associatedChallengeId: 'c-packet-parser',
    estTime: '45m',
  },
  {
    id: 'raft-consensus-ts',
    title: 'Distributed Consensus State Machine (Raft/Paxos)',
    category: 'Distributed',
    stack: ['TypeScript', 'Node.js', 'WebSocket', 'Jest'],
    difficulty: 'Hard',
    description: 'Distributed leader election and log replication engine with split-brain recovery and non-deterministic state transitions.',
    associatedChallengeId: 'ts-state-machine',
    estTime: '60m',
  },
];

const IN_IDE_LEADERBOARD = [
  { rank: 1, name: 'Elena Rostova', title: 'Senior Backend Engineer', score: '6,420 XP', solved: 48, streak: '28 Days', badge: '🥇' },
  { rank: 2, name: 'Kenji Sato', title: 'Full Stack Architect', score: '5,890 XP', solved: 42, streak: '21 Days', badge: '🥈' },
  { rank: 3, name: 'Sarah Chen', title: 'Distributed Systems Dev', score: '5,310 XP', solved: 39, streak: '19 Days', badge: '🥉' },
  { rank: 4, name: 'David Kim', title: 'DevOps & Cloud Engineer', score: '4,920 XP', solved: 35, streak: '15 Days', badge: '' },
  { rank: 5, name: 'Priya Sharma', title: 'AI / ML Engineer', score: '4,680 XP', solved: 33, streak: '14 Days', badge: '' },
  { rank: 6, name: 'Marcus Vance', title: 'Platform Engineer', score: '4,210 XP', solved: 30, streak: '12 Days', badge: '' },
  { rank: 14, name: 'Alex Rivera (You)', title: 'Learner & Practicing Dev', score: '2,450 XP', solved: 24, streak: '12 Days', isUser: true, badge: '⭐' },
];

interface IDEWorkspaceProps {
  initialChallengeId?: string;
  onExitWorkspace?: () => void;
  onNavigateTab?: (tabName: string) => void;
}

export default function IDEWorkspace({
  initialChallengeId,
  onExitWorkspace,
  onNavigateTab,
}: IDEWorkspaceProps) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const userId = user?.id;

  // Active Challenge State
  const [activeChallengeId, setActiveChallengeId] = useState<string>(
    initialChallengeId || DEFAULT_CHALLENGES[0].id
  );

  const currentChallenge: Challenge =
    DEFAULT_CHALLENGES.find((c) => c.id === activeChallengeId) || DEFAULT_CHALLENGES[0];

  // Activity bar state
  const [activeActivity, setActiveActivity] = useState<'explorer' | 'run' | 'git' | 'settings'>('explorer');
  const [showExplorer, setShowExplorer] = useState(true);

  // Files & Tabs State
  const [files, setFiles] = useState<IDEFile[]>([]);
  const [openFileIds, setOpenFileIds] = useState<string[]>([]);
  const [activeFileId, setActiveFileId] = useState<string>('');

  // Settings State
  const [settings, setSettings] = useState<EditorSettings>(() =>
    ideStorage.getSettings(userId)
  );

  // Execution & Test State
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [completionModalOpen, setCompletionModalOpen] = useState(false);

  // In-IDE Modals & Overlays (Challenges, Projects, Leaderboard, AI Assistant)
  const [ideActiveModal, setIdeActiveModal] = useState<'none' | 'challenges' | 'projects' | 'leaderboard'>('none');
  const [showAiAssistant, setShowAiAssistant] = useState(true);
  const [challengeSearch, setChallengeSearch] = useState('');
  const [challengeFilterLang, setChallengeFilterLang] = useState('all');
  const [projectSearch, setProjectSearch] = useState('');

  // Switch challenge directly in IDE
  const handleSelectChallenge = (challengeId: string) => {
    setActiveChallengeId(challengeId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('devpractice_active_challenge', challengeId);
      const url = new URL(window.location.href);
      url.searchParams.set('challenge', challengeId);
      window.history.replaceState(null, '', url.pathname + url.search);
    }
    setIdeActiveModal('none');
    setActiveDiff(null);
    setExecutionResult(null);
  };

  // Active Diff State
  const [activeDiff, setActiveDiff] = useState<{
    fileId: string;
    filePath: string;
    originalContent: string;
    modifiedContent: string;
    description: string;
  } | null>(null);

  // Load files for the challenge from storage or defaults
  useEffect(() => {
    const savedFiles = ideStorage.getChallengeFiles(activeChallengeId, userId);
    // Ensure fresh load if saved files belonged to an older schema
    const hasExpectedMain =
      savedFiles &&
      savedFiles.some((f) => f.name === currentChallenge.initialFiles[0]?.name);

    const initial =
      savedFiles && savedFiles.length > 0 && hasExpectedMain
        ? savedFiles
        : currentChallenge.initialFiles;

    setFiles(initial);
    if (initial.length > 0) {
      setActiveFileId(initial[0].id);
      setOpenFileIds(initial.slice(0, 3).map((f) => f.id));
    }
    setActiveDiff(null);
    setExecutionResult(null);
  }, [activeChallengeId, userId, currentChallenge.initialFiles]);

  // Keep settings synced with localStorage
  const handleUpdateSettings = (newSettings: Partial<EditorSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      ideStorage.saveSettings(updated, userId);
      return updated;
    });
  };

  const activeFile = files.find((f) => f.id === activeFileId) || files[0] || null;

  // Code edit handler in Monaco
  const handleCodeChange = (newVal: string | undefined) => {
    if (newVal === undefined || !activeFile) return;

    setFiles((prev) =>
      prev.map((f) => (f.id === activeFile.id ? { ...f, content: newVal, isDirty: true } : f))
    );
  };

  // Directly apply AI suggested code to active file
  const handleApplyCodeDirectly = (newCode: string) => {
    if (!activeFile) return;
    setFiles((prev) => {
      const updated = prev.map((f) =>
        f.id === activeFile.id ? { ...f, content: newCode, isDirty: true } : f
      );
      ideStorage.saveChallengeFiles(activeChallengeId, updated, userId);
      return updated;
    });
  };

  // Save current active or all files
  const handleSave = useCallback(() => {
    setIsSaving(true);
    setFiles((prev) => {
      const updated = prev.map((f) => ({ ...f, isDirty: false }));
      ideStorage.saveChallengeFiles(activeChallengeId, updated, userId);
      return updated;
    });

    if (activeFile) {
      ideStorage.saveCodeVersion(
        activeChallengeId,
        activeFile.id,
        activeFile.content,
        'Manual Save',
        userId
      );
    }

    setTimeout(() => {
      setIsSaving(false);
    }, 300);
  }, [activeChallengeId, activeFile, userId]);

  // Run Code via /api/execute
  const handleRunCode = async () => {
    if (!activeFile) return;
    setIsRunning(true);

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: currentChallenge.language,
          code: activeFile.content,
          files: files.map((f) => ({ name: f.name, content: f.content })),
        }),
      });

      const data: ExecutionResult = await response.json();
      setExecutionResult(data);
    } catch (err: any) {
      setExecutionResult({
        stdout: '',
        stderr: err?.message || 'Failed to dispatch code execution.',
        exitCode: 1,
        executionTimeMs: 0,
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Run Test Suite via /api/execute with test cases
  const handleRunTests = async () => {
    setIsRunning(true);

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: currentChallenge.language,
          code: activeFile ? activeFile.content : '',
          files: files.map((f) => ({ name: f.name, content: f.content })),
          testCases: currentChallenge.testCases,
        }),
      });

      const data: ExecutionResult = await response.json();
      setExecutionResult(data);

      const allPassed =
        data.testResults &&
        data.testResults.length > 0 &&
        data.testResults.every((r) => r.status === 'passed');

      if (allPassed) {
        ideStorage.saveChallengeProgress(activeChallengeId, true, 100, userId);
        setCompletionModalOpen(true);
      }
    } catch (err: any) {
      setExecutionResult({
        stdout: '',
        stderr: err?.message || 'Failed to run test suite.',
        exitCode: 1,
        executionTimeMs: 0,
      });
    } finally {
      setIsRunning(false);
    }
  };

  // File explorer actions
  const handleCreateFile = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    let lang: SupportedLanguage | 'json' | 'markdown' | 'plaintext' = 'javascript';
    if (ext === 'ts') lang = 'typescript';
    else if (ext === 'py') lang = 'python';
    else if (ext === 'java') lang = 'java';
    else if (ext === 'c') lang = 'c';
    else if (ext === 'cpp') lang = 'cpp';
    else if (ext === 'json') lang = 'json';
    else if (ext === 'md') lang = 'markdown';

    const newFile: IDEFile = {
      id: 'file-' + Date.now(),
      name,
      path: `src/${name}`,
      language: lang,
      content: `// ${name}\n`,
      isDirty: true,
    };

    setFiles((prev) => {
      const updated = [...prev, newFile];
      ideStorage.saveChallengeFiles(activeChallengeId, updated, userId);
      return updated;
    });
    setOpenFileIds((prev) => [...prev, newFile.id]);
    setActiveFileId(newFile.id);
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles((prev) => {
      const updated = prev.filter((f) => f.id !== fileId);
      ideStorage.saveChallengeFiles(activeChallengeId, updated, userId);
      return updated;
    });
    setOpenFileIds((prev) => prev.filter((id) => id !== fileId));
    if (activeFileId === fileId) {
      const remaining = files.filter((f) => f.id !== fileId);
      if (remaining.length > 0) setActiveFileId(remaining[0].id);
    }
  };

  const handleRenameFile = (fileId: string, newName: string) => {
    setFiles((prev) => {
      const updated = prev.map((f) => (f.id === fileId ? { ...f, name: newName } : f));
      ideStorage.saveChallengeFiles(activeChallengeId, updated, userId);
      return updated;
    });
  };

  // Tab closing
  const handleCloseTab = (fileId: string) => {
    const remaining = openFileIds.filter((id) => id !== fileId);
    setOpenFileIds(remaining);
    if (activeFileId === fileId && remaining.length > 0) {
      setActiveFileId(remaining[remaining.length - 1]);
    }
  };

  // Reset challenge template files
  const handleResetChallenge = () => {
    setFiles(currentChallenge.initialFiles);
    ideStorage.saveChallengeFiles(activeChallengeId, currentChallenge.initialFiles, userId);
    if (currentChallenge.initialFiles.length > 0) {
      setActiveFileId(currentChallenge.initialFiles[0].id);
      setOpenFileIds(currentChallenge.initialFiles.slice(0, 3).map((f) => f.id));
    }
    setActiveDiff(null);
    setExecutionResult(null);
  };

  // Apply Diff from Monaco Diff Viewer
  const handleAcceptDiff = (newCode: string) => {
    if (!activeDiff) return;

    setFiles((prev) => {
      const updated = prev.map((f) =>
        f.id === activeDiff.fileId ? { ...f, content: newCode, isDirty: true } : f
      );
      ideStorage.saveChallengeFiles(activeChallengeId, updated, userId);
      return updated;
    });

    ideStorage.saveCodeVersion(
      activeChallengeId,
      activeDiff.fileId,
      newCode,
      'AI Suggested Patch',
      userId
    );
    setActiveDiff(null);
  };

  const hasDirtyFiles = files.some((f) => f.isDirty);

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'CS';

  return (
    <div className="flex flex-col h-screen w-full bg-[#F8F6FC] dark:bg-[#070510] text-[#353148] dark:text-slate-100 overflow-hidden font-sans select-none transition-colors duration-200">
      {/* ===================================================================== */}
      {/* 1. TOP GLOBAL NAVIGATION BAR                                          */}
      {/* ===================================================================== */}
      <header className="h-14 px-4 bg-white/90 dark:bg-[#0B091B]/90 backdrop-blur-md border-b border-[#E4E0EC] dark:border-white/10 flex items-center justify-between flex-shrink-0 transition-colors duration-200">
        {/* Brand Logo */}
        <div
          onClick={onExitWorkspace}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7038F0] to-[#8C60F3] flex items-center justify-center shadow-md shadow-[#7038F0]/30">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-[#353148] dark:text-white leading-none">
              DevPractice
            </div>
            <div className="text-[10px] text-[#8E8A9C] dark:text-slate-400 tracking-wide mt-0.5">
              Learn • Practice • Master
            </div>
          </div>
        </div>

        {/* Center Navigation Pills - Opens In-IDE Modals & Toggles without Leaving IDE */}
        <nav className="hidden lg:flex items-center gap-1.5">
          <button
            onClick={onExitWorkspace}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[#8E8A9C] dark:text-slate-300 hover:text-[#353148] dark:hover:text-white hover:bg-[#F8F6FC] dark:hover:bg-[#161233] text-xs font-medium transition-colors"
            title="Exit IDE and return to Dashboard"
          >
            <Home className="w-3.5 h-3.5 text-[#8E8A9C] dark:text-slate-400" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setIdeActiveModal(ideActiveModal === 'challenges' ? 'none' : 'challenges')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              ideActiveModal === 'challenges'
                ? 'bg-[#7038F0]/10 dark:bg-[#7038F0]/25 border border-[#7038F0]/30 dark:border-[#7038F0]/50 text-[#7038F0] dark:text-white shadow-xs'
                : 'text-[#8E8A9C] dark:text-slate-300 hover:text-[#353148] dark:hover:text-white hover:bg-[#F8F6FC] dark:hover:bg-[#161233]'
            }`}
          >
            <Trophy className={`w-3.5 h-3.5 ${ideActiveModal === 'challenges' ? 'text-[#7038F0] dark:text-[#A69BFF]' : 'text-[#8E8A9C] dark:text-slate-400'}`} />
            <span>Challenges</span>
          </button>

          <button
            onClick={() => setIdeActiveModal(ideActiveModal === 'projects' ? 'none' : 'projects')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              ideActiveModal === 'projects'
                ? 'bg-[#7038F0]/10 dark:bg-[#7038F0]/25 border border-[#7038F0]/30 dark:border-[#7038F0]/50 text-[#7038F0] dark:text-white shadow-xs'
                : 'text-[#8E8A9C] dark:text-slate-300 hover:text-[#353148] dark:hover:text-white hover:bg-[#F8F6FC] dark:hover:bg-[#161233]'
            }`}
          >
            <FolderGit2 className={`w-3.5 h-3.5 ${ideActiveModal === 'projects' ? 'text-[#7038F0] dark:text-[#A69BFF]' : 'text-[#8E8A9C] dark:text-slate-400'}`} />
            <span>Projects</span>
          </button>

          <button
            onClick={() => setIdeActiveModal(ideActiveModal === 'leaderboard' ? 'none' : 'leaderboard')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              ideActiveModal === 'leaderboard'
                ? 'bg-[#7038F0]/10 dark:bg-[#7038F0]/25 border border-[#7038F0]/30 dark:border-[#7038F0]/50 text-[#7038F0] dark:text-white shadow-xs'
                : 'text-[#8E8A9C] dark:text-slate-300 hover:text-[#353148] dark:hover:text-white hover:bg-[#F8F6FC] dark:hover:bg-[#161233]'
            }`}
          >
            <BarChart2 className={`w-3.5 h-3.5 ${ideActiveModal === 'leaderboard' ? 'text-[#7038F0] dark:text-[#A69BFF]' : 'text-[#8E8A9C] dark:text-slate-400'}`} />
            <span>Leaderboard</span>
          </button>

          <button
            onClick={() => setShowAiAssistant((prev) => !prev)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              showAiAssistant
                ? 'bg-[#7038F0]/10 dark:bg-[#7038F0]/25 border border-[#7038F0]/30 dark:border-[#7038F0]/50 text-[#7038F0] dark:text-white shadow-xs'
                : 'text-[#8E8A9C] dark:text-slate-300 hover:text-[#353148] dark:hover:text-white hover:bg-[#F8F6FC] dark:hover:bg-[#161233]'
            }`}
            title="Toggle AI Assistant Panel inside IDE"
          >
            <Sparkles className={`w-3.5 h-3.5 ${showAiAssistant ? 'text-[#7038F0] dark:text-[#A69BFF]' : 'text-[#8E8A9C] dark:text-slate-400'}`} />
            <span>AI Assistant</span>
          </button>
        </nav>

        {/* Right User Stats & Avatar */}
        <div className="flex items-center gap-3 text-xs">
          {/* Streak */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-[#15112D] border border-[#E4E0EC] dark:border-[#26204E] text-[#353148] dark:text-slate-200 font-semibold shadow-2xs">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span>12 Days</span>
          </div>

          {/* Token Balance */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-[#15112D] border border-[#E4E0EC] dark:border-[#26204E] text-[#353148] dark:text-slate-200 font-semibold shadow-2xs">
            <span className="w-4 h-4 rounded bg-gradient-to-br from-[#7038F0] to-[#8C60F3] flex items-center justify-center text-[9px] font-bold text-white">
              ❖
            </span>
            <span>2,450</span>
          </div>

          {/* Notification Bell */}
          <button className="p-2 rounded-xl bg-white dark:bg-[#15112D] hover:bg-[#F8F6FC] dark:hover:bg-[#1E193E] border border-[#E4E0EC] dark:border-[#26204E] text-[#8E8A9C] dark:text-slate-300 hover:text-[#353148] dark:hover:text-white transition-colors shadow-2xs">
            <Bell className="w-4 h-4" />
          </button>

          {/* Change Theme Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#15112D] hover:bg-[#F8F6FC] dark:hover:bg-[#1E193E] border border-[#E4E0EC] dark:border-[#26204E] text-[#353148] dark:text-slate-200 hover:text-[#7038F0] dark:hover:text-[#A78BFA] transition-all shadow-2xs cursor-pointer active:scale-95 font-semibold"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#7038F0]" />
            )}
            <span className="hidden md:inline text-xs font-semibold">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>

          {/* Avatar Circle */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7038F0] to-[#8C60F3] flex items-center justify-center text-white font-bold text-xs shadow-md shadow-[#7038F0]/25">
            {userInitials}
          </div>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* 2. MAIN WORKSPACE CONTAINER                                           */}
      {/* ===================================================================== */}
      <div className="flex-1 flex gap-2.5 p-2.5 overflow-hidden">
        {/* ----------------------------------------------------------------- */}
        {/* FAR-LEFT VERTICAL ACTIVITY DOCK                                   */}
        {/* ----------------------------------------------------------------- */}
        <aside className="w-14 bg-white dark:bg-[#100D22] border border-[#E4E0EC] dark:border-white/10 rounded-2xl flex flex-col items-center justify-between py-3 flex-shrink-0 shadow-xs transition-colors duration-200">
          <div className="flex flex-col items-center gap-3 w-full px-1.5">
            {/* Explorer */}
            <button
              onClick={() => {
                setActiveActivity('explorer');
                setShowExplorer(!showExplorer);
              }}
              className={`w-full py-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
                activeActivity === 'explorer'
                  ? 'bg-[#7038F0]/10 dark:bg-[#7038F0]/25 text-[#7038F0] dark:text-[#A78BFA] border border-[#7038F0]/30 dark:border-[#7038F0]/50 shadow-xs'
                  : 'text-[#8E8A9C] dark:text-slate-400 hover:text-[#353148] dark:hover:text-white hover:bg-[#F8F6FC] dark:hover:bg-[#161230]'
              }`}
            >
              <Files className="w-4 h-4" />
              <span className="text-[9px] font-semibold">Explorer</span>
            </button>

            {/* Run */}
            <button
              onClick={() => {
                setActiveActivity('run');
                handleRunCode();
              }}
              className={`w-full py-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
                activeActivity === 'run'
                  ? 'bg-[#7038F0]/10 dark:bg-[#211A4C] text-[#7038F0] dark:text-[#A69BFF] border border-[#7038F0]/30 dark:border-[#4D3BB3]'
                  : 'text-[#8E8A9C] dark:text-slate-400 hover:text-[#353148] dark:hover:text-white hover:bg-[#F8F6FC] dark:hover:bg-[#161230]'
              }`}
            >
              <Play className="w-4 h-4" />
              <span className="text-[9px] font-medium">Run</span>
            </button>

            {/* Git */}
            <button
              onClick={() => setActiveActivity('git')}
              className={`w-full py-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
                activeActivity === 'git'
                  ? 'bg-[#7038F0]/10 dark:bg-[#211A4C] text-[#7038F0] dark:text-[#A69BFF] border border-[#7038F0]/30 dark:border-[#4D3BB3]'
                  : 'text-[#8E8A9C] dark:text-slate-400 hover:text-[#353148] dark:hover:text-white hover:bg-[#F8F6FC] dark:hover:bg-[#161230]'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              <span className="text-[9px] font-medium">Git</span>
            </button>

            {/* Settings */}
            <button
              onClick={() => setActiveActivity('settings')}
              className={`w-full py-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
                activeActivity === 'settings'
                  ? 'bg-[#7038F0]/10 dark:bg-[#211A4C] text-[#7038F0] dark:text-[#A69BFF] border border-[#7038F0]/30 dark:border-[#4D3BB3]'
                  : 'text-[#8E8A9C] dark:text-slate-400 hover:text-[#353148] dark:hover:text-white hover:bg-[#F8F6FC] dark:hover:bg-[#161230]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="text-[9px] font-medium">Settings</span>
            </button>
          </div>

          {/* Bottom Help Button */}
          <div className="w-full px-1.5">
            <button className="w-full py-2 rounded-xl flex flex-col items-center gap-1 text-[#8E8A9C] dark:text-slate-400 hover:text-[#353148] dark:hover:text-white hover:bg-[#F8F6FC] dark:hover:bg-[#161230] transition-colors">
              <HelpCircle className="w-4 h-4" />
              <span className="text-[9px] font-medium">Help</span>
            </button>
          </div>
        </aside>

        {/* ----------------------------------------------------------------- */}
        {/* LEFT COLUMN: FILE EXPLORER + CHALLENGE DETAILS                    */}
        {/* ----------------------------------------------------------------- */}
        {showExplorer && (
          <div className="w-64 lg:w-72 flex-shrink-0 h-full">
            <FileExplorer
              files={files}
              activeFileId={activeFileId}
              challenge={currentChallenge}
              testResults={executionResult?.testResults}
              onSelectFile={(id) => {
                setActiveFileId(id);
                if (!openFileIds.includes(id)) {
                  setOpenFileIds((prev) => [...prev, id]);
                }
                setActiveDiff(null);
              }}
              onCreateFile={handleCreateFile}
              onDeleteFile={handleDeleteFile}
              onRenameFile={handleRenameFile}
            />
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* CENTER COLUMN: TOOLBAR, TABS, MONACO EDITOR, BOTTOM TERMINAL      */}
        {/* ----------------------------------------------------------------- */}
        <div className="flex-1 flex flex-col h-full min-w-0 bg-white dark:bg-[#100D22] border border-[#E4E0EC] dark:border-white/10 rounded-2xl overflow-hidden shadow-xs transition-colors duration-200">
          {/* Top Action Toolbar */}
          <TopToolbar
            challenge={currentChallenge}
            challenges={DEFAULT_CHALLENGES}
            onSelectChallenge={setActiveChallengeId}
            isRunning={isRunning}
            isSaving={isSaving}
            hasDirtyFiles={hasDirtyFiles}
            isDiffActive={activeDiff !== null}
            settings={settings}
            onRunCode={handleRunCode}
            onRunTests={handleRunTests}
            onSubmit={handleRunTests}
            onSave={handleSave}
            onToggleDiff={() => setActiveDiff(null)}
            onResetChallenge={handleResetChallenge}
            onUpdateSettings={handleUpdateSettings}
          />

          {/* Open File Tabs */}
          <EditorTabs
            openFileIds={openFileIds}
            activeFileId={activeFileId}
            files={files}
            onSelectTab={(id) => {
              setActiveFileId(id);
              setActiveDiff(null);
            }}
            onCloseTab={handleCloseTab}
            onCreateNewTab={() => {
              const name = prompt('Enter new file name:', 'helper.js');
              if (name && name.trim()) handleCreateFile(name.trim());
            }}
          />

          {/* Monaco Code Editor or Diff Viewer */}
          <div className="flex-1 min-h-0 relative">
            {activeDiff ? (
              <MonacoDiffViewer
                originalCode={activeDiff.originalContent}
                modifiedCode={activeDiff.modifiedContent}
                language={activeFile?.language || currentChallenge.language}
                settings={settings}
                fileName={activeFile?.name || 'File'}
                diffDescription={activeDiff.description}
                onAccept={handleAcceptDiff}
                onReject={() => setActiveDiff(null)}
              />
            ) : activeFile ? (
              <MonacoCodeEditor
                code={activeFile.content}
                language={activeFile.language}
                settings={settings}
                onChange={handleCodeChange}
                onSave={handleSave}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-[#8E8A9C] dark:text-slate-500 text-xs">
                Select or create a file in the explorer to start coding.
              </div>
            )}
          </div>

          {/* Bottom Panel: Terminal, Test Results, Problems, Output */}
          <BottomPanel
            executionResult={executionResult}
            isRunning={isRunning}
            onRunCode={handleRunCode}
            onRunTests={handleRunTests}
            testCases={currentChallenge.testCases}
          />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* RIGHT COLUMN: AI ASSISTANT                                        */}
        {/* ----------------------------------------------------------------- */}
        {showAiAssistant && (
          <AIAssistantPanel
            activeFile={activeFile}
            language={currentChallenge.language}
            executionResult={executionResult}
            onApplyCodeDirectly={handleApplyCodeDirectly}
            onOpenDiff={(diff) => setActiveDiff(diff)}
          />
        )}
      </div>

      {/* ===================================================================== */}
      {/* IN-IDE MODAL 1: CHALLENGES CATALOG                                    */}
      {/* ===================================================================== */}
      {ideActiveModal === 'challenges' && (
        <div
          onClick={() => setIdeActiveModal('none')}
          className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#0E0C22] border border-[#E4E0EC] dark:border-[#2D2568] rounded-3xl max-w-3xl w-full p-6 text-[#353148] dark:text-slate-100 shadow-2xl relative flex flex-col max-h-[85vh] transition-colors duration-200"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E4E0EC] dark:border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#7038F0]/10 dark:bg-[#7038F0]/25 flex items-center justify-center text-[#7038F0] dark:text-[#A78BFA] border border-[#7038F0]/20 dark:border-[#7038F0]/40">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#353148] dark:text-white leading-tight">
                    Practice Challenges
                  </h3>
                  <p className="text-xs text-[#8E8A9C] dark:text-slate-400 mt-0.5">
                    Select any challenge to load it directly into your Monaco workspace without leaving the IDE.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIdeActiveModal('none')}
                className="p-2 rounded-xl text-[#8E8A9C] hover:text-[#353148] dark:hover:text-white hover:bg-[#F8F6FC] dark:hover:bg-[#1E193E] transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="py-3 flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8A9C] dark:text-slate-400" />
                <input
                  type="text"
                  placeholder="Search challenges by title, keyword, or language..."
                  value={challengeSearch}
                  onChange={(e) => setChallengeSearch(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#F8F6FC] dark:bg-[#15122E] border border-[#E4E0EC] dark:border-[#282156] text-xs text-[#353148] dark:text-white placeholder-[#8E8A9C] dark:placeholder-slate-400 outline-none focus:border-[#7038F0] dark:focus:border-[#8C60F3] transition-colors"
                />
              </div>

              {/* Language filter pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {['all', 'javascript', 'typescript', 'python', 'java', 'cpp'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setChallengeFilterLang(lang)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all uppercase cursor-pointer ${
                      challengeFilterLang === lang
                        ? 'bg-[#7038F0] dark:bg-[#8C60F3] text-white shadow-xs'
                        : 'bg-[#F8F6FC] dark:bg-[#15122E] text-[#8E8A9C] dark:text-slate-300 hover:text-[#353148] dark:hover:text-white border border-[#E4E0EC] dark:border-[#282156]'
                    }`}
                  >
                    {lang === 'all' ? 'All' : lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Challenge Cards List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 mt-1">
              {DEFAULT_CHALLENGES.filter((c) => {
                const matchSearch =
                  !challengeSearch ||
                  c.title.toLowerCase().includes(challengeSearch.toLowerCase()) ||
                  c.description.toLowerCase().includes(challengeSearch.toLowerCase()) ||
                  c.language.toLowerCase().includes(challengeSearch.toLowerCase());
                const matchLang = challengeFilterLang === 'all' || c.language === challengeFilterLang;
                return matchSearch && matchLang;
              }).map((ch) => {
                const isActive = ch.id === activeChallengeId;
                return (
                  <div
                    key={ch.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isActive
                        ? 'bg-[#7038F0]/5 dark:bg-[#8C60F3]/10 border-[#7038F0]/40 dark:border-[#8C60F3]/50 shadow-xs ring-1 ring-[#7038F0]/20'
                        : 'bg-[#FAF8FD] dark:bg-[#14102C] border-[#E4E0EC] dark:border-[#221C46] hover:border-[#7038F0]/30 dark:hover:border-[#8C60F3]/40'
                    }`}
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-[#353148] dark:text-white">
                          {ch.title}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            ch.difficulty === 'Easy'
                              ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                              : ch.difficulty === 'Medium'
                              ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                              : 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                          }`}
                        >
                          {ch.difficulty}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-[#1E193E] text-[#7038F0] dark:text-[#A78BFA] border border-[#E4E0EC] dark:border-[#2F2660]">
                          {ch.language}
                        </span>
                        <span className="text-[11px] text-[#8E8A9C] dark:text-slate-400 flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3" />
                          {ch.estimatedTime}
                        </span>
                      </div>
                      <p className="text-xs text-[#6E6A7D] dark:text-slate-300 line-clamp-2">
                        {ch.description}
                      </p>
                    </div>

                    <div className="shrink-0 flex sm:flex-col items-end gap-2">
                      {isActive ? (
                        <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>Currently Active</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSelectChallenge(ch.id)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7038F0] to-[#8C60F3] hover:brightness-110 text-white text-xs font-bold shadow-md shadow-[#7038F0]/25 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-white" />
                          <span>Load in Editor</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* IN-IDE MODAL 2: PROJECTS CATALOG                                      */}
      {/* ===================================================================== */}
      {ideActiveModal === 'projects' && (
        <div
          onClick={() => setIdeActiveModal('none')}
          className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#0E0C22] border border-[#E4E0EC] dark:border-[#2D2568] rounded-3xl max-w-3xl w-full p-6 text-[#353148] dark:text-slate-100 shadow-2xl relative flex flex-col max-h-[85vh] transition-colors duration-200"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E4E0EC] dark:border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#7038F0]/10 dark:bg-[#7038F0]/25 flex items-center justify-center text-[#7038F0] dark:text-[#A78BFA] border border-[#7038F0]/20 dark:border-[#7038F0]/40">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#353148] dark:text-white leading-tight">
                    Real-World Production Projects
                  </h3>
                  <p className="text-xs text-[#8E8A9C] dark:text-slate-400 mt-0.5">
                    Browse real-world architectures, microservices, and system projects directly in the IDE.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIdeActiveModal('none')}
                className="p-2 rounded-xl text-[#8E8A9C] hover:text-[#353148] dark:hover:text-white hover:bg-[#F8F6FC] dark:hover:bg-[#1E193E] transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="py-3 shrink-0">
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8A9C] dark:text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter projects by title, stack, or category..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#F8F6FC] dark:bg-[#15122E] border border-[#E4E0EC] dark:border-[#282156] text-xs text-[#353148] dark:text-white placeholder-[#8E8A9C] dark:placeholder-slate-400 outline-none focus:border-[#7038F0] dark:focus:border-[#8C60F3] transition-colors"
                />
              </div>
            </div>

            {/* Scrollable Project Cards List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 mt-1">
              {IN_IDE_PROJECTS.filter((p) => {
                if (!projectSearch) return true;
                const q = projectSearch.toLowerCase();
                return (
                  p.title.toLowerCase().includes(q) ||
                  p.description.toLowerCase().includes(q) ||
                  p.category.toLowerCase().includes(q) ||
                  p.stack.some((s) => s.toLowerCase().includes(q))
                );
              }).map((proj) => (
                <div
                  key={proj.id}
                  className="p-4 rounded-2xl bg-[#FAF8FD] dark:bg-[#14102C] border border-[#E4E0EC] dark:border-[#221C46] hover:border-[#7038F0]/30 dark:hover:border-[#8C60F3]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
                >
                  <div className="space-y-2 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-[#353148] dark:text-white">
                        {proj.title}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800 uppercase tracking-wider">
                        {proj.category}
                      </span>
                      <span className="text-[11px] text-[#8E8A9C] dark:text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" />
                        {proj.estTime}
                      </span>
                    </div>

                    <p className="text-xs text-[#6E6A7D] dark:text-slate-300">
                      {proj.description}
                    </p>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {proj.stack.map((st) => (
                        <span
                          key={st}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-[#1E193E] text-[#7038F0] dark:text-[#A78BFA] border border-[#E4E0EC] dark:border-[#2E255C]"
                        >
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="shrink-0">
                    <button
                      onClick={() => handleSelectChallenge(proj.associatedChallengeId)}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-[#7038F0] to-[#8C60F3] hover:brightness-110 text-white text-xs font-bold shadow-md shadow-[#7038F0]/25 transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Load in IDE</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* IN-IDE MODAL 3: LEADERBOARD OVERLAY                                   */}
      {/* ===================================================================== */}
      {ideActiveModal === 'leaderboard' && (
        <div
          onClick={() => setIdeActiveModal('none')}
          className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#0E0C22] border border-[#E4E0EC] dark:border-[#2D2568] rounded-3xl max-w-2xl w-full p-6 text-[#353148] dark:text-slate-100 shadow-2xl relative flex flex-col max-h-[85vh] transition-colors duration-200"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E4E0EC] dark:border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-500 border border-amber-500/20">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#353148] dark:text-white leading-tight">
                    Weekly Engineering Leaderboard
                  </h3>
                  <p className="text-xs text-[#8E8A9C] dark:text-slate-400 mt-0.5">
                    Live rankings based on debugging speed, test pass rate, and AI token economy.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIdeActiveModal('none')}
                className="p-2 rounded-xl text-[#8E8A9C] hover:text-[#353148] dark:hover:text-white hover:bg-[#F8F6FC] dark:hover:bg-[#1E193E] transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2.5 my-4 shrink-0">
              <div className="p-3 rounded-2xl bg-[#F8F6FC] dark:bg-[#14102C] border border-[#E4E0EC] dark:border-[#241E4E] text-center">
                <span className="text-[10px] font-bold text-[#8E8A9C] uppercase tracking-wider">Your Rank</span>
                <p className="text-xl font-black text-[#7038F0] dark:text-[#A78BFA] mt-0.5">#14</p>
              </div>
              <div className="p-3 rounded-2xl bg-[#F8F6FC] dark:bg-[#14102C] border border-[#E4E0EC] dark:border-[#241E4E] text-center">
                <span className="text-[10px] font-bold text-[#8E8A9C] uppercase tracking-wider">Your XP</span>
                <p className="text-xl font-black text-amber-500 mt-0.5">2,450</p>
              </div>
              <div className="p-3 rounded-2xl bg-[#F8F6FC] dark:bg-[#14102C] border border-[#E4E0EC] dark:border-[#241E4E] text-center">
                <span className="text-[10px] font-bold text-[#8E8A9C] uppercase tracking-wider">Streak</span>
                <p className="text-xl font-black text-orange-500 mt-0.5 flex items-center justify-center gap-1">
                  <Flame className="w-4 h-4 fill-orange-500 inline" />
                  <span>12 Days</span>
                </p>
              </div>
            </div>

            {/* Leaderboard Table */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {IN_IDE_LEADERBOARD.map((item) => (
                <div
                  key={item.rank}
                  className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-colors ${
                    item.isUser
                      ? 'bg-[#7038F0]/10 dark:bg-[#8C60F3]/20 border-[#7038F0]/40 dark:border-[#8C60F3]/50 font-bold'
                      : 'bg-[#FAF8FD] dark:bg-[#14102C] border-[#E4E0EC] dark:border-[#221C46] text-[#353148] dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-bold text-sm">
                      {item.badge || `#${item.rank}`}
                    </span>
                    <div>
                      <p className="font-bold leading-tight">{item.name}</p>
                      <p className="text-[10px] text-[#8E8A9C] dark:text-slate-400 font-normal">{item.title}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="font-mono font-bold text-amber-500 dark:text-amber-400">{item.score}</span>
                      <p className="text-[10px] text-[#8E8A9C] dark:text-slate-400 font-normal">{item.solved} solved</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Challenge Completion Celebration Modal */}
      {completionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0D0B1E] border border-[#E4E0EC] dark:border-[#2D2568] rounded-3xl max-w-md w-full p-6 text-[#353148] dark:text-slate-100 shadow-2xl relative text-center transition-colors duration-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 mx-auto flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
              <Trophy className="w-8 h-8" />
            </div>

            <span className="text-[10px] font-bold text-[#7038F0] dark:text-[#A69BFF] uppercase tracking-wider">
              Challenge Solved • +200 XP • +500 Tokens
            </span>
            <h3 className="text-xl font-bold text-[#353148] dark:text-white mt-1 mb-2">
              {currentChallenge.title} Completed!
            </h3>
            <p className="text-xs text-[#8E8A9C] dark:text-slate-300 leading-relaxed mb-6">
              All 3 test cases passed in the isolated container runner. Your solution and rewards have been saved!
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setCompletionModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7038F0] to-[#8C60F3] hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-[#7038F0]/30 transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Continue Practicing</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
