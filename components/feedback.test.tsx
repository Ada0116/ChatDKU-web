import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ChatPage from './ChatPage';
import * as convos from '@/lib/convosNew';

// The feedback UI is built imperatively inside ChatPage once an answer lands,
// so these tests drive a whole turn and then interact with the controls.

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
vi.mock('@/components/ui/ai-input', () => ({
  AIInput: ({ onSubmit }: { onSubmit?: (value: string) => void }) => (
    <button data-testid="submit" onClick={() => onSubmit?.('What are the dining hours?')}>
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
const ANSWER = 'Marketplace serves dinner until 8pm.';

const mockFetch = vi.fn();

const streamResponse = (body: string) => ({
  ok: true,
  status: 200,
  body: {
    getReader() {
      const encoder = new TextEncoder();
      let sent = false;
      return {
        read: async () =>
          sent
            ? { done: true, value: undefined }
            : ((sent = true), { done: false, value: encoder.encode(body) }),
      };
    },
  },
});

const feedbackCalls = () =>
  mockFetch.mock.calls.filter(([url]) => url === '/api/feedback');

/** Runs one full turn so the feedback controls are on screen. */
async function completeATurn() {
  const user = userEvent.setup();
  render(<ChatPage />);
  await user.click(await screen.findByTestId('submit'));
  await waitFor(() => expect(screen.getByText('Was this response helpful?')).toBeInTheDocument());
  return user;
}

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
  mockFetch.mockReset();
  mockFetch.mockImplementation(async (url: string, init?: RequestInit) => {
    if (url === '/api/feedback') return { ok: true, status: 201, json: async () => ({ message: 'ok' }) };
    if ((init?.method ?? 'GET') === 'POST') {
      return { ok: true, status: 202, json: async () => ({ chatId: 'chat-1', sessionId: SESSION }) };
    }
    return streamResponse(
      `data: ${JSON.stringify({ type: 'chunk', stage: 'generation', content: ANSWER })}\n\n` +
        `data: ${JSON.stringify({ type: 'end', stage: 'end', content: '' })}\n\n`,
    );
  });

  vi.mocked(useRouter).mockReturnValue({ push: vi.fn() } as unknown as ReturnType<typeof useRouter>);
  vi.mocked(Cookies.get).mockReturnValue('true' as unknown as ReturnType<typeof Cookies.get>);
  vi.mocked(convos.getCurrentSessionId).mockReturnValue(SESSION);
  vi.mocked(convos.getNewSession).mockResolvedValue(SESSION);
  vi.mocked(convos.getSessionMessages).mockResolvedValue([]);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('positive feedback', () => {
  it('posts the question, answer and session, then thanks the user', async () => {
    const user = await completeATurn();

    await user.click(screen.getByRole('button', { name: 'Yes' }));

    await waitFor(() => expect(feedbackCalls()).toHaveLength(1));
    expect(JSON.parse(feedbackCalls()[0][1].body)).toEqual({
      userInput: 'What are the dining hours?',
      botAnswer: ANSWER,
      feedbackReason: 'helpful',
      chatHistoryId: SESSION,
    });
    expect(screen.getByText('Thanks for your feedback!')).toBeInTheDocument();
  });
});

describe('negative feedback', () => {
  it('asks for a reason and submits the chosen one', async () => {
    const user = await completeATurn();

    await user.click(screen.getByRole('button', { name: 'No' }));
    expect(screen.getByText(/Sorry to hear that/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Not Correct' }));
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => expect(feedbackCalls()).toHaveLength(1));
    expect(JSON.parse(feedbackCalls()[0][1].body).feedbackReason).toBe('not_correct');
    expect(screen.getByText('Thanks for your feedback!')).toBeInTheDocument();
  });

  it('requires a reason before submitting', async () => {
    const user = await completeATurn();

    await user.click(screen.getByRole('button', { name: 'No' }));
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(feedbackCalls()).toHaveLength(0);
  });

  it('collects free text when "Other" is chosen', async () => {
    const user = await completeATurn();

    await user.click(screen.getByRole('button', { name: 'No' }));
    await user.click(screen.getByRole('button', { name: 'Other' }));

    const textarea = screen.getByPlaceholderText('Please describe the issue');
    expect(textarea).toBeVisible();

    await user.type(textarea, 'The 食堂 closes at 20:00, not 8pm — <check this>');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => expect(feedbackCalls()).toHaveLength(1));
    expect(JSON.parse(feedbackCalls()[0][1].body).feedbackReason).toBe(
      'The 食堂 closes at 20:00, not 8pm — <check this>',
    );
  });

  it('refuses an empty "Other" and prompts for text', async () => {
    const user = await completeATurn();

    await user.click(screen.getByRole('button', { name: 'No' }));
    await user.click(screen.getByRole('button', { name: 'Other' }));
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(feedbackCalls()).toHaveLength(0);
    expect(screen.getByPlaceholderText('Please write something!')).toBeInTheDocument();
  });

  it('can be cancelled without sending anything', async () => {
    const user = await completeATurn();

    await user.click(screen.getByRole('button', { name: 'No' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(feedbackCalls()).toHaveLength(0);
    expect(screen.getByText('Feedback canceled.')).toBeInTheDocument();
  });

  it('carries a long answer through to the backend', async () => {
    const user = await completeATurn();

    await user.click(screen.getByRole('button', { name: 'Yes' }));

    await waitFor(() => expect(feedbackCalls()).toHaveLength(1));
    expect(JSON.parse(feedbackCalls()[0][1].body).botAnswer).toBe(ANSWER);
  });
});

describe('failures', () => {
  it('still thanks the user when the backend rejects the feedback', async () => {
    const user = await completeATurn();
    mockFetch.mockImplementation(async (url: string) => {
      if (url === '/api/feedback') throw new Error('offline');
      return { ok: false, status: 500 };
    });

    await user.click(screen.getByRole('button', { name: 'Yes' }));

    await waitFor(() => expect(screen.getByText('Thanks for your feedback!')).toBeInTheDocument());
  });
});
