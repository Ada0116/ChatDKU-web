import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from './route';

// Proxy onto Django's WeeklyEventsView (chat/urls.py registers it as a plain
// `path('events')`, so the backend path carries no trailing slash).

const BACKEND = 'http://127.0.0.1:8009';
const mockFetch = vi.fn();

const payload = {
  events: [
    {
      title: 'Career Talk',
      date: '2026-05-30',
      start_time: '13:00:00',
      end_time: null,
      location: 'Academic Building',
      sponsor: 'Career Services',
      open_to: 'All students',
      speaker: '',
      url: 'https://example.com',
    },
  ],
};

const get = (query: string, headers: Record<string, string> = {}) =>
  GET(new NextRequest(`http://localhost:3000/api/events${query}`, { headers }));

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
  mockFetch.mockReset();
  mockFetch.mockResolvedValue(
    new Response(JSON.stringify(payload), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );
});

describe('GET /api/events', () => {
  it('forwards the date window to the backend and relays the payload', async () => {
    const response = await get('?start_date=2026-05-25&end_date=2026-05-31');

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(payload);

    const [url] = mockFetch.mock.calls[0];
    expect(url).toBe(`${BACKEND}/api/events?start_date=2026-05-25&end_date=2026-05-31`);
  });

  it.each([
    ['no dates', ''],
    ['only start_date', '?start_date=2026-05-25'],
    ['only end_date', '?end_date=2026-05-31'],
  ])('rejects %s without calling the backend', async (_label, query) => {
    const response = await get(query);

    expect(response.status).toBe(400);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('forwards the session cookie so IsAuthenticated passes', async () => {
    await get('?start_date=2026-05-25&end_date=2026-05-31', { cookie: 'sessionid=abc123' });

    const [, init] = mockFetch.mock.calls[0];
    expect(new Headers(init.headers).get('cookie')).toBe('sessionid=abc123');
  });

  it('relays a backend error status instead of masking it', async () => {
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ error: 'Invalid date format, use YYYY-MM-DD' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const response = await get('?start_date=nonsense&end_date=2026-05-31');

    expect(response.status).toBe(400);
  });

  it('returns 502 when the backend is unreachable', async () => {
    mockFetch.mockRejectedValue(new Error('ECONNREFUSED'));

    const response = await get('?start_date=2026-05-25&end_date=2026-05-31');

    expect(response.status).toBe(502);
  });
});
