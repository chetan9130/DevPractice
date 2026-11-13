'use client';

import React, { useState } from 'react';
import { Challenge, EditorSettings } from '@/types/ide';
import { useTheme } from '@/context/ThemeContext';
import {
  Play,
  Send,
  Save,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
  ChevronDown,
  Loader2,
  SplitSquareVertical,
  RotateCcw,
  Sliders,
  X,
} from 'lucide-react';

interface TopToolbarProps {
  challenge: Challenge;
  challenges: Challenge[];
  onSelectChallenge: (challengeId: string) => void;
  isRunning: boolean;
  isSaving: boolean;
  hasDirtyFiles: boolean;
  isDiffActive: boolean;
  settings: EditorSettings;
  onRunCode: () => void;
  onRunTests: () => void;
  onSubmit: () => void;
  onSave: () => void;
  onToggleDiff: () => void;
  onResetChallenge: () => void;
  onUpdateSettings: (newSettings: Partial<EditorSettings>) => void;
}

const LANGUAGE_LABELS: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  java: 'Java',
  c: 'C',
  cpp: 'C++',
};

export default function TopToolbar({
  challenge,
  challenges,
  onSelectChallenge,
  isRunning,
  isSaving,
  hasDirtyFiles,
  isDiffActive,
  settings,
  onRunCode,
  onRunTests,
  onSubmit,
  onSave,
  onToggleDiff,
  onResetChallenge,
  onUpdateSettings,
}: TopToolbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (typeof document !== 'undefined') {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        setIsFullscreen(true);
      } else {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-between px-3 py-2 bg-white dark:bg-[#100D22] border-b border-[#E4E0EC] dark:border-white/10 text-[#353148] dark:text-slate-100 text-xs select-none transition-colors duration-200">
      {/* Left Action Buttons: Run, Run Tests, Submit, Save */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Green Run Button */}
        <button
          onClick={onRunCode}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:brightness-110 text-white font-bold text-xs shadow-md shadow-emerald-500/25 transition-all active:scale-95 disabled:opacity-50"
        >
          {isRunning ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current" />
          )}
          <span>Run</span>
        </button>

        {/* Purple Run Tests Button */}
        <button
          onClick={onRunTests}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#7038F0] to-[#8C60F3] hover:brightness-110 text-white font-semibold text-xs shadow-md shadow-[#7038F0]/25 transition-all active:scale-95 disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5 text-white/90 fill-current" />
          <span>Run Tests</span>
        </button>

        {/* Submit Button */}
        <button
          onClick={onSubmit}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F8F6FC] dark:bg-[#16132E] hover:bg-[#EDE8F5] dark:hover:bg-[#211C44] border border-[#E4E0EC] dark:border-[#2B2554] text-[#353148] dark:text-slate-200 hover:text-black dark:hover:text-white font-semibold text-xs transition-all active:scale-95"
        >
          <Send className="w-3.5 h-3.5 text-[#7038F0] dark:text-[#A78BFA]" />
          <span>Submit</span>
        </button>

        {/* Save Button */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border font-semibold text-xs transition-all active:scale-95 ${
            hasDirtyFiles
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-300'
              : 'bg-[#F8F6FC] dark:bg-[#16132E] hover:bg-[#EDE8F5] dark:hover:bg-[#211C44] border-[#E4E0EC] dark:border-[#2B2554] text-[#353148] dark:text-slate-200 hover:text-black dark:hover:text-white'
          }`}
          title="Save (Ctrl+S)"
        >
          {isSaving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
          ) : (
            <Save className="w-3.5 h-3.5 text-[#8E8A9C] dark:text-slate-400" />
          )}
          <span>Save</span>
          {hasDirtyFiles && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
        </button>

        {isDiffActive && (
          <button
            onClick={onToggleDiff}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#7038F0]/15 border border-[#7038F0]/40 text-[#7038F0] dark:text-[#A78BFA] hover:text-[#5820D0] dark:hover:text-white text-xs font-semibold"
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>Close Diff</span>
          </button>
        )}
      </div>

      {/* Right Controls: Language Selector, Theme Toggle, Settings, Fullscreen */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 relative">
          <span className="text-[#8E8A9C] dark:text-slate-400 text-xs">Language:</span>
          <button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-[#F8F6FC] dark:bg-[#16132E] hover:bg-[#EDE8F5] dark:hover:bg-[#1F1B3F] border border-[#E4E0EC] dark:border-[#2B2554] text-[#353148] dark:text-white font-medium text-xs min-w-[115px] transition-colors"
          >
            <span>{LANGUAGE_LABELS[challenge.language] || 'JavaScript'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#8E8A9C] dark:text-slate-400" />
          </button>

          {langDropdownOpen && (
            <div className="absolute top-full right-0 mt-1.5 w-64 bg-white dark:bg-[#120E2E] border border-[#E4E0EC] dark:border-[#2E2564] rounded-2xl shadow-2xl py-1.5 z-50">
              <div className="px-3 py-1 text-[10px] font-bold text-[#8E8A9C] dark:text-slate-400 uppercase tracking-wider border-b border-[#E4E0EC] dark:border-[#221B4B]">
                Switch Challenge / Language
              </div>
              {challenges.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onSelectChallenge(c.id);
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#F8F6FC] dark:hover:bg-[#1E1849] transition-colors ${
                    c.id === challenge.id
                      ? 'bg-[#7038F0]/10 dark:bg-[#1E1849] text-[#7038F0] dark:text-white font-bold'
                      : 'text-[#353148] dark:text-slate-300'
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="text-xs font-semibold">{LANGUAGE_LABELS[c.language]}</div>
                    <div className="text-[10px] text-[#8E8A9C] dark:text-slate-400 truncate">{c.title}</div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#7038F0]/15 dark:bg-purple-900/40 text-[#7038F0] dark:text-purple-300 font-semibold">
                    {c.difficulty}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Global Website Theme Toggle (Sun / Moon) */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-xl bg-[#F8F6FC] dark:bg-[#16132E] hover:bg-[#EDE8F5] dark:hover:bg-[#211C44] border border-[#E4E0EC] dark:border-[#2B2554] text-[#7038F0] dark:text-[#A78BFA] transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Settings Popover Trigger */}
        <div className="relative">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="p-1.5 rounded-xl bg-[#F8F6FC] dark:bg-[#16132E] hover:bg-[#EDE8F5] dark:hover:bg-[#211C44] border border-[#E4E0EC] dark:border-[#2B2554] text-[#8E8A9C] dark:text-slate-300 hover:text-[#353148] dark:hover:text-white transition-colors"
            title="Editor Appearance & Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {settingsOpen && (
            <div className="absolute top-full right-0 mt-2 w-68 bg-white dark:bg-[#120E2E] border border-[#E4E0EC] dark:border-[#2E2564] rounded-2xl shadow-2xl p-4 z-50 text-[#353148] dark:text-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E4E0EC] dark:border-[#221B4B]">
                <span className="font-bold text-xs text-[#353148] dark:text-white">Editor Settings</span>
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="text-[#8E8A9C] dark:text-slate-400 hover:text-black dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#8E8A9C] dark:text-slate-400">Font Size:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      onUpdateSettings({ fontSize: Math.max(settings.fontSize - 1, 11) })
                    }
                    className="w-6 h-6 rounded bg-[#F8F6FC] dark:bg-[#1D1746] hover:bg-[#EDE8F5] dark:hover:bg-[#282060] text-[#353148] dark:text-white font-bold border border-[#E4E0EC] dark:border-transparent"
                  >
                    -
                  </button>
                  <span className="font-mono text-[#353148] dark:text-white font-semibold">{settings.fontSize}px</span>
                  <button
                    onClick={() =>
                      onUpdateSettings({ fontSize: Math.min(settings.fontSize + 1, 22) })
                    }
                    className="w-6 h-6 rounded bg-[#F8F6FC] dark:bg-[#1D1746] hover:bg-[#EDE8F5] dark:hover:bg-[#282060] text-[#353148] dark:text-white font-bold border border-[#E4E0EC] dark:border-transparent"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#8E8A9C] dark:text-slate-400">Minimap:</span>
                <button
                  onClick={() => onUpdateSettings({ minimap: !settings.minimap })}
                  className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                    settings.minimap
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40'
                      : 'bg-[#F8F6FC] dark:bg-[#1D1746] text-[#8E8A9C] dark:text-slate-400 border border-[#E4E0EC] dark:border-transparent'
                  }`}
                >
                  {settings.minimap ? 'On' : 'Off'}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#8E8A9C] dark:text-slate-400">Monaco Theme:</span>
                <select
                  value={settings.theme}
                  onChange={(e) => onUpdateSettings({ theme: e.target.value as any })}
                  className="bg-[#F8F6FC] dark:bg-[#1D1746] border border-[#E4E0EC] dark:border-[#2E2564] text-[#353148] dark:text-white text-xs rounded-lg px-2 py-1 outline-none"
                >
                  <option value="auto">Auto (Match Website)</option>
                  <option value="devpractice-dark">DevPractice Dark</option>
                  <option value="devpractice-light">DevPractice Light</option>
                  <option value="vs-dark">VS Code Dark</option>
                  <option value="light">VS Code Light</option>
                </select>
              </div>

              <div className="pt-2 border-t border-[#E4E0EC] dark:border-[#221B4B] flex justify-end">
                <button
                  onClick={() => {
                    onResetChallenge();
                    setSettingsOpen(false);
                  }}
                  className="flex items-center gap-1 text-[11px] text-rose-500 dark:text-rose-400 hover:underline"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Template Code</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-1.5 rounded-xl bg-[#F8F6FC] dark:bg-[#16132E] hover:bg-[#EDE8F5] dark:hover:bg-[#211C44] border border-[#E4E0EC] dark:border-[#2B2554] text-[#8E8A9C] dark:text-slate-300 hover:text-[#353148] dark:hover:text-white transition-colors"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
