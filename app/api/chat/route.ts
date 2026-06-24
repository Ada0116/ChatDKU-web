import { NextRequest, NextResponse } from 'next/server';

// Receive the user message and return the chatId and sessionId
export async function POST(request: NextRequest) {
  const body = await request.json();
  const useMock = process.env.NODE_ENV === 'development' && process.env.MOCK_API !== 'false';

if (!useMock) {
    try {
      console.log('Proxying chat request to backend...');
      
      const backendResponse = await fetch('http://10.200.14.39:8999/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cookie': request.headers.get('cookie') || '',
        },
        body: JSON.stringify(body),
      });

      if (!backendResponse.ok) {
        const errorText = await backendResponse.text();
        console.error('Backend error:', backendResponse.status, errorText);
        return NextResponse.json(
          { error: `Backend error: ${errorText}` },
          { status: backendResponse.status }
        );
      }

      const data = await backendResponse.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error('Backend connection error:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      );
    }
  }

  // Mock mode
  const mockChatId = `mock-chat-${Date.now()}`;
  const mockSessionId = body?.chatHistoryId || `mock-session-${Date.now()}`;

  console.log('Mock POST /api/chat → returning chatId:', mockChatId);

  return NextResponse.json({
    chatId: mockChatId,
    sessionId: mockSessionId,
  });
}