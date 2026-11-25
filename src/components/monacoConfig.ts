import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker.js?worker';
import { TYPE_UTILS_DTS } from '../engine/typeTestGlobals';

let initialized = false;

export function ensureMonacoConfigured(): typeof monaco {
  if (initialized) return monaco;
  initialized = true;

  const globalScope = self as unknown as {
    MonacoEnvironment?: {
      getWorker: (_moduleId: string, label: string) => Worker;
    };
  };

  globalScope.MonacoEnvironment = {
    getWorker(_moduleId: string, label: string) {
      if (label === 'typescript' || label === 'javascript') {
        return new tsWorker();
      }
      return new editorWorker();
    },
  };

  loader.config({ monaco });

  const tsDefaults = monaco.languages.typescript.typescriptDefaults;
  tsDefaults.setEagerModelSync(true);
  tsDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    module: monaco.languages.typescript.ModuleKind.ESNext,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    strict: true,
    noImplicitAny: true,
    strictNullChecks: true,
    strictFunctionTypes: true,
    allowNonTsExtensions: true,
    esModuleInterop: true,
    noEmit: true,
  });

  tsDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });

  tsDefaults.addExtraLib(TYPE_UTILS_DTS, 'file:///type-utils.d.ts');

  monaco.editor.defineTheme('zed-one-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '676f7d', fontStyle: 'italic' },
      { token: 'keyword', foreground: '61afef' },
      { token: 'type', foreground: 'e5c07b' },
      { token: 'type.identifier', foreground: 'e5c07b' },
      { token: 'string', foreground: '98c379' },
      { token: 'number', foreground: 'd19a66' },
      { token: 'regexp', foreground: '56b6c2' },
      { token: 'delimiter', foreground: 'abb2bf' },
      { token: 'identifier', foreground: 'dce0e5' },
    ],
    colors: {
      'editor.background': '#282c34',
      'editor.foreground': '#dce0e5',
      'editorLineNumber.foreground': '#545b68',
      'editorLineNumber.activeForeground': '#dce0e5',
      'editor.lineHighlightBackground': '#2f343e88',
      'editor.selectionBackground': '#3e4451',
      'editorCursor.foreground': '#74ade8',
      'editorIndentGuide.background1': '#363b46',
      'editorWidget.background': '#21252b',
      'editorWidget.border': '#363b46',
      'editorSuggestWidget.background': '#21252b',
      'editorSuggestWidget.border': '#363b46',
      'editorSuggestWidget.selectedBackground': '#2f343e',
      'scrollbarSlider.background': '#4b526344',
      'scrollbarSlider.hoverBackground': '#4b526388',
    },
  });

  monaco.editor.defineTheme('zed-one-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '8c909b', fontStyle: 'italic' },
      { token: 'keyword', foreground: '3875d7' },
      { token: 'type', foreground: 'b57614' },
      { token: 'type.identifier', foreground: 'b57614' },
      { token: 'string', foreground: '3d8b40' },
      { token: 'number', foreground: 'b4551d' },
      { token: 'regexp', foreground: '1b8591' },
      { token: 'identifier', foreground: '242529' },
    ],
    colors: {
      'editor.background': '#fafafa',
      'editor.foreground': '#242529',
      'editorLineNumber.foreground': '#9da1ab',
      'editorLineNumber.activeForeground': '#242529',
      'editor.lineHighlightBackground': '#f0f0f1',
      'editor.selectionBackground': '#dce7f7',
      'editorCursor.foreground': '#3875d7',
      'editorIndentGuide.background1': '#e5e5e6',
      'editorWidget.background': '#f0f0f1',
      'editorWidget.border': '#d3d4d8',
    },
  });

  return monaco;
}

export function syncWorkspaceModels(
  files: Record<string, string>,
  typeAssertionPrelude?: string,
  typeAssertions?: Array<{ id: string; assertion: string; isBlock?: boolean }>
): void {
  const m = ensureMonacoConfigured();
  const activeUris = new Set<string>();

  for (const [rawPath, content] of Object.entries(files)) {
    const clean = rawPath.replace(/^\/+/, '');
    const uriStr = `file:///workspace/${clean}`;
    activeUris.add(uriStr);
    const uri = m.Uri.parse(uriStr);
    const existing = m.editor.getModel(uri);
    if (existing) {
      if (existing.getValue() !== content) {
        existing.setValue(content);
      }
    } else {
      m.editor.createModel(content, 'typescript', uri);
    }
  }

  // Dispose stale workspace models from previous challenges so cross-file symbols stay isolated
  for (const model of m.editor.getModels()) {
    const u = model.uri.toString();
    if (u.startsWith('file:///workspace/') && !activeUris.has(u)) {
      model.dispose();
    }
  }

  // Ignore unused optional params reserved for hover preview if needed
  void typeAssertionPrelude;
  void typeAssertions;
}

export { monaco };
