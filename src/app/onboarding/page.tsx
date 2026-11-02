'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { GoalType, ExperienceLevel, PreferredLanguage } from '@/types/auth';
import {
  Bug,
  Code2,
  Clock,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Zap,
  Target,
  Loader2,
  Terminal,
} from 'lucide-react';

interface GoalOption {
  id: GoalType;
  title: string;
  badge: string;
  badgeColor: string;
  icon: React.ElementType;
  description: string;
  skills: string[];
  sampleChallenge: string;
}

const GOAL_OPTIONS: GoalOption[] = [
  {
    id: 'debugging',
    title: 'Debugging Round',
    badge: 'Placement Favorite',
    badgeColor: 'bg-dev-purple/20 text-purple-300 border-dev-purple/40',
    icon: Bug,
    description:
      'Diagnose and repair real-world bugs in multi-file projects (broken auth, HTTP 500, database race conditions, null references).',
    skills: ['Root-Cause Analysis', 'Log Inspection', 'Regression Safety', 'Prompt Efficiency'],
    sampleChallenge: 'Fix Broken JWT Authentication & Password Verification',
  },
  {
    id: 'fullstack',
    title: 'Feature Implementation',
    badge: 'Core Engineering',
    badgeColor: 'bg-dev-cyan/20 text-cyan-300 border-dev-cyan/40',
    icon: Code2,
    description:
      'Build missing endpoints, integrate database queries, and add pagination to existing repositories without breaking tests.',
    skills: ['REST Endpoints', 'Schema Integrations', 'Acceptance Testing', 'Clean Architecture'],
    sampleChallenge: 'Implement Filtered Product Pagination in Node.js & Mongo',
  },
  {
    id: 'interview',
    title: 'Interview Simulation',
    badge: 'High Stakes Practice',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    icon: Clock,
    description:
      'Timed, multi-step technical screening rounds with restricted AI assistance policies and realistic token budgets.',
    skills: ['Token Budgeting', 'Timed Problem Solving', 'Hidden Tests', 'AI Trust Calibration'],
    sampleChallenge: '45-Min Screening: Banking Transaction Double-Charge Bug',
  },
];

function OnboardingContent() {
  const { user, setUserGoal } = useAuth();
  const router = useRouter();

  const [selectedGoal, setSelectedGoal] = useState<GoalType>('debugging');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('intermediate');
  const [preferredLanguage, setPreferredLanguage] = useState<PreferredLanguage>('javascript');
  const [saving, setSaving] = useState(false);

  const handleSaveGoal = async () => {
    setSaving(true);
    try {
      const res = await setUserGoal(selectedGoal, experienceLevel, preferredLanguage);
      if (res.success) {
        router.push('/dashboard');
      } else {
        alert(res.error || 'Failed to set learning goal');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Top Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dev-purple/15 border border-dev-purple/30 text-purple-300 text-xs font-semibold mb-3">
          <Target className="w-3.5 h-3.5 text-dev-purple" />
          <span>Step 1 of 1 • Personalized Track Setup</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
          Choose Your Primary Placement Goal
        </h1>
        <p className="text-sm text-dev-muted leading-relaxed">
          Welcome, <span className="text-purple-300 font-semibold">{user?.name}</span>!
          DevPractice tailors your challenge library, AI assistance policies, and token quotas
          based on your target assessment focus.
        </p>
      </div>

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {GOAL_OPTIONS.map((goal) => {
          const Icon = goal.icon;
          const isSelected = selectedGoal === goal.id;

          return (
            <div
              key={goal.id}
              onClick={() => setSelectedGoal(goal.id)}
              className={`relative rounded-3xl p-6 cursor-pointer transition-all duration-300 border flex flex-col justify-between ${
                isSelected
                  ? 'glass-panel-glow border-dev-purple shadow-glow-purple scale-[1.02] bg-gradient-to-b from-dev-card via-dev-card to-dev-purple/10'
                  : 'glass-panel border-dev-border/70 hover:border-dev-purple/40 hover:bg-dev-cardHover'
              }`}
            >
              {/* Selected Checkmark Indicator */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-gradient-to-tr from-dev-purple to-dev-indigo text-white shadow-glow-purple'
                      : 'bg-dev-surface border border-dev-border text-dev-muted'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${goal.badgeColor}`}
                  >
                    {goal.badge}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-dev-purple border-dev-purple text-white'
                        : 'border-dev-border bg-dev-surface/50'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-4 h-4 fill-white text-dev-card" />}
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div className="mb-5">
                <h3 className="text-lg font-bold text-white mb-2">{goal.title}</h3>
                <p className="text-xs text-dev-muted leading-relaxed">{goal.description}</p>
              </div>

              {/* Skill Tags */}
              <div className="mb-4">
                <p className="text-[11px] font-semibold text-dev-subtle uppercase tracking-wider mb-2">
                  Skills Evaluated
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {goal.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-dev-surface/80 border border-dev-border text-dev-muted font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sample Challenge Footer */}
              <div className="pt-4 border-t border-dev-border/50 text-[11px] text-dev-muted">
                <span className="text-purple-300 font-semibold block mb-0.5">Sample Challenge:</span>
                <span className="italic">{goal.sampleChallenge}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Preferences Panel */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 mb-8 border border-dev-border/80">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-dev-purple" />
          <span>Tailor Your Initial Learning Profile</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Experience Level */}
          <div>
            <label className="block text-xs font-semibold text-dev-muted uppercase tracking-wider mb-2">
              Your Current Experience Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'beginner', label: 'Beginner', desc: '1st/2nd Year' },
                { id: 'intermediate', label: 'Intermediate', desc: 'Placement Ready' },
                { id: 'advanced', label: 'Advanced', desc: 'Competitive' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setExperienceLevel(lvl.id as ExperienceLevel)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    experienceLevel === lvl.id
                      ? 'bg-dev-purple/20 border-dev-purple text-white shadow-glow-purple'
                      : 'bg-dev-surface/80 border-dev-border text-dev-muted hover:border-dev-purple/30'
                  }`}
                >
                  <p className="text-xs font-bold leading-tight">{lvl.label}</p>
                  <p className="text-[10px] text-dev-muted mt-0.5">{lvl.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Primary Language */}
          <div>
            <label className="block text-xs font-semibold text-dev-muted uppercase tracking-wider mb-2">
              Primary Language Stack
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'javascript', label: 'Node.js / JS' },
                { id: 'python', label: 'Python 3' },
                { id: 'java', label: 'Java' },
                { id: 'cpp', label: 'C++' },
              ].map((lang) => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setPreferredLanguage(lang.id as PreferredLanguage)}
                  className={`py-2.5 px-2 rounded-xl border text-center transition-all ${
                    preferredLanguage === lang.id
                      ? 'bg-dev-purple/20 border-dev-purple text-white shadow-glow-purple'
                      : 'bg-dev-surface/80 border-dev-border text-dev-muted hover:border-dev-purple/30'
                  }`}
                >
                  <span className="text-xs font-semibold">{lang.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel rounded-2xl p-4 border border-dev-border/70">
        <div className="flex items-center gap-3 text-xs text-dev-muted">
          <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0" />
          <span>
            You can modify your learning track anytime from your dashboard or profile settings.
          </span>
        </div>

        <button
          onClick={handleSaveGoal}
          disabled={saving}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-dev-gradient hover:opacity-95 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-glow-purple transition-all duration-200 active:scale-95 disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Personalizing Workspace...</span>
            </>
          ) : (
            <>
              <span>Launch DevPractice Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <ProtectedRoute requireOnboarded={false}>
      <OnboardingContent />
    </ProtectedRoute>
  );
}
