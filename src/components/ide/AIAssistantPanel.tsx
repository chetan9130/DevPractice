'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  AIAssistantMessage,
  AIPolicyMode,
  IDEFile,
  SupportedLanguage,
  ExecutionResult,
} from '@/types/ide';
import {
  Sparkles,
  Send,
  User,
  GraduationCap,
  Compass,
  Lock,
  Copy,
  Check,
  CheckSquare,
  Minus,
  X,
  HelpCircle,
  Target,
  Loader2,
  SplitSquareVertical,
  RefreshCw,
} from 'lucide-react';

interface AIAssistantPanelProps {
  activeFile: IDEFile | null;
  language: SupportedLanguage;
  executionResult: ExecutionResult | null;
  onApplyCodeDirectly?: (newCode: string) => void;
  onOpenDiff: (diff: {
    fileId: string;
    filePath: string;
    originalContent: string;
    modifiedContent: string;
    description: string;
  }) => void;
}

const DEFAULT_SUGGESTED_SNIPPET = `const user = validateUser(email, password);
if (!user) {
  return res.status(401).json({
    error: 'Invalid credentials'
  });
}
return res.status(200).json({ user });`;

export default function AIAssistantPanel({
  activeFile,
  language,
  executionResult,
  onApplyCodeDirectly,
  onOpenDiff,
}: AIAssistantPanelProps) {
  const [policyMode, setPolicyMode] = useState<AIPolicyMode>('learning');
  const [inputQuery, setInputQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<AIAssistantMessage[]>([
    {
      id: 'user-init',
      sender: 'user',
      content: 'Why is this API returning 500 error?',
      timestamp: 'Just now',
    },
    {
      id: 'ai-init',
      sender: 'assistant',
      content:
        'The 500 error is likely because the validateUser() function is not returning a proper user object or throwing an error. Let\'s check the function and add proper error handling.',
      timestamp: 'Just now',
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(DEFAULT_SUGGESTED_SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const buildFixedFileContent = (file: IDEFile): string => {
    if (file.content.includes('// TODO: Fix the bug here')) {
      return file.content.replace(
        '  const user = validateUser(email, password);\n  // TODO: Fix the bug here',
        `  const user = validateUser(email, password);\n  if (!user) {\n    return res.status(401).json({\n      error: 'Invalid credentials'\n    });\n  }\n\n  return res.status(200).json({ status: 200, user });`
      );
    }
    return file.content + '\n' + DEFAULT_SUGGESTED_SNIPPET;
  };

  const handleApplySuggestion = () => {
    if (!activeFile) return;
    const updatedContent = buildFixedFileContent(activeFile);

    if (onApplyCodeDirectly) {
      onApplyCodeDirectly(updatedContent);
      setAppliedSuccess(true);
      setTimeout(() => setAppliedSuccess(false), 2000);
    } else {
      onOpenDiff({
        fileId: activeFile.id,
        filePath: activeFile.path,
        originalContent: activeFile.content,
        modifiedContent: updatedContent,
        description: 'Add 401 & 200 response handlers after validateUser()',
      });
    }
  };

  const handleOpenDiffPreview = () => {
    if (!activeFile) return;
    const updatedContent = buildFixedFileContent(activeFile);
    onOpenDiff({
      fileId: activeFile.id,
      filePath: activeFile.path,
      originalContent: activeFile.content,
      modifiedContent: updatedContent,
      description: 'AI Suggested Fix for Login API',
    });
  };

  const handleActionPrompt = (
    actionType: 'explain' | 'find_bugs' | 'improve' | 'custom',
    customText?: string
  ) => {
    const promptText =
      customText ||
      (actionType === 'explain'
        ? 'Explain how this file works'
        : actionType === 'find_bugs'
        ? 'Find bugs in my current implementation'
        : 'How can I improve and optimize this code?');

    const userMsg: AIAssistantMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      content: promptText,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsGenerating(true);

    setTimeout(() => {
      let reply = '';
      if (policyMode === 'strict') {
        reply =
          '[Strict Mode Active] Direct code solutions are hidden. Hint: Check what happens after `validateUser(email, password)` is called on line 15 — does the route ever send a response back to the client?';
      } else if (actionType === 'explain') {
        reply = `In \`${activeFile?.name || 'app.js'}\`, the POST \`/api/login\` endpoint validates that \`email\` and \`password\` exist, then calls \`validateUser()\`. However, it never sends an HTTP 200 or 401 response back.`;
      } else if (actionType === 'find_bugs') {
        reply =
          'Bug detected on line 15: `validateUser(email, password)` is called, but its return value `user` is not checked. If `user` is null, return HTTP 401; otherwise return HTTP 200.';
      } else {
        reply =
          'Check the Suggested Fix card below! Adding a null check for `!user` with a 401 status and returning 200 for valid users will resolve the bug and pass all 3 tests.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-' + (Date.now() + 1),
          sender: 'assistant',
          content: reply,
          timestamp: 'Just now',
        },
      ]);
      setIsGenerating(false);
    }, 650);
  };

  if (isMinimized) {
    return (
      <div className="w-12 bg-white dark:bg-[#100D22] border border-[#E4E0EC] dark:border-white/10 rounded-2xl flex flex-col items-center py-4 select-none shadow-xs transition-colors duration-200">
        <button
          onClick={() => setIsMinimized(false)}
          className="p-2 rounded-xl bg-[#7038F0]/15 text-[#7038F0] dark:text-[#A78BFA] hover:text-[#5820D0] dark:hover:text-white"
          title="Expand AI Assistant"
        >
          <Sparkles className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-80 xl:w-[340px] bg-white dark:bg-[#100D22] border border-[#E4E0EC] dark:border-white/10 rounded-2xl flex flex-col h-full select-none text-xs overflow-hidden flex-shrink-0 shadow-xs transition-colors duration-200">
      {/* ================================================================= */}
      {/* HEADER: AI Assistant Beta                                         */}
      {/* ================================================================= */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E4E0EC] dark:border-white/10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#7038F0] dark:text-[#A78BFA]" />
          <span className="font-bold text-[#353148] dark:text-white text-sm">AI Assistant</span>
          <span className="px-1.5 py-0.5 rounded bg-[#7038F0]/15 text-[#7038F0] dark:text-[#A78BFA] border border-[#7038F0]/30 font-bold text-[10px]">
            Beta
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[#8E8A9C] dark:text-slate-400">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 rounded hover:bg-[#F8F6FC] dark:hover:bg-[#191536] hover:text-[#353148] dark:hover:text-white transition-colors"
            title="Minimize"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 rounded hover:bg-[#F8F6FC] dark:hover:bg-[#191536] hover:text-[#353148] dark:hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ================================================================= */}
      {/* POLICY MODE PILLS: Learning | Guided | Strict                     */}
      {/* ================================================================= */}
      <div className="grid grid-cols-3 gap-1.5 px-3.5 py-2.5 border-b border-[#E4E0EC] dark:border-white/10 bg-[#F8F6FC]/60 dark:bg-black/10">
        <button
          onClick={() => setPolicyMode('learning')}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl font-semibold text-xs transition-all ${
            policyMode === 'learning'
              ? 'bg-gradient-to-r from-[#7038F0] to-[#8C60F3] text-white shadow-md shadow-[#7038F0]/25'
              : 'bg-white dark:bg-[#15122E] text-[#8E8A9C] dark:text-slate-300 hover:text-[#353148] dark:hover:text-white border border-[#E4E0EC] dark:border-[#25204B]'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Learning</span>
        </button>

        <button
          onClick={() => setPolicyMode('guided')}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl font-semibold text-xs transition-all ${
            policyMode === 'guided'
              ? 'bg-gradient-to-r from-[#7038F0] to-[#8C60F3] text-white shadow-md shadow-[#7038F0]/25'
              : 'bg-white dark:bg-[#15122E] text-[#8E8A9C] dark:text-slate-300 hover:text-[#353148] dark:hover:text-white border border-[#E4E0EC] dark:border-[#25204B]'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Guided</span>
        </button>

        <button
          onClick={() => setPolicyMode('strict')}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl font-semibold text-xs transition-all ${
            policyMode === 'strict'
              ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-md shadow-rose-500/25'
              : 'bg-white dark:bg-[#15122E] text-[#8E8A9C] dark:text-slate-300 hover:text-[#353148] dark:hover:text-white border border-[#E4E0EC] dark:border-[#25204B]'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Strict</span>
        </button>
      </div>

      {/* ================================================================= */}
      {/* CONVERSATION & SUGGESTED FIX CARD                                 */}
      {/* ================================================================= */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.sender === 'user' ? (
              <div className="flex justify-end">
                <div className="flex items-center gap-2 bg-gradient-to-r from-[#7038F0] to-[#8C60F3] text-white px-3.5 py-2 rounded-2xl rounded-tr-xs max-w-[90%] shadow-xs">
                  <User className="w-3.5 h-3.5 text-white/90 flex-shrink-0" />
                  <span className="text-xs">{msg.content}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7038F0] to-sky-400 p-0.5 flex-shrink-0 mt-0.5 shadow-md shadow-[#7038F0]/20">
                  <div className="w-full h-full rounded-full bg-white dark:bg-[#0D0B1E] flex items-center justify-center">
                    <RefreshCw className="w-3.5 h-3.5 text-[#7038F0] dark:text-sky-400" />
                  </div>
                </div>
                <div className="bg-[#F8F6FC] dark:bg-[#15122E] border border-[#E4E0EC] dark:border-[#25204B] text-[#353148] dark:text-slate-200 p-3 rounded-2xl rounded-tl-xs text-xs leading-relaxed flex-1">
                  {msg.content}
                </div>
              </div>
            )}
          </div>
        ))}

        {isGenerating && (
          <div className="flex items-center gap-2 text-[#8E8A9C] dark:text-slate-400 text-xs pl-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7038F0] dark:text-[#A69BFF]" />
            <span>Analyzing AST & execution context...</span>
          </div>
        )}

        {/* Suggested Fix Box (Hidden in Strict mode) */}
        {policyMode !== 'strict' && (
          <div className="pt-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                <CheckSquare className="w-4 h-4 text-emerald-500" />
                <span>Suggested Fix:</span>
              </div>
              <button
                onClick={handleOpenDiffPreview}
                className="text-[10px] text-[#7038F0] dark:text-[#A69BFF] hover:underline flex items-center gap-1 font-semibold"
              >
                <SplitSquareVertical className="w-3 h-3" />
                <span>View Diff</span>
              </button>
            </div>

            <div className="bg-[#F5F2FA] dark:bg-[#0B0918] border border-[#E4E0EC] dark:border-[#2B2352] rounded-xl overflow-hidden mb-2.5 shadow-xs">
              <div className="flex items-center justify-between px-2.5 py-1.5 bg-[#EDE7F6] dark:bg-[#120F26] border-b border-[#E4E0EC] dark:border-[#221C42]">
                <span className="text-[10px] font-mono font-semibold text-[#7038F0] dark:text-[#A69BFF]">fix.js</span>
                <button
                  onClick={handleCopySnippet}
                  className="flex items-center gap-1 text-[10px] text-[#555068] dark:text-slate-300 hover:text-[#25213B] dark:hover:text-white bg-white dark:bg-[#201A42] px-2 py-0.5 rounded border border-[#DDD8E8] dark:border-[#382F6A] shadow-2xs transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-2.5 h-2.5 text-emerald-500 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-300 font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-2.5 h-2.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-3 font-mono text-[11px] leading-relaxed overflow-x-auto text-[#28243D] dark:text-slate-200">
                <code>
                  <span className="text-blue-600 dark:text-sky-400">const</span> user ={' '}
                  <span className="text-amber-700 dark:text-amber-300">validateUser</span>(email, password);{'\n'}
                  <span className="text-purple-600 dark:text-purple-400">if</span> (!user) &#123;{'\n'}
                  {'  '}
                  <span className="text-purple-600 dark:text-purple-400">return</span> res.
                  <span className="text-amber-700 dark:text-amber-300">status</span>(
                  <span className="text-emerald-700 dark:text-emerald-300">401</span>).
                  <span className="text-amber-700 dark:text-amber-300">json</span>(&#123;{'\n'}
                  {'    '}error: <span className="text-rose-600 dark:text-rose-300">&apos;Invalid credentials&apos;</span>
                  {'\n'}
                  {'  '}&#125;);{'\n'}
                  &#125;
                </code>
              </pre>
            </div>

            {/* Apply Suggestion Button */}
            <button
              onClick={handleApplySuggestion}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#7038F0] to-[#8C60F3] hover:brightness-110 text-white font-bold text-xs shadow-md shadow-[#7038F0]/30 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              {appliedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Suggestion Applied to Editor!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Apply Suggestion</span>
                </>
              )}
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ================================================================= */}
      {/* BOTTOM INPUT & QUICK ACTION PILLS                                 */}
      {/* ================================================================= */}
      <div className="p-3 bg-[#F8F6FC] dark:bg-[#0A0818] border-t border-[#E4E0EC] dark:border-white/10 space-y-2.5">
        <div className="flex items-center gap-2 bg-white dark:bg-[#14102E] border border-[#E4E0EC] dark:border-[#292254] rounded-xl pl-3 pr-1.5 py-1.5 shadow-2xs">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputQuery.trim()) {
                handleActionPrompt('custom', inputQuery.trim());
              }
            }}
            placeholder="Ask anything about your code..."
            className="flex-1 bg-transparent border-none outline-none text-xs text-[#353148] dark:text-white placeholder-[#8E8A9C]"
          />
          <button
            onClick={() => {
              if (inputQuery.trim()) handleActionPrompt('custom', inputQuery.trim());
            }}
            className="w-7 h-7 rounded-lg bg-gradient-to-r from-[#7038F0] to-[#8C60F3] hover:brightness-110 text-white flex items-center justify-center shadow-xs transition-all"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom 3 Action Links */}
        <div className="flex items-center justify-between px-1 text-[11px] text-[#8E8A9C] dark:text-slate-400">
          <button
            onClick={() => handleActionPrompt('explain')}
            className="flex items-center gap-1 hover:text-[#7038F0] dark:hover:text-white transition-colors"
          >
            <HelpCircle className="w-3 h-3 text-[#7038F0] dark:text-[#A69BFF]" />
            <span>Explain Code</span>
          </button>

          <button
            onClick={() => handleActionPrompt('find_bugs')}
            className="flex items-center gap-1 hover:text-[#7038F0] dark:hover:text-white transition-colors"
          >
            <Target className="w-3 h-3 text-[#7038F0] dark:text-[#A69BFF]" />
            <span>Find Bugs</span>
          </button>

          <button
            onClick={() => handleActionPrompt('improve')}
            className="flex items-center gap-1 hover:text-[#7038F0] dark:hover:text-white transition-colors"
          >
            <Sparkles className="w-3 h-3 text-[#7038F0] dark:text-[#A69BFF]" />
            <span>Improve Code</span>
          </button>
        </div>
      </div>
    </div>
  );
}
