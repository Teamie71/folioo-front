import { beforeEach, expect, it, vi } from 'vitest';
import axios, {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from 'axios';
import api, { refreshSession } from './axios';
import { useAuthStore } from '@/store/useAuthStore';
function response(config: InternalAxiosRequestConfig, status = 200) {
  return {
    config,
    data: {},
    status,
    statusText: '',
    headers: new AxiosHeaders(),
  };
}
function reject(config: InternalAxiosRequestConfig, status = 401) {
  return Promise.reject(
    new AxiosError('rejected', '', config, undefined, response(config, status)),
  );
}
beforeEach(() => {
  vi.restoreAllMocks();
  useAuthStore.getState().clearAuth();
  useAuthStore.getState().setAccessToken('old');
});
it('shares refresh and retries concurrent writes with the new token', async () => {
  const post = vi
    .spyOn(axios, 'post')
    .mockResolvedValue({ data: { isSuccess: true, result: 'new' } });
  const adapter = vi.fn(async (c: InternalAxiosRequestConfig) =>
    c.headers.Authorization === 'Bearer old' ? reject(c) : response(c),
  );
  await Promise.all([
    api.get('/one', { adapter }),
    api.patch('/two', { text: 'draft' }, { adapter }),
  ]);
  expect(post).toHaveBeenCalledTimes(1);
  expect(post.mock.calls[0][2]).toEqual({ withCredentials: true });
  expect(adapter).toHaveBeenCalledTimes(4);
  expect(useAuthStore.getState().accessToken).toBe('new');
});
it('expires the session when refresh fails', async () => {
  vi.spyOn(axios, 'post').mockRejectedValue(new Error('missing cookie'));
  const adapter = vi.fn((c: InternalAxiosRequestConfig) => reject(c));
  await expect(api.get('/one', { adapter })).rejects.toThrow('missing cookie');
  expect(adapter).toHaveBeenCalledTimes(1);
  expect(useAuthStore.getState().sessionExpired).toBe(true);
});
it('does not refresh 403 or refresh requests', async () => {
  const post = vi.spyOn(axios, 'post');
  await expect(
    api.get('/one', { adapter: (c) => reject(c, 403) }),
  ).rejects.toThrow();
  await expect(
    api.post('/auth/refresh', undefined, { adapter: (c) => reject(c) }),
  ).rejects.toThrow();
  expect(post).not.toHaveBeenCalled();
});
it('does not loop when the new token is rejected', async () => {
  const post = vi
    .spyOn(axios, 'post')
    .mockResolvedValue({ data: { isSuccess: true, result: 'new' } });
  const adapter = vi.fn((c: InternalAxiosRequestConfig) => reject(c));
  await expect(api.get('/one', { adapter })).rejects.toThrow();
  expect(adapter).toHaveBeenCalledTimes(2);
  expect(post).toHaveBeenCalledTimes(1);
});
it('discards refresh arriving after logout', async () => {
  let complete!: (value: { data: unknown }) => void;
  vi.spyOn(axios, 'post').mockImplementation(
    () =>
      new Promise((resolve) => {
        complete = resolve;
      }),
  );
  const pending = refreshSession();
  useAuthStore.getState().clearAuth();
  complete({ data: { isSuccess: true, result: 'new' } });
  await expect(pending).rejects.toThrow('인증 상태가 변경');
  expect(useAuthStore.getState().accessToken).toBeNull();
});

it('reuses the current token for a late 401 without another refresh', async () => {
  const post = vi
    .spyOn(axios, 'post')
    .mockResolvedValue({ data: { isSuccess: true, result: 'new' } });
  let release!: () => void;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  const adapter = async (c: InternalAxiosRequestConfig) => {
    if (c.headers.Authorization !== 'Bearer old') return response(c);
    if (c.url === '/late') await held;
    return reject(c);
  };
  const late = api.get('/late', { adapter });
  await api.get('/early', { adapter });
  release();
  await late;
  expect(post).toHaveBeenCalledTimes(1);
});

it('never replays an old request under a different login', async () => {
  const post = vi.spyOn(axios, 'post');
  let release!: () => void;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  const pending = api.get('/old-account', {
    adapter: async (c) => {
      await held;
      return reject(c);
    },
  });
  await Promise.resolve();
  useAuthStore.getState().clearAuth();
  useAuthStore.getState().setAccessToken('other-account');
  release();
  await expect(pending).rejects.toThrow();
  expect(post).not.toHaveBeenCalled();
  expect(useAuthStore.getState().accessToken).toBe('other-account');
});
