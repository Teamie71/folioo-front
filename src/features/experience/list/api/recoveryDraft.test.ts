import { afterEach, expect, it, vi } from 'vitest';
import {
  clearRecoveryDraft,
  readRecoveryDraft,
  saveRecoveryDraft,
} from './recoveryDraft';

afterEach(() => {
  clearRecoveryDraft();
  vi.unstubAllGlobals();
});
it('preserves an independent draft across module reloads', async () => {
  const data = new Map<string, string>();
  vi.stubGlobal('sessionStorage', {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => data.set(key, value),
    removeItem: (key: string) => data.delete(key),
  });
  const draft = { groups: [], experiences: [] };
  saveRecoveryDraft(draft);
  vi.resetModules();
  const reloaded = await import('./recoveryDraft');
  expect(reloaded.readRecoveryDraft()).toEqual(draft);
  reloaded.clearRecoveryDraft();
  expect(readRecoveryDraft()).toEqual(draft); // 기존 메모리 사본도 명시적으로 정리한다.
});
it('keeps a memory copy when browser storage is unavailable', () => {
  vi.stubGlobal('sessionStorage', {
    setItem() {
      throw new Error('quota');
    },
    getItem() {
      throw new Error('blocked');
    },
  });
  const draft = { groups: [], experiences: [] };
  saveRecoveryDraft(draft);
  expect(readRecoveryDraft()).toEqual(draft);
});
