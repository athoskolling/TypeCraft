import React, { useState } from 'react';
import {
  CheckCircle2,
  Lock,
  Sparkles,
  FolderGit2,
  ShieldCheck,
  FastForward,
  Play,
  ChevronRight,
  Award,
} from 'lucide-react';
import type { Section } from '../types/curriculum';
import type { WorkspaceTarget } from '../curriculum';
import {
  getSectionStatus,
  isPhaseUnlocked,
  type UserProgressState,
} from '../state/progressStore';

interface SkillPathViewProps {
  sections: Section[];
  progress: UserProgressState;
  onSelectTarget: (target: WorkspaceTarget) => void;
}

const WINDING_OFFSETS_PX = [0, 56, 84, 42, -24];

const PhaseRingSvg: React.FC<{ solved: number; total: number; locked: boolean }> = ({
  solved,
  total,
  locked,
}) => {
  const size = 76;
  const stroke = 5;
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const pct = total > 0 ? solved / total : 0;
  const dashOffset = circ * (1 - pct);

  return (
    <svg width={size} height={size} className="phase-ring-svg" aria-hidden="true">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--ring-track)"
        strokeWidth={stroke}
      />
      {!locked && pct > 0 && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={pct >= 1 ? 'var(--zed-green)' : 'var(--zed-blue)'}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      )}
    </svg>
  );
};

