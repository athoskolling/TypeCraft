import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import {
  ArrowLeft,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Terminal,
  Cpu,
  FlaskConical,
  Lightbulb,
  Lock,
  FileCode2,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { ensureMonacoConfigured, syncWorkspaceModels } from './monacoConfig';
import { MarkdownView } from './MarkdownView';
import { sandboxClient } from '../engine/workerClient';
import { formatValueCompact } from '../engine/layer3LogicAnalyzer';
import {
  findNextTargetAfterChallenge,
  type WorkspaceTarget,
} from '../curriculum';
import type { Section } from '../types/curriculum';
import type { EvaluationResponse, PlaygroundResponse } from '../types/engine';
import type { ThemeMode, UserProgressState } from '../state/progressStore';

ensureMonacoConfigured();

interface WorkspaceViewProps {
  target: WorkspaceTarget;
  sections: Section[];
  theme: ThemeMode;
  progress: UserProgressState;
  onBackToPath: () => void;
  onSelectTarget: (target: WorkspaceTarget) => void;
  onSaveFiles: (itemId: string, files: Record<string, string>) => void;
  onMarkChallengeSolved: (challengeId: string) => void;
  onMarkMiniProjectSolved: (miniProjectId: string) => void;
  onMarkExamPassed: (section: Section) => void;
  onOpenPalette: () => void;
  registerWorkspaceActions: (actions: {
    runTests: () => void;
    resetCode: () => void;
  } | null) => void;
}

type DockTab = 'diagnostics' | 'console' | 'playground';

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({
  target,
  sections,
  theme,
  progress,
  onBackToPath,
  onSelectTarget,
  onSaveFiles,
  onMarkChallengeSolved,
  onMarkMiniProjectSolved,
  onMarkExamPassed,
  onOpenPalette,
  registerWorkspaceActions,
}) => {
  // Exam task state when target.kind === 'exam'
  const [examTaskIdx, setExamTaskIdx] = useState(0);
  const [examPassedTaskIds, setExamPassedTaskIds] = useState<string[]>([]);

  useEffect(() => {
    setExamTaskIdx(0);
    setExamPassedTaskIds([]);
  }, [target]);

  const activeItem = useMemo(() => {
    if (target.kind === 'challenge') {
      const ch = target.challenge;
      return {
        itemId: ch.id,
        title: ch.title,
        breadcrumb: `S${target.section.number} · Phase ${target.phase.number} · Problem ${target.challengeIndex + 1}/4`,
        style: ch.style,
        difficulty: ch.difficulty,
        description: ch.description,
        extraNotes: target.phase.conceptSummary,
        tags: ch.tags,
        hints: ch.hints,
        hintsDisabled: false,
        entryFile: 'solution.ts',
        entryFunction: ch.entryFunction ?? 'solve',
        starterFiles: { 'solution.ts': ch.starterCode } as Record<string, string>,
        readOnlyMap: {} as Record<string, boolean>,
        typeAssertionPrelude: ch.typeAssertionPrelude,
        typeAssertions: ch.typeAssertions,
        testCases: ch.testCases,
        playgroundInput: ch.playgroundInput ?? '',
        astRules: ch.astRules,
      };
    }

    if (target.kind === 'mini-project') {
      const mp = target.miniProject;
      const starterFiles: Record<string, string> = {};
      const readOnlyMap: Record<string, boolean> = {};
      for (const f of mp.files) {
        starterFiles[f.path] = f.starterCode;
        if (f.readOnly) readOnlyMap[f.path] = true;
      }
      return {
        itemId: mp.id,
        title: mp.title,
        breadcrumb: `S${target.section.number} · 4-File Mini-Project${target.earlyAccess ? ' (Early Preview)' : ''}`,
        style: 'project' as const,
        difficulty: mp.difficulty,
        description: mp.description,
        extraNotes: mp.architectureNotes,
        tags: mp.tags,
        hints: mp.hints,
        hintsDisabled: false,
        entryFile: mp.entryFile,
        entryFunction: mp.entryFunction,
        starterFiles,
        readOnlyMap,
        typeAssertionPrelude: mp.typeAssertionPrelude,
        typeAssertions: mp.typeAssertions,
        testCases: mp.testCases,
        playgroundInput: mp.playgroundInput ?? '',
        astRules: mp.astRules,
      };
    }

    // Cumulative Exam
    const task = target.exam.tasks[examTaskIdx] ?? target.exam.tasks[0];
    return {
      itemId: task.id,
      title: task.title,
      breadcrumb: `S${target.section.number} Exam · Task ${examTaskIdx + 1}/${target.exam.tasks.length}`,
      style: task.style,
      difficulty: task.difficulty,
      description: task.description,
      extraNotes: target.exam.description,
      tags: task.tags,
      hints: [],
      hintsDisabled: true,
      entryFile: 'solution.ts',
      entryFunction: task.entryFunction ?? 'solve',
      starterFiles: { 'solution.ts': task.starterCode } as Record<string, string>,
      readOnlyMap: {} as Record<string, boolean>,
      typeAssertionPrelude: task.typeAssertionPrelude,
      typeAssertions: task.typeAssertions,
      testCases: task.testCases,
      playgroundInput: task.playgroundInput ?? '',
      astRules: task.astRules,
    };
  }, [target, examTaskIdx]);

  const [files, setFiles] = useState<Record<string, string>>(() => {
    const saved = progress.savedFilesByItemId[activeItem.itemId];
    return saved && Object.keys(saved).length > 0 ? { ...activeItem.starterFiles, ...saved } : activeItem.starterFiles;
  });

  const [activeFile, setActiveFile] = useState<string>(activeItem.entryFile);
  const [dockTab, setDockTab] = useState<DockTab>('diagnostics');
  const [isRunning, setIsRunning] = useState(false);
  const [evalResult, setEvalResult] = useState<EvaluationResponse | null>(null);
  const [playgroundInput, setPlaygroundInput] = useState<string>(activeItem.playgroundInput);
  const [playgroundResult, setPlaygroundResult] = useState<PlaygroundResponse | null>(null);
  const [revealedHints, setRevealedHints] = useState(0);

  // Resizable split state
  const [leftPanePct, setLeftPanePct] = useState(38);
  const [dockHeightPx, setDockHeightPx] = useState(250);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rightColRef = useRef<HTMLDivElement | null>(null);

  // Reload workspace state whenever activeItem.itemId changes
  useEffect(() => {
    const saved = progress.savedFilesByItemId[activeItem.itemId];
    const nextFiles =
      saved && Object.keys(saved).length > 0
        ? { ...activeItem.starterFiles, ...saved }
        : { ...activeItem.starterFiles };
    setFiles(nextFiles);
    const fileKeys = Object.keys(nextFiles);
    setActiveFile(nextFiles[activeItem.entryFile] !== undefined ? activeItem.entryFile : fileKeys[0]);
    setEvalResult(null);
    setPlaygroundInput(activeItem.playgroundInput);
    setPlaygroundResult(null);
    setRevealedHints(0);
    syncWorkspaceModels(nextFiles, activeItem.typeAssertionPrelude, activeItem.typeAssertions);
    // Intentionally reset only on item switch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItem.itemId]);

  useEffect(() => {
    syncWorkspaceModels(files, activeItem.typeAssertionPrelude, activeItem.typeAssertions);
  }, [files, activeItem.typeAssertionPrelude, activeItem.typeAssertions]);

  const handleCodeChange = (value: string | undefined) => {
    const updated = value ?? '';
    setFiles((prev) => {
      const next = { ...prev, [activeFile]: updated };
      onSaveFiles(activeItem.itemId, next);
      return next;
    });
  };

  const handleRunTests = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setDockTab('diagnostics');

    const reqId = `${activeItem.itemId}-${Date.now()}`;
    const res = await sandboxClient.evaluate({
      requestId: reqId,
      files,
      entryFile: activeItem.entryFile,
      entryFunction: activeItem.entryFunction,
      astRules: activeItem.astRules,
      typeAssertionPrelude: activeItem.typeAssertionPrelude,
      typeAssertions: activeItem.typeAssertions,
      testCases: activeItem.testCases,
      timeoutMs: 4500,
    });

    setEvalResult(res);
    setIsRunning(false);

    if (res.passed) {
      if (target.kind === 'challenge') {
        onMarkChallengeSolved(target.challenge.id);
      } else if (target.kind === 'mini-project') {
        onMarkMiniProjectSolved(target.miniProject.id);
      } else if (target.kind === 'exam') {
        onMarkChallengeSolved(activeItem.itemId);
        setExamPassedTaskIds((prev) => {
          const next = [...new Set([...prev, activeItem.itemId])];
          const requiredCount = Math.ceil(
            target.exam.tasks.length * target.exam.passingScore
          );
          if (next.length >= requiredCount) {
            onMarkExamPassed(target.section);
          }
          return next;
        });
      }
    }
  }, [
    isRunning,
    activeItem,
    files,
    target,
    onMarkChallengeSolved,
    onMarkMiniProjectSolved,
    onMarkExamPassed,
  ]);

  const handleResetCode = useCallback(() => {
    const fresh = { ...activeItem.starterFiles };
    setFiles(fresh);
    onSaveFiles(activeItem.itemId, fresh);
    setEvalResult(null);
  }, [activeItem, onSaveFiles]);

  useEffect(() => {
    registerWorkspaceActions({
      runTests: handleRunTests,
      resetCode: handleResetCode,
    });
    return () => registerWorkspaceActions(null);
  }, [registerWorkspaceActions, handleRunTests, handleResetCode]);

  // Global Ctrl/Cmd+Enter shortcut inside workspace
  const runRef = useRef(handleRunTests);
  runRef.current = handleRunTests;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        void runRef.current();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleEditorMount: OnMount = (editor, monacoInstance) => {
    editor.addCommand(monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Enter, () => {
      void runRef.current();
    });
    editor.addCommand(monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyK, () => {
      onOpenPalette();
    });
  };

  const handleRunPlayground = async () => {
    setIsRunning(true);
    setDockTab('playground');
    const res = await sandboxClient.runPlayground({
      requestId: `play-${Date.now()}`,
      files,
      entryFile: activeItem.entryFile,
      entryFunction: activeItem.entryFunction,
      customInput: playgroundInput,
      timeoutMs: 4500,
    });
    setPlaygroundResult(res);
    setIsRunning(false);
  };

  // Drag horizontal resizer
  const startHorizontalResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const onMove = (ev: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((ev.clientX - rect.left) / rect.width) * 100;
      setLeftPanePct(Math.min(62, Math.max(24, pct)));
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // Drag vertical dock resizer
  const startVerticalResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const onMove = (ev: MouseEvent) => {
      if (!rightColRef.current) return;
      const rect = rightColRef.current.getBoundingClientRect();
      const height = rect.bottom - ev.clientY;
      setDockHeightPx(Math.min(rect.height - 140, Math.max(130, height)));
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const nextTarget =
    target.kind === 'challenge'
      ? findNextTargetAfterChallenge(
          sections,
          target.section.id,
          target.phase.id,
          target.challenge.id
        )
      : null;

  const consoleCount = evalResult?.layer2.consoleEntries.length ?? 0;

  return (
    <div className="workspace-shell">
      {/* Workspace Toolbar */}
      <div className="workspace-bar">
        <div className="ws-bar-left">
          <button
            type="button"
            id="back-to-skill-path-btn"
            className="zed-btn zed-btn-ghost"
            onClick={onBackToPath}
          >
            <ArrowLeft size={15} />
            <span>Skill Path</span>
          </button>
          <span className="ws-sep">/</span>
          <span className="ws-breadcrumb">{activeItem.breadcrumb}</span>
          <span className={`style-tag tag-${activeItem.style}`}>{activeItem.style}</span>
          <span className="diff-tag">{activeItem.difficulty}</span>
          {activeItem.hintsDisabled && (
            <span className="exam-lock-pill" title="Hints are disabled during Cumulative Exams">
              <Lock size={12} /> Exam Mode · Hints Disabled
            </span>
          )}
        </div>

        <div className="ws-bar-right">
          <button
            type="button"
            id="reset-starter-code-btn"
            className="zed-btn zed-btn-ghost"
            onClick={handleResetCode}
            title="Reset starter code"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
          <button
            type="button"
            id="run-tests-btn"
            className="zed-btn zed-btn-run"
            disabled={isRunning}
            onClick={handleRunTests}
          >
            <Play size={14} />
            <span>{isRunning ? 'Compiling & Running...' : 'Run & Verify'}</span>
            <kbd className="zed-kbd-inline">Ctrl+↵</kbd>
          </button>
        </div>
      </div>

      {/* Exam Task Bar */}
      {target.kind === 'exam' && (
        <div className="exam-task-strip">
          <span className="exam-strip-label">EXAM TASKS:</span>
          {target.exam.tasks.map((t, idx) => {
            const solved =
              examPassedTaskIds.includes(t.id) ||
              progress.completedChallengeIds.includes(t.id);
            return (
              <button
                key={t.id}
                type="button"
                id={`exam-task-tab-${idx + 1}`}
                className={`exam-task-pill ${idx === examTaskIdx ? 'active' : ''} ${
                  solved ? 'solved' : ''
                }`}
                onClick={() => setExamTaskIdx(idx)}
              >
                {solved ? <CheckCircle2 size={13} /> : <span>#{idx + 1}</span>}
                <span>{t.title}</span>
              </button>
            );
          })}
          {progress.passedExamIds.includes(target.exam.id) && (
            <span className="exam-passed-banner">
              <CheckCircle2 size={14} /> Cumulative Exam Passed! Section {target.section.number}{' '}
              Unlocked.
            </span>
          )}
        </div>
      )}

      {/* Split Workspace Container */}
      <div className="workspace-split" ref={containerRef}>
        {/* Left Pane: Problem Description & Hints */}
        <section className="problem-pane" style={{ width: `${leftPanePct}%` }}>
          <div className="problem-scroll">
            <h1 className="problem-title">{activeItem.title}</h1>

            <div className="tag-cluster">
              {activeItem.tags.map((t) => (
                <span key={t} className="concept-tag">
                  {t}
                </span>
              ))}
              {activeItem.astRules?.requireGenerics && (
                <span className="ast-badge">AST: Generic &lt;T&gt; Required</span>
              )}
              {activeItem.astRules?.requireTypeNarrowing && (
                <span className="ast-badge">AST: Narrowing Required</span>
              )}
              {activeItem.astRules?.requireTypePredicate && (
                <span className="ast-badge">AST: Type Predicate Required</span>
              )}
              {activeItem.astRules?.requireClass && (
                <span className="ast-badge">AST: Class Required</span>
              )}
              {activeItem.astRules?.requireAsync && (
                <span className="ast-badge">AST: Async/Promise Required</span>
              )}
            </div>

            {activeItem.extraNotes && (
              <details className="concept-callout">
                <summary>Concept &amp; Architecture Notes</summary>
                <div className="concept-callout-body">
                  <MarkdownView content={activeItem.extraNotes} />
                </div>
              </details>
            )}

            <MarkdownView content={activeItem.description} />

            {/* Type Assertions Preview if present */}
            {activeItem.typeAssertions && activeItem.typeAssertions.length > 0 && (
              <div className="type-cases-box">
                <div className="box-header">Compile-Time Type Assertions (Visible)</div>
                <pre className="type-cases-pre">
                  <code>
                    {activeItem.typeAssertions
                      .filter((ta) => !ta.hidden)
                      .map((ta) => `// ${ta.name}\n${ta.assertion}`)
                      .join('\n\n')}
                  </code>
                </pre>
              </div>
            )}

            {/* Hints Accordion (Disabled in Exam Mode!) */}
            <div className="hints-section">
              {activeItem.hintsDisabled ? (
                <div className="hints-locked-card">
                  <Lock size={15} />
                  <span>
                    Hints are disabled during Cumulative Exams. Solve all required tasks using
                    compiler &amp; test diagnostics.
                  </span>
                </div>
              ) : (
                activeItem.hints.length > 0 && (
                  <div className="hints-box">
                    <div className="hints-header">
                      <span>
                        <Lightbulb size={14} /> Progressive Hints ({revealedHints}/
                        {activeItem.hints.length})
                      </span>
                      {revealedHints < activeItem.hints.length && (
                        <button
                          type="button"
                          id="reveal-hint-btn"
                          className="zed-btn zed-btn-secondary zed-btn-xs"
                          onClick={() => setRevealedHints((n) => n + 1)}
                        >
                          Reveal Hint #{revealedHints + 1}
                        </button>
                      )}
                    </div>
                    {revealedHints > 0 && (
                      <ol className="hints-list">
                        {activeItem.hints.slice(0, revealedHints).map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ol>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* Horizontal Drag Sash */}
        <div
          className="sash-vertical"
          onMouseDown={startHorizontalResize}
          role="separator"
          aria-orientation="vertical"
        />

        {/* Right Column: Multi-File Editor + Bottom Dock */}
        <section
          className="editor-dock-col"
          ref={rightColRef}
          style={{ width: `${100 - leftPanePct}%` }}
        >
          {/* Multi-file Zed Tab Bar */}
          <div className="editor-tabs-bar" role="tablist">
            {Object.keys(files).map((filePath) => (
              <button
                key={filePath}
                type="button"
                role="tab"
                aria-selected={filePath === activeFile}
                id={`editor-tab-${filePath.replace(/[^a-zA-Z0-9]/g, '-')}`}
                className={`editor-tab ${filePath === activeFile ? 'active' : ''}`}
                onClick={() => setActiveFile(filePath)}
              >
                <FileCode2 size={13} className="tab-ts-icon" />
                <span>{filePath}</span>
                {activeItem.readOnlyMap[filePath] && <Lock size={11} className="txt-muted" />}
              </button>
            ))}
          </div>

          {/* Monaco Editor */}
          <div className="editor-canvas">
            <Editor
              height="100%"
              language="typescript"
              path={`file:///workspace/${activeFile}`}
              theme={theme === 'dark' ? 'zed-one-dark' : 'zed-one-light'}
              value={files[activeFile] ?? ''}
              onChange={handleCodeChange}
              onMount={handleEditorMount}
              options={{
                fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 13.5,
                lineHeight: 21,
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                padding: { top: 12, bottom: 12 },
                tabSize: 2,
                automaticLayout: true,
                readOnly: Boolean(activeItem.readOnlyMap[activeFile]),
                renderLineHighlight: 'all',
                bracketPairColorization: { enabled: true },
              }}
            />
          </div>

          {/* Vertical Drag Sash */}
          <div
            className="sash-horizontal"
            onMouseDown={startVerticalResize}
            role="separator"
            aria-orientation="horizontal"
          />

          {/* Zed Bottom Dock */}
          <div className="bottom-dock" style={{ height: `${dockHeightPx}px` }}>
            <div className="dock-tabs-bar">
              <button
                type="button"
                id="dock-tab-diagnostics"
                className={`dock-tab ${dockTab === 'diagnostics' ? 'active' : ''}`}
                onClick={() => setDockTab('diagnostics')}
              >
                <Cpu size={13} />
                <span>Test Results &amp; Diagnostics</span>
                {evalResult && (
                  <span className={`dock-pill ${evalResult.passed ? 'pill-pass' : 'pill-fail'}`}>
                    {evalResult.passed ? 'PASS' : 'FAIL'}
                  </span>
                )}
              </button>

              <button
                type="button"
                id="dock-tab-console"
                className={`dock-tab ${dockTab === 'console' ? 'active' : ''}`}
                onClick={() => setDockTab('console')}
              >
                <Terminal size={13} />
                <span>Console</span>
                {consoleCount > 0 && <span className="dock-pill">{consoleCount}</span>}
              </button>

              <button
                type="button"
                id="dock-tab-playground"
                className={`dock-tab ${dockTab === 'playground' ? 'active' : ''}`}
                onClick={() => setDockTab('playground')}
              >
                <FlaskConical size={13} />
                <span>Custom Input / Playground</span>
              </button>
            </div>

            <div className="dock-body">
              {dockTab === 'diagnostics' && (
                <div className="diagnostics-panel">
                  {!evalResult && !isRunning && (
                    <div className="dock-placeholder">
                      Press <kbd className="zed-kbd">Ctrl+Enter</kbd> or click{' '}
                      <strong>Run &amp; Verify</strong> to run the 3-Layer TypeScript Diagnostic
                      Engine.
                    </div>
                  )}

                  {isRunning && (
                    <div className="dock-placeholder">
                      Running strict TypeScript 5.9 compiler, AST rules, and sandbox tests...
                    </div>
                  )}

                  {evalResult && (
                    <div className="eval-stack">
                      {/* Overall Success Banner */}
                      {evalResult.passed && (
                        <div className="pass-banner">
                          <div className="pass-banner-left">
                            <CheckCircle2 size={18} />
                            <div>
                              <strong>All Checks Passed!</strong>
                              <span>
                                Strict compiler, AST rules, and all verification tests succeeded in{' '}
                                {evalResult.layer2.totalDurationMs}ms.
                              </span>
                            </div>
                          </div>
                          {target.kind === 'challenge' && nextTarget && (
                            <button
                              type="button"
                              id="next-challenge-btn"
                              className="zed-btn zed-btn-primary"
                              onClick={() => onSelectTarget(nextTarget)}
                            >
                              <span>Next Challenge</span>
                              <ArrowRight size={14} />
                            </button>
                          )}
                          {target.kind === 'exam' &&
                            examTaskIdx + 1 < target.exam.tasks.length && (
                              <button
                                type="button"
                                className="zed-btn zed-btn-primary"
                                onClick={() => setExamTaskIdx((i) => i + 1)}
                              >
                                <span>Next Exam Task</span>
                                <ArrowRight size={14} />
                              </button>
                            )}
                        </div>
                      )}

                      {/* Layer 1: Compiler Diagnostics */}
                      {evalResult.layer1.compilerDiagnostics.length > 0 && (
                        <div className="diag-group">
                          <div className="diag-group-title txt-red">
                            <XCircle size={14} /> Layer 1 · Strict TypeScript Compiler (
                            {evalResult.layer1.compilerDiagnostics.length})
                          </div>
                          {evalResult.layer1.compilerDiagnostics.map((d, idx) => (
                            <div
                              key={idx}
                              className="diag-card diag-error"
                              onClick={() => {
                                if (files[d.file] !== undefined) setActiveFile(d.file);
                              }}
                            >
                              <div className="diag-loc">
                                <code>
                                  {d.file}:{d.line}:{d.column}
                                </code>
                                <span className="ts-code-badge">TS{d.code}</span>
                              </div>
                              <div className="diag-raw">{d.message}</div>
                              {d.friendlyExplanation && (
                                <div className="diag-friendly">{d.friendlyExplanation}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Layer 1: AST Violations */}
                      {evalResult.layer1.astViolations.length > 0 && (
                        <div className="diag-group">
                          <div className="diag-group-title txt-amber">
                            <ShieldAlert size={14} /> Layer 1 · AST &amp; Architecture Rules (
                            {evalResult.layer1.astViolations.length})
                          </div>
                          {evalResult.layer1.astViolations.map((v, idx) => (
                            <div key={idx} className="diag-card diag-warn">
                              <div className="diag-loc">
                                <code>
                                  {v.file}:{v.line}:{v.column}
                                </code>
                                <span className="ts-code-badge">{v.rule}</span>
                              </div>
                              <div className="diag-raw">{v.message}</div>
                              <div className="diag-friendly">{v.hint}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Layer 1: Type Challenge Assertions */}
                      {evalResult.layer1.typeAssertionResults.length > 0 && (
                        <div className="diag-group">
                          <div className="diag-group-title">
                            Layer 1 · Static Type Assertions (
                            {evalResult.layer1.typeAssertionResults.filter((r) => r.passed).length}/
                            {evalResult.layer1.typeAssertionResults.length})
                          </div>
                          {evalResult.layer1.typeAssertionResults.map((ta) => (
                            <div
                              key={ta.id}
                              className={`test-row ${ta.passed ? 'row-pass' : 'row-fail'}`}
                            >
                              <div className="test-row-head">
                                {ta.passed ? (
                                  <CheckCircle2 size={14} className="txt-green" />
                                ) : (
                                  <XCircle size={14} className="txt-red" />
                                )}
                                <span className="test-name">
                                  {ta.hidden ? `[Hidden Type Case] ${ta.name}` : ta.name}
                                </span>
                              </div>
                              {!ta.passed && ta.errorMessage && (
                                <div className="logic-diag-box">
                                  {!ta.hidden && (
                                    <code className="ta-expr">{ta.assertion}</code>
                                  )}
                                  <p>{ta.errorMessage}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Layer 2 & Layer 3: Runtime Tests + Smart Logic Diagnosis */}
                      {evalResult.layer2.testResults.length > 0 && (
                        <div className="diag-group">
                          <div className="diag-group-title">
                            Layer 2 &amp; 3 · Sandbox Tests &amp; Logic Analyzer (
                            {evalResult.layer2.testResults.filter((t) => t.passed).length}/
                            {evalResult.layer2.testResults.length})
                          </div>
                          {evalResult.layer2.testResults.map((tr) => (
                            <div
                              key={tr.id}
                              className={`test-row ${tr.passed ? 'row-pass' : 'row-fail'}`}
                            >
                              <div className="test-row-head">
                                {tr.passed ? (
                                  <CheckCircle2 size={14} className="txt-green" />
                                ) : (
                                  <XCircle size={14} className="txt-red" />
                                )}
                                <span className="test-name">
                                  {tr.hidden ? `[Hidden Edge Case] ${tr.name}` : tr.name}
                                </span>
                                <span className="test-ms">{tr.durationMs}ms</span>
                              </div>

                              {!tr.passed && tr.diagnosis && (
                                <div className="logic-diag-box">
                                  <div className="logic-diag-title">
                                    <AlertTriangle size={13} />
                                    <strong>{tr.diagnosis.title}</strong>
                                  </div>
                                  <p className="logic-diag-exp">{tr.diagnosis.explanation}</p>
                                  <p className="logic-diag-sug">
                                    <strong>Tip:</strong> {tr.diagnosis.suggestion}
                                  </p>
                                  {!tr.hidden && tr.expected !== undefined && (
                                    <div className="diff-pair">
                                      <div>
                                        <span>Expected:</span>{' '}
                                        <code>{formatValueCompact(tr.expected)}</code>
                                      </div>
                                      <div>
                                        <span>Actual:</span>{' '}
                                        <code>{formatValueCompact(tr.actual)}</code>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {dockTab === 'console' && (
                <div className="console-panel">
                  {(!evalResult || evalResult.layer2.consoleEntries.length === 0) ? (
                    <div className="dock-placeholder">
                      No <code>console.log</code> output captured during the last run.
                    </div>
                  ) : (
                    <div className="console-lines">
                      {evalResult.layer2.consoleEntries.map((entry, idx) => (
                        <div key={idx} className={`console-line level-${entry.level}`}>
                          {entry.testId && <span className="console-tag">[{entry.testId}]</span>}
                          <code>{entry.text}</code>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {dockTab === 'playground' && (
                <div className="playground-panel">
                  <div className="playground-col">
                    <div className="play-head">
                      <span>Custom Input (stdin string or JSON arguments)</span>
                      <button
                        type="button"
                        id="run-playground-btn"
                        className="zed-btn zed-btn-primary zed-btn-xs"
                        disabled={isRunning}
                        onClick={handleRunPlayground}
                      >
                        <Play size={12} />
                        <span>Run Custom Input</span>
                      </button>
                    </div>
                    <textarea
                      id="playground-custom-input"
                      className="playground-textarea"
                      value={playgroundInput}
                      onChange={(e) => setPlaygroundInput(e.target.value)}
                      placeholder="Enter custom stdin text or JSON input..."
                    />
                  </div>
                  <div className="playground-col">
                    <div className="play-head">
                      <span>Sandbox Output</span>
                      {playgroundResult && (
                        <span className="txt-muted">{playgroundResult.durationMs}ms</span>
                      )}
                    </div>
                    <pre className="playground-output">
                      {!playgroundResult
                        ? 'Click "Run Custom Input" to inspect your solution on arbitrary inputs.'
                        : playgroundResult.compilerErrors.length > 0
                          ? playgroundResult.compilerErrors
                              .map((e) => `TS${e.code} (${e.file}:${e.line}): ${e.message}`)
                              .join('\n')
                          : playgroundResult.runtimeError
                            ? `Runtime Error: ${playgroundResult.runtimeError}`
                            : playgroundResult.output}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Zed Status Bar */}
      <footer className="zed-statusbar">
        <div className="sb-left">
          <span className="sb-item sb-accent">TypeScript 5.9.3 · strict</span>
          <span className="sb-item">{activeFile}</span>
          <span className="sb-item">{Object.keys(files).length} file(s)</span>
        </div>
        <div className="sb-right">
          <span className="sb-item">Ctrl+K Command Palette</span>
          <span className="sb-item">Ctrl+Enter Run</span>
          <span className="sb-item">Zed One {theme === 'dark' ? 'Dark' : 'Light'}</span>
        </div>
      </footer>
    </div>
  );
};
