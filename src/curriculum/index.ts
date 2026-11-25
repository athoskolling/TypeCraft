import type { Challenge, CumulativeExam, MiniProject, Phase, Section } from '../types/curriculum';
import { section1 } from './section1';
import { section2 } from './section2';
import { section3 } from './section3';
import { section4 } from './section4';
import { section5 } from './section5';
import { section6 } from './section6';

export const CURRICULUM_SECTIONS: Section[] = [
  section1,
  section2,
  section3,
  section4,
  section5,
  section6,
];

export type WorkspaceTarget =
  | {
      kind: 'challenge';
      section: Section;
      phase: Phase;
      challenge: Challenge;
      challengeIndex: number;
    }
  | {
      kind: 'mini-project';
      section: Section;
      miniProject: MiniProject;
      earlyAccess: boolean;
    }
  | {
      kind: 'exam';
      section: Section;
      exam: CumulativeExam;
      isSkipAheadAttempt: boolean;
    };

export function getCurriculumTotals(sections: Section[]) {
  let phaseChallenges = 0;
  let miniProjects = 0;
  let examTasks = 0;
  for (const s of sections) {
    for (const p of s.phases) {
      phaseChallenges += p.challenges.length;
    }
    miniProjects += 1;
    examTasks += s.exam.tasks.length;
  }
  return {
    sections: sections.length,
    phaseChallenges,
    miniProjects,
    examTasks,
    totalChallenges: phaseChallenges + miniProjects + examTasks,
  };
}

export function findNextTargetAfterChallenge(
  sections: Section[],
  sectionId: string,
  phaseId: string,
  challengeId: string
): WorkspaceTarget | null {
  const sIdx = sections.findIndex((s) => s.id === sectionId);
  if (sIdx === -1) return null;
  const section = sections[sIdx];
  const pIdx = section.phases.findIndex((p) => p.id === phaseId);
  if (pIdx === -1) return null;
  const phase = section.phases[pIdx];
  const cIdx = phase.challenges.findIndex((c) => c.id === challengeId);
  if (cIdx === -1) return null;

  if (cIdx + 1 < phase.challenges.length) {
    return {
      kind: 'challenge',
      section,
      phase,
      challenge: phase.challenges[cIdx + 1],
      challengeIndex: cIdx + 1,
    };
  }
  if (pIdx + 1 < section.phases.length) {
    const nextPhase = section.phases[pIdx + 1];
    if (nextPhase.challenges.length > 0) {
      return {
        kind: 'challenge',
        section,
        phase: nextPhase,
        challenge: nextPhase.challenges[0],
        challengeIndex: 0,
      };
    }
  }
  return {
    kind: 'mini-project',
    section,
    miniProject: section.miniProject,
    earlyAccess: false,
  };
}