export const SkillPathView: React.FC<SkillPathViewProps> = ({
  sections,
  progress,
  onSelectTarget,
}) => {
  const [expandedPhaseId, setExpandedPhaseId] = useState<string | null>(null);
  const completedSet = new Set(progress.completedChallengeIds);

  const scrollToSection = (slug: string) => {
    const el = document.getElementById(`section-anchor-${slug}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (sections.length === 0) {
    return (
      <main className="skill-empty-state">
        <h1>TypeCraft Academy</h1>
        <p>Loading curriculum sections...</p>
      </main>
    );
  }

  return (
    <div className="skill-layout">
      {/* Left Zed Section Rail */}
      <aside className="section-rail" aria-label="Curriculum sections">
        <div className="rail-header">SECTIONS</div>
        <nav className="rail-list">
          {sections.map((sec) => {
            const status = getSectionStatus(sec, sections, progress);
            const totalPhaseProblems = sec.phases.reduce((s, p) => s + p.challenges.length, 0);
            const solvedInSec = sec.phases.reduce(
              (s, p) => s + p.challenges.filter((c) => completedSet.has(c.id)).length,
              0
            );
            const pct = totalPhaseProblems > 0 ? Math.round((solvedInSec / totalPhaseProblems) * 100) : 0;

            return (
              <button
                key={sec.id}
                type="button"
                id={`rail-section-${sec.number}`}
                className={`rail-item status-${status}`}
                onClick={() => scrollToSection(sec.slug)}
              >
                <span className="rail-num">S{sec.number}</span>
                <span className="rail-meta">
                  <span className="rail-title">{sec.title}</span>
                  <span className="rail-sub">
                    {status === 'completed'
                      ? '100% Mastered'
                      : status === 'tested-out'
                        ? `Tested Out · ${solvedInSec}/${totalPhaseProblems}`
                        : status === 'locked'
                          ? 'Locked · Jump Available'
                          : `${solvedInSec}/${totalPhaseProblems} (${pct}%)`}
                  </span>
                </span>
                <span className="rail-icon">
                  {status === 'completed' ? (
                    <CheckCircle2 size={15} className="txt-green" />
                  ) : status === 'tested-out' ? (
                    <Award size={15} className="txt-amber" />
                  ) : status === 'locked' ? (
                    <Lock size={14} className="txt-muted" />
                  ) : (
                    <Sparkles size={14} className="txt-blue" />
                  )}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Winding Skill Path */}
      <main className="skill-scroll-area">
        <header className="academy-hero">
          <div>
            <h1 className="hero-title">TypeScript Mastery Path</h1>
            <p className="hero-subtitle">
              100% in-browser strict <code>tsc</code> 5.9 compiler, AST verifier, CommonJS multi-file
              bundler, and smart logic diagnostics. Already experienced? Jump straight to any Cumulative
              Exam to unlock higher sections.
            </p>
          </div>
        </header>

        <div className="sections-stack">
          {sections.map((section) => {
            const sectionStatus = getSectionStatus(section, sections, progress);
            const isSectionLocked = sectionStatus === 'locked';
            const mpCompleted = progress.completedMiniProjectIds.includes(section.miniProject.id);
            const examPassed = progress.passedExamIds.includes(section.exam.id);

            const totalProblems = section.phases.reduce((acc, p) => acc + p.challenges.length, 0);
            const solvedProblems = section.phases.reduce(
              (acc, p) => acc + p.challenges.filter((c) => completedSet.has(c.id)).length,
              0
            );

            return (
              <section
                key={section.id}
                id={`section-anchor-${section.slug}`}
                className={`section-block section-${sectionStatus}`}
              >
                {/* Section Banner */}
                <div className="section-banner">
                  <div className="section-banner-top">
                    <div className="section-badge-row">
                      <span className="section-pill">SECTION {section.number}</span>
                      {sectionStatus === 'completed' && (
                        <span className="status-chip chip-green">Completed</span>
                      )}
                      {sectionStatus === 'tested-out' && (
                        <span className="status-chip chip-amber">Tested Out · Playable Anytime</span>
                      )}
                      {sectionStatus === 'unlocked' && (
                        <span className="status-chip chip-blue">Active</span>
                      )}
                      {sectionStatus === 'locked' && (
                        <span className="status-chip chip-muted">Locked</span>
                      )}
                    </div>
                    <span className="section-progress-label">
                      {solvedProblems}/{totalProblems} Phase Problems
                    </span>
                  </div>

                  <h2 className="section-heading">{section.title}</h2>
                  <p className="section-desc">{section.description}</p>

                  {/* Locked Gate Banner: Jump Here + Try Mini-Project Early */}
                  {isSectionLocked && (
                    <div className="skip-ahead-gate">
                      <div className="gate-copy">
                        <FastForward size={18} className="txt-amber" />
                        <div>
                          <strong>Know Sections 1–{section.number - 1} already?</strong>
                          <p>
                            Pass the cumulative exam (hints disabled) to unlock Section {section.number}{' '}
                            immediately and mark prior sections as <em>Tested Out</em>, or preview this
                            section&apos;s 4-file Mini-Project right now.
                          </p>
                        </div>
                      </div>
                      <div className="gate-actions">
                        <button
                          type="button"
                          id={`jump-here-exam-s${section.number}`}
                          className="zed-btn zed-btn-amber"
                          onClick={() =>
                            onSelectTarget({
                              kind: 'exam',
                              section,
                              exam: section.exam,
                              isSkipAheadAttempt: true,
                            })
                          }
                        >
                          <ShieldCheck size={15} />
                          <span>Jump Here (Cumulative Exam)</span>
                        </button>
                        <button
                          type="button"
                          id={`try-mp-early-s${section.number}`}
                          className="zed-btn zed-btn-secondary"
                          onClick={() =>
                            onSelectTarget({
                              kind: 'mini-project',
                              section,
                              miniProject: section.miniProject,
                              earlyAccess: true,
                            })
                          }
                        >
                          <FolderGit2 size={15} />
                          <span>Try Mini-Project Early</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Winding Phase Nodes */}
                <div className="winding-track">
                  {section.phases.map((phase, pIdx) => {
                    const phaseUnlocked = isPhaseUnlocked(section, pIdx, sections, progress);
                    const phaseSolved = phase.challenges.filter((c) => completedSet.has(c.id)).length;
                    const phaseTotal = phase.challenges.length;
                    const phaseDone = phaseSolved === phaseTotal && phaseTotal > 0;
                    const offset = WINDING_OFFSETS_PX[pIdx % WINDING_OFFSETS_PX.length];
                    const isExpanded = expandedPhaseId === phase.id;

                    const nextChallengeIndex = Math.max(
                      0,
                      phase.challenges.findIndex((c) => !completedSet.has(c.id))
                    );

                    return (
                      <div
                        key={phase.id}
                        className="winding-step"
                        style={{ transform: `translateX(${offset}px)` }}
                      >
                        <div className="phase-node-row">
                          <button
                            type="button"
                            id={`phase-node-${phase.id}`}
                            disabled={!phaseUnlocked}
                            className={`phase-node-btn ${
                              !phaseUnlocked
                                ? 'node-locked'
                                : phaseDone
                                  ? 'node-complete'
                                  : 'node-active'
                            }`}
                            onClick={() =>
                              setExpandedPhaseId((prev) => (prev === phase.id ? null : phase.id))
                            }
                          >
                            <PhaseRingSvg
                              solved={phaseSolved}
                              total={phaseTotal}
                              locked={!phaseUnlocked}
                            />
                            <span className="phase-node-center">
                              {!phaseUnlocked ? (
                                <Lock size={20} />
                              ) : phaseDone ? (
                                <CheckCircle2 size={22} />
                              ) : (
                                <span className="phase-num-label">P{phase.number}</span>
                              )}
                            </span>
                          </button>

                          <div
                            className={`phase-label-card ${!phaseUnlocked ? 'card-dim' : ''}`}
                            onClick={() => {
                              if (phaseUnlocked) {
                                setExpandedPhaseId((prev) => (prev === phase.id ? null : phase.id));
                              }
                            }}
                          >
                            <div className="phase-card-top">
                              <span className="phase-kicker">
                                PHASE {section.number}.{phase.number}
                              </span>
                              <span className="phase-fraction">
                                {phaseSolved}/{phaseTotal}
                              </span>
                            </div>
                            <div className="phase-card-title">{phase.title}</div>
                            <div className="phase-card-sub">{phase.subtitle}</div>
                          </div>
                        </div>

                        {/* Expandable 4-Challenge Drawer */}
                        {isExpanded && phaseUnlocked && (
                          <div className="phase-drawer" style={{ transform: `translateX(${-offset}px)` }}>
                            <div className="phase-drawer-header">
                              <div>
                                <strong>{phase.title}</strong>
                                <p>{phase.conceptSummary}</p>
                              </div>
                              <button
                                type="button"
                                className="zed-btn zed-btn-primary"
                                onClick={() =>
                                  onSelectTarget({
                                    kind: 'challenge',
                                    section,
                                    phase,
                                    challenge: phase.challenges[nextChallengeIndex],
                                    challengeIndex: nextChallengeIndex,
                                  })
                                }
                              >
                                <Play size={14} />
                                <span>{phaseDone ? 'Practice Again' : 'Continue Phase'}</span>
                              </button>
                            </div>
                            <div className="phase-challenge-list">
                              {phase.challenges.map((ch, cIdx) => {
                                const isDone = completedSet.has(ch.id);
                                return (
                                  <button
                                    key={ch.id}
                                    type="button"
                                    id={`challenge-item-${ch.id}`}
                                    className={`challenge-row-btn ${isDone ? 'solved' : ''}`}
                                    onClick={() =>
                                      onSelectTarget({
                                        kind: 'challenge',
                                        section,
                                        phase,
                                        challenge: ch,
                                        challengeIndex: cIdx,
                                      })
                                    }
                                  >
                                    <span className="ch-status-dot">
                                      {isDone ? (
                                        <CheckCircle2 size={15} className="txt-green" />
                                      ) : (
                                        <span className="ch-index">{cIdx + 1}</span>
                                      )}
                                    </span>
                                    <span className="ch-main">
                                      <span className="ch-title">{ch.title}</span>
                                      <span className="ch-tags">
                                        <span className={`style-tag tag-${ch.style}`}>{ch.style}</span>
                                        <span className="diff-tag">{ch.difficulty}</span>
                                        {ch.tags.slice(0, 2).map((t) => (
                                          <span key={t} className="concept-tag">
                                            {t}
                                          </span>
                                        ))}
                                      </span>
                                    </span>
                                    <ChevronRight size={15} className="txt-muted" />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Capstone Cards: 4-File Mini-Project + Cumulative Exam */}
                <div className="capstone-grid">
                  <div className={`capstone-card ${mpCompleted ? 'capstone-done' : ''}`}>
                    <div className="capstone-top">
                      <span className="capstone-kicker">
                        <FolderGit2 size={14} /> 4-FILE MINI-PROJECT
                      </span>
                      {mpCompleted && <span className="status-chip chip-green">Completed</span>}
                    </div>
                    <h3>{section.miniProject.title}</h3>
                    <p>{section.miniProject.subtitle}</p>
                    <div className="file-pills">
                      {section.miniProject.files.map((f) => (
                        <code key={f.path} className="file-pill">
                          {f.path}
                        </code>
                      ))}
                    </div>
                    <button
                      type="button"
                      id={`open-mp-${section.miniProject.id}`}
                      className="zed-btn zed-btn-primary"
                      onClick={() =>
                        onSelectTarget({
                          kind: 'mini-project',
                          section,
                          miniProject: section.miniProject,
                          earlyAccess: isSectionLocked,
                        })
                      }
                    >
                      <FolderGit2 size={14} />
                      <span>
                        {isSectionLocked
                          ? 'Try Mini-Project Early'
                          : mpCompleted
                            ? 'Open Workspace'
                            : 'Build Mini-Project'}
                      </span>
                    </button>
                  </div>

                  <div className={`capstone-card ${examPassed ? 'capstone-done' : ''}`}>
                    <div className="capstone-top">
                      <span className="capstone-kicker">
                        <ShieldCheck size={14} /> CUMULATIVE EXAM · S1
                        {section.number > 1 ? `–S${section.number}` : ''}
                      </span>
                      {examPassed && <span className="status-chip chip-amber">Passed</span>}
                    </div>
                    <h3>{section.exam.title}</h3>
                    <p>{section.exam.subtitle}</p>
                    <div className="exam-meta-note">
                      {section.exam.tasks.length} verification tasks · Hints disabled · Unlocks next
                      tier
                    </div>
                    <button
                      type="button"
                      id={`open-exam-${section.exam.id}`}
                      className={isSectionLocked ? 'zed-btn zed-btn-amber' : 'zed-btn zed-btn-secondary'}
                      onClick={() =>
                        onSelectTarget({
                          kind: 'exam',
                          section,
                          exam: section.exam,
                          isSkipAheadAttempt: isSectionLocked,
                        })
                      }
                    >
                      <ShieldCheck size={14} />
                      <span>
                        {isSectionLocked
                          ? 'Jump Here (Cumulative Exam)'
                          : examPassed
                            ? 'Retake Exam'
                            : 'Start Cumulative Exam'}
                      </span>
                    </button>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
};
