import { NextRequest } from 'next/server';
import { backendFetch, backendUnreachable, relayResponse, useMockApi } from '@/lib/server/backend';

// POST /api/chat -> Django chat.views.Chat
// Body: { chatHistoryId, messages: [{role, content}], mode?: "default"|"agent", sources?: string[] }
// Returns 202 { chatId, sessionId }; the answer itself streams from
// GET /api/chat/{chatId}?sessionId=… (see ./[chatId]/route.ts).
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (body === null) {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!body.chatHistoryId) {
    return Response.json({ error: 'chatHistoryId is required' }, { status: 400 });
  }

  if (useMockApi()) {
    return Response.json(
      { chatId: `mock-chat-${Date.now()}`, sessionId: body.chatHistoryId },
      { status: 202 },
    );
  }

  try {
    const response = await backendFetch(request, '/api/chat', { method: 'POST', body });
    return relayResponse(response);
  } catch (error) {
    return backendUnreachable('api/chat POST', error);
  }
}
