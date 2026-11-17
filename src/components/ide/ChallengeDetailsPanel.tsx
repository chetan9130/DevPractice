'use client';

import React, { useState } from 'react';
import { Challenge, TestResult } from '@/types/ide';
import {
  Target,
  Sparkles,
  Star,
  Check,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  Terminal,
  HelpCircle,
  Lightbulb,
  Cpu,
  Layers,
  ArrowRight,
  Clock,
  Code2,
} from 'lucide-react';

interface ChallengeDetailsPanelProps {
  challenge: Challenge;
  testResults?: TestResult[];
  onOpenExplorer?: () => void;
}

export function ChallengeDetailsPanel({
  challenge,
  testResults = [],
  onOpenExplorer,
}: ChallengeDetailsPanelProps) {
  // Local state for checking off requirements interactively
  const [checkedRequirements, setCheckedRequirements] = useState<Record<number, boolean>>({});
  // Progressive hints reveal state
  const [revealedHints, setRevealedHints] = useState<Record<number, boolean>>({});
  // Collapsible sections
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    scenario: false,
    requirements: false,
    ioSpec: false,
    samples: false,
    constraints: false,
    hints: false,
    architecture: false,
  });

  const toggleSection = (key: string) => {
    setCollapsedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleRequirement = (idx: number) => {
    setCheckedRequirements((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleHint = (idx: number) => {
    setRevealedHints((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Test progress calculation
  const totalTests = testResults.length || challenge.testCases?.length || 3;
  const passedTests = testResults.length
    ? testResults.filter((t) => t.status === 'passed').length
    : 0;
  const progressPercent = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  // Difficulty badge colors
  const difficultyBadge = () => {
    const d = (challenge.difficulty || 'Medium').toLowerCase();
    if (d === 'easy') {
      return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700/50';
    }
    if (d === 'hard') {
      return 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-700/50';
    }
    return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700/50';
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#100D22] border border-[#E4E0EC] dark:border-white/10 rounded-2xl overflow-hidden shadow-xs transition-colors duration-200">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E4E0EC] dark:border-white/10 bg-[#FAF9FD] dark:bg-[#14102B]/60 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500">
            <Target className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-[#353148] dark:text-slate-100 text-xs tracking-wide">
            Problem Specification
          </span>
        </div>
        {onOpenExplorer && (
          <button
            onClick={onOpenExplorer}
            className="flex items-center gap-1 text-[11px] font-medium text-[#7038F0] dark:text-purple-400 hover:underline"
          >
            <span>View Files</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-xs">
        {/* Title & Metadata Pills */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`px-2.5 py-0.5 rounded-md font-semibold text-[10px] uppercase tracking-wider border ${difficultyBadge()}`}
            >
              {challenge.difficulty}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#EDE8F5] dark:bg-[#1F1A3A] text-[#7038F0] dark:text-purple-300 border border-[#DDD6EE] dark:border-purple-500/20 font-medium text-[10px] flex items-center gap-1">
              <Code2 className="w-3 h-3" />
              <span>{challenge.language || 'Code'}</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-[#8E8A9C] dark:text-slate-300 font-medium text-[10px] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>~15-25m</span>
            </span>
          </div>

          <h2 className="text-base font-bold text-[#353148] dark:text-white leading-tight">
            {challenge.title}
          </h2>

          <p className="text-xs text-[#6F6B7D] dark:text-slate-300 leading-relaxed">
            {challenge.description}
          </p>
        </div>

        {/* Real-world Scenario / Production Incident Briefing */}
        {challenge.scenarioContext && (
          <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/70 dark:bg-rose-950/20 p-3.5 transition-all">
            <button
              onClick={() => toggleSection('scenario')}
              className="w-full flex items-center justify-between text-left font-bold text-rose-900 dark:text-rose-300 text-xs mb-1"
            >
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Production Incident Briefing</span>
              </div>
              {collapsedSections.scenario ? (
                <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
            {!collapsedSections.scenario && (
              <p className="text-[11px] text-rose-950/90 dark:text-rose-200/90 leading-relaxed mt-1.5 whitespace-pre-line">
                {challenge.scenarioContext}
              </p>
            )}
          </div>
        )}

        {/* Requirements Checklist */}
        <div className="rounded-xl border border-[#E4E0EC] dark:border-white/10 bg-[#FAF9FD] dark:bg-[#16122E]/50 p-3.5">
          <button
            onClick={() => toggleSection('requirements')}
            className="w-full flex items-center justify-between text-left font-bold text-[#353148] dark:text-slate-100 text-xs mb-1"
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>Requirements Checklist</span>
            </div>
            {collapsedSections.requirements ? (
              <ChevronRight className="w-3.5 h-3.5 text-[#8E8A9C]" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-[#8E8A9C]" />
            )}
          </button>

          {!collapsedSections.requirements && (
            <div className="space-y-2 mt-2">
              {challenge.instructions && challenge.instructions.length > 0 ? (
                challenge.instructions.map((req, idx) => {
                  const isChecked = checkedRequirements[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleRequirement(idx)}
                      className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300'
                          : 'bg-white dark:bg-[#1A1636] border border-[#E4E0EC] dark:border-white/5 hover:border-[#7038F0]/40 text-[#353148] dark:text-slate-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={!!isChecked}
                        onChange={() => {}} // Controlled by container click
                        className="mt-0.5 rounded border-gray-300 text-[#7038F0] focus:ring-[#7038F0] cursor-pointer"
                      />
                      <span
                        className={`text-[11px] leading-relaxed select-none ${
                          isChecked ? 'line-through opacity-80' : ''
                        }`}
                      >
                        {req}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-[11px] text-[#8E8A9C]">No explicit instructions provided.</p>
              )}
            </div>
          )}
        </div>

        {/* Input & Output Specifications */}
        {(challenge.inputFormat || challenge.outputFormat) && (
          <div className="rounded-xl border border-[#E4E0EC] dark:border-white/10 bg-[#FAF9FD] dark:bg-[#16122E]/50 p-3.5">
            <button
              onClick={() => toggleSection('ioSpec')}
              className="w-full flex items-center justify-between text-left font-bold text-[#353148] dark:text-slate-100 text-xs mb-1"
            >
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-sky-500" />
                <span>Input & Output Contract</span>
              </div>
              {collapsedSections.ioSpec ? (
                <ChevronRight className="w-3.5 h-3.5 text-[#8E8A9C]" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-[#8E8A9C]" />
              )}
            </button>

            {!collapsedSections.ioSpec && (
              <div className="space-y-2.5 mt-2 text-[11px]">
                {challenge.inputFormat && (
                  <div>
                    <span className="font-semibold text-[#353148] dark:text-slate-200">
                      Input Format:
                    </span>
                    <p className="text-[#6F6B7D] dark:text-slate-300 font-mono bg-white dark:bg-[#120F26] p-2 rounded-lg border border-[#E4E0EC] dark:border-white/5 mt-1 whitespace-pre-wrap">
                      {challenge.inputFormat}
                    </p>
                  </div>
                )}
                {challenge.outputFormat && (
                  <div>
                    <span className="font-semibold text-[#353148] dark:text-slate-200">
                      Expected Output:
                    </span>
                    <p className="text-[#6F6B7D] dark:text-slate-300 font-mono bg-white dark:bg-[#120F26] p-2 rounded-lg border border-[#E4E0EC] dark:border-white/5 mt-1 whitespace-pre-wrap">
                      {challenge.outputFormat}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Sample Scenarios & Edge Cases */}
        {challenge.sampleScenarios && challenge.sampleScenarios.length > 0 && (
          <div className="rounded-xl border border-[#E4E0EC] dark:border-white/10 bg-[#FAF9FD] dark:bg-[#16122E]/50 p-3.5">
            <button
              onClick={() => toggleSection('samples')}
              className="w-full flex items-center justify-between text-left font-bold text-[#353148] dark:text-slate-100 text-xs mb-1"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-500" />
                <span>Sample Scenarios ({challenge.sampleScenarios.length})</span>
              </div>
              {collapsedSections.samples ? (
                <ChevronRight className="w-3.5 h-3.5 text-[#8E8A9C]" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-[#8E8A9C]" />
              )}
            </button>

            {!collapsedSections.samples && (
              <div className="space-y-3 mt-2">
                {challenge.sampleScenarios.map((scenario, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-[#120F26] border border-[#E4E0EC] dark:border-white/5 rounded-lg p-2.5 space-y-1.5 text-[11px]"
                  >
                    <div className="font-semibold text-[#353148] dark:text-slate-200 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-[#EDE8F5] dark:bg-[#201B3E] text-[#7038F0] dark:text-purple-300 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span>{scenario.title}</span>
                    </div>

                    <div className="grid grid-cols-1 gap-1.5 pt-1">
                      <div>
                        <span className="text-[10px] text-[#8E8A9C] dark:text-slate-400 uppercase font-semibold">
                          Input / Action:
                        </span>
                        <pre className="mt-0.5 p-1.5 bg-[#F6F4FB] dark:bg-[#0B0918] rounded border border-[#E8E4F0] dark:border-white/5 font-mono text-[10px] text-slate-800 dark:text-slate-200 overflow-x-auto">
                          {scenario.input}
                        </pre>
                      </div>

                      <div>
                        <span className="text-[10px] text-[#8E8A9C] dark:text-slate-400 uppercase font-semibold">
                          Expected Output / Behavior:
                        </span>
                        <pre className="mt-0.5 p-1.5 bg-[#F6F4FB] dark:bg-[#0B0918] rounded border border-[#E8E4F0] dark:border-white/5 font-mono text-[10px] text-emerald-700 dark:text-emerald-400 overflow-x-auto">
                          {scenario.output}
                        </pre>
                      </div>

                      {scenario.explanation && (
                        <p className="text-[10px] text-[#6F6B7D] dark:text-slate-300 italic pt-0.5">
                          💡 {scenario.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Constraints */}
        {challenge.constraints && challenge.constraints.length > 0 && (
          <div className="rounded-xl border border-[#E4E0EC] dark:border-white/10 bg-[#FAF9FD] dark:bg-[#16122E]/50 p-3.5">
            <button
              onClick={() => toggleSection('constraints')}
              className="w-full flex items-center justify-between text-left font-bold text-[#353148] dark:text-slate-100 text-xs mb-1"
            >
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-500" />
                <span>Constraints & Concurrency</span>
              </div>
              {collapsedSections.constraints ? (
                <ChevronRight className="w-3.5 h-3.5 text-[#8E8A9C]" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-[#8E8A9C]" />
              )}
            </button>

            {!collapsedSections.constraints && (
              <ul className="list-disc list-inside space-y-1 mt-2 text-[11px] text-[#6F6B7D] dark:text-slate-300">
                {challenge.constraints.map((c, idx) => (
                  <li key={idx} className="leading-relaxed">
                    <span className="font-mono text-[10px]">{c}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Progressive Collapsible Hints */}
        {((challenge.solutionHints && challenge.solutionHints.length > 0) || (challenge.hints && challenge.hints.length > 0)) && (
          <div className="rounded-xl border border-purple-200 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-950/20 p-3.5">
            <button
              onClick={() => toggleSection('hints')}
              className="w-full flex items-center justify-between text-left font-bold text-purple-900 dark:text-purple-300 text-xs mb-1"
            >
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Progressive Hints ({(challenge.solutionHints || challenge.hints || []).length})</span>
              </div>
              {collapsedSections.hints ? (
                <ChevronRight className="w-3.5 h-3.5 text-purple-700 dark:text-purple-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-purple-700 dark:text-purple-400" />
              )}
            </button>

            {!collapsedSections.hints && (
              <div className="space-y-2 mt-2">
                {(challenge.solutionHints || challenge.hints || []).map((hint, idx) => {
                  const isRevealed = revealedHints[idx];
                  return (
                    <div
                      key={idx}
                      className="border border-purple-200 dark:border-purple-800/40 rounded-lg bg-white dark:bg-[#120F26] p-2.5 text-[11px]"
                    >
                      {isRevealed ? (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-semibold text-purple-700 dark:text-purple-400 uppercase">
                            <span>Hint {idx + 1}</span>
                            <button
                              onClick={() => toggleHint(idx)}
                              className="text-[10px] text-[#8E8A9C] dark:text-slate-400 hover:underline"
                            >
                              Hide
                            </button>
                          </div>
                          <p className="text-[#353148] dark:text-slate-200 leading-relaxed">
                            {hint}
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-[#8E8A9C] dark:text-slate-400 text-[11px]">
                            Need a nudge? Hint #{idx + 1} is hidden.
                          </span>
                          <button
                            onClick={() => toggleHint(idx)}
                            className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-700 text-white font-medium text-[10px] transition-colors"
                          >
                            Reveal Hint
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Architecture & Implementation Notes */}
        {challenge.architectureNotes && (
          <div className="rounded-xl border border-sky-200 dark:border-sky-900/30 bg-sky-50/50 dark:bg-sky-950/20 p-3.5">
            <button
              onClick={() => toggleSection('architecture')}
              className="w-full flex items-center justify-between text-left font-bold text-sky-900 dark:text-sky-300 text-xs mb-1"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>Architecture & Debug Notes</span>
              </div>
              {collapsedSections.architecture ? (
                <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
            {!collapsedSections.architecture && (
              <p className="text-[11px] text-sky-950/90 dark:text-sky-200/90 leading-relaxed mt-1.5 whitespace-pre-line">
                {challenge.architectureNotes}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Bottom Summary Bar & Progress */}
      <div className="border-t border-[#E4E0EC] dark:border-white/10 p-3.5 bg-[#FAF9FD] dark:bg-[#14102B]/80 flex-shrink-0 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 font-semibold text-[#7038F0] dark:text-purple-300 text-[11px]">
              <Star className="w-3.5 h-3.5 text-[#7038F0] dark:text-purple-400 fill-[#7038F0] dark:fill-purple-400" />
              <span>+200 XP</span>
            </div>
            <div className="flex items-center gap-1 font-semibold text-sky-600 dark:text-sky-300 text-[11px]">
              <span className="w-3.5 h-3.5 rounded-full bg-sky-500/15 border border-sky-400/40 text-sky-600 dark:text-sky-300 flex items-center justify-center text-[9px] font-bold">
                $
              </span>
              <span>+500 Tokens</span>
            </div>
          </div>
          <span className="text-[11px] font-medium text-[#8E8A9C] dark:text-slate-400">
            {passedTests} / {totalTests} Tests Passing
          </span>
        </div>

        <div className="w-full h-1.5 bg-[#EDE8F5] dark:bg-[#191534] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#7038F0] to-emerald-400 transition-all duration-300"
            style={{ width: `${Math.max(progressPercent, 4)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
