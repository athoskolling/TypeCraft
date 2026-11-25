import { describe, expect, it } from 'vitest';
import {
  createInitialProgress,
  getSectionStatus,
  isPhaseUnlocked,
  recordExamPassed,
} from '../progressStore';
import type { Section } from '../../types/curriculum';

function makeMockSection(num: number): Section {
  return {
    id: `section-${num}`,
    number: num,
    slug: `sec-${num}`,
    title: `Section ${num}`,
    subtitle: 'Sub',
    accentColor: '#61afef',
    description: 'Desc',
    phases: [
      {
        id: `s${num}-p1`,
        number: 1,
        title: 'P1',
        subtitle: 'Sub',
        conceptSummary: 'Sum',
        challenges: [
          {
            id: `s${num}-p1-c1`,
            title: 'C1',
            style: 'leetcode',
            difficulty: 'easy',
            description: 'd',
            tags: [],
            hints: [],
            starterCode: '',
            referenceSolution: '',
            testCases: [],
          },
        ],
      },
      {
        id: `s${num}-p2`,
        number: 2,
        title: 'P2',
        subtitle: 'Sub',
        conceptSummary: 'Sum',
        challenges: [
          {
            id: `s${num}-p2-c1`,
            title: 'C2',
            style: 'leetcode',
            difficulty: 'easy',
            description: 'd',
            tags: [],
            hints: [],
            starterCode: '',
            referenceSolution: '',
            testCases: [],
          },
        ],
      },
    ],
    miniProject: {
      id: `s${num}-mp`,
      title: 'MP',
      subtitle: 'Sub',
      difficulty: 'medium',
      description: 'd',
      architectureNotes: '',
      tags: [],
      hints: [],
      entryFile: 'index.ts',
      files: [],
      testCases: [],
    },
    exam: {
      id: `s${num}-exam`,
      title: 'Exam',
      subtitle: 'Sub',
      coveredSections: [num],
      passingScore: 1,
      description: 'd',
      tasks: [],
    },
  };
}

describe('Skip-Ahead & Section Unlocking Rules', () => {
  it('unlocks Section 1 by default, locks higher sections, and marks S1..S3 as Tested Out when Exam 4 is passed', () => {
    const sections = [1, 2, 3, 4].map(makeMockSection);
    const initial = createInitialProgress();

    expect(getSectionStatus(sections[0], sections, initial)).toBe('unlocked');
    expect(getSectionStatus(sections[1], sections, initial)).toBe('locked');
    expect(getSectionStatus(sections[3], sections, initial)).toBe('locked');

    // Pass Section 4's Cumulative Exam via Jump Here
    const afterSkip = recordExamPassed(initial, sections[3], sections);

    expect(getSectionStatus(sections[3], sections, afterSkip)).toBe('unlocked');
    expect(getSectionStatus(sections[0], sections, afterSkip)).toBe('tested-out');
    expect(getSectionStatus(sections[1], sections, afterSkip)).toBe('tested-out');
    expect(getSectionStatus(sections[2], sections, afterSkip)).toBe('tested-out');

    // Tested-out sections and skipped-into section have all phases playable
    expect(isPhaseUnlocked(sections[0], 1, sections, afterSkip)).toBe(true);
    expect(isPhaseUnlocked(sections[2], 1, sections, afterSkip)).toBe(true);
    expect(isPhaseUnlocked(sections[3], 1, sections, afterSkip)).toBe(true);
  });
});
