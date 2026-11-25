# TypeCraft Academy

**100% In-Browser Interactive TypeScript Mastery Platform** — featuring a Duolingo-style Winding Skill Path, a Zed-inspired Multi-File IDE (`Zed One Dark` & `Zed One Light`), and a real TypeScript 5.9 3-Layer Diagnostic Engine running inside Web Workers with zero backend and zero API keys.

---

## Architecture & 3-Layer Diagnostic Engine

Unlike static string-matching platforms, **any valid TypeScript solution passes**:

1. **Layer 1 — Strict TypeScript 5.9 Compiler & AST Verifier (`src/engine/layer1Compiler.ts`)**
   - Runs `ts.createProgram` in `strict: true` against bundled ES2023 `.d.ts` definitions (`src/engine/tsLibMap.json`) plus global type-challenge utilities (`Expect`, `Equal`, `ExpectTrue`, `ExpectFalse`, `NotEqual`, `IsAny`, `NotAny`, `Alike`).
   - Translates cryptic compiler diagnostics (`TS2322`, `TS2339`, `TS2344`, `TS2345`, `TS7006`, `TS2532`, `TS18046`, etc.) into clear educational explanations.
   - Enforces AST & architectural rules (`forbidExplicitAny`, `forbidTsIgnore`, `requireGenerics`, `requireTypeNarrowing`, `requireTypePredicate`, `requireClass`, `requireAsync`).

2. **Layer 2 — Sandbox Runner & Virtual CommonJS Bundler (`src/engine/layer2Runner.ts`)**
   - Executes inside an isolated Web Worker (`src/engine/sandbox.worker.ts`) with a **4.5s infinite-loop watchdog** that terminates and respawns hung workers without freezing the UI.
   - Bundles 4-file Mini-Projects virtually in-memory with cross-file `import`/`export` resolution, `console.log` capture, async `Promise` support, and `checkImmutability` input mutation guards.

3. **Layer 3 — Smart Logic Error Analyzer (`src/engine/layer3LogicAnalyzer.ts`)**
   - Automatically detects and explains:
     - Forgotten `return` statements (`undefined` returned)
     - In-place input array/object mutation (`checkImmutability`)
     - Off-by-one (`±1`) counts and slice boundaries
     - Floating-point & `.toFixed()` decimal formatting mismatches
     - Beecrowd-style trailing whitespace / newline discrepancies
     - Correct elements returned in the wrong order

---

## Curriculum Overview (153 Verified Challenges)

Each of the **6 Sections** includes **5 Phases × 4 Problems (120 Phase Problems)** + **1 Multi-File Mini-Project (4 files each)** + **1 Cumulative Exam (27 Exam Tasks)** across three blended styles (`beecrowd`, `leetcode`, and `type-challenge`):

| Section | Focus | 4-File Mini-Project | Cumulative Exam |
| :--- | :--- | :--- | :--- |
| **Section 1** | Foundations, Control Flow & I/O | *CLI Receipt, Discount & Tax Engine* | Exam 1 (S1 · 4 tasks) |
| **Section 2** | Functions, Strings & Arrays | *Server Log Analyzer & CSV Pipeline* | Exam 2 (S1–S2 · 4 tasks) |
| **Section 3** | Objects, Interfaces, Unions & Narrowing | *Task Workflow State Machine* | Exam 3 (S1–S3 · 4 tasks) |
| **Section 4** | Generics & Data Structures | *Typed LRU Cache & Query Engine* | Exam 4 (S1–S4 · 5 tasks) |
| **Section 5** | Classes, Architecture & Async TS | *Async Job Queue & Rate Limiter* | Exam 5 (S1–S5 · 5 tasks) |
| **Section 6** | Advanced Type-Level TS & Algorithms | *Mini Type-Safe Schema Validator (`mini-zod`)* | Exam 6 (S1–S6 · 5 tasks) |

### Skip-Ahead & Early Project Access
- Every locked section features **"Jump Here (Cumulative Exam)"** and **"Try Mini-Project Early"**.
- Passing a higher section's Cumulative Exam (with hints disabled) immediately unlocks that section and marks all preceding sections as **Tested Out** (still playable anytime).

---

## Keyboard Shortcuts & Local Persistence

- **`Ctrl/Cmd + Enter`** — Compile & run all verification tests in the active workspace
- **`Ctrl/Cmd + K`** — Open the Zed Command Palette (fuzzy search challenges, projects, exams, themes, commands)
- **Local Backup** — Progress and per-challenge code edits persist in `localStorage` with 1-click **Export JSON**, **Import JSON**, and **Reset**.

---

## Development & Verification Commands

```bash
# Install dependencies
npm install

# Launch local Vite dev server
npm run dev

# Run engine & state unit tests (Vitest)
npm test

# Compile & execute 100% of curriculum referenceSolutions & 4-file Mini-Projects
npm run verify:curriculum

# Type-check & build production bundle
npm run build
```
