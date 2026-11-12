import { EditorSettings, IDEFile } from '@/types/ide';

const DEFAULT_SETTINGS: EditorSettings = {
  fontSize: 14,
  tabSize: 2,
  minimap: true,
  wordWrap: 'on',
  lineNumbers: 'on',
  theme: 'devpractice-dark',
  autoIndent: true,
  formatOnSave: true,
};

function getStorageKey(userId: string | undefined, suffix: string): string {
  const userPrefix = userId ? `user_${userId}` : 'anonymous';
  return `devpractice_ide_${userPrefix}_${suffix}`;
}

export const ideStorage = {
  getSettings(userId?: string): EditorSettings {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    try {
      const raw = localStorage.getItem(getStorageKey(userId, 'settings'));
      if (!raw) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: EditorSettings, userId?: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(getStorageKey(userId, 'settings'), JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save IDE settings to localStorage', e);
    }
  },

  getChallengeFiles(challengeId: string, userId?: string): IDEFile[] | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(getStorageKey(userId, `files_${challengeId}`));
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  saveChallengeFiles(challengeId: string, files: IDEFile[], userId?: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(getStorageKey(userId, `files_${challengeId}`), JSON.stringify(files));
    } catch (e) {
      console.warn('Failed to persist challenge files to localStorage', e);
    }
  },

  getChallengeProgress(userId?: string): Record<string, { completed: boolean; score: number; lastSaved: string }> {
    if (typeof window === 'undefined') return {};
    try {
      const raw = localStorage.getItem(getStorageKey(userId, 'progress'));
      if (!raw) return {};
      return JSON.parse(raw);
    } catch {
      return {};
    }
  },

  saveChallengeProgress(
    challengeId: string,
    completed: boolean,
    score: number,
    userId?: string
  ): void {
    if (typeof window === 'undefined') return;
    try {
      const current = this.getChallengeProgress(userId);
      current[challengeId] = {
        completed,
        score,
        lastSaved: new Date().toISOString(),
      };
      localStorage.setItem(getStorageKey(userId, 'progress'), JSON.stringify(current));
    } catch (e) {
      console.warn('Failed to persist challenge progress', e);
    }
  },

  saveCodeVersion(challengeId: string, fileId: string, content: string, label: string, userId?: string) {
    if (typeof window === 'undefined') return;
    try {
      const key = getStorageKey(userId, `versions_${challengeId}_${fileId}`);
      const raw = localStorage.getItem(key);
      const list = raw ? JSON.parse(raw) : [];
      list.unshift({
        id: 'ver_' + Date.now(),
        label,
        content,
        timestamp: new Date().toISOString(),
      });
      // Keep last 15 versions
      localStorage.setItem(key, JSON.stringify(list.slice(0, 15)));
    } catch (e) {
      console.warn('Failed to persist code version', e);
    }
  },

  getCodeVersions(challengeId: string, fileId: string, userId?: string): Array<{ id: string; label: string; content: string; timestamp: string }> {
    if (typeof window === 'undefined') return [];
    try {
      const key = getStorageKey(userId, `versions_${challengeId}_${fileId}`);
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
};

