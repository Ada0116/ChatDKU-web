import { NextRequest } from 'next/server';
import { backendFetch, backendUnreachable, relayResponse, isMockApi } from '@/lib/server/backend';

// POST /api/feedback -> Django chat.views.FeedbackView
// Body: { userInput, botAnswer, feedbackReason, chatHistoryId } -> 201 { message }
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (body === null) {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!body.userInput || !body.botAnswer || !body.feedbackReason || !body.chatHistoryId) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (typeof body.chatHistoryId !== 'string' || body.chatHistoryId.trim() === '') {
    return Response.json({ error: 'Invalid chat history ID' }, { status: 400 });
  }

  if (isMockApi()) {
    console.log('[mock] Feedback received:', body.feedbackReason);
    return Response.json({ message: 'Feedback saved successfully' }, { status: 201 });
  }

  try {
    const response = await backendFetch(request, '/api/feedback', { method: 'POST', body });
    return relayResponse(response);
  } catch (error) {
    return backendUnreachable('api/feedback', error);
  }
}
