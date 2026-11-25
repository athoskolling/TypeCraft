import type { Section } from '../types/curriculum';

export type ThemeMode = 'dark' | 'light';

export interface UserProgressState {
  version: 1;
  theme: ThemeMode;
  completedChallengeIds: string[];
  completedMiniProjectIds: string[];
  passedExamIds: string[];
  testedOutSectionNumbers: number[];
  savedFilesByItemId: Record<string, Record<string, string>>;
  lastActiveItemId?: string;
}

const STORAGE_KEY = 'typecraft.academy.progress.v1';

export function createInitialProgress(): UserProgressState {
  return {
    version: 1,
    theme: 'dark',
    completedChallengeIds: [],
    completedMiniProjectIds: [],
    passedExamIds: [],
    testedOutSectionNumbers: [],
    savedFilesByItemId: {},
  };
}

export function loadProgressState(): UserProgressState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialProgress();
    const parsed = JSON.parse(raw) as Partial<UserProgressState>;
    return normalizeProgress(parsed);
  } catch {
    return createInitialProgress();
  }
}

export function normalizeProgress(parsed: Partial<UserProgressState>): UserProgressState {
  return {
    version: 1,
    theme: parsed.theme === 'light' ? 'light' : 'dark',
    completedChallengeIds: Array.isArray(parsed.completedChallengeIds)
      ? [...new Set(parsed.completedChallengeIds.filter((x): x is string => typeof x === 'string'))]
      : [],
    completedMiniProjectIds: Array.isArray(parsed.completedMiniProjectIds)
      ? [...new Set(parsed.completedMiniProjectIds.filter((x): x is string => typeof x === 'string'))]
      : [],
    passedExamIds: Array.isArray(parsed.passedExamIds)
      ? [...new Set(parsed.passedExamIds.filter((x): x is string => typeof x === 'string'))]
      : [],
    testedOutSectionNumbers: Array.isArray(parsed.testedOutSectionNumbers)
      ? [...new Set(parsed.testedOutSectionNumbers.filter((x): x is number => typeof x === 'number'))]
      : [],
    savedFilesByItemId:
      parsed.savedFilesByItemId && typeof parsed.savedFilesByItemId === 'object'
        ? parsed.savedFilesByItemId
        : {},
    lastActiveItemId:
      typeof parsed.lastActiveItemId === 'string' ? parsed.lastActiveItemId : undefined,
  };
}

export function saveProgressState(state: UserProgressState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota errors gracefully
  }
}

export type SectionStatus = 'completed' | 'tested-out' | 'unlocked' | 'locked';

export function isSectionNaturallyCompleted(section: Section, state: UserProgressState): boolean {
  const completedSet = new Set(state.completedChallengeIds);
  const allPhasesDone = section.phases.every((phase) =>
    phase.challenges.every((ch) => completedSet.has(ch.id))
  );
  const projectDone = state.completedMiniProjectIds.includes(section.miniProject.id);
  const examDone = state.passedExamIds.includes(section.exam.id);
  return allPhasesDone && projectDone && examDone;
}

export function getSectionStatus(
  section: Section,
  allSections: Section[],
  state: UserProgressState
): SectionStatus {
  if (isSectionNaturallyCompleted(section, state)) {
    return 'completed';
  }
  if (state.testedOutSectionNumbers.includes(section.number)) {
    return 'tested-out';
  }
  if (section.number === 1) {
    return 'unlocked';
  }
  // Unlocked if this section's own Cumulative Exam was passed (Jump Here / Skip-Ahead!)
  if (state.passedExamIds.includes(section.exam.id)) {
    return 'unlocked';
  }
  // Unlocked if any higher section's Cumulative Exam was passed
  const passedHigherExam = allSections.some(
    (s) => s.number > section.number && state.passedExamIds.includes(s.exam.id)
  );
  if (passedHigherExam) {
    return 'tested-out';
  }
  // Unlocked if previous section is completed or its exam was passed
  const prevSection = allSections.find((s) => s.number === section.number - 1);
  if (
    prevSection &&
    (isSectionNaturallyCompleted(prevSection, state) ||
      state.passedExamIds.includes(prevSection.exam.id))
  ) {
    return 'unlocked';
  }
  return 'locked';
}

export function isPhaseUnlocked(
  section: Section,
  phaseIndex: number,
  allSections: Section[],
  state: UserProgressState
): boolean {
  const sectionStatus = getSectionStatus(section, allSections, state);
  if (sectionStatus === 'locked') return false;
  if (sectionStatus === 'completed' || sectionStatus === 'tested-out') return true;
  if (state.passedExamIds.includes(section.exam.id)) return true;
  if (phaseIndex === 0) return true;

  const prevPhase = section.phases[phaseIndex - 1];
  if (!prevPhase) return true;
  const completedSet = new Set(state.completedChallengeIds);
  return prevPhase.challenges.every((c) => completedSet.has(c.id));
}

export function recordExamPassed(
  state: UserProgressState,
  passedSection: Section,
  allSections: Section[]
): UserProgressState {
  const passedExamIds = [...new Set([...state.passedExamIds, passedSection.exam.id])];
  const priorNumbersToTestOut = allSections
    .filter(
      (s) =>
        s.number < passedSection.number && !isSectionNaturallyCompleted(s, state)
    )
    .map((s) => s.number);

  const testedOutSectionNumbers = [
    ...new Set([...state.testedOutSectionNumbers, ...priorNumbersToTestOut]),
  ];

  return {
    ...state,
    passedExamIds,
    testedOutSectionNumbers,
  };
}

export function calculateTotalXp(state: UserProgressState): number {
  return (
    state.completedChallengeIds.length * 25 +
    state.completedMiniProjectIds.length * 120 +
    state.passedExamIds.length * 150
  );
}
