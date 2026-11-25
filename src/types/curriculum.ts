export type ChallengeStyle = 'beecrowd' | 'leetcode' | 'type-challenge' | 'project';

export type Difficulty = 'beginner' | 'easy' | 'medium' | 'hard' | 'master';

export interface AstRuleConfig {
  /** Disallow `: any`, `as any`, `<any>` in user code (default: true) */
  forbidExplicitAny?: boolean;
  /** Disallow `@ts-ignore`, `@ts-nocheck`, `@ts-expect-error` in user code (default: true) */
  forbidTsIgnore?: boolean;
  /** Require at least one generic type parameter declaration `<T>` */
  requireGenerics?: boolean;
  /** Require type narrowing (`typeof`, `instanceof`, `in`, type predicate `is`, or discriminated check) */
  requireTypeNarrowing?: boolean;
  /** Require a user-defined type predicate (`param is Type`) */
  requireTypePredicate?: boolean;
  /** Require declaring an `interface` or `type` alias */
  requireInterfaceOrType?: boolean;
  /** Require declaring a `class` */
  requireClass?: boolean;
  /** Require `async` / `await` or `Promise` usage */
  requireAsync?: boolean;
  /** Disallow calling `Array.prototype.sort` */
  forbidArraySort?: boolean;
}

export interface ChallengeTestCase {
  id: string;
  name: string;
  hidden?: boolean;
  /** Entry file for multi-file projects (defaults to challenge entryFile or 'solution.ts') */
  entryFile?: string;
  /** Function to invoke on module exports (defaults to challenge entryFunction or 'solve') */
  fnName?: string;
  /** Serializable arguments passed to `fnName` */
  args?: unknown[];
  /**
   * Optional custom async TypeScript/JS body executed as:
   * `async (exports, require) => { <harnessCode> }`
   * Should return the `actual` value to compare against `expected`.
   */
  harnessCode?: string;
  /** Expected return value compared via deep structural equality */
  expected: unknown;
  /** Verify that `args` were not mutated in-place during execution */
  checkImmutability?: boolean;
  /** Optional tolerance for floating-point comparisons when intended */
  floatTolerance?: number;
}

export interface TypeAssertionCase {
  id: string;
  name: string;
  hidden?: boolean;
  /**
   * Type-level expression evaluated in `/__type_assertions__.ts`, e.g.:
   * `Expect<Equal<MyPick<{ a: number; b: string }, 'a'>, { a: number }>>`
   * Or a multi-statement type check block if `isBlock` is true.
   */
  assertion: string;
  /** If true, `assertion` contains full TS type statements rather than a single type expression */
  isBlock?: boolean;
}

export interface ProjectFile {
  path: string;
  starterCode: string;
  referenceSolution: string;
  readOnly?: boolean;
  description?: string;
}

export interface Challenge {
  id: string;
  title: string;
  style: ChallengeStyle;
  difficulty: Difficulty;
  /** Markdown problem statement with context, examples, and constraints */
  description: string;
  /** Concise list of concept tags, e.g. ['Discriminated Unions', 'Exhaustiveness'] */
  tags: string[];
  /** Progressive hints (disabled automatically during Cumulative Exams) */
  hints: string[];
  /** Default entry function name for single-file challenges (e.g. 'solve') */
  entryFunction?: string;
  /** Starter code for single-file challenges */
  starterCode: string;
  /** Verified reference solution for single-file challenges */
  referenceSolution: string;
  /** Setup declarations imported into `/__type_assertions__.ts` (e.g. `import type { MyPick } from './solution';`) */
  typeAssertionPrelude?: string;
  /** Compile-time type assertions (`Expect<Equal<...>>`) */
  typeAssertions?: TypeAssertionCase[];
  /** Runtime test cases (visible + hidden edge cases) */
  testCases: ChallengeTestCase[];
  /** Sample stdin string preloaded in Custom Input / Playground tab */
  playgroundInput?: string;
  /** AST & strictness enforcement rules */
  astRules?: AstRuleConfig;
}

export interface Phase {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  /** Concept guide shown in a collapsible lesson callout */
  conceptSummary: string;
  /** 4 progressive problems per phase */
  challenges: Challenge[];
}

export interface MiniProject {
  id: string;
  title: string;
  subtitle: string;
  difficulty: Difficulty;
  description: string;
  architectureNotes: string;
  tags: string[];
  hints: string[];
  /** Primary entry file for tests & playground (e.g. 'engine.ts' or 'index.ts') */
  entryFile: string;
  entryFunction?: string;
  /** 4 interconnected TypeScript files */
  files: ProjectFile[];
  typeAssertionPrelude?: string;
  typeAssertions?: TypeAssertionCase[];
  testCases: ChallengeTestCase[];
  playgroundInput?: string;
  astRules?: AstRuleConfig;
}

export interface CumulativeExam {
  id: string;
  title: string;
  subtitle: string;
  coveredSections: number[];
  /** Minimum fraction (0..1) of tasks passed required to pass the exam (e.g. 0.8 or 1.0 — we require 100% or 4/4, 4/5) */
  passingScore: number;
  description: string;
  /** 4–5 tasks covering current and prior sections; hints are disabled in exam mode */
  tasks: Challenge[];
}

export interface Section {
  id: string;
  number: number;
  slug: string;
  title: string;
  subtitle: string;
  accentColor: string;
  description: string;
  /** 5 phases × 4 problems = 20 phase problems */
  phases: Phase[];
  /** 1 multi-file Mini-Project (4 files) */
  miniProject: MiniProject;
  /** 1 Cumulative Exam (4–5 tasks) */
  exam: CumulativeExam;
}
