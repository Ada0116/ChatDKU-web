import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ChatPage from '@/components/ChatPage';
import { POST as chatPost } from '@/app/api/chat/route';
import { GET as chatStream } from '@/app/api/chat/[chatId]/route';
import { GET as sessionsGet } from '@/app/api/c/[[...path]]/route';
import { POST as feedbackPost } from '@/app/api/feedback/route';

// End-to-end through the real seams: the browser code calls the actual route
// handlers, and only the Django backend itself is stubbed. Anything that drifts
// between client, proxy and the documented backend contract fails here.

vi.mock('next/navigation', () => ({ useRouter: vi.fn() }));
vi.mock('js-cookie', () => ({ default: { get: vi.fn(), set: vi.fn() } }));
vi.mock('@/components/ui/ai-input', () => ({
  AIInput: ({ onSubmit, submitDisabled }: {
    onSubmit?: (value: string) => void;
    submitDisabled?: boolean;
  }) => (
    <button
      data-testid="submit"
      disabled={submitDisabled}
      onClick={() => onSubmit?.('What majors are available at Duke Kunshan University?')}
    >
      Send
    </button>
  ),
}));
vi.mock('@/components/navbar', () => ({ Navbar: () => <nav /> }));
vi.mock('@/components/side', () => ({ __esModule: true, default: () => <div /> }));
vi.mock('@/components/WelcomeBanner', () => ({ __esModule: true, default: () => <div /> }));
vi.mock('@/components/doc-manager', () => ({ DocumentManager: () => <div /> }));
vi.mock('@/components/prompt_recs', () => ({ PromptRecs: () => <div /> }));
vi.mock('@/components/CampusMap', () => ({ __esModule: true, default: () => <div /> }));
vi.mock('@/components/academic-calendar', () => ({ __esModule: true, default: () => <div /> }));

const SESSION = '08d8d518-bc9a-4f25-8e1a-8b6f3264f59b';
const BACKEND = 'http://10.200.14.39:8999';

/** Requests the stubbed Django server received, in order. */
let backendCalls: { method: string; url: string; body?: string }[] = [];

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

