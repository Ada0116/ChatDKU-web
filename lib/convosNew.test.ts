import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearSessionId,
  clearStoredEndpoint,
  deleteConversation,
  getConversations,
  getCurrentSessionId,
  getNewSession,
  getSessionMessages,
  getStoredEndpoint,
  renameConversation,
  setCurrentSessionId,
  setStoredEndpoint,
} from './convosNew';
import { API_ENDPOINTS } from './constants';

// Responses below mirror django_backend/chat/serializer.py exactly.
const jsonResponse = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
  mockFetch.mockReset();
  // Clear cookies between tests.
  for (const cookie of document.cookie.split('; ')) {
    const name = cookie.split('=')[0];
    if (name) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
  localStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getNewSession', () => {
  it('creates a session through create_session and stores the id', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse({ session_id: '08d8d518-bc9a-4f25-8e1a-8b6f3264f59b' }, { status: 201 }),
    );

    const sessionId = await getNewSession();

    expect(sessionId).toBe('08d8d518-bc9a-4f25-8e1a-8b6f3264f59b');
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/c/create_session/',
      expect.objectContaining({ method: 'GET', credentials: 'include' }),
    );
    expect(getCurrentSessionId()).toBe('08d8d518-bc9a-4f25-8e1a-8b6f3264f59b');
  });

  it('returns null and stores nothing when the backend rejects the caller', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ message: 'Unauthorized' }, { status: 401 }));

    expect(await getNewSession()).toBeNull();
    expect(getCurrentSessionId()).toBeNull();
  });

  it('returns null when the payload has no session_id', async () => {
    mockFetch.mockResolvedValue(jsonResponse({}));

    expect(await getNewSession()).toBeNull();
    expect(getCurrentSessionId()).toBeNull();
  });

  it('returns null when the network fails', async () => {
    mockFetch.mockRejectedValue(new Error('offline'));

    expect(await getNewSession()).toBeNull();
  });
});

describe('session id storage', () => {
  it('round-trips through a cookie', () => {
    expect(getCurrentSessionId()).toBeNull();

    setCurrentSessionId('abc-123');
    expect(getCurrentSessionId()).toBe('abc-123');

    clearSessionId();
    expect(getCurrentSessionId()).toBeNull();
  });

  it('reads its own cookie when others are present', () => {
    document.cookie = 'terms_accepted=true; path=/';
    document.cookie = 'other=value; path=/';
    setCurrentSessionId('abc-123');

    expect(getCurrentSessionId()).toBe('abc-123');
  });
});

describe('getSessionMessages', () => {
  it('maps Django message rows onto the UI shape', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse([
        { id: 1, role: 'user', message: 'Which majors exist?', created_at: '2026-08-01T10:00:00Z' },
        { id: 2, role: 'bot', message: 'DKU offers 24.', created_at: '2026-08-01T10:00:05Z' },
      ]),
    );

    const messages = await getSessionMessages('sess-1');

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/c/sess-1/messages/',
      expect.objectContaining({ method: 'GET' }),
    );
    expect(messages).toEqual([
      { role: 'user', content: 'Which majors exist?', timestamp: '2026-08-01T10:00:00Z' },
      { role: 'assistant', content: 'DKU offers 24.', timestamp: '2026-08-01T10:00:05Z' },
    ]);
  });

  it('url-encodes the session id', async () => {
    mockFetch.mockResolvedValue(jsonResponse([]));

    await getSessionMessages('a b/c');

    expect(mockFetch).toHaveBeenCalledWith('/api/c/a%20b%2Fc/messages/', expect.anything());
  });

  it('returns an empty list on error, non-arrays and network failure', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ detail: 'Not found.' }, { status: 404 }));
    expect(await getSessionMessages('missing')).toEqual([]);

    mockFetch.mockResolvedValue(jsonResponse({ not: 'an array' }));
    expect(await getSessionMessages('sess-1')).toEqual([]);

    mockFetch.mockRejectedValue(new Error('offline'));
    expect(await getSessionMessages('sess-1')).toEqual([]);
  });
});

describe('getConversations', () => {
  it('maps sessions and parses created_at', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse([
        { id: 'sess-1', title: 'Signature work', created_at: '2026-08-01T10:00:00Z' },
        { id: 'sess-2', title: '', created_at: '2026-07-30T09:00:00Z' },
      ]),
    );

    const convos = await getConversations();

    expect(mockFetch).toHaveBeenCalledWith(API_ENDPOINTS.CONVERSATIONS, expect.anything());
    expect(convos[0]).toEqual({
      id: 'sess-1',
      title: 'Signature work',
      created_at: new Date('2026-08-01T10:00:00Z'),
    });
    // An untitled session still needs something to render.
    expect(convos[1].title).toBe('New Chat');
  });

  it('returns an empty list when unauthorised', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ message: 'Unauthorized' }, { status: 401 }));
    expect(await getConversations()).toEqual([]);
  });
});

describe('renameConversation', () => {
  it('PATCHes the rename action with the new title', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ id: 'sess-1', title: 'Renamed' }));

    expect(await renameConversation('sess-1', 'Renamed')).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/c/sess-1/rename/',
      expect.objectContaining({ method: 'PATCH', body: JSON.stringify({ title: 'Renamed' }) }),
    );
  });

  it('reports failure without throwing', async () => {
    mockFetch.mockRejectedValue(new Error('offline'));
    expect(await renameConversation('sess-1', 'Renamed')).toBe(false);
  });
});

describe('deleteConversation', () => {
  it('DELETEs the session detail route and accepts 204', async () => {
    mockFetch.mockResolvedValue(new Response(null, { status: 204 }));

    expect(await deleteConversation('sess-1')).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/c/sess-1/',
      expect.objectContaining({ method: 'DELETE', credentials: 'include' }),
    );
  });

  it('returns false when the backend refuses', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ detail: 'Not found.' }, { status: 404 }));
    expect(await deleteConversation('sess-1')).toBe(false);
  });
});

describe('stored endpoint', () => {
  it('defaults to the chat endpoint and round-trips overrides', () => {
    expect(getStoredEndpoint()).toBe(API_ENDPOINTS.CHAT);

    setStoredEndpoint('/dev/qwen/chat');
    expect(getStoredEndpoint()).toBe('/dev/qwen/chat');

    clearStoredEndpoint();
    expect(getStoredEndpoint()).toBe(API_ENDPOINTS.CHAT);
  });
});
