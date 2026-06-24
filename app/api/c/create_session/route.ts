import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Generate a new session ID directly using Node.js crypto
  const sessionId = crypto.randomUUID();
  
  const session = {
    session_id: sessionId,
  };

  console.log('New session created (create_session):', sessionId);
  return NextResponse.json(session);
}

export async function POST(request: NextRequest) {
  // Generate a new session ID directly using Node.js crypto
  const sessionId = crypto.randomUUID();
  
  const session = {
    session_id: sessionId,
  };

  console.log('New session created (create_session POST):', sessionId);
  return NextResponse.json(session);
}
