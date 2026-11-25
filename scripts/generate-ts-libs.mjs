import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const tsLibDir = path.join(rootDir, 'node_modules', 'typescript', 'lib');
const outJsonPath = path.join(rootDir, 'src', 'engine', 'tsLibMap.json');
const outTsPath = path.join(rootDir, 'src', 'engine', 'generatedTsLibs.ts');

const visited = new Set();

function collect(libName) {
  const fileName = libName.startsWith('lib.') ? libName : `lib.${libName}.d.ts`;
  if (visited.has(fileName)) return;
  visited.add(fileName);
  const fullPath = path.join(tsLibDir, fileName);
  const content = fs.readFileSync(fullPath, 'utf8');
  for (const match of content.matchAll(/\/\/\/\s*<reference\s+lib="([^"]+)"\s*\/>/g)) {
    collect(match[1]);
  }
}

collect('es2023');

const sortedFiles = [...visited].sort();
const libMap = {};

for (const fileName of sortedFiles) {
  const raw = fs.readFileSync(path.join(tsLibDir, fileName), 'utf8');
  const compact = raw
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  libMap[`/${fileName}`] = compact + '\n';
}

fs.mkdirSync(path.dirname(outJsonPath), { recursive: true });
fs.writeFileSync(outJsonPath, JSON.stringify(libMap, null, 2), 'utf8');

const tsOutput = `import rawLibMap from './tsLibMap.json';

export const TS_ES2023_LIBS: Readonly<Record<string, string>> = rawLibMap;
`;
fs.writeFileSync(outTsPath, tsOutput, 'utf8');
console.log(`Generated ${outJsonPath} and ${outTsPath} (${sortedFiles.length} lib files).`);
