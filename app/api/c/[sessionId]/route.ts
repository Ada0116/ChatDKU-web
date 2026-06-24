import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  
  // Return empty messages list - backend integration needed for persistence
  console.log('Session messages requested for:', sessionId);
  return NextResponse.json([]);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  
  console.log('Session deleted:', sessionId);
  return NextResponse.json({ success: true });
}
