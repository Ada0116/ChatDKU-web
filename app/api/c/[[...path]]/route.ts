import { NextRequest } from 'next/server';
import { backendFetch, backendUnreachable, relayResponse, useMockApi } from '@/lib/server/backend';
import {
  mockCreateSession,
  mockDeleteSession,
  mockRenameSession,
  mockSessionMessages,
  mockSessions,
} from '@/lib/mocks/sessions';

// Proxies Django's SessionViewSet (router-registered at /api/c/):
//   GET    /api/c/                 list sessions        -> [{ id, title, created_at }]
//   GET    /api/c/create_session/  new session          -> 201 { session_id }
//   GET    /api/c/{id}/messages/   session transcript   -> [{ id, role, message, created_at }]
//   PATCH  /api/c/{id}/rename/     rename               -> { id, title }
//   DELETE /api/c/{id}/            delete               -> 204

type RouteContext = { params: Promise<{ path?: string[] }> };

/** Django's router expects a trailing slash on every one of these routes. */
function backendPath(segments: string[]): string {
  return segments.length === 0 ? '/api/c/' : `/api/c/${segments.join('/')}/`;
}

async function proxy(request: NextRequest, context: RouteContext, method: string, body?: unknown) {
  const { path = [] } = await context.params;
  try {
    const response = await backendFetch(request, backendPath(path), { method, body });
    return relayResponse(response);
  } catch (error) {
    return backendUnreachable(`api/c ${method}`, error);
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { path = [] } = await context.params;

  if (useMockApi()) {
    if (path[0] === 'create_session') return Response.json(mockCreateSession(), { status: 201 });
    if (path.length === 0) return Response.json(mockSessions());
    if (path[1] === 'messages') return Response.json(mockSessionMessages(path[0]));
    return Response.json({ detail: 'Not found.' }, { status: 404 });
  }

  return proxy(request, context, 'GET');
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const body = await request.json().catch(() => ({}));

  if (useMockApi()) {
    const { path = [] } = await context.params;
    return Response.json(mockRenameSession(path[0], body?.title));
  }

  return proxy(request, context, 'PATCH', body);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  if (useMockApi()) {
    const { path = [] } = await context.params;
    mockDeleteSession(path[0]);
    return new Response(null, { status: 204 });
  }

  return proxy(request, context, 'DELETE');
}
