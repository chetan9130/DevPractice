'use client';

import React, { useState } from 'react';
import { Challenge, IDEFile, TestResult } from '@/types/ide';
import {
  Plus,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Folder,
  File,
  Check,
  X,
  Target,
  Sparkles,
  Star,
  Trash2,
  Edit2,
} from 'lucide-react';

interface FileExplorerProps {
  files: IDEFile[];
  activeFileId: string;
  challenge: Challenge;
  testResults?: TestResult[];
  onSelectFile: (fileId: string) => void;
  onCreateFile: (fileName: string) => void;
  onDeleteFile: (fileId: string) => void;
  onRenameFile: (fileId: string, newName: string) => void;
}

export function getFileIcon(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (fileName.toLowerCase() === 'readme.md') {
    return (
      <span className="w-4 h-4 rounded-full bg-blue-500/20 border border-blue-400/50 text-blue-400 flex items-center justify-center text-[9px] font-bold">
        i
      </span>
    );
  }
  switch (ext) {
    case 'js':
      return (
        <span className="px-1 py-0.2 rounded bg-[#F7DF1E] text-black font-extrabold text-[8px] leading-tight">
          JS
        </span>
      );
    case 'ts':
      return (
        <span className="px-1 py-0.2 rounded bg-[#3178C6] text-white font-extrabold text-[8px] leading-tight">
          TS
        </span>
      );
    case 'py':
      return (
        <span className="px-1 py-0.2 rounded bg-emerald-500 text-black font-extrabold text-[8px] leading-tight">
          PY
        </span>
      );
    case 'java':
      return (
        <span className="px-1 py-0.2 rounded bg-orange-500 text-white font-extrabold text-[8px] leading-tight">
          JV
        </span>
      );
    case 'c':
      return (
        <span className="px-1 py-0.2 rounded bg-blue-500 text-white font-extrabold text-[8px] leading-tight">
          C
        </span>
      );
    case 'cpp':
      return (
        <span className="px-1 py-0.2 rounded bg-purple-500 text-white font-extrabold text-[8px] leading-tight">
          C++
        </span>
      );
    case 'json':
      return <span className="text-amber-400 font-mono font-bold text-[11px]">&#123;&#125;</span>;
    case 'md':
      return (
        <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[9px] font-bold">
          i
        </span>
      );
    default:
      return <File className="w-3.5 h-3.5 text-slate-400" />;
  }
}

