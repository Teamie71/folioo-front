import { useAuthStore } from '@/store/useAuthStore';

const getBaseUrl = () =>
  (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/$/, '');

export async function fetchSSEStream<T = unknown>(params: {
  path: string;
  method: 'POST' | 'GET';
  body?: string;
  signal?: AbortSignal;
  onEvent: (event: T) => void;
  onError?: (error: Error) => void;
  onDone?: () => void;
}): Promise<void> {
  const { path, method, body, signal, onEvent, onError, onDone } = params;
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${path}`;
  const token = useAuthStore.getState().accessToken;
  const headers: Record<string, string> = {
    Accept: 'text/event-stream',
    ...(body ? { 'Content-Type': 'application/json' } : {}),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: body ?? undefined,
      credentials: 'include',
      signal,
    });

    if (!res.ok) {
      const text = await res.text();
      const err = new Error(`SSE request failed: ${res.status} ${text}`) as Error & { status?: number };
      err.status = res.status;
      throw err;
    }

    const reader = res.body?.getReader();
    if (!reader) {
      onError?.(new Error('No response body'));
      return;
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const dataLine = line.startsWith('data: ')
          ? line.slice(6).trim()
          : line.trim();
        if (dataLine === '' || dataLine === '[DONE]') continue;
        try {
          const parsed = JSON.parse(dataLine) as T;
          onEvent(parsed);
        } catch {}
      }
    }

    if (buffer.trim()) {
      const dataLine = buffer.startsWith('data: ')
        ? buffer.slice(6).trim()
        : buffer.trim();
      if (dataLine && dataLine !== '[DONE]') {
        try {
          const parsed = JSON.parse(dataLine) as T;
          onEvent(parsed);
        } catch {}
      }
    }

    onDone?.();
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      onDone?.();
      return;
    }
    const error = err instanceof Error ? err : new Error(String(err));
    if (err && typeof err === 'object' && 'status' in err) {
      (error as Error & { status?: number }).status = (err as { status?: number }).status;
    }
    onError?.(error);
    onDone?.();
  }
}
