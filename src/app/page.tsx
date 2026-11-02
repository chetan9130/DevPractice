'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AuthPromptModal from '@/components/auth/AuthPromptModal';
import { motion } from 'framer-motion';
import { BorderBeam } from '@/components/ui/border-beam';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { GlowBorderCard } from '@/components/ui/glow-border-card';
import { StatsCounter } from '@/components/ui/stats-counter';
import {
  Code2,
  Bug,
  Sparkles,
  Terminal,
  ShieldCheck,
  TrendingUp,
  Building2,
  Play,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Cpu,
  Coins,
  ShieldAlert,
  BrainCircuit,
  HelpCircle,
  FolderGit2,
  Flame,
  Check,
  Lock,
  Compass,
  FileCode,
  Zap,
  Target,
  BarChart3,
  Bot,
  AlertTriangle,
  Award,
  ChevronRight,
  RotateCcw,
  Loader2,
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated, isOnboarded } = useAuth();
  const router = useRouter();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [modalActionContext, setModalActionContext] = useState({
    title: 'Sign In to Access DevPractice Workspace',
    subtitle: 'Sign in with Google, GitHub, Microsoft, or Email to start practicing and debugging real codebases.',
  });

  // Practice Modes Tab Switcher
  const [activePracticeTab, setActivePracticeTab] = useState<'debugging' | 'rescue' | 'feature' | 'interview'>('debugging');

  // AI Prompt Simulator Selected Example
  const [simulatedPrompt, setSimulatedPrompt] = useState<'shotgun' | 'overexplainer' | 'surgical'>('surgical');

  // Interactive Live IDE Sandbox states
  const [selectedFile, setSelectedFile] = useState<'authController.js' | 'jwt.verify.js' | 'auth.test.js'>('authController.js');
  const [testRunStatus, setTestRunStatus] = useState<'idle' | 'running' | 'done'>('idle');
  const [showAiHint, setShowAiHint] = useState<boolean>(false);

  // Universal handler for all clickable buttons
  const handleProtectedAction = (
    targetUrl: string,
    featureName: string = 'this feature'
  ) => {
    if (!isAuthenticated) {
      setModalActionContext({
        title: `Sign In to Access ${featureName}`,
        subtitle: `Create a free account or log in with Google, GitHub, Microsoft, or Email to unlock ${featureName} and launch your isolated browser IDE.`,
      });
      setAuthModalOpen(true);
    } else {
      if (!isOnboarded && targetUrl !== '/onboarding') {
        router.push('/onboarding');
      } else {
        router.push(targetUrl);
      }
    }
  };

  const handleRunTests = () => {
    setTestRunStatus('running');
    setTimeout(() => {
      setTestRunStatus('done');
    }, 1200);
  };

  return (
    <div className="relative overflow-hidden bg-[#090812] text-slate-100 min-h-screen">
      {/* Precision Developer Engineering Grid (Linear / Supabase aesthetic, replaces blurry slop) */}
      <div className="absolute inset-0 bg-dev-grid opacity-75 pointer-events-none" />
      
      {/* Subtle top radial ambient lighting without cartoonish blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[380px] bg-gradient-to-b from-[#5B48EE]/15 to-transparent blur-3xl pointer-events-none" />

      {/* ========================================================================= */}
      {/* SECTION 1: HERO & HOME (#home) */}
      {/* ========================================================================= */}
      <section id="home" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center relative z-10 scroll-mt-20">
        {/* Release Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1838] border border-[#3C3877] text-[#C4BEEC] text-xs font-semibold mb-6 shadow-xs animate-subtle-float">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px] text-[#A69BFF]">v1.4 ENGINE</span>
          <span className="text-slate-500">•</span>
          <span>Docker Pinned Sandboxes • Token Policy Gate</span>
        </div>

        {/* Hero Title (Approved Copy: Become the Developer Who Can Solve Real Problems) */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.08] mb-6">
          Become the Developer Who Can{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-200 to-violet-400">
            Solve Real Problems.
          </span>
        </h1>

        {/* Hero Supporting Text (Approved Copy) */}
        <p className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed mb-9 font-normal">
          Debug real software projects, implement features, use AI responsibly and prove your engineering skills through practical assessments.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <InteractiveHoverButton
            onClick={() => handleProtectedAction('/dashboard', 'Practice Workspace')}
            className="w-full sm:w-auto px-8 py-3.5 text-base"
          >
            {isAuthenticated ? 'Open Practice Workspace' : 'Start Practicing Free'}
          </InteractiveHoverButton>

          <button
            onClick={() => {
              const el = document.getElementById('live-sandbox');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#141228] hover:bg-[#1E1B3A] border border-[#2B2754] text-slate-200 font-semibold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all hover:border-[#5B48EE]/60 shadow-vengeance hover:shadow-vengeance-hover"
          >
            <Play className="w-4 h-4 text-purple-400 fill-current" />
            <span>Explore a Live Challenge</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* LIVE INTERACTIVE IDE SANDBOX (Crisp developer tool aesthetic) */}
        {/* ========================================================================= */}
        <div id="live-sandbox" className="max-w-5xl mx-auto rounded-2xl bg-[#0D0B1E] border border-[#25214D] p-2 sm:p-4 text-left shadow-2xl relative scroll-mt-24 overflow-hidden">
          {/* VengeanceUI Border Beam */}
          <BorderBeam size={320} duration={12} colorFrom="#7C3AED" colorTo="#06B6D4" borderWidth={1.5} />
          {/* Top Window Bar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#211D44] mb-3 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="font-semibold text-slate-200 font-mono text-xs flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-[#A69BFF]" />
                ecommerce-auth-service (Node.js 20 • Docker Sandbox)
              </span>
            </div>

            <div className="flex items-center gap-3 font-mono">
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                <Clock className="w-3 h-3" />
                <span>Timer: 42:15</span>
              </div>
              <button
                onClick={() => handleProtectedAction('/dashboard', 'Submission Engine')}
                className="px-3.5 py-1 rounded-lg bg-[#5B48EE] hover:bg-[#4D3AD4] text-white text-[11px] font-bold transition-all shadow-xs"
              >
                Submit Code
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs font-mono">
            {/* 1. Workspace File Explorer */}
            <div className="hidden md:block md:col-span-3 rounded-xl bg-[#090815] border border-[#1C1938] p-3 select-none">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Workspace Files</p>
              <div className="space-y-1 text-slate-400 text-[11px]">
                <p className="text-slate-300 font-bold flex items-center gap-1">
                  <span>📁</span> ecommerce-service/
                </p>
                <p className="pl-3 text-slate-300 flex items-center gap-1">
                  <span>📁</span> src/
                </p>
                <button
                  onClick={() => setSelectedFile('authController.js')}
                  className={`pl-6 text-left w-full py-1 px-1.5 rounded transition-colors flex items-center justify-between ${
                    selectedFile === 'authController.js'
                      ? 'bg-[#1C1842] text-[#B7A9FF] font-bold'
                      : 'hover:text-white'
                  }`}
                >
                  <span>📄 authController.js</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                </button>
                <button
                  onClick={() => setSelectedFile('jwt.verify.js')}
                  className={`pl-6 text-left w-full py-1 px-1.5 rounded transition-colors flex items-center justify-between ${
                    selectedFile === 'jwt.verify.js'
                      ? 'bg-[#1C1842] text-[#B7A9FF] font-bold'
                      : 'hover:text-white'
                  }`}
                >
                  <span>📄 jwt.verify.js</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                </button>
                <button
                  onClick={() => setSelectedFile('auth.test.js')}
                  className={`pl-6 text-left w-full py-1 px-1.5 rounded transition-colors flex items-center justify-between ${
                    selectedFile === 'auth.test.js'
                      ? 'bg-[#1C1842] text-[#B7A9FF] font-bold'
                      : 'hover:text-white'
                  }`}
                >
                  <span>🧪 auth.test.js</span>
                </button>
                <p className="pl-3 text-slate-500">📁 models/</p>
                <p className="pl-3 text-slate-500">📄 package.json</p>
                <p className="pl-3 text-slate-500">📄 docker-compose.yml</p>
              </div>
            </div>

            {/* 2. Code Editor View */}
            <div className="md:col-span-5 rounded-xl bg-[#080714] border border-[#1E1B3E] p-4 font-mono text-[11px] leading-relaxed flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#1C1938] pb-2 mb-3 text-[10px]">
                  <span className="text-[#A69BFF] font-semibold">{selectedFile}</span>
                  <span className="text-slate-500">
                    {selectedFile === 'authController.js' && 'Line 9 • Error Detected'}
                    {selectedFile === 'jwt.verify.js' && 'Line 4 • Missing Secret Guard'}
                    {selectedFile === 'auth.test.js' && '5 Test Suites Defined'}
                  </span>
                </div>

                {selectedFile === 'authController.js' && (
                  <div className="space-y-1 text-slate-300">
                    <p><span className="text-purple-400">const</span> login = <span className="text-purple-400">async</span> (req, res) =&gt; &#123;</p>
                    <p className="pl-3"><span className="text-purple-400">const</span> &#123; email, password &#125; = req.body;</p>
                    <p className="pl-3"><span className="text-purple-400">const</span> user = <span className="text-purple-400">await</span> User.findOne(&#123; email &#125;);</p>
                    <p className="pl-3"><span className="text-purple-400">if</span> (!user) &#123;</p>
                    <p className="pl-6 text-rose-400"><span className="text-purple-400">return</span> res.status(401).json(&#123; message: &quot;Invalid credentials&quot; &#125;);</p>
                    <p className="pl-3">&#125;</p>
                    <div className="p-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 my-1">
                      // BUG: Plaintext comparison fails with bcrypt hashed passwords!
                    </div>
                    <p className="pl-3 text-rose-300 bg-rose-950/20 px-1 py-0.5 rounded">
                      <span className="text-purple-400">if</span> (user.password !== password) <span className="text-purple-400">return</span> 401;
                    </p>
                    <p className="pl-3"><span className="text-purple-400">return</span> res.json(&#123; token: generateToken(user) &#125;);</p>
                    <p>&#125;;</p>
                  </div>
                )}

                {selectedFile === 'jwt.verify.js' && (
                  <div className="space-y-1 text-slate-300">
                    <p><span className="text-purple-400">import</span> jwt <span className="text-purple-400">from</span> &apos;jsonwebtoken&apos;;</p>
                    <p><span className="text-purple-400">export const</span> verifyToken = (header) =&gt; &#123;</p>
                    <p className="pl-3"><span className="text-purple-400">const</span> token = header?.split(&apos; &apos;)[1];</p>
                    <p className="pl-3"><span className="text-purple-400">if</span> (!token) <span className="text-purple-400">throw new</span> Error(&apos;No token provided&apos;);</p>
                    <p className="pl-3 text-amber-300 bg-amber-500/10 px-1 py-0.5 rounded">// WARNING: Secret key falls back to empty string if ENV undefined</p>
                    <p className="pl-3"><span className="text-purple-400">return</span> jwt.verify(token, process.env.JWT_SECRET || &apos;&apos;);</p>
                    <p>&#125;;</p>
                  </div>
                )}

                {selectedFile === 'auth.test.js' && (
                  <div className="space-y-1 text-slate-300">
                    <p><span className="text-purple-400">describe</span>(&apos;POST /api/auth/login&apos;, () =&gt; &#123;</p>
                    <p className="pl-3">it(&apos;should return 200 with valid JWT when hash matches&apos;, <span className="text-purple-400">async</span> () =&gt; &#123;</p>
                    <p className="pl-6"><span className="text-purple-400">const</span> res = <span className="text-purple-400">await</span> request(app).post(&apos;/login&apos;).send(validUser);</p>
                    <p className="pl-6">expect(res.status).toBe(200);</p>
                    <p className="pl-6">expect(res.body.token).toBeDefined();</p>
                    <p className="pl-3">&#125;);</p>
                    <p>&#125;);</p>
                  </div>
                )}
              </div>

              {/* Terminal Section with Run Tests Trigger */}
              <div className="mt-4 pt-3 border-t border-[#1C1938]">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3 h-3 text-[#A69BFF]" />
                    Container Terminal
                  </span>
                  <button
                    onClick={handleRunTests}
                    disabled={testRunStatus === 'running'}
                    className="text-[#A69BFF] hover:text-white flex items-center gap-1 uppercase tracking-wider"
                  >
                    {testRunStatus === 'running' ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin text-purple-400" />
                        <span>Running Suites...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-2.5 h-2.5 fill-current" />
                        <span>Run Test Suite</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-2.5 rounded-lg bg-[#05040D] border border-[#16142B] text-[10px] space-y-1">
                  <p className="text-emerald-400">$ pnpm test --silent</p>
                  {testRunStatus === 'running' && (
                    <p className="text-slate-400 animate-pulse">Running 3 test suites in Docker container #8f2a1e...</p>
                  )}
                  {testRunStatus !== 'running' && (
                    <>
                      <p className="text-emerald-400">✓ test/jwt.spec.js (3 passed)</p>
                      <p className="text-rose-400">✗ test/auth.spec.js: line 14 - expected 200, received 401</p>
                      <p className="text-slate-500">Tests: 1 failed, 3 passed, 4 total</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 3. AI Assistant Panel (Policy L2) */}
            <div className="md:col-span-4 rounded-xl bg-[#0C0B1C] border border-[#26224E] p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#1E1B40] mb-2.5">
                  <div className="flex items-center gap-1.5 text-purple-300 font-bold text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-[#A69BFF]" />
                    <span>Policy-Aware AI</span>
                  </div>
                  <span className="text-[9px] font-semibold bg-[#221A4B] text-[#A69BFF] px-2 py-0.5 rounded border border-[#3C2D7B]">
                    Guided Mode (L2)
                  </span>
                </div>

                <div className="space-y-2 text-[11px] font-sans">
                  <div className="p-2.5 rounded-lg bg-[#14122C] text-slate-200 border border-[#25224D]">
                    <span className="text-[10px] font-mono text-slate-500 block mb-0.5">STUDENT QUERY:</span>
                    Why does /api/auth/login return 401 on valid password?
                  </div>

                  {showAiHint ? (
                    <div className="p-2.5 rounded-lg bg-[#1C1642] border border-[#483B8D] text-slate-200 animate-in fade-in duration-200">
                      <p className="font-semibold text-purple-300 text-xs mb-1 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-400 fill-current" />
                        Progressive Hint (Policy L2):
                      </p>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        The passwords in the database were saved via bcrypt. When comparing passwords, standard inequality <code className="text-rose-300 font-mono">!==</code> does not evaluate salted hashes.
                      </p>
                      <div className="mt-2 p-1.5 rounded bg-[#100E26] border border-[#2B265C] text-amber-300 font-mono text-[10px]">
                        💡 Use <code className="text-white">await bcrypt.compare(password, user.password)</code>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-lg bg-[#14122C]/60 border border-[#211E44] text-slate-400 text-[11px]">
                      AI policy blocks direct answers during assessment. Progressive hints can be unlocked.
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setShowAiHint(!showAiHint)}
                className="w-full mt-3 py-2 px-3 rounded-lg bg-[#5B48EE]/20 hover:bg-[#5B48EE]/30 border border-[#5B48EE]/40 text-xs font-semibold text-purple-300 flex items-center justify-center gap-1.5 transition-all"
              >
                <span>{showAiHint ? 'Hide Hint Clue' : 'Unlock Hint 1 (Costs 25 tokens)'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Real Engineering Metrics Row */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto text-left">
          {[
            { val: 10000, suffix: '+', label: 'Active Learners Practicing' },
            { val: 500, suffix: '+', label: 'Multi-File Codebases' },
            { val: 50, suffix: '+', label: 'Colleges & Institutions' },
            { val: 4, suffix: ' Modes', label: 'Debug, Rescue, Feature, Exam' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#0D0B1E] border border-[#1E1B3E] shadow-vengeance hover:border-[#5B48EE]/40 transition-all hover:-translate-y-0.5"
            >
              <p className="text-2xl font-black text-white">
                <StatsCounter value={item.val} suffix={item.suffix} />
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Traditional Coding vs DevPractice Comparison */}
        <div className="mt-24 text-left">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider bg-[#1A1838] px-3.5 py-1 rounded-full border border-[#3C3877]">
              The Core Problem
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
              Why LeetCode + ChatGPT Is No Longer Enough
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Flawed traditional prep */}
            <div className="p-6 sm:p-7 rounded-2xl border border-rose-500/20 bg-[#120914]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <XCircle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Traditional Snippet Practice</h3>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-400">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold shrink-0">✗</span>
                  <span><strong className="text-slate-200">Isolated One-File Puzzles:</strong> Writing single functions without seeing server architectures, routes, or logs.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold shrink-0">✗</span>
                  <span><strong className="text-slate-200">ChatGPT Reliance:</strong> Copy-pasting errors blindly into ChatGPT creates dependency without skill retention.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold shrink-0">✗</span>
                  <span><strong className="text-slate-200">Zero Regression Habits:</strong> Students write code that passes happy paths but breaks critical production flows.</span>
                </li>
              </ul>
            </div>

            {/* DevPractice Advantage */}
            <div className="p-6 sm:p-7 rounded-2xl border border-[#3E3486] bg-[#0F0C28]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#5B48EE]/20 border border-[#5B48EE]/40 flex items-center justify-center text-[#A69BFF]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">DevPractice Engineering Engine</h3>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-400">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span><strong className="text-slate-200">Full Multi-File Projects:</strong> Work directly in controllers, middleware, models, and real package configs.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span><strong className="text-slate-200">Policy-Governed AI:</strong> Progressive hints guide your thinking without handing out complete answers.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span><strong className="text-slate-200">Hidden Evaluation Suites:</strong> Independent container test suites verify behavior objectively.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: PRACTICE MODES (#practice-modes) */}
      {/* ========================================================================= */}
      <section id="practice-modes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-[#1C193C] scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1838] border border-[#3C3877] text-[#C4BEEC] text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5 text-[#A69BFF]" />
            <span>Curated Practice Modes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
            Four Practice Modes for Every Engineering Skill
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Choose how you want to train. Click through each mode to view challenges, skill rubrics, and evaluation benchmarks.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          {[
            { id: 'debugging', label: '1. Debugging Round', icon: Bug, count: '14 Repos' },
            { id: 'rescue', label: '2. Environment Rescue', icon: Terminal, count: '8 Repos' },
            { id: 'feature', label: '3. Feature Implementation', icon: Layers, count: '11 Repos' },
            { id: 'interview', label: '4. Interview Simulation', icon: Clock, count: '6 Exams' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activePracticeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePracticeTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#5B48EE] text-white shadow-md shadow-indigo-600/30 border border-[#7C66FF]'
                    : 'bg-[#121026] text-slate-400 border border-[#232048] hover:border-[#5B48EE]/40 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-[#1D1A3B] text-slate-400'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mode Card Content with VengeanceUI BorderBeam */}
        <div className="rounded-2xl p-6 sm:p-9 border border-[#2C2758] bg-[#0E0C22] relative overflow-hidden shadow-vengeance">
          <BorderBeam size={360} duration={14} colorFrom="#5B48EE" colorTo="#38BDF8" borderWidth={1.5} />
          {activePracticeTab === 'debugging' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#201A4B] text-[#A69BFF] border border-[#3C2E85] uppercase tracking-wider">
                  Mode 01 • Bug Hunting & Root Cause Analysis
                </span>
                <h3 className="text-2xl font-bold text-white mt-3 mb-3">
                  The Debugging Round
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                  You are handed a realistic, broken multi-file repository. The client reports an issue: HTTP 500 on checkout,
                  users bypass password verification, or database queries deadlock under load. You must explore the codebase,
                  inspect server logs, reproduce the failure, and fix the root cause without causing regressions.
                </p>

                <div className="space-y-2.5 mb-6 text-xs text-slate-400">
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#A69BFF] shrink-0" />
                    <span><strong className="text-slate-200">Real Bugs:</strong> Broken authentication, race conditions, memory leaks, null references.</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#A69BFF] shrink-0" />
                    <span><strong className="text-slate-200">Skills Tested:</strong> Log diagnosis, stack trace comprehension, regression prevention.</span>
                  </p>
                </div>

                <button
                  onClick={() => handleProtectedAction('/dashboard', 'Debugging Round Workspace')}
                  className="px-6 py-3 rounded-xl bg-[#5B48EE] hover:bg-[#4D3AD4] text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-indigo-600/30 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Launch Sample Debugging Challenge</span>
                </button>
              </div>

              <div className="lg:col-span-5 bg-[#070612] rounded-xl p-5 border border-[#1C193C] font-mono text-xs">
                <p className="text-[10px] text-purple-300 font-bold uppercase mb-2">Simulated Task Brief</p>
                <div className="space-y-2 text-slate-400 text-[11px]">
                  <p className="text-white font-semibold">Challenge: Fix Broken JWT Auth</p>
                  <p className="text-amber-300">&gt; GET /api/orders 401 Unauthorized</p>
                  <div className="p-2.5 rounded-lg bg-[#110E26] border border-[#211E48] text-slate-300">
                    <code>1. Verify JWT signature using RSA256</code><br />
                    <code>2. Do not return 401 on valid Bearer header</code><br />
                    <code>3. Pass all 5 hidden test suites</code>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePracticeTab === 'rescue' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-800 uppercase tracking-wider">
                  Mode 02 • DevOps & Dependency Troubleshooting
                </span>
                <h3 className="text-2xl font-bold text-white mt-3 mb-3">
                  Environment Rescue
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                  In production, the code is often completely fine—it is the environment that refuses to start! In this mode,
                  you are given an application that fails to boot due to missing dependencies, corrupt lockfiles, database
                  migration deadlocks, or port collisions. You must diagnose and revive the system.
                </p>

                <button
                  onClick={() => handleProtectedAction('/dashboard', 'Environment Rescue Workspace')}
                  className="px-6 py-3 rounded-xl bg-[#5B48EE] hover:bg-[#4D3AD4] text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Launch Environment Rescue Sandbox</span>
                </button>
              </div>

              <div className="lg:col-span-5 bg-[#070612] rounded-xl p-5 border border-[#1C193C] font-mono text-xs">
                <p className="text-[10px] text-cyan-300 font-bold uppercase mb-2">Startup Crash Log</p>
                <div className="space-y-1.5 text-slate-400 text-[11px]">
                  <p className="text-rose-400">Error: listen EADDRINUSE: address already in use :::3000</p>
                  <p className="text-amber-300">Missing Dependency: peer mongoose@^8.0 required</p>
                </div>
              </div>
            </div>
          )}

          {activePracticeTab === 'feature' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800 uppercase tracking-wider">
                  Mode 03 • System Expansion & API Design
                </span>
                <h3 className="text-2xl font-bold text-white mt-3 mb-3">
                  Feature Implementation
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                  Software engineers spend most of their time enhancing existing codebases rather than building from scratch.
                  In this mode, you receive a functional project and a feature ticket: add filtered pagination to an endpoint,
                  implement rate limiting, or add role-based access control without breaking existing tests.
                </p>

                <button
                  onClick={() => handleProtectedAction('/dashboard', 'Feature Implementation Workspace')}
                  className="px-6 py-3 rounded-xl bg-[#5B48EE] hover:bg-[#4D3AD4] text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Launch Feature Implementation Challenge</span>
                </button>
              </div>

              <div className="lg:col-span-5 bg-[#070612] rounded-xl p-5 border border-[#1C193C] font-mono text-xs">
                <p className="text-[10px] text-emerald-300 font-bold uppercase mb-2">Product Feature Ticket</p>
                <div className="space-y-2 text-slate-400 text-[11px]">
                  <p className="text-white font-semibold">Ticket #402: Add Pagination to /api/products</p>
                  <div className="p-2.5 rounded-lg bg-[#110E26] border border-[#211E48]">
                    <code>Query: ?page=1&limit=20</code><br />
                    <code>Rule: Must not break existing non-paginated callers</code>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePracticeTab === 'interview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800 uppercase tracking-wider">
                  Mode 04 • High Stakes Placement Exam
                </span>
                <h3 className="text-2xl font-bold text-white mt-3 mb-3">
                  Interview Simulation
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                  Experience true technical screening conditions. You get a countdown timer (e.g. 45 minutes), a realistic
                  token budget (e.g. 1,000 tokens), and a policy-restricted AI assistant that refuses to give away direct solutions.
                </p>

                <button
                  onClick={() => handleProtectedAction('/dashboard', 'Interview Simulation Assessment')}
                  className="px-6 py-3 rounded-xl bg-[#5B48EE] hover:bg-[#4D3AD4] text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Start 45-Min Timed Assessment</span>
                </button>
              </div>

              <div className="lg:col-span-5 bg-[#070612] rounded-xl p-5 border border-[#1C193C] font-mono text-xs">
                <p className="text-[10px] text-amber-300 font-bold uppercase mb-2">Exam Enforcement</p>
                <div className="space-y-2 text-slate-400 text-[11px]">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#110E26] border border-[#211E48]">
                    <span>Session Timer</span>
                    <span className="text-amber-400 font-bold">45:00 Strict</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#110E26] border border-[#211E48]">
                    <span>Token Quota</span>
                    <span className="text-purple-300 font-bold">1,000 Tokens Max</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: AI ASSISTANT & TRUST CALIBRATION (#ai-assistant) */}
      {/* ========================================================================= */}
      <section id="ai-assistant" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-[#1C193C] scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1838] border border-[#3C3877] text-[#C4BEEC] text-xs font-semibold mb-3">
            <Bot className="w-3.5 h-3.5 text-[#A69BFF]" />
            <span>AI Intelligence & Skepticism Training</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
            Policy-Aware AI Assistant & Skepticism Engine
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Unlike standard AI chatbots that simply regurgitate answers, DevPractice coaches you with policy tiers,
            rewards prompt discipline, and exposes subtle bugs through adversarial Trap Rounds.
          </p>
        </div>

        {/* 3 AI Policy Levels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-[#0D0B1E] border border-[#211E44]">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1F1948] text-[#A69BFF] border border-[#3A2E80]">
              Policy Level 1
            </span>
            <h3 className="text-base font-bold text-white mt-3 mb-1">Learning Mode</h3>
            <p className="text-xs text-slate-400 mb-4">
              Broad conceptual explanations, line-by-line traceback breakdowns, and architectural guidance for students learning from scratch.
            </p>
            <div className="p-2.5 rounded-xl bg-[#070612] text-[11px] text-slate-500 border border-[#1A1838]">
              Allows: Full error explanations, syntax examples, debugging steps.
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#110E28] border border-[#3E3486]">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700">
              Policy Level 2 (Default)
            </span>
            <h3 className="text-base font-bold text-white mt-3 mb-1">Guided Practice</h3>
            <p className="text-xs text-slate-400 mb-4">
              Progressive hints on a ladder. Gives clue #1 first; charges tokens for stronger clues. Does not write complete code for you.
            </p>
            <div className="p-2.5 rounded-xl bg-[#070612] text-[11px] text-slate-400 border border-[#262052]">
              Allows: Hint 1 (Root cause) → Hint 2 (Target line) → Hint 3 (Pseudocode).
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0D0B1E] border border-[#211E44]">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700">
              Policy Level 3
            </span>
            <h3 className="text-base font-bold text-white mt-3 mb-1">Restricted Assessment</h3>
            <p className="text-xs text-slate-400 mb-4">
              For official college placement tests. Full solutions are completely blocked. Only high-level sanity checks allowed.
            </p>
            <div className="p-2.5 rounded-xl bg-[#070612] text-[11px] text-slate-500 border border-[#1A1838]">
              Enforced: Zero solutions, token usage recorded in audit report.
            </div>
          </div>
        </div>

        {/* Interactive Prompting DNA & Efficiency Lab with VengeanceUI BorderBeam */}
        <div className="rounded-2xl p-6 sm:p-8 border border-[#2C2758] bg-[#0E0C22] mb-12 relative overflow-hidden shadow-vengeance">
          <BorderBeam size={340} duration={13} colorFrom="#06B6D4" colorTo="#7C3AED" borderWidth={1.5} />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#A69BFF]" />
                <span>Interactive Prompt Efficiency Lab</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                See how different student prompting styles impact token cost and solve probability.
              </p>
            </div>
            <span className="text-xs font-semibold text-purple-300 bg-[#211B4B] px-3 py-1 rounded-full border border-[#3E2E8A]">
              Data Flywheel Simulation
            </span>
          </div>

          {/* Prompt Selector Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <button
              onClick={() => setSimulatedPrompt('shotgun')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                simulatedPrompt === 'shotgun'
                  ? 'bg-rose-950/40 border-rose-500 text-white shadow-lg'
                  : 'bg-[#090815] border-[#1E1B3E] text-slate-400 hover:border-[#5B48EE]/40'
              }`}
            >
              <p className="text-xs font-bold text-rose-300">Style A: &quot;Shotgun&quot; Prompt</p>
              <p className="text-[11px] text-slate-500 mt-0.5">&quot;Code not working. Give fix.&quot;</p>
            </button>

            <button
              onClick={() => setSimulatedPrompt('overexplainer')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                simulatedPrompt === 'overexplainer'
                  ? 'bg-amber-950/40 border-amber-500 text-white shadow-lg'
                  : 'bg-[#090815] border-[#1E1B3E] text-slate-400 hover:border-[#5B48EE]/40'
              }`}
            >
              <p className="text-xs font-bold text-amber-300">Style B: &quot;Over-Explainer&quot;</p>
              <p className="text-[11px] text-slate-500 mt-0.5">3 paragraphs copying whole file</p>
            </button>

            <button
              onClick={() => setSimulatedPrompt('surgical')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                simulatedPrompt === 'surgical'
                  ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-lg'
                  : 'bg-[#090815] border-[#1E1B3E] text-slate-400 hover:border-[#5B48EE]/40'
              }`}
            >
              <p className="text-xs font-bold text-emerald-300">Style C: &quot;Surgical&quot; (Target)</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Exact error line & specific query</p>
            </button>
          </div>

          {/* Feedback Display */}
          <div className="p-5 rounded-xl bg-[#06050F] border border-[#1C193C] font-mono text-xs">
            {simulatedPrompt === 'shotgun' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-rose-400 font-bold">
                  <span>Evaluation: Vague / Low Efficiency</span>
                  <span>Solve Probability: 14%</span>
                </div>
                <p className="text-slate-400">
                  Tokens consumed: <strong className="text-rose-400">450 tokens</strong> without providing enough context for the AI to pinpoint the defect.
                </p>
                <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300">
                  ⚠️ AI Coach: You didn&apos;t mention which file or line failed. Add the error message to raise solve chance to 78%.
                </div>
              </div>
            )}

            {simulatedPrompt === 'overexplainer' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-amber-400 font-bold">
                  <span>Evaluation: High Token Wastage</span>
                  <span>Solve Probability: 52%</span>
                </div>
                <p className="text-slate-400">
                  Tokens consumed: <strong className="text-amber-400">820 tokens</strong>. You pasted entire files into the chat window unnecessarily.
                </p>
                <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                  ⚠️ AI Coach: Avoid pasting 100 lines of unchanged code. Isolate only the failing function to conserve token quota.
                </div>
              </div>
            )}

            {simulatedPrompt === 'surgical' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span>Evaluation: Optimum / Placement Ready</span>
                  <span>Solve Probability: 96%</span>
                </div>
                <p className="text-slate-400">
                  Tokens consumed: <strong className="text-emerald-400">42 tokens</strong>. Maximum efficiency, minimal budget spent.
                </p>
                <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
                  ✓ AI Coach: Precise error identification. The AI immediately provided the exact bcrypt comparison pattern needed.
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: PLACEMENT TRACKS (#placement-tracks) */}
      {/* ========================================================================= */}
      <section id="placement-tracks" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-[#1C193C] scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1838] border border-[#3C3877] text-[#C4BEEC] text-xs font-semibold mb-3">
            <Target className="w-3.5 h-3.5 text-[#A69BFF]" />
            <span>Placement Preparation & Assessment Tracks</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
            Company-Calibrated Assessment Tracks
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Tailored tracks built by analyzing actual campus hiring formats. Each track enforces strict time and token quotas.
          </p>
        </div>

        {/* 4 Company Assessment Tracks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              company: 'TCS NQT & Digital',
              badge: 'Service Leader',
              badgeColor: 'text-purple-300 bg-[#221A4B] border-[#3E2E88]',
              topics: 'Pointer errors, array boundaries, runtime exceptions',
              tokens: '800 token budget',
              time: '45 mins timed',
              icon: Building2,
            },
            {
              company: 'Infosys SP / DSE',
              badge: 'Specialist Track',
              badgeColor: 'text-cyan-300 bg-cyan-950 border-cyan-700',
              topics: 'REST API pagination, SQL tuning, HTTP 500 debugging',
              tokens: '1,200 token budget',
              time: '60 mins timed',
              icon: Building2,
            },
            {
              company: 'Wipro & Turbo Elite',
              badge: 'Elite Track',
              badgeColor: 'text-emerald-300 bg-emerald-950 border-emerald-700',
              topics: 'Environment setup, Docker containers, dependency lockfiles',
              tokens: '1,000 token budget',
              time: '40 mins timed',
              icon: Building2,
            },
            {
              company: 'Tier-1 Product / Startups',
              badge: 'FAANG & Unicorns',
              badgeColor: 'text-amber-300 bg-amber-950 border-amber-700',
              topics: 'Concurrency race conditions, microservices, auth security',
              tokens: '1,500 token budget',
              time: '75 mins timed',
              icon: Award,
            },
          ].map((track, idx) => {
            const Icon = track.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0D0B1E] border border-[#211E44] hover:border-[#5B48EE]/50 hover:bg-[#121026] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#171433] border border-[#2B2754] flex items-center justify-center text-[#A69BFF]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${track.badgeColor}`}>
                      {track.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">{track.company}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{track.topics}</p>

                  <div className="space-y-1.5 pt-3 border-t border-[#1C193C] text-[11px] text-slate-400 mb-6 font-mono">
                    <p className="flex items-center gap-1.5 text-amber-300">
                      <Coins className="w-3.5 h-3.5" />
                      <span>{track.tokens}</span>
                    </p>
                    <p className="flex items-center gap-1.5 text-purple-300">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{track.time}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleProtectedAction('/onboarding', `${track.company} Track`)}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#171433] hover:bg-[#5B48EE]/20 border border-[#292450] hover:border-[#5B48EE]/50 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Select Track</span>
                  <ArrowRight className="w-3.5 h-3.5 text-purple-300" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FINAL CTA SECTION */}
      {/* ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center border-t border-[#1C193C]">
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
          Ready to Train Like a Real Software Engineer?
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto mb-8">
          Sign in in seconds with Google, GitHub, Microsoft, or Email. Receive 15,000 free tokens and launch your
          first debugging workspace today.
        </p>

        <InteractiveHoverButton
          onClick={() => handleProtectedAction('/signup', 'New Account Registration')}
          className="px-9 py-4 text-base"
        >
          Create Free Learner Account
        </InteractiveHoverButton>
      </section>

      {/* Auth Prompt Modal (triggers when any button is clicked while unauthenticated) */}
      <AuthPromptModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        title={modalActionContext.title}
        subtitle={modalActionContext.subtitle}
      />
    </div>
  );
}
