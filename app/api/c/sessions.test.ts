import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { DELETE, GET, PATCH } from './[[...path]]/route';

// Proxy onto Django's SessionViewSet. Every backend path it builds must carry
// the router's trailing slash.

const BACKEND = 'http://10.200.14.39:8999';
const mockFetch = vi.fn();

const context = (path?: string[]) => ({ params: Promise.resolve({ path }) });

const request = (url: string, init: RequestInit = {}) =>
  new NextRequest(`http://localhost:3000${url}`, init as ConstructorParameters<typeof NextRequest>[1]);

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
  mockFetch.mockReset();
  mockFetch.mockResolvedValue(
    new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );
});

describe('path mapping', () => {
  it.each([
    [undefined, '/api/c/'],
    [[], '/api/c/'],
    [['create_session'], '/api/c/create_session/'],
    [['sess-1', 'messages'], '/api/c/sess-1/messages/'],
  ])('GET %j -> %s', async (path, expected) => {
    await GET(request('/api/c/'), context(path as string[] | undefined));
    expect(mockFetch.mock.calls[0][0]).toBe(`${BACKEND}${expected}`);
  });

  it('PATCH maps to the rename action and forwards the title', async () => {
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ id: 'sess-1', title: 'Renamed' }), { status: 200 }),
    );

    await PATCH(
      request('/api/c/sess-1/rename/', {
        method: 'PATCH',
        body: JSON.stringify({ title: 'Renamed' }),
      }),
      context(['sess-1', 'rename']),
    );

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe(`${BACKEND}/api/c/sess-1/rename/`);
    expect(init.method).toBe('PATCH');
    expect(JSON.parse(init.body)).toEqual({ title: 'Renamed' });
  });

  it('DELETE maps to the session detail route', async () => {
    mockFetch.mockResolvedValue(new Response(null, { status: 204 }));

    const response = await DELETE(
      request('/api/c/sess-1/', { method: 'DELETE' }),
      context(['sess-1']),
    );

    expect(mockFetch.mock.calls[0][0]).toBe(`${BACKEND}/api/c/sess-1/`);
    expect(response.status).toBe(204);
  });
});

describe('relaying', () => {
  it('passes the session list through unchanged', async () => {
    const sessions = [{ id: 'sess-1', title: 'Signature work', created_at: '2026-08-01T10:00:00Z' }];
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify(sessions), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const response = await GET(request('/api/c/'), context([]));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(sessions);
  });

  it('keeps 201 on session creation', async () => {
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ session_id: 'sess-9' }), { status: 201 }),
    );

    const response = await GET(request('/api/c/create_session/'), context(['create_session']));

    expect(response.status).toBe(201);
  });

  it('relays the backend 401 rather than inventing data', async () => {
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 }),
    );

    const response = await GET(request('/api/c/'), context([]));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ message: 'Unauthorized' });
  });

  it("relays Django's session cookie back to the browser", async () => {
    mockFetch.mockResolvedValue(
      new Response('[]', {
        status: 200,
        headers: { 'Set-Cookie': 'sessionid=abc; Path=/; HttpOnly' },
      }),
    );

    const response = await GET(request('/api/c/'), context([]));

    expect(response.headers.get('set-cookie')).toContain('sessionid=abc');
  });

  it('forwards auth headers on every method', async () => {
    const headers = { UID: 'ab123', Cookie: 'sessionid=xyz' };

    await GET(request('/api/c/', { headers }), context([]));
    await DELETE(request('/api/c/sess-1/', { method: 'DELETE', headers }), context(['sess-1']));

    for (const call of mockFetch.mock.calls) {
      expect((call[1].headers as Headers).get('uid')).toBe('ab123');
      expect((call[1].headers as Headers).get('cookie')).toBe('sessionid=xyz');
    }
  });

  it('reports an unreachable backend as 502', async () => {
    mockFetch.mockRejectedValue(new Error('ECONNREFUSED'));

    const response = await GET(request('/api/c/'), context([]));

    expect(response.status).toBe(502);
  });
});
