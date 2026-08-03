import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { userAPI } from './user';

// Client for Django's core app. Response shapes come from core/views.py:
// HealthView -> { netid, username, role }; UploadView -> { netid, document[] }.

const mockFetch = vi.fn();

const jsonResponse = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
  mockFetch.mockReset();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getUserProfile', () => {
  it('reads the identity from the user endpoint', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse({ netid: 'ab123', username: 'Ada Lovelace', role: 'student' }),
    );

    await expect(userAPI.getUserProfile()).resolves.toEqual({
      netid: 'ab123',
      name: 'Ada Lovelace',
      role: 'student',
    });
    expect(mockFetch).toHaveBeenCalledWith(
      '/user',
      expect.objectContaining({ method: 'GET', credentials: 'include' }),
    );
  });

  it('asks for /user without a trailing slash', async () => {
    // Apache maps `/user` onto `http://127.0.0.1:8009/user/`, appending whatever
    // follows. A trailing slash here would reach Django as `/user//`, which its
    // resolver does not match. See lib/constants.ts.
    mockFetch.mockResolvedValue(jsonResponse({ netid: 'ab123', username: 'Ada', role: '' }));

    await userAPI.getUserProfile();

    expect(mockFetch.mock.calls[0][0]).toBe('/user');
  });

  it('falls back to a placeholder when unauthenticated', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ message: 'Unauthorized' }, { status: 401 }));

    await expect(userAPI.getUserProfile()).resolves.toEqual({ netid: '', name: 'User', role: '' });
  });

  it('falls back when the network fails', async () => {
    mockFetch.mockRejectedValue(new Error('offline'));

    await expect(userAPI.getUserProfile()).resolves.toEqual({ netid: '', name: 'User', role: '' });
  });
});

describe('getUploadedDocuments', () => {
  it('maps the document filename list', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse({ netid: 'ab123', document: ['handbook.pdf', 'syllabus.pdf'] }),
    );

    await expect(userAPI.getUploadedDocuments()).resolves.toEqual([
      { id: 'handbook.pdf', filename: 'handbook.pdf' },
      { id: 'syllabus.pdf', filename: 'syllabus.pdf' },
    ]);
    expect(mockFetch).toHaveBeenCalledWith('/user/upload', expect.objectContaining({ method: 'GET' }));
  });

  it('returns an empty list when the payload has no documents', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ netid: 'ab123' }));

    await expect(userAPI.getUploadedDocuments()).resolves.toEqual([]);
  });

  it('returns an empty list on failure', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ error: 'boom' }, { status: 500 }));

    await expect(userAPI.getUploadedDocuments()).resolves.toEqual([]);
  });
});

describe('uploadDocument', () => {
  it('posts multipart data under the field UploadView expects', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ message: 'File uploaded successfully' }, { status: 201 }));
    const file = new File(['%PDF-1.4'], 'syllabus.pdf', { type: 'application/pdf' });

    const uploaded = await userAPI.uploadDocument(file);

    expect(uploaded).toMatchObject({ id: 'syllabus.pdf', filename: 'syllabus.pdf' });

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('/user/upload');
    expect(init.method).toBe('POST');
    expect((init.body as FormData).get('file_')).toBe(file);
  });

  it('returns null when the backend rejects the file', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse({ file_: ['File should end with PDF'] }, { status: 400 }),
    );

    await expect(
      userAPI.uploadDocument(new File(['x'], 'notes.txt', { type: 'text/plain' })),
    ).resolves.toBeNull();
  });
});

describe('deleteDocument', () => {
  it('reports that the backend has no delete route rather than failing silently', async () => {
    await expect(userAPI.deleteDocument('handbook.pdf')).rejects.toThrow(
      /not supported by the backend/i,
    );
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
