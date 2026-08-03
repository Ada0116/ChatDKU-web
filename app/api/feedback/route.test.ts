import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';

// Proxy onto Django's FeedbackView, which stores
// { userInput, botAnswer, feedbackReason, chatHistoryId }.

const BACKEND = 'http://127.0.0.1:8009';
const mockFetch = vi.fn();

const valid = {
  userInput: 'What are the dining hours?',
  botAnswer: 'Marketplace serves dinner until 8pm.',
  feedbackReason: 'helpful',
  chatHistoryId: '08d8d518-bc9a-4f25-8e1a-8b6f3264f59b',
};

const post = (body: unknown, headers: Record<string, string> = {}) =>
  POST(
    new NextRequest('http://localhost:3000/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  );

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
  mockFetch.mockReset();
  mockFetch.mockResolvedValue(
    new Response(JSON.stringify({ message: 'Feedback saved successfully' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    }),
  );
});

describe('POST /api/feedback', () => {
  it('forwards valid feedback to the backend and relays 201', async () => {
    const response = await post(valid);

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({ message: 'Feedback saved successfully' });

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe(`${BACKEND}/api/feedback`);
    expect(JSON.parse(init.body)).toEqual(valid);
  });

  it.each([
    ['userInput', { ...valid, userInput: '' }],
    ['botAnswer', { ...valid, botAnswer: '' }],
    ['feedbackReason', { ...valid, feedbackReason: '' }],
    ['chatHistoryId', { ...valid, chatHistoryId: undefined }],
  ])('rejects feedback missing %s', async (_field, body) => {
    const response = await post(body);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: 'Missing required fields' });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('rejects a blank or non-string session id', async () => {
    const blank = await post({ ...valid, chatHistoryId: '   ' });
    expect(blank.status).toBe(400);
    await expect(blank.json()).resolves.toEqual({ error: 'Invalid chat history ID' });

    const numeric = await post({ ...valid, chatHistoryId: 42 });
    expect(numeric.status).toBe(400);

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('rejects a malformed body', async () => {
    const response = await post('not json');

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: 'Invalid request body' });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('preserves long answers and special characters', async () => {
    const body = {
      ...valid,
      botAnswer: 'x'.repeat(5000),
      feedbackReason: 'Wrong — the 食堂 closes at 20:00 <script>alert(1)</script>',
    };

    await post(body);

    expect(JSON.parse(mockFetch.mock.calls[0][1].body)).toEqual(body);
  });

  it('forwards auth headers', async () => {
    await post(valid, { UID: 'ab123', Cookie: 'sessionid=xyz' });

    const headers = mockFetch.mock.calls[0][1].headers as Headers;
    expect(headers.get('uid')).toBe('ab123');
    expect(headers.get('cookie')).toBe('sessionid=xyz');
  });

  it('relays a backend failure instead of reporting success', async () => {
    mockFetch.mockResolvedValue(new Response('{"message":"boom"}', { status: 500 }));

    const response = await post(valid);

    expect(response.status).toBe(500);
  });

  it('reports an unreachable backend as 502', async () => {
    mockFetch.mockRejectedValue(new Error('ECONNREFUSED'));

    const response = await post(valid);

    expect(response.status).toBe(502);
  });
});
