'use client';

import React, { useState } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { EditorSettings, SupportedLanguage } from '@/types/ide';
import { useTheme } from '@/context/ThemeContext';
import { Check, X, SplitSquareVertical, Columns2, Sparkles, Loader2 } from 'lucide-react';

interface MonacoDiffViewerProps {
  originalCode: string;
  modifiedCode: string;
  language: SupportedLanguage | 'json' | 'markdown' | 'plaintext';
  settings: EditorSettings;
  fileName: string;
  diffDescription?: string;
  onAccept: (newCode: string) => void;
  onReject: () => void;
}

export default function MonacoDiffViewer({
  originalCode,
  modifiedCode,
  language,
  settings,
  fileName,
  diffDescription,
  onAccept,
  onReject,
}: MonacoDiffViewerProps) {
  const { theme } = useTheme();
  const [inlineView, setInlineView] = useState(false);

  const effectiveTheme =
    settings.theme === 'auto'
      ? theme === 'dark'
        ? 'devpractice-dark'
        : 'devpractice-light'
      : settings.theme === 'light'
      ? 'vs'
      : settings.theme;

  return (
    <div className="flex flex-col h-full w-full bg-[#FAFAFE] dark:bg-[#0A0818] border border-[#E4E0EC] dark:border-[#2D2568] rounded-xl overflow-hidden shadow-xl transition-colors duration-200">
      {/* Diff Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white dark:bg-[#0F0D24] border-b border-[#E4E0EC] dark:border-[#241E4E] text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#7038F0]/15 flex items-center justify-center text-[#7038F0] dark:text-[#A69BFF]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-[#353148] dark:text-white">Review Diff: {fileName}</span>
            {diffDescription && (
              <span className="ml-2 text-[#8E8A9C] dark:text-slate-400 text-[11px] font-normal">
                ({diffDescription})
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Inline vs Side-by-side */}
          <button
            onClick={() => setInlineView(!inlineView)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F8F6FC] dark:bg-[#181438] hover:bg-[#EDE8F5] dark:hover:bg-[#231E50] text-[#7038F0] dark:text-[#A69BFF] hover:text-[#5820D0] dark:hover:text-white transition-colors border border-[#E4E0EC] dark:border-[#2D2568]"
            title={inlineView ? 'Switch to Side-by-Side view' : 'Switch to Inline Diff view'}
          >
            {inlineView ? (
              <>
                <Columns2 className="w-3 h-3" />
                <span className="text-[11px]">Side-by-Side</span>
              </>
            ) : (
              <>
                <SplitSquareVertical className="w-3 h-3" />
                <span className="text-[11px]">Inline</span>
              </>
            )}
          </button>

          {/* Reject */}
          <button
            onClick={onReject}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30 transition-colors text-[11px] font-semibold"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reject</span>
          </button>

          {/* Accept */}
          <button
            onClick={() => onAccept(modifiedCode)}
            className="flex items-center gap-1 px-3.5 py-1 rounded-lg bg-gradient-to-r from-[#7038F0] to-[#8C60F3] hover:brightness-110 text-white shadow-md shadow-[#7038F0]/30 transition-all text-[11px] font-bold"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Changes</span>
          </button>
        </div>
      </div>

      {/* Monaco DiffEditor */}
      <div className="flex-1 w-full h-full min-h-[350px]">
        <DiffEditor
          height="100%"
          width="100%"
          language={language}
          original={originalCode}
          modified={modifiedCode}
          theme={effectiveTheme}
          loading={
            <div className="flex items-center justify-center h-full w-full bg-[#FAFAFE] dark:bg-[#0A0818] text-[#7038F0] dark:text-[#A69BFF] gap-2 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-[#7038F0]" />
              <span>Loading Monaco Diff Engine...</span>
            </div>
          }
          options={{
            readOnly: true,
            renderSideBySide: !inlineView,
            fontSize: settings.fontSize,
            lineNumbers: settings.lineNumbers,
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace",
          }}
        />
      </div>
    </div>
  );
}

