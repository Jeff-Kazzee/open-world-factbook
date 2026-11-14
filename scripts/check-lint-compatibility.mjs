import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import path from 'node:path';

// Follow declared dependencies so this also works with pnpm's isolated layout.
const configRequire = createRequire(import.meta.resolve('eslint-config-next/typescript'));
const tseslintRequire = createRequire(configRequire.resolve('typescript-eslint'));
const parserRequire = createRequire(tseslintRequire.resolve('@typescript-eslint/parser'));
const estreeRequire = createRequire(parserRequire.resolve('@typescript-eslint/typescript-estree'));
const { minimatch, Minimatch } = estreeRequire('minimatch');
const matcherVersion = estreeRequire('minimatch/package.json').version;
const estreeVersion = parserRequire('@typescript-eslint/typescript-estree/package.json').version;
assert.equal(matcherVersion, '11.0.8', 'Check the override at its actual consumer');
assert.match(estreeVersion, /^8\./);
assert.equal(typeof minimatch, 'function');
assert.equal(typeof Minimatch, 'function');

const cases = [
  ['src/lib/data.ts', 'src/**/*.ts', {}, true],
  ['src/lib/data.ts', 'src/**/*.js', {}, false],
  ['src/.hidden.ts', 'src/*.ts', {}, false],
  ['src/.hidden.ts', 'src/*.ts', { dot: true }, true],
  ['src/page.tsx', 'src/*.{ts,tsx}', {}, true],
  ['src/page.js', 'src/*.{ts,tsx}', {}, false],
  ['src/page.tsx', 'src/*.@(ts|tsx)', {}, true],
  ['src/page.js', 'src/*.@(ts|tsx)', {}, false],
  ['src/lib/data.ts', '*.ts', { matchBase: true }, true],
  ['src/lib/data.ts', '*.ts', {}, false],
];
for (const [file, pattern, options, expected] of cases) {
  assert.equal(minimatch(file, pattern, options), expected, `${file}: ${pattern}`);
  assert.equal(new Minimatch(pattern, options).match(file), expected, `${file}: ${pattern}`);
}

const parser = tseslintRequire('@typescript-eslint/parser');
const parserOptions = {
  filePath: path.resolve('ci-default-project.js'),
  tsconfigRootDir: process.cwd(),
  projectService: { allowDefaultProject: ['ci-default-project.js'] },
};
assert.ok(parser.parseForESLint('const value = 1;', parserOptions).ast);
assert.throws(
  () => parser.parseForESLint('const value = 1;', {
    ...parserOptions,
    filePath: path.resolve('ci-unmatched-project.js'),
  }),
  /not found by the project service/,
);
console.log(JSON.stringify({
  result: 'PASS',
  node: process.version,
  estree: estreeVersion,
  minimatch: matcherVersion,
  pathCases: cases.length,
  projectService: 'matching file accepted; unmatched file rejected',
}));
