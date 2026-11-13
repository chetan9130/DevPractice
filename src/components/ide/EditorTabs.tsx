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
    <div className="flex items-center overflow-x-auto bg-[#F8F6FC] dark:bg-[#0B0918] border-b border-[#E4E0EC] dark:border-white/10 px-2 pt-1.5 gap-1 select-none transition-colors duration-200">
      {openFileIds.map((id) => {
        const file = fileMap.get(id);
        if (!file) return null;

        const isActive = id === activeFileId;

        return (
          <div
            key={id}
            onClick={() => onSelectTab(id)}
            className={`group flex items-center gap-2 px-3.5 py-2 rounded-t-xl cursor-pointer text-xs transition-all ${
              isActive
                ? 'bg-white dark:bg-[#14102A] text-[#353148] dark:text-white border-t-2 border-t-[#7038F0] border-x border-[#E4E0EC] dark:border-white/10 shadow-xs font-semibold'
                : 'text-[#8E8A9C] dark:text-slate-400 hover:text-[#353148] dark:hover:text-slate-200 hover:bg-white/70 dark:hover:bg-white/5 font-medium'
            }`}
          >
            <div className="flex items-center justify-center flex-shrink-0">
              {getFileIcon(file.name)}
            </div>
            <span className="truncate max-w-[140px]">{file.name}</span>

            {file.isDirty && (
              <span
                className="w-1.5 h-1.5 rounded-full bg-amber-500"
                title="Unsaved changes"
              />
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onCloseTab(id);
              }}
              className="p-0.5 rounded hover:bg-[#7038F0]/15 dark:hover:bg-[#2A225A] text-[#8E8A9C] dark:text-slate-400 hover:text-[#7038F0] dark:hover:text-white transition-colors ml-1"
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
          className="p-1.5 rounded-lg text-[#8E8A9C] dark:text-slate-400 hover:text-[#353148] dark:hover:text-white hover:bg-[#EDE8F5] dark:hover:bg-[#191536] transition-colors ml-1 mb-1"
          title="New File"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
