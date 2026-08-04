import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ChatPage from './ChatPage';
import * as convos from '@/lib/convosNew';

vi.mock('next/navigation', () => ({ useRouter: vi.fn() }));
vi.mock('js-cookie', () => ({ default: { get: vi.fn(), set: vi.fn() } }));
vi.mock('@/lib/convosNew', async (importOriginal) => {
  const actual = await importOriginal<typeof convos>();
  return {
    ...actual,
    getNewSession: vi.fn(),
    getCurrentSessionId: vi.fn(),
    getSessionMessages: vi.fn(),
    getStoredEndpoint: vi.fn(() => '/api/chat'),
  };
});

// Stand-ins for the chrome around the chat log, so these tests only exercise
// ChatPage's own behaviour.
vi.mock('@/components/ui/ai-input', () => ({
  AIInput: ({ onSubmit, submitDisabled, placeholder }: {
    onSubmit?: (value: string) => void;
    submitDisabled?: boolean;
    placeholder?: string;
  }) => (
    <div>
      <span data-testid="placeholder">{placeholder}</span>
      <button
        data-testid="submit"
        disabled={submitDisabled}
        onClick={() => onSubmit?.('What majors are available at Duke Kunshan University?')}
      >
        Send
      </button>
    </div>
  ),
}));
vi.mock('@/components/navbar', () => ({ Navbar: () => <nav /> }));
vi.mock('@/components/side', () => ({
  __esModule: true,
  default: ({ onNewChat, onConversationSelect }: {
    onNewChat?: () => void;
    onConversationSelect?: (id: string) => void;
  }) => (
    <div>
      <button data-testid="new-chat" onClick={() => onNewChat?.()}>New chat</button>
      <button data-testid="open-convo" onClick={() => onConversationSelect?.('sess-old')}>
        Open conversation
      </button>
    </div>
  ),
}));
vi.mock('@/components/WelcomeBanner', () => ({ __esModule: true, default: () => <div /> }));
vi.mock('@/components/doc-manager', () => ({ DocumentManager: () => <div /> }));
vi.mock('@/components/prompt_recs', () => ({ PromptRecs: () => <div /> }));
vi.mock('@/components/CampusMap', () => ({ __esModule: true, default: () => <div /> }));
vi.mock('@/components/academic-calendar', () => ({ __esModule: true, default: () => <div /> }));

const SESSION = '08d8d518-bc9a-4f25-8e1a-8b6f3264f59b';

/** Frames in Django's ChatStream wire format. */
const sseBody = (payloads: object[]) =>
  payloads.map((payload, i) => `id: ${i}\ndata: ${JSON.stringify(payload)}\n\n`).join('');

const streamResponse = (body: string) => ({
  ok: true,
  status: 200,
  body: {
    getReader() {
      const encoder = new TextEncoder();
      let sent = false;
      return {
        read: async () =>
          sent ? { done: true, value: undefined } : ((sent = true), { done: false, value: encoder.encode(body) }),
      };
    },
  },
});

const ANSWER_STREAM = sseBody([
  { type: 'reasoning', stage: 'start', content: 'Agent started' },
  { type: 'reasoning', stage: 'Planner', content: 'look up the major list' },
  { type: 'chunk', stage: 'generation', content: 'DKU offers **24** undergraduate majors. ' },
  { type: 'chunk', stage: 'generation', content: 'Data Science is one of them.' },
  { type: 'end', stage: 'end', content: '' },
]);

const mockFetch = vi.fn();
const push = vi.fn();

/** Default: POST returns the envelope, GET returns the SSE stream. */
function respondWithChat(stream = ANSWER_STREAM) {
  mockFetch.mockImplementation(async (_url: string, init?: RequestInit) => {
    if ((init?.method ?? 'GET') === 'POST') {
      return { ok: true, status: 202, json: async () => ({ chatId: 'chat-1', sessionId: SESSION }) };
    }
    return streamResponse(stream);
  });
}

