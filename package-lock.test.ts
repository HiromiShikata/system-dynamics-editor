import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

interface PackageLockFile {
  packages: Record<string, { version: string }>;
}

type SemverTuple = [number, number, number];

const packageLockJsonPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'package-lock.json');

const parseSemverTuple = (version: string): SemverTuple => {
  const [major, minor, patch] = version.split('.').map(Number) as SemverTuple;
  return [major, minor, patch];
};

const isSemverGreaterOrEqual = (actual: SemverTuple, minimum: SemverTuple): boolean => {
  if (actual[0] !== minimum[0]) return actual[0] > minimum[0];
  if (actual[1] !== minimum[1]) return actual[1] > minimum[1];
  return actual[2] >= minimum[2];
};

describe('package-lock.json source-map-js resolved version', () => {
  it('is at or above 1.2.2, the version patching GHSA-68fv-2mgg-jv7q', () => {
    const packageLock = JSON.parse(readFileSync(packageLockJsonPath, 'utf-8')) as PackageLockFile;
    const resolvedVersion = packageLock.packages['node_modules/source-map-js'].version;

    expect(isSemverGreaterOrEqual(parseSemverTuple(resolvedVersion), [1, 2, 2])).toBe(true);
  });
});

describe('package-lock.json brace-expansion resolved version', () => {
  it('is at or above 5.0.12, the version patching GHSA-q2hr-2g5m-vwhr', () => {
    const packageLock = JSON.parse(readFileSync(packageLockJsonPath, 'utf-8')) as PackageLockFile;
    const resolvedVersion = packageLock.packages['node_modules/brace-expansion'].version;

    expect(isSemverGreaterOrEqual(parseSemverTuple(resolvedVersion), [5, 0, 12])).toBe(true);
  });
});
