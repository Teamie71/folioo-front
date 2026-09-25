import type {
  BodyChatStreamApiV1ExperienceMapSessionsSessionIdChatStreamPost,
  RetryStreamRequest,
} from '@/api/ai/models';

const aiBaseUrl =
  process.env.NEXT_PUBLIC_AI_API_BASE_URL ??
  'https://folioo-ai-dev.onrender.com';

type StreamEvent = {
  event: string;
  data: unknown;
};

type StreamOptions = {
  sessionId: string;
  ticket: string;
  signal?: AbortSignal;
  onEvent: (event: StreamEvent) => void;
};

function parseEvent(frame: string): StreamEvent | null {
  let event = 'message';
  const data: string[] = [];
  for (const line of frame.split('\n')) {
    if (line.startsWith('event:')) event = line.slice(6).trim();
    if (line.startsWith('data:')) data.push(line.slice(5).trimStart());
  }
  if (!data.length) return null;
  const value = data.join('\n');
  if (value === '[DONE]') return { event: 'done', data: null };
  try {
    return { event, data: JSON.parse(value) as unknown };
  } catch {
    return { event, data: value };
  }
}

async function readStream(response: Response, onEvent: StreamOptions['onEvent']) {
  if (!response.ok) {
    throw new Error(`AI stream request failed (${response.status}): ${await response.text()}`);
  }
  if (!response.body) throw new Error('AI stream response has no body');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value, { stream: !done }).replace(/\r\n/g, '\n');
      const frames = buffer.split('\n\n');
      buffer = frames.pop() ?? '';
      for (const frame of frames) {
        const parsed = parseEvent(frame);
        if (parsed) onEvent(parsed);
      }
      if (done) break;
    }
    const last = parseEvent(buffer);
    if (last) onEvent(last);
  } finally {
    reader.releaseLock();
  }
}

function streamUrl(sessionId: string, suffix: string) {
  return `${aiBaseUrl.replace(/\/$/, '')}/api/v1/experience-map/sessions/${encodeURIComponent(sessionId)}/${suffix}`;
}

/** AI 서버의 TicketAuth를 사용한다. Folioo access token은 전달하지 않는다. */
export async function streamExperienceAgentChat(
  options: StreamOptions & {
    body: BodyChatStreamApiV1ExperienceMapSessionsSessionIdChatStreamPost;
  },
) {
  const form = new FormData();
  form.append('request', options.body.request);
  for (const file of options.body.files ?? []) form.append('files', file);
  const response = await fetch(streamUrl(options.sessionId, 'chat/stream'), {
    method: 'POST',
    headers: {
      Accept: 'text/event-stream',
      Authorization: `Bearer ${options.ticket}`,
    },
    body: form,
    signal: options.signal,
  });
  await readStream(response, options.onEvent);
}

export async function streamExperienceAgentRetry(
  options: StreamOptions & { body: RetryStreamRequest },
) {
  const response = await fetch(streamUrl(options.sessionId, 'retry/stream'), {
    method: 'POST',
    headers: {
      Accept: 'text/event-stream',
      Authorization: `Bearer ${options.ticket}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options.body),
    signal: options.signal,
  });
  await readStream(response, options.onEvent);
}
