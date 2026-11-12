export type SupportedLanguage = 'javascript' | 'typescript' | 'python' | 'java' | 'c' | 'cpp';

export interface IDEFile {
  id: string;
  name: string;
  path: string;
  content: string;
  language: SupportedLanguage | 'json' | 'markdown' | 'plaintext';
  isDirty?: boolean;
  isReadOnly?: boolean;
}

export interface IDEFolder {
  id: string;
  name: string;
  path: string;
  children: (IDEFile | IDEFolder)[];
  isOpen?: boolean;
}

export interface EditorSettings {
  fontSize: number;
  tabSize: number;
  minimap: boolean;
  wordWrap: 'on' | 'off';
  lineNumbers: 'on' | 'off';
  theme: 'devpractice-dark' | 'vs-dark' | 'light';
  autoIndent: boolean;
  formatOnSave: boolean;
}

export interface TestCase {
  id: string;
  name: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
  description?: string;
}

export interface TestResult {
  testCaseId: string;
  name: string;
  status: 'passed' | 'failed' | 'error';
  actualOutput?: string;
  expectedOutput: string;
  executionTimeMs?: number;
  memoryKb?: number;
  errorMessage?: string;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTimeMs: number;
  memoryKb?: number;
  compilationError?: string;
  runtimeError?: string;
  testResults?: TestResult[];
}

export type AIPolicyMode = 'learning' | 'guided' | 'strict';

export interface AIAssistantMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedDiff?: {
    fileId: string;
    filePath: string;
    originalContent: string;
    modifiedContent: string;
    description: string;
  };
}

export interface Challenge {
  id: string;
  title: string;
  mode: 'debugging' | 'rescue' | 'feature' | 'interview';
  language: SupportedLanguage;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: string;
  description: string;
  instructions: string[];
  initialFiles: IDEFile[];
  testCases: TestCase[];
  solutionHints: string[];
}

