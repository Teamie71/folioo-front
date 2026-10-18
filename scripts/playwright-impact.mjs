#!/usr/bin/env node
/**
 * 변경 파일 목록으로 Playwright smoke/full 선택 결과를 출력한다.
 * 규칙: qa/playwright-path-rules.json
 *
 * 사용:
 *   pnpm qa:playwright-impact
 *   pnpm qa:playwright-impact --base origin/dev
 *   pnpm qa:playwright-impact -- src/a.ts e2e/b.spec.ts
 *   PLAYWRIGHT_FULL=1 pnpm qa:playwright-impact
 */

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const rulesPath = join(root, 'qa/playwright-path-rules.json');

function loadRules() {
  return JSON.parse(readFileSync(rulesPath, 'utf8'));
}

/** 단순 glob → RegExp (** / * 만 지원) */
function globToRegExp(glob) {
  let i = 0;
  let out = '^';
  while (i < glob.length) {
    if (glob.startsWith('**/', i)) {
      out += '(?:.*/)?';
      i += 3;
      continue;
    }
    if (glob[i] === '*' && glob[i + 1] !== '*') {
      out += '[^/]*';
      i += 1;
      continue;
    }
    if (glob.startsWith('**', i)) {
      out += '.*';
      i += 2;
      continue;
    }
    const ch = glob[i];
    if (/[.+^${}()|[\]\\]/.test(ch)) out += `\\${ch}`;
    else out += ch;
    i += 1;
  }
  out += '$';
  return new RegExp(out);
}

function matchesAny(file, globs) {
  return globs.some((g) => globToRegExp(g).test(file));
}

function normalize(file) {
  return file.replaceAll('\\', '/').replace(/^\.\//, '');
}

function parseArgs(argv) {
  const args = { base: null, files: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--base') {
      args.base = argv[i + 1] ?? null;
      i += 1;
      continue;
    }
    if (a === '--') {
      args.files.push(...argv.slice(i + 1).map(normalize));
      break;
    }
    if (!a.startsWith('-')) args.files.push(normalize(a));
  }
  return args;
}

function changedFilesFromGit(base) {
  const range = base ? `${base}...HEAD` : 'HEAD';
  const cmd = base
    ? `git diff --name-only --diff-filter=ACMR ${range}`
    : 'git diff --name-only --diff-filter=ACMR HEAD';
  // unstaged + staged against HEAD when no base
  const unstaged = execSync('git diff --name-only --diff-filter=ACMR', {
    cwd: root,
    encoding: 'utf8',
  });
  const staged = execSync('git diff --name-only --cached --diff-filter=ACMR', {
    cwd: root,
    encoding: 'utf8',
  });
  if (!base) {
    const untracked = execSync('git ls-files --others --exclude-standard', {
      cwd: root,
      encoding: 'utf8',
    });
    return [...new Set(`${unstaged}\n${staged}\n${untracked}`.split('\n').map(normalize).filter(Boolean))];
  }
  const named = execSync(cmd, { cwd: root, encoding: 'utf8' });
  return [...new Set(named.split('\n').map(normalize).filter(Boolean))];
}

function decide(rules, files) {
  const reasons = [];
  let smoke = false;
  let full = false;

  const {
    webRuntimeGlobs,
    webRuntimeExcludeGlobs,
    fullWhenTestCodeGlobs,
    explicitFullEnv,
  } = rules.conservativePolicy;

  const highRisk = rules.highRiskWebPaths.globs ?? [];
  const common = rules.commonInteractionPaths.globs ?? [];
  const linked = rules.commonInteractionPaths.linkedHighRiskGlobs ?? [];
  const commonFull =
    rules.commonInteractionPaths.criticalJourneyLinked === true;

  const envName = explicitFullEnv || 'PLAYWRIGHT_FULL';
  if (process.env[envName] === '1' || process.env[envName] === 'true') {
    full = true;
    reasons.push(`${envName}=1 (담당자 명시 요청)`);
  }

  for (const file of files) {
    if (matchesAny(file, fullWhenTestCodeGlobs)) {
      full = true;
      reasons.push(`e2e/설정 변경: ${file}`);
    }

    const isWebRuntime =
      matchesAny(file, webRuntimeGlobs) &&
      !matchesAny(file, webRuntimeExcludeGlobs);

    if (isWebRuntime) {
      smoke = true;
      reasons.push(`웹 실행 코드 변경 → smoke: ${file}`);
    }

    if (highRisk.length > 0 && matchesAny(file, highRisk)) {
      full = true;
      reasons.push(`고위험 웹 경로 → full: ${file}`);
    }

    if (common.length > 0 && matchesAny(file, common)) {
      smoke = true;
      reasons.push(`공통 상호작용 경로 → smoke: ${file}`);
      if (commonFull || (linked.length > 0 && matchesAny(file, linked))) {
        full = true;
        reasons.push(`공통 상호작용(핵심 여정 연결) → full: ${file}`);
      }
    }
  }

  // full만 필요해도 smoke는 같이 돌릴 필요는 없음. 
  // 단 full이 켜져도 smoke가 따로 true일 수 있음.
  const commands = [];
  if (smoke) commands.push(rules.commands.smoke);
  if (full) commands.push(rules.commands.full);

  return {
    smoke,
    full,
    runNothing: !smoke && !full,
    commands,
    reasons: [...new Set(reasons)],
    listsEmpty: {
      highRiskWebPaths: highRisk.length === 0,
      commonInteractionPaths: common.length === 0,
    },
    note:
      highRisk.length === 0 && common.length === 0
        ? '고위험/공통 상호작용 목록이 비어 있어 경로 기반 자동 판단은 하지 않고, conservative 정책만 적용했다.'
        : null,
    files,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const rules = loadRules();
  const files =
    args.files.length > 0 ? args.files : changedFilesFromGit(args.base);
  const result = decide(rules, files);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  // CI에서 실패로 쓰지 않음. 선택 결과만 출력.
  process.exit(0);
}

main();
