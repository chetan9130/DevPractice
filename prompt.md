# DevPractice – Monaco Editor IDE Integration

## Project Objective

Upgrade the existing DevPractice platform by replacing its simulated coding editor with a fully functional browser-based IDE powered by Monaco Editor.

The goal is to create a professional developer learning environment inspired by VS Code, LeetCode and modern cloud IDE platforms.

## Phase 1: Repository Analysis

Before making any changes:

1. Inspect the existing project structure.
2. Analyze the dashboard implementation.
3. Identify the current simulated code editor.
4. Inspect the existing file management, terminal, test runner and diff viewer.
5. Understand the existing AuthContext and dashboard state management.
6. Preserve all existing functionality.

Do not rewrite the entire application.

## Phase 2: Monaco Editor Integration

Install and configure:

- @monaco-editor/react
- monaco-editor

Requirements:

- Integrate Monaco Editor into the existing dashboard.
- Support JavaScript, TypeScript, Python, Java, C and C++ language modes.
- Enable syntax highlighting.
- Enable autocomplete and IntelliSense where language services are available.
- Enable line numbers.
- Enable bracket matching.
- Enable code folding.
- Enable minimap.
- Enable automatic indentation.
- Enable formatting.
- Support dark theme.
- Support editor resizing.
- Add configurable font size and tab size.
- Ensure compatibility with Next.js 15 App Router and React 19.
- Load the editor client-side to avoid SSR problems.

## Phase 3: File Explorer

Implement a real multi-file editor interface.

Features:

- Create files.
- Delete files.
- Rename files.
- Create folders.
- Open multiple files.
- Switch between editor tabs.
- Track unsaved changes.
- Save file contents.
- Maintain independent file contents.
- Add appropriate file icons.

## Phase 4: IDE Layout

Create a professional VS Code-inspired layout.

Layout:

1. Left sidebar: File explorer and challenge navigation.
2. Main area: Monaco Editor and editor tabs.
3. Bottom panel: Terminal, output, tests and problems.
4. Right sidebar: AI debugging assistant.
5. Top toolbar: Run, Submit, Save and editor settings.

Make the layout responsive and resizable.

## Phase 5: Code Execution

Build an execution service that supports:

- JavaScript execution.
- Python execution.
- Java compilation and execution.
- C compilation and execution.
- C++ compilation and execution.
- Standard input and output.
- Runtime errors.
- Compilation errors.
- Execution timeout.
- Test-case execution.

IMPORTANT: Do not execute untrusted code directly inside the Next.js server or the main application process.

Use an isolated execution environment such as Docker-based sandboxes or a secure code execution service.

## Phase 6: Test Runner

Integrate the existing challenge system with Monaco.

Features:

- Run sample test cases.
- Run hidden test cases securely on the server.
- Show passed and failed test cases.
- Display execution time.
- Display memory usage when available.
- Show detailed error messages.
- Calculate challenge completion status.

## Phase 7: AI Debugging Assistant

Connect Monaco Editor with the existing AI Assistant.

Features:

- Explain selected code.
- Find bugs.
- Suggest fixes.
- Generate unit tests.
- Explain runtime errors.
- Review code quality.
- Suggest optimized solutions.

Add three tutoring modes:

1. Learning Mode – Explain concepts and provide hints.
2. Guided Mode – Help users debug step by step.
3. Strict Mode – Avoid giving complete solutions.

Allow users to apply AI-generated code changes through a reviewable editor diff.

## Phase 8: Diff Viewer

Use Monaco's DiffEditor.

Features:

- Original versus modified code.
- AI-generated changes.
- Side-by-side comparison.
- Accept or reject suggested changes.
- Preserve previous code versions.

## Phase 9: Persistence

Integrate with the existing authentication and storage architecture.

Persist:

- User projects.
- File contents.
- Selected programming language.
- Editor preferences.
- Challenge progress.
- Submission history.
- Saved code versions.

Ensure users can resume their work after logging in again.

## Phase 10: Quality Assurance

Verify:

- No existing authentication functionality breaks.
- Dashboard navigation works.
- Monaco loads without hydration errors.
- Multiple files work independently.
- Editor tabs work correctly.
- File changes persist.
- Test runner works.
- AI assistant integration works.
- Responsive design works.
- No TypeScript or build errors.

## Design Direction

Maintain the existing DevPractice identity:

- Background: #090812.
- Professional dark developer interface.
- Linear and Supabase-inspired design.
- Subtle blue and purple accents.
- Minimal borders.
- Smooth Framer Motion transitions.
- Professional typography.
- Avoid excessive gradients and unnecessary animations.

## Important Development Rules

- Implement in phases.
- Inspect existing code before editing.
- Reuse existing components and logic.
- Do not create duplicate authentication or challenge systems.
- Do not replace working features unnecessarily.
- Do not use mock functionality where real functionality is required.
- Test every phase before moving to the next.
- Provide a completion report with changed files, installed packages, implemented features and remaining limitations.

Final goal: Transform DevPractice into a functional, professional browser-based developer training IDE powered by Monaco Editor.