// Server-side helpers for talking to the Django backend.
//
// Every route handler under app/api and app/user is a thin proxy onto the real
// backend and mirrors its URL structure 1:1, so it does not matter whether
// nginx sends a given prefix to this Node server or straight to Django — both
// produce the same responses.
//
// Backend reference (ChatDKU-backend, django_backend/):
//   GET    /user/                       -> { netid, username, role }
//   GET    /user/upload                 -> { netid, document: string[] }
//   POST   /user/upload                 -> multipart field `file_` (pdf, <=10MB)
//   GET    /api/c/create_session/       -> 201 { session_id }
//   GET    /api/c/                      -> [{ id, title, created_at }]
//   GET    /api/c/{id}/messages/        -> [{ id, role, message, created_at }]
//   PATCH  /api/c/{id}/rename/          -> { id, title }
//   DELETE /api/c/{id}/                 -> 204
//   POST   /api/chat                    -> 202 { chatId, sessionId }
//   GET    /api/chat/{chatId}?sessionId -> text/event-stream
//   POST   /api/feedback                -> 201 { message }
//
// Auth: core.auth.ShibbolethAuthentication reads the `UID` header (injected by
// Shibboleth at the edge) or `netid` off the Django session cookie, and
// core.middleware.GETNetIDMiddleware 401s anything with neither. So both the
// cookie and the Shibboleth headers have to be forwarded on every hop, and
// Django's Set-Cookie has to come back out, or each request would start a new
// session server-side.

export const BACKEND_BASE_URL = (
  process.env.BACKEND_BASE_URL ?? 'http://10.200.14.39:8999'
).replace(/\/$/, '');

/** Mock data is on by default in `npm run dev`; set MOCK_API=false to hit the real backend. */
export function isMockApi(): boolean {
  return process.env.NODE_ENV === 'development' && process.env.MOCK_API !== 'false';
}

const FORWARDED_REQUEST_HEADERS = ['cookie', 'uid', 'x-displayname', 'affiliation'];

function forwardedHeaders(request: Request, extra: Record<string, string> = {}): Headers {
  const headers = new Headers();
  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  for (const [name, value] of Object.entries(extra)) {
    headers.set(name, value);
  }
  return headers;
}

export interface BackendRequestInit {
  method?: string;
  /** Serialised as JSON unless it is already a BodyInit. */
  body?: unknown;
  headers?: Record<string, string>;
}

/** Calls `path` (e.g. "/api/c/") on the backend with this request's auth forwarded. */
export function backendFetch(
  request: Request,
  path: string,
  init: BackendRequestInit = {},
): Promise<Response> {
  const { method = 'GET', body, headers = {} } = init;

  const isRawBody =
    body instanceof FormData ||
    body instanceof ReadableStream ||
    body instanceof URLSearchParams ||
    typeof body === 'string';

  const extra = { ...headers };
  if (body !== undefined && !isRawBody) {
    extra['Content-Type'] = 'application/json';
  }

  return fetch(`${BACKEND_BASE_URL}${path}`, {
    method,
    headers: forwardedHeaders(request, extra),
    body:
      body === undefined
        ? undefined
        : isRawBody
          ? (body as BodyInit)
          : JSON.stringify(body),
    // Multipart/stream uploads need this to send a request body without buffering it.
    ...(body instanceof ReadableStream ? { duplex: 'half' } : {}),
  } as RequestInit);
}

const FORWARDED_RESPONSE_HEADERS = ['content-type', 'cache-control'];

/**
 * Relays a backend response to the browser, preserving status, content type and
 * Set-Cookie. Streaming responses (SSE) are piped through unbuffered.
 */
export function relayResponse(backendResponse: Response, options: { stream?: boolean } = {}): Response {
  const headers = new Headers();
  for (const name of FORWARDED_RESPONSE_HEADERS) {
    const value = backendResponse.headers.get(name);
    if (value) headers.set(name, value);
  }

  // Django's session cookie has to reach the browser, otherwise every proxied
  // request creates a fresh server-side session.
  const setCookie = backendResponse.headers.getSetCookie?.() ?? [];
  for (const cookie of setCookie) {
    headers.append('set-cookie', cookie);
  }

  if (options.stream) {
    headers.set('Cache-Control', 'no-cache, no-transform');
    headers.set('Connection', 'keep-alive');
    headers.set('X-Accel-Buffering', 'no');
  }

  // 204/304 must not carry a body.
  const body = backendResponse.status === 204 || backendResponse.status === 304
    ? null
    : backendResponse.body;

  return new Response(body, { status: backendResponse.status, headers });
}

/** Uniform 502 for an unreachable backend. */
export function backendUnreachable(context: string, error: unknown): Response {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(`[${context}] backend request failed:`, message);
  return Response.json({ error: `Backend unreachable: ${message}` }, { status: 502 });
}
