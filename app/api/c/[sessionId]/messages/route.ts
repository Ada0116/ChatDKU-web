import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  
  // Return empty messages list - backend integration needed for persistence
  console.log('Messages requested for session:', sessionId);
  return NextResponse.json([]);
}