export default function FileExplorer({
  files,
  activeFileId,
  challenge,
  testResults = [],
  onSelectFile,
  onCreateFile,
  onDeleteFile,
  onRenameFile,
}: FileExplorerProps) {
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [editFileName, setEditFileName] = useState('');

  // Folder open states
  const [rootOpen, setRootOpen] = useState(true);
  const [srcOpen, setSrcOpen] = useState(true);
  const [testsOpen, setTestsOpen] = useState(true);

  const handleConfirmCreate = () => {
    if (newFileName.trim()) {
      onCreateFile(newFileName.trim());
      setIsCreatingFile(false);
      setNewFileName('');
    }
  };

  const handleStartRename = (file: IDEFile, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingFileId(file.id);
    setEditFileName(file.name);
  };

  const handleConfirmRename = () => {
    if (editingFileId && editFileName.trim()) {
      onRenameFile(editingFileId, editFileName.trim());
      setEditingFileId(null);
    }
  };

  // Categorize files into src/, tests/, and root files to match folder hierarchy
  const srcFiles = files.filter(
    (f) =>
      f.path.startsWith('src/') ||
      (!f.path.startsWith('tests/') &&
        !f.name.includes('test') &&
        f.name !== 'package.json' &&
        f.name.toLowerCase() !== 'readme.md')
  );
  const testFiles = files.filter(
    (f) => f.path.startsWith('tests/') || f.name.includes('test')
  );
  const rootFiles = files.filter(
    (f) => f.name === 'package.json' || f.name.toLowerCase() === 'readme.md'
  );

  const passedTests = testResults.filter((r) => r.status === 'passed').length;
  const totalTests = challenge.testCases.length || 3;
  const progressPercent = Math.round((passedTests / totalTests) * 100);

  const renderFileItem = (file: IDEFile, indentClass: string = 'pl-7') => {
    const isActive = file.id === activeFileId;
    const isEditing = file.id === editingFileId;

    return (
      <div
        key={file.id}
        onClick={() => onSelectFile(file.id)}
        className={`group flex items-center justify-between ${indentClass} pr-2.5 py-1.5 rounded-lg cursor-pointer transition-all ${
          isActive
            ? 'bg-[#7038F0]/10 dark:bg-[#7038F0]/25 text-[#7038F0] dark:text-white font-semibold shadow-xs border border-[#7038F0]/30 dark:border-[#8C60F3]/40'
            : 'text-[#353148] dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-[#F8F6FC] dark:hover:bg-[#15122E]'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-4 flex items-center justify-center flex-shrink-0">
            {getFileIcon(file.name)}
          </div>

          {isEditing ? (
            <input
              type="text"
              value={editFileName}
              onChange={(e) => setEditFileName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConfirmRename();
                if (e.key === 'Escape') setEditingFileId(null);
              }}
              onBlur={handleConfirmRename}
              autoFocus
              className="flex-1 bg-white dark:bg-[#0C0920] text-[#353148] dark:text-white text-xs px-1.5 py-0.5 rounded border border-[#7038F0] outline-none font-mono"
            />
          ) : (
            <span className="truncate text-[12px]">{file.name}</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {file.isDirty && !isEditing && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Unsaved changes" />
          )}
          <div className="hidden group-hover:flex items-center gap-0.5">
            <button
              onClick={(e) => handleStartRename(file, e)}
              className="p-0.5 rounded text-[#8E8A9C] dark:text-slate-400 hover:text-[#7038F0] dark:hover:text-white"
              title="Rename"
            >
              <Edit2 className="w-2.5 h-2.5" />
            </button>
            {files.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteFile(file.id);
                }}
                className="p-0.5 rounded text-[#8E8A9C] dark:text-slate-400 hover:text-rose-500"
                title="Delete"
              >
                <Trash2 className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full gap-2.5 select-none text-xs">
      {/* ================================================================= */}
      {/* TOP CARD: FILE EXPLORER                                           */}
      {/* ================================================================= */}
      <div className="flex-1 flex flex-col bg-white dark:bg-[#100D22] border border-[#E4E0EC] dark:border-white/10 rounded-2xl overflow-hidden min-h-0 shadow-xs transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[#E4E0EC] dark:border-white/10">
          <span className="font-bold text-[#353148] dark:text-slate-100 text-xs tracking-wide">File Explorer</span>
          <div className="flex items-center gap-1 text-[#8E8A9C] dark:text-slate-400">
            <button
              onClick={() => {
                setIsCreatingFile(true);
                setNewFileName('');
              }}
              className="p-1 rounded-lg hover:bg-[#F8F6FC] dark:hover:bg-[#1A1636] hover:text-[#7038F0] dark:hover:text-white transition-colors"
              title="New File"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              className="p-1 rounded-lg hover:bg-[#F8F6FC] dark:hover:bg-[#1A1636] hover:text-[#7038F0] dark:hover:text-white transition-colors"
              title="More Actions"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tree Content */}
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {isCreatingFile && (
            <div className="flex items-center gap-1 px-2 py-1 bg-[#F8F6FC] dark:bg-[#161233] rounded-lg border border-[#7038F0] mb-1">
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleConfirmCreate();
                  if (e.key === 'Escape') setIsCreatingFile(false);
                }}
                placeholder="newFile.js"
                autoFocus
                className="flex-1 bg-transparent border-none outline-none text-xs text-[#353148] dark:text-white placeholder-slate-400 font-mono"
              />
              <button onClick={handleConfirmCreate} className="text-emerald-500 p-0.5">
                <Check className="w-3 h-3" />
              </button>
              <button onClick={() => setIsCreatingFile(false)} className="text-rose-500 p-0.5">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Root Project Folder */}
          <button
            onClick={() => setRootOpen(!rootOpen)}
            className="w-full flex items-center gap-1.5 px-1.5 py-1 text-[#353148] dark:text-slate-200 hover:text-[#7038F0] dark:hover:text-white font-medium text-xs transition-colors"
          >
            {rootOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-[#8E8A9C] dark:text-slate-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-[#8E8A9C] dark:text-slate-400" />
            )}
            <Folder className="w-4 h-4 text-amber-500 fill-amber-500/80" />
            <span className="truncate">challenge-project</span>
          </button>

          {rootOpen && (
            <div className="space-y-0.5">
              {/* src folder */}
              <div>
                <button
                  onClick={() => setSrcOpen(!srcOpen)}
                  className="w-full flex items-center gap-1.5 pl-4 pr-2 py-1 text-[#353148] dark:text-slate-300 hover:text-[#7038F0] dark:hover:text-white text-xs transition-colors"
                >
                  {srcOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-[#8E8A9C] dark:text-slate-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-[#8E8A9C] dark:text-slate-400" />
                  )}
                  <Folder className="w-4 h-4 text-[#7038F0] dark:text-sky-400 fill-[#7038F0]/30 dark:fill-sky-400/80" />
                  <span>src</span>
                </button>
                {srcOpen && (
                  <div className="space-y-0.5 mt-0.5">
                    {srcFiles.map((file) => renderFileItem(file, 'pl-8'))}
                  </div>
                )}
              </div>

              {/* tests folder */}
              {testFiles.length > 0 && (
                <div>
                  <button
                    onClick={() => setTestsOpen(!testsOpen)}
                    className="w-full flex items-center gap-1.5 pl-4 pr-2 py-1 text-[#353148] dark:text-slate-300 hover:text-[#7038F0] dark:hover:text-white text-xs transition-colors"
                  >
                    {testsOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-[#8E8A9C] dark:text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-[#8E8A9C] dark:text-slate-400" />
                    )}
                    <Folder className="w-4 h-4 text-[#7038F0] dark:text-sky-400 fill-[#7038F0]/30 dark:fill-sky-400/80" />
                    <span>tests</span>
                  </button>
                  {testsOpen && (
                    <div className="space-y-0.5 mt-0.5">
                      {testFiles.map((file) => renderFileItem(file, 'pl-8'))}
                    </div>
                  )}
                </div>
              )}

              {/* Root-level config & docs */}
              {rootFiles.map((file) => renderFileItem(file, 'pl-5'))}
            </div>
          )}
        </div>
      </div>

      {/* ================================================================= */}
      {/* BOTTOM CARD: CHALLENGE DETAILS                                    */}
      {/* ================================================================= */}
      <div className="bg-white dark:bg-[#100D22] border border-[#E4E0EC] dark:border-white/10 rounded-2xl p-3.5 flex flex-col justify-between flex-shrink-0 shadow-xs transition-colors duration-200">
        <div>
          {/* Card Header */}
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-5 h-5 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500">
              <Target className="w-3 h-3" />
            </div>
            <span className="font-bold text-[#353148] dark:text-slate-100 text-xs">Challenge Details</span>
          </div>

          {/* Difficulty Row */}
          <div className="flex items-center justify-between mb-2.5 text-[11px]">
            <span className="flex items-center gap-1.5 text-[#8E8A9C] dark:text-slate-400">
              <Sparkles className="w-3 h-3 text-[#7038F0] dark:text-indigo-400" />
              <span>Difficulty</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/15 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700/50 font-semibold text-[11px]">
              {challenge.difficulty}
            </span>
          </div>

          {/* Challenge Title & Description */}
          <h3 className="text-sm font-bold text-[#353148] dark:text-white mb-1.5 leading-snug">
            {challenge.title}
          </h3>
          <p className="text-[11px] text-[#8E8A9C] dark:text-slate-300 leading-relaxed mb-3">
            {challenge.description}
          </p>

          {/* Requirements Checklist */}
          <div className="mb-3">
            <p className="text-[11px] font-bold text-[#353148] dark:text-slate-200 mb-1.5">Requirements:</p>
            <div className="space-y-1">
              {challenge.instructions.map((req, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-[11px] text-[#353148] dark:text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="leading-tight">{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rewards */}
          <div className="mb-3">
            <p className="text-[11px] font-bold text-[#353148] dark:text-slate-200 mb-1.5">Rewards:</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-[11px] font-semibold text-[#7038F0] dark:text-purple-300">
                <Star className="w-3.5 h-3.5 text-[#7038F0] dark:text-purple-400 fill-[#7038F0] dark:fill-purple-400" />
                <span>+200 XP</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-sky-600 dark:text-sky-300">
                <span className="w-4 h-4 rounded-full bg-sky-500/15 border border-sky-400/40 text-sky-600 dark:text-sky-300 flex items-center justify-center text-[9px] font-bold">
                  $
                </span>
                <span>+500 Tokens</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Progress Bar */}
        <div className="pt-2 border-t border-[#E4E0EC] dark:border-white/10">
          <div className="w-full h-1.5 bg-[#EDE8F5] dark:bg-[#191534] rounded-full overflow-hidden mb-1.5">
            <div
              className="h-full bg-gradient-to-r from-[#7038F0] to-emerald-400 transition-all duration-300"
              style={{ width: `${Math.max(progressPercent, 8)}%` }}
            />
          </div>
          <div className="text-right text-[10px] text-[#8E8A9C] dark:text-slate-400 font-medium">
            {passedTests} / {totalTests} Tests Passed
          </div>
        </div>
      </div>
    </div>
  );
}
