import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { evaluateSubmission } from '../src/engine/evaluator';
import type { Challenge, MiniProject, Section } from '../src/types/curriculum';

async function verifyChallengeItem(label: string, ch: Challenge): Promise<string[]> {
  const errors: string[] = [];

  if (ch.testCases.length + (ch.typeAssertions?.length ?? 0) < 4) {
    errors.push(
      `${label} (${ch.id}): Expected at least 4 verification checks (testCases + typeAssertions), found ${
        ch.testCases.length + (ch.typeAssertions?.length ?? 0)
      }`
    );
  }

  const res = await evaluateSubmission({
    requestId: `verify-${ch.id}`,
    files: { 'solution.ts': ch.referenceSolution },
    entryFile: 'solution.ts',
    entryFunction: ch.entryFunction ?? 'solve',
    astRules: ch.astRules,
    typeAssertionPrelude: ch.typeAssertionPrelude,
    typeAssertions: ch.typeAssertions,
    testCases: ch.testCases,
    timeoutMs: 4500,
  });

  if (!res.passed) {
    const cErrs = res.layer1.compilerDiagnostics.map((d) => `TS${d.code}@L${d.line}: ${d.message}`);
    const aErrs = res.layer1.astViolations.map((v) => `AST(${v.rule}): ${v.message}`);
    const tErrs = res.layer1.typeAssertionResults
      .filter((r) => !r.passed)
      .map((r) => `TypeCase(${r.id}): ${r.errorMessage}`);
    const rErrs = res.layer2.testResults
      .filter((r) => !r.passed)
      .map(
        (r) =>
          `Test(${r.id}): ${r.diagnosis?.title ?? 'Failed'} — ${r.diagnosis?.explanation ?? ''} (actual=${JSON.stringify(r.actual)}, expected=${JSON.stringify(r.expected)})`
      );
    errors.push(
      `${label} (${ch.id} "${ch.title}") referenceSolution FAILED:\n    ${[
        ...cErrs,
        ...aErrs,
        ...tErrs,
        ...rErrs,
      ].join('\n    ')}`
    );
  }

  // Also ensure starterCode does NOT already pass
  const starterRes = await evaluateSubmission({
    requestId: `starter-${ch.id}`,
    files: { 'solution.ts': ch.starterCode },
    entryFile: 'solution.ts',
    entryFunction: ch.entryFunction ?? 'solve',
    astRules: ch.astRules,
    typeAssertionPrelude: ch.typeAssertionPrelude,
    typeAssertions: ch.typeAssertions,
    testCases: ch.testCases,
    timeoutMs: 2500,
  });

  if (starterRes.passed) {
    errors.push(`${label} (${ch.id} "${ch.title}"): starterCode already passes without edits!`);
  }

  return errors;
}

async function verifyMiniProject(sectionNum: number, mp: MiniProject): Promise<string[]> {
  const errors: string[] = [];

  if (mp.files.length !== 4) {
    errors.push(
      `S${sectionNum} MiniProject (${mp.id}): Expected exactly 4 files, found ${mp.files.length}`
    );
  }

  const refFiles: Record<string, string> = {};
  const starterFiles: Record<string, string> = {};
  for (const f of mp.files) {
    refFiles[f.path] = f.referenceSolution;
    starterFiles[f.path] = f.starterCode;
  }

  const res = await evaluateSubmission({
    requestId: `verify-mp-${mp.id}`,
    files: refFiles,
    entryFile: mp.entryFile,
    entryFunction: mp.entryFunction,
    astRules: mp.astRules,
    typeAssertionPrelude: mp.typeAssertionPrelude,
    typeAssertions: mp.typeAssertions,
    testCases: mp.testCases,
    timeoutMs: 4500,
  });

  if (!res.passed) {
    const cErrs = res.layer1.compilerDiagnostics.map(
      (d) => `${d.file}:L${d.line} TS${d.code}: ${d.message}`
    );
    const aErrs = res.layer1.astViolations.map((v) => `${v.file} AST(${v.rule}): ${v.message}`);
    const tErrs = res.layer1.typeAssertionResults
      .filter((r) => !r.passed)
      .map((r) => `TypeCase(${r.id}): ${r.errorMessage}`);
    const rErrs = res.layer2.testResults
      .filter((r) => !r.passed)
      .map((r) => `Test(${r.id}): ${r.diagnosis?.title} — ${r.diagnosis?.explanation}`);
    errors.push(
      `S${sectionNum} MiniProject (${mp.id} "${mp.title}") referenceSolution FAILED:\n    ${[
        ...cErrs,
        ...aErrs,
        ...tErrs,
        ...rErrs,
      ].join('\n    ')}`
    );
  }

  const starterRes = await evaluateSubmission({
    requestId: `starter-mp-${mp.id}`,
    files: starterFiles,
    entryFile: mp.entryFile,
    entryFunction: mp.entryFunction,
    astRules: mp.astRules,
    typeAssertionPrelude: mp.typeAssertionPrelude,
    typeAssertions: mp.typeAssertions,
    testCases: mp.testCases,
    timeoutMs: 2500,
  });

  if (starterRes.passed) {
    errors.push(`S${sectionNum} MiniProject (${mp.id}): starterCode already passes without edits!`);
  }

  return errors;
}

