import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';
import { GET } from './[chatId]/route';

// These handlers proxy Django's Chat and ChatStream views. NODE_ENV is
// "test" here, so isMockApi() is false and every call goes to the backend.

const BACKEND = 'http://127.0.0.1:8009';
const mockFetch = vi.fn();

const post = (body: unknown, headers: Record<string, string> = {}) =>
  POST(
    new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
    }),
  );

const getStream = (query: string, headers: Record<string, string> = {}) =>
  GET(new NextRequest(`http://localhost:3000/api/chat/chat-1${query}`, { headers }), {
    params: Promise.resolve({ chatId: 'chat-1' }),
  });

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
  mockFetch.mockReset();
});

describe('POST /api/chat', () => {
  it('forwards the turn and relays 202 { chatId, sessionId }', async () => {
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ chatId: 'chat-1', sessionId: 'sess-1' }), {
        status: 202,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const response = await post({
      chatHistoryId: 'sess-1',
      messages: [{ role: 'user', content: 'hi' }],
      mode: 'default',
    });

    expect(response.status).toBe(202);
    await expect(response.json()).resolves.toEqual({ chatId: 'chat-1', sessionId: 'sess-1' });

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe(`${BACKEND}/api/chat`);
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual({
      chatHistoryId: 'sess-1',
      messages: [{ role: 'user', content: 'hi' }],
      mode: 'default',
    });
  });

  it('forwards Shibboleth auth so the backend can identify the user', async () => {
    mockFetch.mockResolvedValue(new Response('{}', { status: 202 }));

    await post(
      { chatHistoryId: 'sess-1', messages: [] },
      { UID: 'ab123', 'X-DisplayName': 'Ada', Cookie: 'sessionid=xyz' },
    );

    const headers = mockFetch.mock.calls[0][1].headers as Headers;
    expect(headers.get('uid')).toBe('ab123');
    expect(headers.get('x-displayname')).toBe('Ada');
    expect(headers.get('cookie')).toBe('sessionid=xyz');
  });

  it('rejects a turn with no session before calling the backend', async () => {
    const response = await post({ messages: [{ role: 'user', content: 'hi' }] });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: 'chatHistoryId is required' });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('rejects a malformed body', async () => {
    const response = await POST(
      new NextRequest('http://localhost:3000/api/chat', { method: 'POST', body: 'not json' }),
    );

    expect(response.status).toBe(400);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('passes a backend rejection through untouched', async () => {
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const response = await post({ chatHistoryId: 'sess-1', messages: [] });

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ message: 'Unauthorized' });
  });

  it('reports an unreachable backend as 502', async () => {
    mockFetch.mockRejectedValue(new Error('ECONNREFUSED'));

    const response = await post({ chatHistoryId: 'sess-1', messages: [] });

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      error: 'Backend unreachable: ECONNREFUSED',
    });
  });
});

describe('GET /api/chat/[chatId]', () => {
  it('streams the backend SSE body through as text/event-stream', async () => {
    const body = 'id: 1\ndata: {"type":"chunk","stage":"generation","content":"hi"}\n\n';
    mockFetch.mockResolvedValue(
      new Response(body, { status: 200, headers: { 'Content-Type': 'text/event-stream' } }),
    );

    const response = await getStream('?sessionId=sess-1');

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('text/event-stream');
    // Nginx buffers SSE unless told otherwise.
    expect(response.headers.get('x-accel-buffering')).toBe('no');
    await expect(response.text()).resolves.toBe(body);

    expect(mockFetch.mock.calls[0][0]).toBe(`${BACKEND}/api/chat/chat-1?sessionId=sess-1`);
  });

  it('requires a sessionId', async () => {
    const response = await getStream('');

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: 'sessionId is required' });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('url-encodes the query it builds', async () => {
    mockFetch.mockResolvedValue(new Response('', { status: 200 }));

    await getStream('?sessionId=a%20b');

    expect(mockFetch.mock.calls[0][0]).toBe(`${BACKEND}/api/chat/chat-1?sessionId=a%20b`);
  });

  it('reports an unreachable backend as 502', async () => {
    mockFetch.mockRejectedValue(new Error('socket hang up'));

    const response = await getStream('?sessionId=sess-1');

    expect(response.status).toBe(502);
  });
});
