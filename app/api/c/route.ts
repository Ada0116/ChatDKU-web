import { NextResponse } from 'next/server';

const MOCK_CONVERSATIONS = [
  { id: 'mock-session-1', title: 'What are the components to a signature work proposal?', created_at: '2025-01-15T10:30:00.000Z' },
  { id: 'mock-session-2', title: 'Do I earn credits from Miniterm?', created_at: '2025-01-14T14:20:00.000Z' },
  { id: 'mock-session-3', title: 'Academic writing tips for research papers', created_at: '2025-01-13T09:15:00.000Z' },
];

export async function GET() {
  return NextResponse.json(MOCK_CONVERSATIONS);
}
