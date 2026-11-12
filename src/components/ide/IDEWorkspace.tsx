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
import TopToolbar from './TopToolbar';
import FileExplorer from './FileExplorer';
import EditorTabs from './EditorTabs';
import BottomPanel from './BottomPanel';
import AIAssistantPanel from './AIAssistantPanel';
import {
  Loader2,
  Trophy,
  CheckCircle2,
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
} from 'lucide-react';

// Dynamically import Monaco components to prevent SSR hydration issues in Next.js App Router
const MonacoCodeEditor = dynamic(() => import('./MonacoCodeEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full bg-[#0A0818] text-[#A69BFF] gap-2 text-xs">
      <Loader2 className="w-4 h-4 animate-spin text-[#5B48EE]" />
      <span>Loading Monaco Editor...</span>
    </div>
  ),
});

const MonacoDiffViewer = dynamic(() => import('./MonacoDiffViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full bg-[#0A0818] text-[#A69BFF] gap-2 text-xs">
      <Loader2 className="w-4 h-4 animate-spin text-[#5B48EE]" />
      <span>Loading Monaco Diff Engine...</span>
    </div>
  ),
});

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
    <div className="flex flex-col h-screen w-full bg-[#070510] text-slate-100 overflow-hidden font-sans select-none">
      {/* ===================================================================== */}
      {/* 1. TOP GLOBAL NAVIGATION BAR                                          */}
      {/* ===================================================================== */}
      <header className="h-14 px-4 bg-[#0B091B] border-b border-[#1D183A] flex items-center justify-between flex-shrink-0">
        {/* Brand Logo */}
        <div
          onClick={onExitWorkspace}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5B48EE] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-white leading-none">
              DevPractice
            </div>
            <div className="text-[10px] text-slate-400 tracking-wide mt-0.5">
              Learn • Practice • Master
            </div>
          </div>
        </div>

        {/* Center Navigation Pills */}
        <nav className="hidden lg:flex items-center gap-1.5">
          <button
            onClick={onExitWorkspace}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#312370] to-[#251A5A] border border-[#533DC2] text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all"
          >
            <Home className="w-3.5 h-3.5 text-[#A69BFF]" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => {
              if (onNavigateTab) onNavigateTab('Challenges');
              else if (onExitWorkspace) onExitWorkspace();
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-[#161233] text-xs font-medium transition-colors"
          >
            <Trophy className="w-3.5 h-3.5 text-slate-400" />
            <span>Challenges</span>
          </button>

          <button
            onClick={() => {
              if (onNavigateTab) onNavigateTab('Practice');
              else if (onExitWorkspace) onExitWorkspace();
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-[#161233] text-xs font-medium transition-colors"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Projects</span>
          </button>

          <button
            onClick={() => {
              if (onNavigateTab) onNavigateTab('Community');
              else if (onExitWorkspace) onExitWorkspace();
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-[#161233] text-xs font-medium transition-colors"
          >
            <BarChart2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Leaderboard</span>
          </button>

          <button
            onClick={() => {
              if (onNavigateTab) onNavigateTab('AI Assistant');
              else if (onExitWorkspace) onExitWorkspace();
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-[#161233] text-xs font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#A69BFF]" />
            <span>AI Assistant</span>
          </button>
        </nav>

        {/* Right User Stats & Avatar */}
        <div className="flex items-center gap-3 text-xs">
          {/* Streak */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#15112D] border border-[#26204E] text-slate-200 font-semibold">
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
            <span>12 Days</span>
          </div>

          {/* Token Balance */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#15112D] border border-[#26204E] text-slate-200 font-semibold">
            <span className="w-4 h-4 rounded bg-gradient-to-br from-[#6C5CE7] to-[#A69BFF] flex items-center justify-center text-[9px] font-bold text-white">
              ❖
            </span>
            <span>2,450</span>
          </div>

          {/* Notification Bell */}
          <button className="p-2 rounded-xl bg-[#15112D] hover:bg-[#1E193E] border border-[#26204E] text-slate-300 hover:text-white transition-colors">
            <Bell className="w-4 h-4" />
          </button>

          {/* Avatar Circle */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-blue-500/20 border border-sky-300/40">
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
        <aside className="w-14 bg-[#0D0B1E] border border-[#1E1A3A] rounded-2xl flex flex-col items-center justify-between py-3 flex-shrink-0">
          <div className="flex flex-col items-center gap-3 w-full px-1.5">
            {/* Explorer */}
            <button
              onClick={() => {
                setActiveActivity('explorer');
                setShowExplorer(!showExplorer);
              }}
              className={`w-full py-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
                activeActivity === 'explorer'
                  ? 'bg-gradient-to-b from-[#1E2A5E] to-[#171B42] text-sky-400 border border-sky-500/40 shadow-md shadow-sky-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-[#161230]'
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
                  ? 'bg-[#211A4C] text-[#A69BFF] border border-[#4D3BB3]'
                  : 'text-slate-400 hover:text-white hover:bg-[#161230]'
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
                  ? 'bg-[#211A4C] text-[#A69BFF] border border-[#4D3BB3]'
                  : 'text-slate-400 hover:text-white hover:bg-[#161230]'
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
                  ? 'bg-[#211A4C] text-[#A69BFF] border border-[#4D3BB3]'
                  : 'text-slate-400 hover:text-white hover:bg-[#161230]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="text-[9px] font-medium">Settings</span>
            </button>
          </div>

          {/* Bottom Help Button */}
          <div className="w-full px-1.5">
            <button className="w-full py-2 rounded-xl flex flex-col items-center gap-1 text-slate-400 hover:text-white hover:bg-[#161230] transition-colors">
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
        <div className="flex-1 flex flex-col h-full min-w-0 bg-[#0D0B1E] border border-[#1E1A3A] rounded-2xl overflow-hidden">
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
              <div className="flex items-center justify-center h-full text-slate-500 text-xs">
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
        <AIAssistantPanel
          activeFile={activeFile}
          language={currentChallenge.language}
          executionResult={executionResult}
          onApplyCodeDirectly={handleApplyCodeDirectly}
          onOpenDiff={(diff) => setActiveDiff(diff)}
        />
      </div>

      {/* Challenge Completion Celebration Modal */}
      {completionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0D0B1E] border border-[#2D2568] rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl relative text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
              <Trophy className="w-8 h-8" />
            </div>

            <span className="text-[10px] font-bold text-[#A69BFF] uppercase tracking-wider">
              Challenge Solved • +200 XP • +500 Tokens
            </span>
            <h3 className="text-xl font-bold text-white mt-1 mb-2">
              {currentChallenge.title} Completed!
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              All 3 test cases passed in the isolated container runner. Your solution and rewards have been saved!
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setCompletionModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#5B48EE] to-[#7C5CFA] hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-indigo-500/40 transition-all flex items-center gap-1.5"
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
