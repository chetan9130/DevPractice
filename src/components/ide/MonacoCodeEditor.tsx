'use client';

import React, { useRef, useEffect, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { EditorSettings, SupportedLanguage } from '@/types/ide';
import { useTheme } from '@/context/ThemeContext';
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
  const { theme } = useTheme();
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  // Compute effective Monaco theme
  const getEffectiveTheme = (settingTheme: EditorSettings['theme'], currentGlobalTheme: string) => {
    if (settingTheme === 'auto') {
      return currentGlobalTheme === 'dark' ? 'devpractice-dark' : 'devpractice-light';
    }
    if (settingTheme === 'light') return 'vs';
    return settingTheme;
  };

  const effectiveTheme = getEffectiveTheme(settings.theme, theme);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // 1. Signature Dark Theme
    monaco.editor.defineTheme('devpractice-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '767394', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'C084FC', fontStyle: 'bold' },
        { token: 'string', foreground: '86EFAC' },
        { token: 'number', foreground: 'FDBA74' },
        { token: 'type', foreground: '93C5FD' },
        { token: 'function', foreground: 'A5B4FC' },
        { token: 'variable', foreground: 'E2E8F0' },
      ],
      colors: {
        'editor.background': '#0B0914',
        'editor.foreground': '#E2E8F0',
        'editor.lineHighlightBackground': '#18143240',
        'editor.lineHighlightBorder': '#7038F030',
        'editorLineNumber.foreground': '#544F75',
        'editorLineNumber.activeForeground': '#A78BFA',
        'editorIndentGuide.background': '#1E1A3D',
        'editorIndentGuide.activeBackground': '#7038F0',
        'editorCursor.foreground': '#8C60F3',
        'editor.selectionBackground': '#7038F045',
        'editor.inactiveSelectionBackground': '#7038F020',
      },
    });

    // 2. Signature Light Theme
    monaco.editor.defineTheme('devpractice-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '8E8A9C', fontStyle: 'italic' },
        { token: 'keyword', foreground: '7038F0', fontStyle: 'bold' },
        { token: 'string', foreground: '059669' },
        { token: 'number', foreground: 'D97706' },
        { token: 'type', foreground: '2563EB' },
        { token: 'function', foreground: '4F46E5' },
        { token: 'variable', foreground: '1E293B' },
      ],
      colors: {
        'editor.background': '#FFFFFF',
        'editor.foreground': '#1E293B',
        'editor.lineHighlightBackground': '#F8F5FE60',
        'editor.lineHighlightBorder': '#E9E2FA',
        'editorLineNumber.foreground': '#A19DAE',
        'editorLineNumber.activeForeground': '#7038F0',
        'editorIndentGuide.background': '#F0EBF8',
        'editorIndentGuide.activeBackground': '#8C60F3',
        'editorCursor.foreground': '#7038F0',
        'editor.selectionBackground': '#7038F025',
        'editor.inactiveSelectionBackground': '#7038F012',
      },
    });

    monaco.editor.setTheme(effectiveTheme);

    // Keyboard shortcut for Cmd+S / Ctrl+S save
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (onSave) {
        onSave();
      }
    });

    setIsEditorReady(true);
  };

  // Update theme dynamically if setting or site theme changes
  useEffect(() => {
    if (monacoRef.current && isEditorReady) {
      monacoRef.current.editor.setTheme(effectiveTheme);
    }
  }, [effectiveTheme, isEditorReady]);

  // Trigger format code helper & options update
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
    <div className="relative w-full h-full min-h-[300px] overflow-hidden bg-white dark:bg-[#0B0914] transition-colors duration-200">
      <Editor
        height="100%"
        width="100%"
        language={monacoLanguage}
        value={code}
        theme={effectiveTheme}
        onChange={onChange}
        onMount={handleEditorDidMount}
        loading={
          <div className="flex items-center justify-center h-full w-full bg-white dark:bg-[#0B0914] text-[#7038F0] dark:text-[#A78BFA] gap-2 text-xs">
            <Loader2 className="w-4 h-4 animate-spin text-[#7038F0]" />
            <span>Initializing Monaco Editor Engine...</span>
          </div>
        }
        options={{
          readOnly: isReadOnly,
          fontSize: settings.fontSize,
          tabSize: settings.tabSize,
          lineHeight: 22,
          renderLineHighlight: 'all',
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