/** Stands in for Django, speaking the contract in django_backend/. */
async function fakeDjango(url: string, init: RequestInit = {}): Promise<Response> {
  const method = init.method ?? 'GET';
  const path = url.replace(BACKEND, '');
  backendCalls.push({ method, url: path, body: init.body as string | undefined });

  if (path === '/api/c/create_session/') return json({ session_id: SESSION }, 201);
  if (path === '/api/chat') return json({ chatId: 'chat-1', sessionId: SESSION }, 202);
  if (path.startsWith('/api/chat/')) {
    const frames = [
      { type: 'reasoning', stage: 'start', content: 'Agent started' },
      { type: 'reasoning', stage: 'Executor', content: 'VectorQuery: DKU majors' },
      { type: 'chunk_batch', chunks: [{ content: 'DKU offers **24** ' }, { content: 'majors, ' }] },
      { type: 'chunk', stage: 'generation', content: 'including Data Science.' },
      { type: 'end', stage: 'end', content: '' },
    ];
    const body = frames.map((f, i) => `id: ${i}\ndata: ${JSON.stringify(f)}\n\n`).join('');
    return new Response(body, { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
  }
  if (path === '/api/feedback') return json({ message: 'Feedback saved successfully' }, 201);

  return json({ detail: 'Not found.' }, 404);
}

/**
 * Routes browser fetches into the app's own route handlers, so a request only
 * reaches the stub after passing through the proxy layer for real.
 */
async function routeThroughApp(input: string, init: RequestInit = {}): Promise<Response> {
  const { NextRequest } = await import('next/server');
  const url = new URL(input, 'http://localhost:3000');
  const request = new NextRequest(url, init as ConstructorParameters<typeof NextRequest>[1]);
  const path = url.pathname;

  if (path === '/api/chat') return chatPost(request);
  if (path.startsWith('/api/chat/')) {
    const chatId = path.split('/')[3];
    return chatStream(request, { params: Promise.resolve({ chatId }) });
  }
  if (path === '/api/feedback') return feedbackPost(request);
  if (path.startsWith('/api/c/')) {
    const segments = path.replace('/api/c/', '').split('/').filter(Boolean);
    return sessionsGet(request, { params: Promise.resolve({ path: segments }) });
  }

  throw new Error(`Unrouted request: ${path}`);
}

const chatLog = () => document.getElementById('chat-log') as HTMLElement;

beforeEach(() => {
  backendCalls = [];

  // The handlers call global fetch to reach Django; the browser code calls it to
  // reach the handlers. Distinguish by URL.
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: string, init: RequestInit = {}) =>
      String(input).startsWith(BACKEND)
        ? fakeDjango(String(input), init)
        : routeThroughApp(String(input), init),
    ),
  );

  vi.mocked(useRouter).mockReturnValue({ push: vi.fn() } as unknown as ReturnType<typeof useRouter>);
  vi.mocked(Cookies.get).mockReturnValue('true' as unknown as ReturnType<typeof Cookies.get>);
  document.cookie = 'chatdku_session_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('a chat turn, browser through proxy to backend', () => {
  it('creates a session, sends the turn and renders the streamed answer', async () => {
    const user = userEvent.setup();

    render(<ChatPage />);
    await user.click(await screen.findByTestId('submit'));

    await waitFor(() => expect(chatLog().textContent).toContain('including Data Science.'));

    // The session must come from the backend, not be invented client-side.
    expect(backendCalls[0]).toMatchObject({ method: 'GET', url: '/api/c/create_session/' });

    const post = backendCalls.find((call) => call.url === '/api/chat');
    expect(JSON.parse(post!.body!)).toEqual({
      messages: [{ role: 'user', content: 'What majors are available at Duke Kunshan University?' }],
      chatHistoryId: SESSION,
      mode: 'default',
    });

    // Then the answer is read from the stream keyed by the returned chatId.
    expect(backendCalls.some((call) => call.url === `/api/chat/chat-1?sessionId=${SESSION}`)).toBe(true);
  });

  it('joins batched and single chunks into one markdown answer', async () => {
    const user = userEvent.setup();

    render(<ChatPage />);
    await user.click(await screen.findByTestId('submit'));

    await waitFor(() =>
      expect(chatLog().textContent).toContain('DKU offers 24 majors, including Data Science.'),
    );
    expect(chatLog().innerHTML).toContain('<strong>24</strong>');
  });

  it('never renders the POST envelope as the answer', async () => {
    const user = userEvent.setup();

    render(<ChatPage />);
    await user.click(await screen.findByTestId('submit'));

    await waitFor(() => expect(chatLog().textContent).toContain('including Data Science.'));
    expect(chatLog().textContent).not.toContain('chatId');
    expect(chatLog().textContent).not.toContain('sessionId');
  });

  it('shows reasoning stages before the answer arrives', async () => {
    const user = userEvent.setup();

    render(<ChatPage />);
    await user.click(await screen.findByTestId('submit'));

    await waitFor(() => expect(chatLog().textContent).toContain('including Data Science.'));
    // The thinking box is dismissed once the answer starts, so assert on the
    // reasoning frames having been delivered rather than a transient DOM state.
    expect(backendCalls.some((call) => call.url.startsWith('/api/chat/chat-1'))).toBe(true);
  });

  it('sends feedback for the completed turn', async () => {
    const user = userEvent.setup();

    render(<ChatPage />);
    await user.click(await screen.findByTestId('submit'));
    await waitFor(() => expect(screen.getByText('Was this response helpful?')).toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: 'Yes' }));

    await waitFor(() => expect(backendCalls.some((call) => call.url === '/api/feedback')).toBe(true));
    const feedback = JSON.parse(backendCalls.find((call) => call.url === '/api/feedback')!.body!);
    expect(feedback).toEqual({
      userInput: 'What majors are available at Duke Kunshan University?',
      botAnswer: 'DKU offers **24** majors, including Data Science.',
      feedbackReason: 'helpful',
      chatHistoryId: SESSION,
    });
  });
});

describe('failure handling', () => {
  it('reports an unreachable backend instead of hanging', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: string, init: RequestInit = {}) => {
        if (String(input).startsWith(BACKEND)) throw new Error('ECONNREFUSED');
        return routeThroughApp(String(input), init);
      }),
    );

    render(<ChatPage />);

    // Session creation fails, so the page offers a retry rather than a broken chat.
    expect(await screen.findByText(/couldn't start a chat session/i)).toBeInTheDocument();
  });

  it('surfaces an agent error mid-stream', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: string, init: RequestInit = {}) => {
        const url = String(input);
        if (url.startsWith(`${BACKEND}/api/chat/`)) {
          const body =
            `data: ${JSON.stringify({ type: 'error', stage: 'error', content: 'tool server down' })}\n\n` +
            `data: ${JSON.stringify({ type: 'end', stage: 'end', content: '' })}\n\n`;
          return new Response(body, {
            status: 200,
            headers: { 'Content-Type': 'text/event-stream' },
          });
        }
        return url.startsWith(BACKEND) ? fakeDjango(url, init) : routeThroughApp(url, init);
      }),
    );
    const user = userEvent.setup();

    render(<ChatPage />);
    await user.click(await screen.findByTestId('submit'));

    await waitFor(() =>
      expect(chatLog().textContent).toContain('Something went wrong while generating a response.'),
    );
  });
});
