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

describe('package-lock.json lucide-react resolved version', () => {
  it('is at or above 1.55.0, the version targeted by the weekly dependency refresh', () => {
    const packageLock = JSON.parse(readFileSync(packageLockJsonPath, 'utf-8')) as PackageLockFile;
    const resolvedVersion = packageLock.packages['node_modules/lucide-react'].version;

    expect(isSemverGreaterOrEqual(parseSemverTuple(resolvedVersion), [1, 55, 0])).toBe(true);
  });
});

describe('package-lock.json vite resolved version', () => {
  it('is at or above 8.3.4, the version targeted by the weekly dependency refresh', () => {
    const packageLock = JSON.parse(readFileSync(packageLockJsonPath, 'utf-8')) as PackageLockFile;
    const resolvedVersion = packageLock.packages['node_modules/vite'].version;

    expect(isSemverGreaterOrEqual(parseSemverTuple(resolvedVersion), [8, 3, 4])).toBe(true);
  });
});

describe('package-lock.json storybook resolved version', () => {
  it('is at or above 10.6.2, the version patching GHSA-f2ph-cmg5-wxc8 and GHSA-px85-f4q5-jh77', () => {
    const packageLock = JSON.parse(readFileSync(packageLockJsonPath, 'utf-8')) as PackageLockFile;
    const resolvedVersion = packageLock.packages['node_modules/storybook'].version;

    expect(isSemverGreaterOrEqual(parseSemverTuple(resolvedVersion), [10, 6, 2])).toBe(true);
  });
});

const resolvedCopiesOutsideNpm = (packageLock: PackageLockFile, packageName: string): string[] =>
  Object.entries(packageLock.packages)
    .filter(([key]) => !key.startsWith('node_modules/npm/') && key.endsWith(`node_modules/${packageName}`))
    .map(([, entry]) => entry.version);

describe('package-lock.json glob copies outside the bundled npm package', () => {
  it('resolve every copy at or above 14.0.2, the version patching GHSA-3g3m-2fjr-6pw4', () => {
    const packageLock = JSON.parse(readFileSync(packageLockJsonPath, 'utf-8')) as PackageLockFile;
    const resolvedVersions = resolvedCopiesOutsideNpm(packageLock, 'glob');

    expect(resolvedVersions.length).toBeGreaterThan(0);
    for (const resolvedVersion of resolvedVersions) {
      expect(isSemverGreaterOrEqual(parseSemverTuple(resolvedVersion), [14, 0, 2])).toBe(true);
    }
  });
});

describe('package-lock.json minimatch copies outside the bundled npm package', () => {
  it('resolve every copy at or above 11.0.1, the version patching GHSA-g3hv-75wg-m249', () => {
    const packageLock = JSON.parse(readFileSync(packageLockJsonPath, 'utf-8')) as PackageLockFile;
    const resolvedVersions = resolvedCopiesOutsideNpm(packageLock, 'minimatch');

    expect(resolvedVersions.length).toBeGreaterThan(0);
    for (const resolvedVersion of resolvedVersions) {
      expect(isSemverGreaterOrEqual(parseSemverTuple(resolvedVersion), [11, 0, 1])).toBe(true);
    }
  });
});
