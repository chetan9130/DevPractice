'use client';

import React, { useState } from 'react';
import { ExecutionResult, TestCase, TestResult } from '@/types/ide';
import {
  Terminal,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  Trash2,
  Plus,
  ChevronDown,
  Lock,
  Sparkles,
  Check,
} from 'lucide-react';

interface BottomPanelProps {
  executionResult: ExecutionResult | null;
  isRunning: boolean;
  onRunCode: () => void;
  onRunTests: () => void;
  testCases: TestCase[];
}

export default function BottomPanel({
  executionResult,
  isRunning,
  onRunCode,
  onRunTests,
  testCases,
}: BottomPanelProps) {
  const [activeTab, setActiveTab] = useState<'terminal' | 'tests' | 'problems' | 'output'>('terminal');
  const [shellType, setShellType] = useState<'bash' | 'zsh' | 'node'>('bash');
  const [cleared, setCleared] = useState(false);

  const testResults: TestResult[] = executionResult?.testResults || [];
  const totalTests = testCases.length || 3;
  const problemCount = executionResult?.stderr ? 1 : 1;

  return (
    <div className="flex flex-col h-56 bg-white dark:bg-[#100D22] border-t border-[#E4E0EC] dark:border-white/10 text-xs select-none flex-shrink-0 transition-colors duration-200">
      {/* Tab Bar */}
      <div className="flex items-center justify-between px-3 border-b border-[#E4E0EC] dark:border-white/10 h-9 bg-[#F8F6FC] dark:bg-[#0F0C24]">
        <div className="flex items-center gap-4 h-full">
          {/* Terminal Tab */}
          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-1.5 h-full px-1 border-b-2 transition-all ${
              activeTab === 'terminal'
                ? 'border-[#7038F0] text-[#7038F0] dark:text-white font-bold'
                : 'border-transparent text-[#8E8A9C] dark:text-slate-400 hover:text-[#353148] dark:hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-[#7038F0] dark:text-[#8E7CFF]" />
            <span>Terminal</span>
          </button>

          {/* Test Results Tab */}
          <button
            onClick={() => setActiveTab('tests')}
            className={`flex items-center gap-1.5 h-full px-1 border-b-2 transition-all ${
              activeTab === 'tests'
                ? 'border-[#7038F0] text-[#7038F0] dark:text-white font-bold'
                : 'border-transparent text-[#8E8A9C] dark:text-slate-400 hover:text-[#353148] dark:hover:text-slate-200'
            }`}
          >
            <span className="text-[#8E8A9C] dark:text-slate-400">⚡</span>
            <span>Test Results</span>
            <span className="w-4 h-4 rounded-full bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center">
              {totalTests}
            </span>
          </button>

          {/* Problems Tab */}
          <button
            onClick={() => setActiveTab('problems')}
            className={`flex items-center gap-1.5 h-full px-1 border-b-2 transition-all ${
              activeTab === 'problems'
                ? 'border-[#7038F0] text-[#7038F0] dark:text-white font-bold'
                : 'border-transparent text-[#8E8A9C] dark:text-slate-400 hover:text-[#353148] dark:hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[#8E8A9C] dark:text-slate-400" />
            <span>Problems</span>
            <span className="w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center">
              {problemCount}
            </span>
          </button>

          {/* Output Tab */}
          <button
            onClick={() => setActiveTab('output')}
            className={`flex items-center gap-1.5 h-full px-1 border-b-2 transition-all ${
              activeTab === 'output'
                ? 'border-[#7038F0] text-[#7038F0] dark:text-white font-bold'
                : 'border-transparent text-[#8E8A9C] dark:text-slate-400 hover:text-[#353148] dark:hover:text-slate-200'
            }`}
          >
            <span>Output</span>
          </button>
        </div>

        {/* Right Controls: bash dropdown, trash, plus */}
        <div className="flex items-center gap-2 text-[#8E8A9C] dark:text-slate-400">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-white dark:bg-[#16132E] border border-[#E4E0EC] dark:border-[#26204B] text-[#353148] dark:text-slate-300 text-[11px] cursor-pointer shadow-2xs">
            <span>{shellType}</span>
            <ChevronDown className="w-3 h-3 text-[#8E8A9C] dark:text-slate-400" />
          </div>

          <button
            onClick={() => setCleared(true)}
            className="p-1 rounded hover:bg-[#EDE8F5] dark:hover:bg-[#1C183B] hover:text-[#353148] dark:hover:text-white transition-colors"
            title="Clear Terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setCleared(false)}
            className="p-1 rounded hover:bg-[#EDE8F5] dark:hover:bg-[#1C183B] hover:text-[#353148] dark:hover:text-white transition-colors"
            title="New Terminal Session"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Panel Body */}
      <div className="flex-1 overflow-y-auto p-3.5 font-mono text-xs bg-[#F8F6FC] dark:bg-[#090716] text-[#353148] dark:text-slate-100 transition-colors duration-200">
        {/* 1. TERMINAL VIEW */}
        {activeTab === 'terminal' && (
          <div className="space-y-1.5">
            {!cleared && (
              <>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>npm run dev</span>
                </div>
                <div className="text-[#5A556E] dark:text-slate-300 pl-4 space-y-0.5">
                  <p>&gt; devpractice@0.1.0 dev</p>
                  <p>&gt; next dev</p>
                </div>
                <div className="flex items-center gap-2 text-[#353148] dark:text-slate-200 pt-1 font-medium">
                  <span className="text-emerald-600 dark:text-emerald-400">↻</span>
                  <span>Ready in 1.2s</span>
                </div>
              </>
            )}

            {isRunning && (
              <div className="text-amber-600 dark:text-amber-300 animate-pulse pt-2 font-medium">
                &gt; Running code in isolated sandbox container...
              </div>
            )}

            {executionResult && (
              <div className="pt-2 mt-2 border-t border-[#E4E0EC] dark:border-[#231E44] space-y-1">
                <div className="text-[#7038F0] dark:text-[#A78BFA] text-[11px] font-bold">
                  $ sandbox execute ({executionResult.executionTimeMs}ms)
                </div>
                {executionResult.stdout && (
                  <pre className="text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 whitespace-pre-wrap">{executionResult.stdout}</pre>
                )}
                {executionResult.stderr && (
                  <pre className="text-rose-700 dark:text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20 whitespace-pre-wrap">{executionResult.stderr}</pre>
                )}
              </div>
            )}
          </div>
        )}

        {/* 2. TEST RESULTS VIEW */}
        {activeTab === 'tests' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#E4E0EC] dark:border-[#231E44]">
              <span className="text-[#353148] dark:text-slate-200 font-bold">Challenge Test Cases</span>
              <button
                onClick={onRunTests}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-[#7038F0] to-[#8C60F3] hover:brightness-110 text-white text-[11px] font-bold shadow-md shadow-[#7038F0]/30 transition-all"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Run Suite</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {testCases.map((tc, idx) => {
                const res = testResults.find((r) => r.testCaseId === tc.id);
                const passed = res?.status === 'passed';
                const failed = res && res.status !== 'passed';

                return (
                  <div
                    key={tc.id}
                    className={`p-2.5 rounded-xl border transition-all ${
                      passed
                        ? 'bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-400/50 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-200'
                        : failed
                        ? 'bg-rose-500/10 dark:bg-rose-950/40 border-rose-400/50 dark:border-rose-500/50 text-rose-800 dark:text-rose-200'
                        : 'bg-white dark:bg-[#181432] border-[#E4E0EC] dark:border-[#2C2458] text-[#353148] dark:text-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[11px] truncate">
                        #{idx + 1} {tc.name}
                      </span>
                      {passed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />}
                      {failed && <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 flex-shrink-0" />}
                    </div>
                    <p className="text-[10px] text-[#8E8A9C] dark:text-slate-400 truncate">{tc.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. PROBLEMS VIEW */}
        {activeTab === 'problems' && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <span>
                [src/app.js: Line 15] Missing response handler after validateUser() — causes request timeout / 500 error.
              </span>
            </div>
            {executionResult?.stderr && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs font-medium">
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                <span>{executionResult.stderr}</span>
              </div>
            )}
          </div>
        )}

        {/* 4. OUTPUT VIEW */}
        {activeTab === 'output' && (
          <div className="text-[#353148] dark:text-slate-300 whitespace-pre-wrap">
            {executionResult?.stdout || 'Ready. Click "Run" or "Run Tests" to view container logs.'}
          </div>
        )}
      </div>
    </div>
  );
}
