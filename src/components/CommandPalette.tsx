import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search,
  Play,
  Sun,
  Moon,
  Map as MapIcon,
  FolderGit2,
  ShieldCheck,
  Code2,
  Download,
  RotateCcw,
} from 'lucide-react';
import type { Section } from '../types/curriculum';
import type { WorkspaceTarget } from '../curriculum';
import { getSectionStatus, type UserProgressState } from '../state/progressStore';

export interface PaletteCommand {
  id: string;
  label: string;
  subtitle?: string;
  shortcut?: string;
  icon: React.ReactNode;
  action: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  sections: Section[];
  progress: UserProgressState;
  inWorkspace: boolean;
  onRunTests?: () => void;
  onResetCurrentCode?: () => void;
  onGoToSkillPath: () => void;
  onSelectTarget: (target: WorkspaceTarget) => void;
  onToggleTheme: () => void;
  onOpenProgressModal: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onClose,
  sections,
  progress,
  inWorkspace,
  onRunTests,
  onResetCurrentCode,
  onGoToSkillPath,
  onSelectTarget,
  onToggleTheme,
  onOpenProgressModal,
}) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      window.setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  const allCommands = useMemo<PaletteCommand[]>(() => {
    const cmds: PaletteCommand[] = [];

    if (inWorkspace && onRunTests) {
      cmds.push({
        id: 'cmd-run-tests',
        label: 'Workspace: Run Tests & Diagnostics',
        subtitle: 'Compile strict TypeScript and run all test cases',
        shortcut: 'Ctrl+Enter',
        icon: <Play size={15} />,
        action: onRunTests,
      });
    }

    if (inWorkspace && onResetCurrentCode) {
      cmds.push({
        id: 'cmd-reset-code',
        label: 'Workspace: Reset Starter Code',
        subtitle: 'Revert active challenge files back to starter template',
        icon: <RotateCcw size={15} />,
        action: onResetCurrentCode,
      });
    }

    cmds.push({
      id: 'cmd-skill-path',
      label: 'Navigation: View Winding Skill Path',
      subtitle: 'Return to Duolingo-style curriculum map',
      icon: <MapIcon size={15} />,
      action: onGoToSkillPath,
    });

    cmds.push({
      id: 'cmd-toggle-theme',
      label: `Theme: Switch to Zed One ${progress.theme === 'dark' ? 'Light' : 'Dark'}`,
      subtitle: 'Toggle IDE & Monaco color scheme',
      icon: progress.theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />,
      action: onToggleTheme,
    });

    cmds.push({
      id: 'cmd-progress-json',
      label: 'Progress: Export / Import JSON or Reset',
      subtitle: 'Manage localStorage backup file',
      icon: <Download size={15} />,
      action: onOpenProgressModal,
    });

    for (const section of sections) {
      const status = getSectionStatus(section, sections, progress);
      const isLocked = status === 'locked';

      // Mini-Project (always accessible — Try Early if locked!)
      cmds.push({
        id: `mp-${section.miniProject.id}`,
        label: `S${section.number} Mini-Project: ${section.miniProject.title}`,
        subtitle: isLocked ? 'Try Mini-Project Early (4-file workspace)' : '4-file TypeScript project',
        icon: <FolderGit2 size={15} />,
        action: () =>
          onSelectTarget({
            kind: 'mini-project',
            section,
            miniProject: section.miniProject,
            earlyAccess: isLocked,
          }),
      });

      // Cumulative Exam (Jump Here if locked!)
      cmds.push({
        id: `exam-${section.exam.id}`,
        label: `S${section.number} Exam: ${section.exam.title}`,
        subtitle: isLocked
          ? `Jump Here — Pass to unlock S${section.number} & test out prior sections`
          : `${section.exam.tasks.length} cumulative tasks (hints disabled)`,
        icon: <ShieldCheck size={15} />,
        action: () =>
          onSelectTarget({
            kind: 'exam',
            section,
            exam: section.exam,
            isSkipAheadAttempt: isLocked,
          }),
      });

      if (!isLocked) {
        for (const phase of section.phases) {
          phase.challenges.forEach((challenge, idx) => {
            cmds.push({
              id: `ch-${challenge.id}`,
              label: `S${section.number}·P${phase.number}: ${challenge.title}`,
              subtitle: `${challenge.style} · ${challenge.difficulty}`,
              icon: <Code2 size={15} />,
              action: () =>
                onSelectTarget({
                  kind: 'challenge',
                  section,
                  phase,
                  challenge,
                  challengeIndex: idx,
                }),
            });
          });
        }
      }
    }

    return cmds;
  }, [
    inWorkspace,
    onRunTests,
    onResetCurrentCode,
    onGoToSkillPath,
    onToggleTheme,
    onOpenProgressModal,
    sections,
    progress,
    onSelectTarget,
  ]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allCommands.slice(0, 40);
    return allCommands
      .filter(
        (c) =>
          c.label.toLowerCase().includes(q) ||
          (c.subtitle && c.subtitle.toLowerCase().includes(q))
      )
      .slice(0, 40);
  }, [allCommands, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!open) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (filtered.length === 0 ? 0 : (prev + 1) % filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) =>
        filtered.length === 0 ? 0 : (prev - 1 + filtered.length) % filtered.length
      );
    } else if (e.key === 'Enter' && filtered[activeIndex]) {
      e.preventDefault();
      const target = filtered[activeIndex];
      onClose();
      target.action();
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className="palette-dialog"
        id="command-palette-dialog"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="palette-input-row">
          <Search size={16} className="palette-search-icon" />
          <input
            ref={inputRef}
            id="command-palette-input"
            type="text"
            className="palette-input"
            placeholder="Type a command, challenge title, mini-project, or exam..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="zed-kbd">ESC</kbd>
        </div>
        <div className="palette-list">
          {filtered.length === 0 ? (
            <div className="palette-empty">No matching commands or unlocked challenges.</div>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                className={`palette-item ${idx === activeIndex ? 'active' : ''}`}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => {
                  onClose();
                  item.action();
                }}
              >
                <span className="palette-item-icon">{item.icon}</span>
                <span className="palette-item-body">
                  <span className="palette-item-label">{item.label}</span>
                  {item.subtitle && <span className="palette-item-sub">{item.subtitle}</span>}
                </span>
                {item.shortcut && <kbd className="zed-kbd">{item.shortcut}</kbd>}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