const chatLog = () => document.getElementById('chat-log') as HTMLElement;

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
  mockFetch.mockReset();
  vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>);
  vi.mocked(Cookies.get).mockReturnValue('true' as unknown as ReturnType<typeof Cookies.get>);
  vi.mocked(convos.getCurrentSessionId).mockReturnValue(SESSION);
  vi.mocked(convos.getNewSession).mockResolvedValue(SESSION);
  vi.mocked(convos.getSessionMessages).mockResolvedValue([]);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('session gate', () => {
  it('sends users who have not accepted the terms to the landing page', async () => {
    vi.mocked(Cookies.get).mockReturnValue(undefined as unknown as ReturnType<typeof Cookies.get>);

    render(<ChatPage />);

    await waitFor(() => expect(push).toHaveBeenCalledWith('/landing'));
  });

  it('reuses the stored session instead of creating another', async () => {
    render(<ChatPage />);

    await waitFor(() => expect(screen.getByTestId('submit')).toBeEnabled());
    expect(convos.getNewSession).not.toHaveBeenCalled();
  });

  it('creates a session when none is stored', async () => {
    vi.mocked(convos.getCurrentSessionId).mockReturnValue(null);

    render(<ChatPage />);

    await waitFor(() => expect(convos.getNewSession).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByTestId('submit')).toBeEnabled());
  });

  it('surfaces a retry when the session cannot be created', async () => {
    vi.mocked(convos.getCurrentSessionId).mockReturnValue(null);
    vi.mocked(convos.getNewSession).mockResolvedValue(null);

    render(<ChatPage />);

    expect(await screen.findByText(/couldn't start a chat session/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });
});

describe('sending a message', () => {
  it('posts the turn, then streams the answer from the chatId', async () => {
    respondWithChat();
    const user = userEvent.setup();

    render(<ChatPage />);
    await user.click(await screen.findByTestId('submit'));

    await waitFor(() => expect(chatLog().textContent).toContain('Data Science is one of them.'));

    const [postUrl, postInit] = mockFetch.mock.calls[0];
    expect(postUrl).toBe('/api/chat');
    expect(postInit.method).toBe('POST');
    expect(JSON.parse(postInit.body)).toEqual({
      messages: [{ role: 'user', content: 'What majors are available at Duke Kunshan University?' }],
      chatHistoryId: SESSION,
      mode: 'default',
    });

    expect(mockFetch.mock.calls[1][0]).toBe(`/api/chat/chat-1?sessionId=${SESSION}`);
  });

  it('renders the answer as markdown and never shows the envelope', async () => {
    respondWithChat();
    const user = userEvent.setup();

    render(<ChatPage />);
    await user.click(await screen.findByTestId('submit'));

    await waitFor(() => expect(chatLog().innerHTML).toContain('<strong>24</strong>'));
    expect(chatLog().textContent).not.toContain('chatId');
  });

  it('shows the question straight away', async () => {
    respondWithChat();
    const user = userEvent.setup();

    render(<ChatPage />);
    await user.click(await screen.findByTestId('submit'));

    await waitFor(() =>
      expect(chatLog().textContent).toContain('What majors are available at Duke Kunshan University?'),
    );
  });

  it('surfaces reasoning steps while the answer is still pending', async () => {
    mockFetch.mockImplementation(async (_url: string, init?: RequestInit) => {
      if ((init?.method ?? 'GET') === 'POST') {
        return { ok: true, status: 202, json: async () => ({ chatId: 'chat-1', sessionId: SESSION }) };
      }
      return streamResponse(
        sseBody([{ type: 'reasoning', stage: 'Planner', content: 'look up the major list' }]),
      );
    });
    const user = userEvent.setup();

    render(<ChatPage />);
    await user.click(await screen.findByTestId('submit'));

    await waitFor(() => expect(chatLog().textContent).toContain('[Planner] look up the major list'));
  });

  it('retries once with a fresh session when the backend rejects the old one', async () => {
    vi.mocked(convos.getNewSession).mockResolvedValue('sess-new');
    let posts = 0;
    mockFetch.mockImplementation(async (_url: string, init?: RequestInit) => {
      if ((init?.method ?? 'GET') === 'POST') {
        posts += 1;
        return posts === 1
          ? { ok: false, status: 400, statusText: 'Bad Request' }
          : { ok: true, status: 202, json: async () => ({ chatId: 'chat-2', sessionId: 'sess-new' }) };
      }
      return streamResponse(ANSWER_STREAM);
    });
    const user = userEvent.setup();

    render(<ChatPage />);
    await user.click(await screen.findByTestId('submit'));

    await waitFor(() => expect(chatLog().textContent).toContain('Data Science is one of them.'));

    expect(convos.getNewSession).toHaveBeenCalled();
    expect(JSON.parse(mockFetch.mock.calls[1][1].body).chatHistoryId).toBe('sess-new');
    // The stream must follow the session the retry actually used.
    expect(mockFetch.mock.calls[2][0]).toBe('/api/chat/chat-2?sessionId=sess-new');
  });

  it('shows an error bubble when the turn cannot be sent', async () => {
    vi.mocked(convos.getNewSession).mockResolvedValue(null);
    mockFetch.mockResolvedValue({ ok: false, status: 500, statusText: 'Server Error' });
    const user = userEvent.setup();

    render(<ChatPage />);
    await user.click(await screen.findByTestId('submit'));

    await waitFor(() => expect(chatLog().textContent).toMatch(/Error:/));
  });

  it('explains an agent error event instead of leaving an empty bubble', async () => {
    mockFetch.mockImplementation(async (_url: string, init?: RequestInit) => {
      if ((init?.method ?? 'GET') === 'POST') {
        return { ok: true, status: 202, json: async () => ({ chatId: 'chat-1', sessionId: SESSION }) };
      }
      return streamResponse(
        sseBody([
          { type: 'reasoning', stage: 'start', content: 'Agent started' },
          { type: 'error', stage: 'error', content: 'tool server unreachable' },
          { type: 'end', stage: 'end', content: '' },
        ]),
      );
    });
    const user = userEvent.setup();

    render(<ChatPage />);
    await user.click(await screen.findByTestId('submit'));

    await waitFor(() =>
      expect(chatLog().textContent).toContain('Something went wrong while generating a response.'),
    );
  });

  it('blocks a second send until the answer arrives', async () => {
    respondWithChat();
    const user = userEvent.setup();

    render(<ChatPage />);
    const submit = await screen.findByTestId('submit');
    await user.click(submit);

    await waitFor(() => expect(chatLog().textContent).toContain('Data Science is one of them.'));
    // One POST and one stream read, not two of each.
    expect(mockFetch.mock.calls.filter(([, init]) => init?.method === 'POST')).toHaveLength(1);
  });

  it('offers feedback controls once the answer is complete', async () => {
    respondWithChat();
    const user = userEvent.setup();

    render(<ChatPage />);
    await user.click(await screen.findByTestId('submit'));

    await waitFor(() => expect(chatLog().textContent).toContain('Was this response helpful?'));
  });
});

describe('conversation history', () => {
  it('loads and renders a stored transcript', async () => {
    vi.mocked(convos.getSessionMessages).mockResolvedValue([
      { role: 'user', content: 'Do I earn credits from Miniterm?', timestamp: '2026-08-01T10:00:00Z' },
      { role: 'assistant', content: 'No, Miniterm is non-credit.', timestamp: '2026-08-01T10:00:05Z' },
    ]);
    const user = userEvent.setup();

    render(<ChatPage />);
    await user.click(await screen.findByTestId('open-convo'));

    await waitFor(() => expect(convos.getSessionMessages).toHaveBeenCalledWith('sess-old'));
    await waitFor(() => {
      expect(chatLog().textContent).toContain('Do I earn credits from Miniterm?');
      expect(chatLog().textContent).toContain('No, Miniterm is non-credit.');
    });
  });

  it('clears the log and starts a new session on new chat', async () => {
    respondWithChat();
    vi.mocked(convos.getNewSession).mockResolvedValue('sess-fresh');
    const user = userEvent.setup();

    render(<ChatPage />);
    await user.click(await screen.findByTestId('submit'));
    await waitFor(() => expect(chatLog().textContent).toContain('Data Science is one of them.'));

    await user.click(screen.getByTestId('new-chat'));

    await waitFor(() => expect(convos.getNewSession).toHaveBeenCalled());
    await waitFor(() => expect(chatLog().textContent).toBe(''));
  });
});
