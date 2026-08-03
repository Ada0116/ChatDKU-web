// Dev-only stand-ins for Django's SessionViewSet. Shapes match the real
// serializers exactly (chat/serializer.py): sessions are {id, title, created_at}
// and messages are {id, role, message, created_at} with role in {user, bot}.

export interface MockSession {
  id: string;
  title: string;
  created_at: string;
}

export interface MockMessage {
  id: number;
  role: 'user' | 'bot';
  message: string;
  created_at: string;
}

const SESSIONS: MockSession[] = [
  {
    id: 'mock-session-1',
    title: 'What are the components to a signature work proposal?',
    created_at: '2025-01-15T10:30:00.000Z',
  },
  { id: 'mock-session-2', title: 'Do I earn credits from Miniterm?', created_at: '2025-01-14T14:20:00.000Z' },
  {
    id: 'mock-session-3',
    title: 'Academic writing tips for research papers',
    created_at: '2025-01-13T09:15:00.000Z',
  },
];

const MESSAGES: Record<string, MockMessage[]> = {
  'mock-session-1': [
    {
      id: 1,
      role: 'user',
      message: 'What are the components to a signature work proposal?',
      created_at: '2025-01-15T10:30:00.000Z',
    },
    {
      id: 2,
      role: 'bot',
      message:
        "The Signature Work Project Proposal (SWPP) is a critical, binding document that outlines the scope, objectives, and structure of a student's Signature Work (SW) project. It serves as the formal plan for the student's independent scholarly or creative endeavor and must be submitted and approved before the start of the senior year.",
      created_at: '2025-01-15T10:30:05.000Z',
    },
    {
      id: 3,
      role: 'user',
      message: 'Can I change my sig work proposal afterward?',
      created_at: '2025-01-15T10:31:00.000Z',
    },
    {
      id: 4,
      role: 'bot',
      message:
        'The Signature Work Project Proposal (SWPP) is a binding document, and once submitted and approved, it cannot be revised without a formal exception request.',
      created_at: '2025-01-15T10:31:08.000Z',
    },
  ],
  'mock-session-2': [
    { id: 5, role: 'user', message: 'Do I earn credits from Miniterm?', created_at: '2025-01-14T14:20:00.000Z' },
    {
      id: 6,
      role: 'bot',
      message:
        'No, Miniterm courses at Duke Kunshan University (DKU) do not provide academic credits. Miniterm is a one-week, non-credit, non-graded intensive course that is required for all DKU undergraduates as part of their graduation requirements.',
      created_at: '2025-01-14T14:20:06.000Z',
    },
  ],
  'mock-session-3': [
    { id: 7, role: 'user', message: 'How do I write a good research paper?', created_at: '2025-01-13T09:15:00.000Z' },
    {
      id: 8,
      role: 'bot',
      message:
        'A strong research paper has a clear thesis, well-structured arguments, proper citations, and a concise abstract. Start with an outline before writing.',
      created_at: '2025-01-13T09:15:07.000Z',
    },
  ],
};

const deleted = new Set<string>();

export function mockSessions(): MockSession[] {
  return SESSIONS.filter((session) => !deleted.has(session.id));
}

export function mockSessionMessages(sessionId: string | undefined): MockMessage[] {
  return (sessionId && MESSAGES[sessionId]) || [];
}

export function mockCreateSession(): { session_id: string } {
  return { session_id: crypto.randomUUID() };
}

export function mockRenameSession(sessionId: string | undefined, title: unknown) {
  const session = SESSIONS.find((candidate) => candidate.id === sessionId);
  if (session && typeof title === 'string' && title.trim()) {
    session.title = title;
  }
  return { id: sessionId, title: session?.title ?? '' };
}

export function mockDeleteSession(sessionId: string | undefined): void {
  if (sessionId) deleted.add(sessionId);
}
