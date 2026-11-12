'use client';

import React, { useRef, useEffect, useState } from 'react';
import Editor, { OnMount, loader } from '@monaco-editor/react';
import { EditorSettings, SupportedLanguage } from '@/types/ide';
import { Loader2 } from 'lucide-react';

interface MonacoCodeEditorProps {
  code: string;
  language: SupportedLanguage | 'json' | 'markdown' | 'plaintext';
  settings: EditorSettings;
  onChange: (value: string | undefined) => void;
  onSave?: () => void;
  isReadOnly?: boolean;
}

// Map IDE language names to Monaco language identifiers
const LANGUAGE_MAP: Record<string, string> = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  java: 'java',
  c: 'c',
  cpp: 'cpp',
  json: 'json',
  markdown: 'markdown',
  plaintext: 'plaintext',
};

export default function MonacoCodeEditor({
  code,
  language,
  settings,
  onChange,
  onSave,
  isReadOnly = false,
}: MonacoCodeEditorProps) {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Define DevPractice signature dark theme
    monaco.editor.defineTheme('devpractice-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6C7086', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'CBA6F7', fontStyle: 'bold' },
        { token: 'string', foreground: 'A6E3A1' },
        { token: 'number', foreground: 'FAB387' },
        { token: 'type', foreground: '89B4FA' },
        { token: 'function', foreground: '89DCEB' },
        { token: 'variable', foreground: 'CDD6F4' },
      ],
      colors: {
        'editor.background': '#0A0818',
        'editor.foreground': '#CDD6F4',
        'editor.lineHighlightBackground': '#151230',
        'editorLineNumber.foreground': '#4B466E',
        'editorLineNumber.activeForeground': '#A69BFF',
        'editorIndentGuide.background': '#1B173B',
        'editorIndentGuide.activeBackground': '#5B48EE',
        'editorCursor.foreground': '#8E7CFF',
        'editor.selectionBackground': '#5B48EE40',
        'editor.inactiveSelectionBackground': '#5B48EE20',
      },
    });

    const activeTheme = settings.theme === 'devpractice-dark' ? 'devpractice-dark' : settings.theme;
    monaco.editor.setTheme(activeTheme);

    // Keyboard shortcut for Cmd+S / Ctrl+S save
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (onSave) {
        onSave();
      }
    });

    setIsEditorReady(true);
  };

  // Update theme dynamically if setting changes
  useEffect(() => {
    if (monacoRef.current) {
      const activeTheme = settings.theme === 'devpractice-dark' ? 'devpractice-dark' : settings.theme;
      monacoRef.current.editor.setTheme(activeTheme);
    }
  }, [settings.theme]);

  // Trigger format code helper
  useEffect(() => {
    if (editorRef.current && isEditorReady) {
      editorRef.current.updateOptions({
        fontSize: settings.fontSize,
        tabSize: settings.tabSize,
        minimap: { enabled: settings.minimap },
        wordWrap: settings.wordWrap,
        lineNumbers: settings.lineNumbers,
      });
    }
  }, [settings, isEditorReady]);

  const monacoLanguage = LANGUAGE_MAP[language] || 'plaintext';

  return (
    <div className="relative w-full h-full min-h-[300px] overflow-hidden bg-[#0A0818]">
      <Editor
        height="100%"
        width="100%"
        language={monacoLanguage}
        value={code}
        theme={settings.theme === 'devpractice-dark' ? 'devpractice-dark' : settings.theme}
        onChange={onChange}
        onMount={handleEditorDidMount}
        loading={
          <div className="flex items-center justify-center h-full w-full bg-[#0A0818] text-[#A69BFF] gap-2 text-xs">
            <Loader2 className="w-4 h-4 animate-spin text-[#5B48EE]" />
            <span>Initializing Monaco Editor Engine...</span>
          </div>
        }
        options={{
          readOnly: isReadOnly,
          fontSize: settings.fontSize,
          tabSize: settings.tabSize,
          minimap: { enabled: settings.minimap, scale: 1 },
          wordWrap: settings.wordWrap,
          lineNumbers: settings.lineNumbers,
          autoIndent: 'full',
          formatOnPaste: true,
          formatOnType: true,
          bracketPairColorization: { enabled: true },
          guides: { bracketPairs: true, indentation: true },
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          renderWhitespace: 'selection',
          scrollBeyondLastLine: false,
          fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace",
          fontLigatures: true,
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
        }}
      />
    </div>
  );
}

