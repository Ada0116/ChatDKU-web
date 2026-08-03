import { NextRequest } from 'next/server';
import { backendFetch, backendUnreachable, relayResponse, isMockApi } from '@/lib/server/backend';
import { mockChatStream } from '@/lib/mocks/chat-stream';

// GET /api/chat/{chatId}?sessionId=… -> Django chat.views.ChatStream
// Server-sent events; each `data:` line carries one agent payload
// ({type, stage, content}) with type in {reasoning, chunk, error, end}.
export async function GET(request: NextRequest, context: { params: Promise<{ chatId: string }> }) {
  const { chatId } = await context.params;
  const sessionId = request.nextUrl.searchParams.get('sessionId');

  if (!sessionId) {
    return Response.json({ error: 'sessionId is required' }, { status: 400 });
  }

  if (isMockApi()) {
    return new Response(mockChatStream(), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  }

  // trailingSlash: true means the id can arrive with a trailing slash attached.
  const cleanChatId = chatId.replace(/\/$/, '');
  const path = `/api/chat/${encodeURIComponent(cleanChatId)}?sessionId=${encodeURIComponent(sessionId)}`;

  try {
    const response = await backendFetch(request, path, {
      headers: { Accept: 'text/event-stream' },
    });
    return relayResponse(response, { stream: true });
  } catch (error) {
    return backendUnreachable('api/chat SSE', error);
  }
}