export async function verifySections(sections: Section[], requireAllSix = false): Promise<void> {
  const allErrors: string[] = [];
  const seenIds = new Set<string>();
  let phaseProblemCount = 0;
  let miniProjectCount = 0;
  let examTaskCount = 0;

  if (requireAllSix && sections.length !== 6) {
    allErrors.push(`Expected 6 sections in curriculum, found ${sections.length}`);
  }

  for (const section of sections) {
    console.log(`\n▶ Verifying Section ${section.number}: ${section.title}...`);

    if (section.phases.length !== 5) {
      allErrors.push(
        `Section ${section.number}: Expected 5 phases, found ${section.phases.length}`
      );
    }

    for (const phase of section.phases) {
      if (phase.challenges.length !== 4) {
        allErrors.push(
          `S${section.number} P${phase.number}: Expected 4 challenges, found ${phase.challenges.length}`
        );
      }

      for (const ch of phase.challenges) {
        if (seenIds.has(ch.id)) {
          allErrors.push(`Duplicate challenge ID: ${ch.id}`);
        }
        seenIds.add(ch.id);
        phaseProblemCount++;
        const errs = await verifyChallengeItem(`S${section.number}·P${phase.number}`, ch);
        allErrors.push(...errs);
      }
    }

    miniProjectCount++;
    const mpErrs = await verifyMiniProject(section.number, section.miniProject);
    allErrors.push(...mpErrs);

    if (section.exam.tasks.length < 4 || section.exam.tasks.length > 5) {
      allErrors.push(
        `S${section.number} Exam: Expected 4–5 tasks, found ${section.exam.tasks.length}`
      );
    }

    for (const task of section.exam.tasks) {
      if (seenIds.has(task.id)) {
        allErrors.push(`Duplicate exam task ID: ${task.id}`);
      }
      seenIds.add(task.id);
      examTaskCount++;
      const errs = await verifyChallengeItem(`S${section.number}·Exam`, task);
      allErrors.push(...errs);
    }

    console.log(
      `  ✓ Section ${section.number} checked (${section.phases.length} phases, 1 4-file Mini-Project, ${section.exam.tasks.length} Exam tasks)`
    );
  }

  const total = phaseProblemCount + miniProjectCount + examTaskCount;
  console.log('\n====================================================');
  console.log(
    `Summary: ${sections.length} section(s) | ${phaseProblemCount} phase problems | ${miniProjectCount} mini-projects | ${examTaskCount} exam tasks | ${total} total verified items`
  );
  console.log('====================================================');

  if (allErrors.length > 0) {
    console.error(`\n❌ Verification FAILED with ${allErrors.length} error(s):\n`);
    for (const e of allErrors) {
      console.error(`  • ${e}`);
    }
    process.exit(1);
  }

  console.log('\n✅ 100% of referenceSolutions compiled strictly and passed all test cases!');
}

async function main() {
  const cliFiles = process.argv.slice(2);
  if (cliFiles.length > 0) {
    const loaded: Section[] = [];
    for (const rel of cliFiles) {
      const abs = path.resolve(process.cwd(), rel);
      const mod = (await import(pathToFileURL(abs).href)) as Record<string, unknown>;
      const sec = Object.values(mod).find(
        (v): v is Section =>
          Boolean(v && typeof v === 'object' && 'phases' in v && 'miniProject' in v && 'exam' in v)
      );
      if (!sec) {
        throw new Error(`No Section export found in ${rel}`);
      }
      loaded.push(sec);
    }
    await verifySections(loaded, false);
  } else {
    const { CURRICULUM_SECTIONS } = await import('../src/curriculum/index');
    await verifySections(CURRICULUM_SECTIONS, true);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
