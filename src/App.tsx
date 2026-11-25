import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  TerminalSquare,
  Command,
  Sun,
  Moon,
  Database,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import {
  CURRICULUM_SECTIONS,
  getCurriculumTotals,
  type WorkspaceTarget,
} from './curriculum';
import {
  calculateTotalXp,
  createInitialProgress,
  loadProgressState,
  recordExamPassed,
  saveProgressState,
  type UserProgressState,
} from './state/progressStore';
import type { Section } from './types/curriculum';
import { SkillPathView } from './components/SkillPathView';
import { WorkspaceView } from './components/WorkspaceView';
import { CommandPalette } from './components/CommandPalette';
import { ProgressModal } from './components/ProgressModal';

export const App: React.FC = () => {
  const [progress, setProgress] = useState<UserProgressState>(() => loadProgressState());
  const [activeTarget, setActiveTarget] = useState<WorkspaceTarget | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [progressModalOpen, setProgressModalOpen] = useState(false);

  const workspaceActionsRef = useRef<{
    runTests: () => void;
    resetCode: () => void;
  } | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', progress.theme);
    saveProgressState(progress);
  }, [progress]);

  // Global Cmd/Ctrl+K listener for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleTheme = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  }, []);

  const handleSaveFiles = useCallback((itemId: string, files: Record<string, string>) => {
    setProgress((prev) => ({
      ...prev,
      savedFilesByItemId: {
        ...prev.savedFilesByItemId,
        [itemId]: files,
      },
    }));
  }, []);

  const handleMarkChallengeSolved = useCallback((challengeId: string) => {
    setProgress((prev) => {
      if (prev.completedChallengeIds.includes(challengeId)) return prev;
      return {
        ...prev,
        completedChallengeIds: [...prev.completedChallengeIds, challengeId],
      };
    });
  }, []);

  const handleMarkMiniProjectSolved = useCallback((miniProjectId: string) => {
    setProgress((prev) => {
      if (prev.completedMiniProjectIds.includes(miniProjectId)) return prev;
      return {
        ...prev,
        completedMiniProjectIds: [...prev.completedMiniProjectIds, miniProjectId],
      };
    });
  }, []);

  const handleMarkExamPassed = useCallback((section: Section) => {
    setProgress((prev) => recordExamPassed(prev, section, CURRICULUM_SECTIONS));
  }, []);

  const registerWorkspaceActions = useCallback(
    (actions: { runTests: () => void; resetCode: () => void } | null) => {
      workspaceActionsRef.current = actions;
    },
    []
  );

  const totals = getCurriculumTotals(CURRICULUM_SECTIONS);
  const xp = calculateTotalXp(progress);
  const totalSolved =
    progress.completedChallengeIds.length + progress.completedMiniProjectIds.length;

  return (
    <div className="app-root">
      {/* Top Zed Titlebar */}
      <header className="zed-titlebar">
        <div className="tb-left">
          <button
            type="button"
            id="brand-home-btn"
            className="brand-btn"
            onClick={() => setActiveTarget(null)}
          >
            <TerminalSquare size={18} className="brand-icon" />
            <span className="brand-name">TypeCraft</span>
            <span className="brand-tag">ACADEMY</span>
          </button>
        </div>

        <div className="tb-center">
          <button
            type="button"
            id="open-command-palette-btn"
            className="palette-trigger-btn"
            onClick={() => setPaletteOpen(true)}
          >
            <Command size={13} />
            <span>Search challenges, projects, exams, commands...</span>
            <kbd className="zed-kbd">Ctrl+K</kbd>
          </button>
        </div>

        <div className="tb-right">
          <div className="stat-pill" title="Experience points earned">
            <Zap size={13} className="txt-amber" />
            <span>{xp} XP</span>
          </div>

          <div className="stat-pill" title="Solved challenges & projects">
            <CheckCircle2 size={13} className="txt-green" />
            <span>
              {totalSolved}/{totals.totalChallenges}
            </span>
          </div>

          <button
            type="button"
            id="open-progress-modal-btn"
            className="icon-btn"
            onClick={() => setProgressModalOpen(true)}
            title="Export / Import JSON or Reset Progress"
          >
            <Database size={15} />
          </button>

          <button
            type="button"
            id="toggle-theme-btn"
            className="icon-btn"
            onClick={handleToggleTheme}
            title={`Switch to Zed One ${progress.theme === 'dark' ? 'Light' : 'Dark'}`}
          >
            {progress.theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      {activeTarget ? (
        <WorkspaceView
          target={activeTarget}
          sections={CURRICULUM_SECTIONS}
          theme={progress.theme}
          progress={progress}
          onBackToPath={() => setActiveTarget(null)}
          onSelectTarget={setActiveTarget}
          onSaveFiles={handleSaveFiles}
          onMarkChallengeSolved={handleMarkChallengeSolved}
          onMarkMiniProjectSolved={handleMarkMiniProjectSolved}
          onMarkExamPassed={handleMarkExamPassed}
          onOpenPalette={() => setPaletteOpen(true)}
          registerWorkspaceActions={registerWorkspaceActions}
        />
      ) : (
        <SkillPathView
          sections={CURRICULUM_SECTIONS}
          progress={progress}
          onSelectTarget={setActiveTarget}
        />
      )}

      {/* Command Palette */}
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        sections={CURRICULUM_SECTIONS}
        progress={progress}
        inWorkspace={Boolean(activeTarget)}
        onRunTests={() => workspaceActionsRef.current?.runTests()}
        onResetCurrentCode={() => workspaceActionsRef.current?.resetCode()}
        onGoToSkillPath={() => setActiveTarget(null)}
        onSelectTarget={setActiveTarget}
        onToggleTheme={handleToggleTheme}
        onOpenProgressModal={() => setProgressModalOpen(true)}
      />

      {/* Export / Import / Reset Progress Modal */}
      <ProgressModal
        open={progressModalOpen}
        onClose={() => setProgressModalOpen(false)}
        progress={progress}
        onImportProgress={(next) => setProgress(next)}
        onResetAllProgress={() => {
          const fresh = createInitialProgress();
          fresh.theme = progress.theme;
          setProgress(fresh);
          setActiveTarget(null);
        }}
      />
    </div>
  );
};

export default App;
