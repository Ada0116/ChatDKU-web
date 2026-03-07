import { NextResponse } from 'next/server';

const MOCK_MESSAGES: Record<string, { role: string; content: string; timestamp: string }[]> = {
  'mock-session-1': [
    { role: 'user', content: 'What are the components to a signature work proposal?', timestamp: '2025-01-15T10:30:00.000Z' },
    { role: 'bot', content: 'The Signature Work Project Proposal (SWPP) is a critical, binding document that outlines the scope, objectives, and structure of a student’s Signature Work (SW) project. It serves as the formal plan for the student’s independent scholarly or creative endeavor and must be submitted and approved before the start of the senior year.', timestamp: '2025-01-15T10:30:05.000Z' },
    { role: 'user', content: 'Can I change my sig work proposal afterward?', timestamp: '2025-01-15T10:31:00.000Z' },
    { role: 'bot', content: 'The Signature Work Project Proposal (SWPP) is a binding document, and once submitted and approved, it cannot be revised without a formal exception request.', timestamp: '2025-01-15T10:31:08.000Z' },
  ],
  'mock-session-2': [
    { role: 'user', content: 'Do I earn credits from Miniterm?', timestamp: '2025-01-14T14:20:00.000Z' },
    { role: 'bot', content: 'No, Miniterm courses at Duke Kunshan University (DKU) do not provide academic credits.Miniterm is a one-week, non-credit, non-graded intensive course that is required for all DKU undergraduates as part of their graduation requirements. It is designed to offer students an exploratory or signature work-focused experience, but it does not count toward the 136 total credits needed for graduation.', timestamp: '2025-01-14T14:20:06.000Z' },
  ],
  'mock-session-3': [
    { role: 'user', content: 'How do I write a good research paper?', timestamp: '2025-01-13T09:15:00.000Z' },
    { role: 'bot', content: 'A strong research paper has a clear thesis, well-structured arguments, proper citations, and a concise abstract. Start with an outline before writing.', timestamp: '2025-01-13T09:15:07.000Z' },
  ],
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  return NextResponse.json(MOCK_MESSAGES[sessionId] ?? []);
}
