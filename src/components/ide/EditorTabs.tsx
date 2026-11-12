'use client';

import React from 'react';
import { IDEFile } from '@/types/ide';
import { getFileIcon } from './FileExplorer';
import { X, Plus } from 'lucide-react';

interface EditorTabsProps {
  openFileIds: string[];
  activeFileId: string;
  files: IDEFile[];
  onSelectTab: (fileId: string) => void;
  onCloseTab: (fileId: string) => void;
  onCreateNewTab?: () => void;
}

export default function EditorTabs({
  openFileIds,
  activeFileId,
  files,
  onSelectTab,
  onCloseTab,
  onCreateNewTab,
}: EditorTabsProps) {
  const fileMap = new Map(files.map((f) => [f.id, f]));

  return (
    <div className="flex items-center overflow-x-auto bg-[#0D0B1E] border-b border-[#1E1A3A] px-2 pt-1.5 gap-1 select-none">
      {openFileIds.map((id) => {
        const file = fileMap.get(id);
        if (!file) return null;

        const isActive = id === activeFileId;

        return (
          <div
            key={id}
            onClick={() => onSelectTab(id)}
            className={`group flex items-center gap-2 px-3.5 py-2 rounded-t-xl cursor-pointer text-xs font-medium transition-all ${
              isActive
                ? 'bg-[#171332] text-white border-t border-x border-[#352B73] shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#120F26]'
            }`}
          >
            <div className="flex items-center justify-center flex-shrink-0">
              {getFileIcon(file.name)}
            </div>
            <span className="truncate max-w-[140px]">{file.name}</span>

            {file.isDirty && (
              <span
                className="w-1.5 h-1.5 rounded-full bg-amber-400"
                title="Unsaved changes"
              />
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onCloseTab(id);
              }}
              className="p-0.5 rounded hover:bg-[#2A225A] text-slate-400 hover:text-white transition-colors ml-1"
              title="Close Tab"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}

      {/* '+' Add File Tab Button */}
      {onCreateNewTab && (
        <button
          onClick={onCreateNewTab}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#191536] transition-colors ml-1 mb-1"
          title="New File"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
