import ts from 'typescript';
import { TS_ES2023_LIBS } from './generatedTsLibs';
import { TYPE_UTILS_DTS } from './typeTestGlobals';
import { explainCompilerDiagnostic } from './friendlyDiagnostics';
import type { AstRuleConfig, TypeAssertionCase } from '../types/curriculum';
import type {
  AstViolationItem,
  CompilerDiagnosticItem,
  TypeAssertionResult,
} from '../types/engine';

const cachedLibSourceFiles = new Map<string, ts.SourceFile>();

function getImmutableLibSourceFile(fileName: string, content: string): ts.SourceFile {
  const existing = cachedLibSourceFiles.get(fileName);
  if (existing) return existing;
  const created = ts.createSourceFile(fileName, content, ts.ScriptTarget.ES2023, true);
  cachedLibSourceFiles.set(fileName, created);
  return created;
}

export interface Layer1Input {
  files: Record<string, string>;
  astRules?: AstRuleConfig;
  typeAssertionPrelude?: string;
  typeAssertions?: TypeAssertionCase[];
}

export interface Layer1Output {
  passed: boolean;
  compilerDiagnostics: CompilerDiagnosticItem[];
  astViolations: AstViolationItem[];
  typeAssertionResults: TypeAssertionResult[];
}

function normalizeUserPath(rawPath: string): string {
  const clean = rawPath.replace(/^\/+/, '').replace(/^\.\//, '');
  const withExt = clean.endsWith('.ts') || clean.endsWith('.d.ts') ? clean : `${clean}.ts`;
  return `/workspace/${withExt}`;
}

function displayUserPath(virtualPath: string): string {
  return virtualPath.replace(/^\/workspace\//, '');
}

interface AssertionSpan {
  item: TypeAssertionCase;
  startLine: number;
  endLine: number;
}

function buildTypeAssertionsFile(
  prelude: string | undefined,
  assertions: TypeAssertionCase[]
): { content: string; spans: AssertionSpan[]; preludeEndLine: number } {
  const lines: string[] = [];
  if (prelude && prelude.trim().length > 0) {
    for (const line of prelude.trim().split('\n')) {
      lines.push(line);
    }
  }
  lines.push('export {};');
  const preludeEndLine = lines.length;

  const spans: AssertionSpan[] = [];
  assertions.forEach((item, idx) => {
    const startLine = lines.length + 1;
    if (item.isBlock) {
      lines.push(`namespace __TypeCraftCase_${idx} {`);
      for (const blockLine of item.assertion.split('\n')) {
        lines.push(`  ${blockLine}`);
      }
      lines.push('}');
    } else {
      const exprLines = item.assertion.trim().replace(/;$/, '').split('\n');
      if (exprLines.length === 1) {
        lines.push(`export type __TypeCraftCase_${idx} = ${exprLines[0]};`);
      } else {
        lines.push(`export type __TypeCraftCase_${idx} =`);
        exprLines.forEach((l, lineIdx) => {
          const suffix = lineIdx === exprLines.length - 1 ? ';' : '';
          lines.push(`  ${l}${suffix}`);
        });
      }
    }
    const endLine = lines.length;
    spans.push({ item, startLine, endLine });
  });

  return {
    content: lines.join('\n') + '\n',
    spans,
    preludeEndLine,
  };
}

function checkAstRules(
  sourceFile: ts.SourceFile,
  displayFile: string,
  rules: AstRuleConfig | undefined
): {
  violations: AstViolationItem[];
  foundGenerics: boolean;
  foundNarrowing: boolean;
  foundTypePredicate: boolean;
  foundInterfaceOrType: boolean;
  foundClass: boolean;
  foundAsync: boolean;
} {
  const forbidExplicitAny = rules?.forbidExplicitAny ?? true;
  const forbidTsIgnore = rules?.forbidTsIgnore ?? true;
  const forbidArraySort = rules?.forbidArraySort ?? false;

  const violations: AstViolationItem[] = [];
  let foundGenerics = false;
  let foundNarrowing = false;
  let foundTypePredicate = false;
  let foundInterfaceOrType = false;
  let foundClass = false;
  let foundAsync = false;

  const text = sourceFile.getFullText();

  if (forbidTsIgnore) {
    const directiveRegex = /(@ts-ignore|@ts-nocheck|@ts-expect-error)/g;
    for (const match of text.matchAll(directiveRegex)) {
      const pos = match.index ?? 0;
      const { line, character } = sourceFile.getLineAndCharacterOfPosition(pos);
      violations.push({
        rule: 'forbidTsIgnore',
        file: displayFile,
        line: line + 1,
        column: character + 1,
        message: `Compiler suppression directive \`${match[1]}\` is forbidden.`,
        hint: 'Fix the underlying static type error instead of suppressing the TypeScript compiler.',
      });
    }
  }

  function visit(node: ts.Node): void {
    if (forbidExplicitAny && node.kind === ts.SyntaxKind.AnyKeyword) {
      const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
      violations.push({
        rule: 'forbidExplicitAny',
        file: displayFile,
        line: line + 1,
        column: character + 1,
        message: 'Explicit `any` is forbidden in strict TypeCraft challenges.',
        hint: 'Use a specific interface/type, `unknown` with narrowing, or a generic type parameter `<T>`.',
      });
    }

    if (
      (ts.isFunctionDeclaration(node) ||
        ts.isArrowFunction(node) ||
        ts.isFunctionExpression(node) ||
        ts.isMethodDeclaration(node) ||
        ts.isClassDeclaration(node) ||
        ts.isInterfaceDeclaration(node) ||
        ts.isTypeAliasDeclaration(node)) &&
      node.typeParameters &&
      node.typeParameters.length > 0
    ) {
      foundGenerics = true;
    }

    if (ts.isTypePredicateNode(node)) {
      foundTypePredicate = true;
      foundNarrowing = true;
    }

    if (ts.isTypeOfExpression(node)) {
      foundNarrowing = true;
    }

    if (
      ts.isBinaryExpression(node) &&
      (node.operatorToken.kind === ts.SyntaxKind.InKeyword ||
        node.operatorToken.kind === ts.SyntaxKind.InstanceOfKeyword)
    ) {
      foundNarrowing = true;
    }

    if (ts.isSwitchStatement(node)) {
      foundNarrowing = true;
    }

    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.expression.getText(sourceFile) === 'Array' &&
      node.expression.name.text === 'isArray'
    ) {
      foundNarrowing = true;
    }

    if (ts.isIfStatement(node)) {
      const condText = node.expression.getText(sourceFile);
      if (
        condText.includes('===') ||
        condText.includes('!==') ||
        condText.includes('!=') ||
        condText.includes('==')
      ) {
        foundNarrowing = true;
      }
    }

    if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
      foundInterfaceOrType = true;
    }

    if (ts.isClassDeclaration(node) || ts.isClassExpression(node)) {
      foundClass = true;
    }

    if (ts.isAwaitExpression(node)) {
      foundAsync = true;
    }

    if (ts.canHaveModifiers(node)) {
      const mods = ts.getModifiers(node);
      if (mods?.some((m) => m.kind === ts.SyntaxKind.AsyncKeyword)) {
        foundAsync = true;
      }
    }

    if (ts.isIdentifier(node) && node.text === 'Promise') {
      foundAsync = true;
    }

    if (
      forbidArraySort &&
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === 'sort'
    ) {
      const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
      violations.push({
        rule: 'forbidArraySort',
        file: displayFile,
        line: line + 1,
        column: character + 1,
        message: 'Built-in `.sort()` is disallowed for this algorithm challenge.',
        hint: 'Implement the sorting or ordering logic directly as specified in the problem statement.',
      });
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return {
    violations,
    foundGenerics,
    foundNarrowing,
    foundTypePredicate,
    foundInterfaceOrType,
    foundClass,
    foundAsync,
  };
}

export function runLayer1Compiler(input: Layer1Input): Layer1Output {
  const virtualUserFiles = new Map<string, string>();
  for (const [rawPath, content] of Object.entries(input.files)) {
    virtualUserFiles.set(normalizeUserPath(rawPath), content);
  }

  const assertionFileVirtualPath = '/workspace/__type_assertions__.ts';
  const assertions = input.typeAssertions ?? [];
  const assertionBuild =
    assertions.length > 0
      ? buildTypeAssertionsFile(input.typeAssertionPrelude, assertions)
      : undefined;

  if (assertionBuild) {
    virtualUserFiles.set(assertionFileVirtualPath, assertionBuild.content);
  }

  const compilerOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2023,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    strict: true,
    noImplicitAny: true,
    strictNullChecks: true,
    strictFunctionTypes: true,
    strictBindCallApply: true,
    strictPropertyInitialization: true,
    noImplicitThis: true,
    useUnknownInCatchVariables: true,
    alwaysStrict: true,
    noEmit: true,
    skipLibCheck: true,
  };

  const userSourceFiles = new Map<string, ts.SourceFile>();

  const host: ts.CompilerHost = {
    getSourceFile(fileName, languageVersion) {
      if (fileName === '/type-utils.d.ts') {
        return getImmutableLibSourceFile(fileName, TYPE_UTILS_DTS);
      }
      const stdLib = TS_ES2023_LIBS[fileName];
      if (stdLib !== undefined) {
        return getImmutableLibSourceFile(fileName, stdLib);
      }
      const userCode = virtualUserFiles.get(fileName);
      if (userCode !== undefined) {
        const existing = userSourceFiles.get(fileName);
        if (existing) return existing;
        const sf = ts.createSourceFile(fileName, userCode, languageVersion, true);
        userSourceFiles.set(fileName, sf);
        return sf;
      }
      return undefined;
    },
    getDefaultLibFileName: () => '/lib.es2023.d.ts',
    writeFile: () => {},
    getCurrentDirectory: () => '/workspace',
    getDirectories: () => [],
    fileExists(fileName) {
      return (
        fileName === '/type-utils.d.ts' ||
        TS_ES2023_LIBS[fileName] !== undefined ||
        virtualUserFiles.has(fileName)
      );
    },
    readFile(fileName) {
      if (fileName === '/type-utils.d.ts') return TYPE_UTILS_DTS;
      if (TS_ES2023_LIBS[fileName] !== undefined) return TS_ES2023_LIBS[fileName];
      return virtualUserFiles.get(fileName);
    },
    getCanonicalFileName: (fileName) => fileName,
    useCaseSensitiveFileNames: () => true,
    getNewLine: () => '\n',
  };

  const rootNames = [
    '/lib.es2023.d.ts',
    '/type-utils.d.ts',
    ...virtualUserFiles.keys(),
  ];

  const program = ts.createProgram(rootNames, compilerOptions, host);
  const allDiagnostics = ts.getPreEmitDiagnostics(program);

  const compilerDiagnostics: CompilerDiagnosticItem[] = [];
  const assertionErrorsByIndex = new Map<number, string[]>();
  const preludeErrors: string[] = [];

  for (const diag of allDiagnostics) {
    const flatMsg = ts.flattenDiagnosticMessageText(diag.messageText, '\n');
    const fileName = diag.file?.fileName;

    if (fileName === assertionFileVirtualPath && assertionBuild && diag.file && diag.start !== undefined) {
      const { line } = diag.file.getLineAndCharacterOfPosition(diag.start);
      const line1 = line + 1;
      if (line1 <= assertionBuild.preludeEndLine) {
        preludeErrors.push(`TS${diag.code}: ${flatMsg}`);
        compilerDiagnostics.push({
          code: diag.code,
          file: 'type-assertions',
          line: 1,
          column: 1,
          message: flatMsg,
          friendlyExplanation: explainCompilerDiagnostic(diag.code, flatMsg),
          severity: 'error',
        });
      } else {
        const matchedIdx = assertionBuild.spans.findIndex(
          (s) => line1 >= s.startLine && line1 <= s.endLine
        );
        if (matchedIdx !== -1) {
          const list = assertionErrorsByIndex.get(matchedIdx) ?? [];
          const friendly = explainCompilerDiagnostic(diag.code, flatMsg);
          list.push(friendly ? `${flatMsg} — ${friendly}` : flatMsg);
          assertionErrorsByIndex.set(matchedIdx, list);
        } else {
          preludeErrors.push(`TS${diag.code}: ${flatMsg}`);
        }
      }
      continue;
    }

    if (fileName && fileName.startsWith('/workspace/')) {
      const pos =
        diag.file && diag.start !== undefined
          ? diag.file.getLineAndCharacterOfPosition(diag.start)
          : { line: 0, character: 0 };
      compilerDiagnostics.push({
        code: diag.code,
        file: displayUserPath(fileName),
        line: pos.line + 1,
        column: pos.character + 1,
        message: flatMsg,
        friendlyExplanation: explainCompilerDiagnostic(diag.code, flatMsg),
        severity: diag.category === ts.DiagnosticCategory.Warning ? 'warning' : 'error',
      });
    } else if (!fileName) {
      compilerDiagnostics.push({
        code: diag.code,
        file: 'project',
        line: 1,
        column: 1,
        message: flatMsg,
        friendlyExplanation: explainCompilerDiagnostic(diag.code, flatMsg),
        severity: 'error',
      });
    }
  }

  const typeAssertionResults: TypeAssertionResult[] = assertions.map((item, idx) => {
    if (preludeErrors.length > 0) {
      return {
        id: item.id,
        name: item.name,
        hidden: Boolean(item.hidden),
        passed: false,
        assertion: item.assertion,
        errorMessage: preludeErrors.join(' | '),
      };
    }
    const errs = assertionErrorsByIndex.get(idx);
    return {
      id: item.id,
      name: item.name,
      hidden: Boolean(item.hidden),
      passed: !errs || errs.length === 0,
      assertion: item.assertion,
      errorMessage: errs?.join('\n'),
    };
  });

  // AST checks across all user files (excluding virtual __type_assertions__.ts)
  const astViolations: AstViolationItem[] = [];
  let anyGenerics = false;
  let anyNarrowing = false;
  let anyTypePredicate = false;
  let anyInterfaceOrType = false;
  let anyClass = false;
  let anyAsync = false;
  let firstDisplayFile = 'solution.ts';

  for (const [vPath] of virtualUserFiles) {
    if (vPath === assertionFileVirtualPath) continue;
    const sf = program.getSourceFile(vPath);
    if (!sf) continue;
    const dFile = displayUserPath(vPath);
    if (firstDisplayFile === 'solution.ts') {
      firstDisplayFile = dFile;
    }
    const res = checkAstRules(sf, dFile, input.astRules);
    astViolations.push(...res.violations);
    if (res.foundGenerics) anyGenerics = true;
    if (res.foundNarrowing) anyNarrowing = true;
    if (res.foundTypePredicate) anyTypePredicate = true;
    if (res.foundInterfaceOrType) anyInterfaceOrType = true;
    if (res.foundClass) anyClass = true;
    if (res.foundAsync) anyAsync = true;
  }

  const rules = input.astRules;
  if (rules?.requireGenerics && !anyGenerics) {
    astViolations.push({
      rule: 'requireGenerics',
      file: firstDisplayFile,
      line: 1,
      column: 1,
      message: 'This challenge requires declaring at least one generic type parameter (`<T>`).',
      hint: 'Parameterize your function, class, or type alias with `<T>` instead of hardcoding concrete types.',
    });
  }
  if (rules?.requireTypeNarrowing && !anyNarrowing) {
    astViolations.push({
      rule: 'requireTypeNarrowing',
      file: firstDisplayFile,
      line: 1,
      column: 1,
      message: 'This challenge requires explicit type narrowing.',
      hint: 'Use `typeof`, `instanceof`, `in`, `Array.isArray`, a `switch` on a discriminant, or a type predicate.',
    });
  }
  if (rules?.requireTypePredicate && !anyTypePredicate) {
    astViolations.push({
      rule: 'requireTypePredicate',
      file: firstDisplayFile,
      line: 1,
      column: 1,
      message: 'This challenge requires a user-defined type guard returning a type predicate (`value is TargetType`).',
      hint: 'Annotate your guard function return type as `value is MyType`.',
    });
  }
  if (rules?.requireInterfaceOrType && !anyInterfaceOrType) {
    astViolations.push({
      rule: 'requireInterfaceOrType',
      file: firstDisplayFile,
      line: 1,
      column: 1,
      message: 'This challenge requires defining an explicit `interface` or `type` alias.',
      hint: 'Model your domain shape with `interface` or `type` before implementing the logic.',
    });
  }
  if (rules?.requireClass && !anyClass) {
    astViolations.push({
      rule: 'requireClass',
      file: firstDisplayFile,
      line: 1,
      column: 1,
      message: 'This challenge requires implementing a `class`.',
      hint: 'Encapsulate state and behavior using a typed TypeScript `class`.',
    });
  }
  if (rules?.requireAsync && !anyAsync) {
    astViolations.push({
      rule: 'requireAsync',
      file: firstDisplayFile,
      line: 1,
      column: 1,
      message: 'This challenge requires asynchronous TypeScript (`async`/`await` or `Promise`).',
      hint: 'Use `async`/`await` or return typed `Promise<T>` instances.',
    });
  }

  const hasCompilerErrors = compilerDiagnostics.some((d) => d.severity === 'error');
  const allTypeAssertionsPassed = typeAssertionResults.every((r) => r.passed);
  const passed = !hasCompilerErrors && astViolations.length === 0 && allTypeAssertionsPassed;

  return {
    passed,
    compilerDiagnostics,
    astViolations,
    typeAssertionResults,
  };
}
