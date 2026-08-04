import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ChatPage from './ChatPage';
import * as convos from '@/lib/convosNew';

// Unlike ChatPage.test.tsx, this file keeps the real PromptRecs *and* the real
// AIInput, because the thing under test is how a recommendation reaches the
// input and gets submitted.

vi.mock('next/navigation', () => ({ useRouter: vi.fn(), usePathname: vi.fn() }));
vi.mock('js-cookie', () => ({ default: { get: vi.fn(), set: vi.fn() } }));
vi.mock('socket.io-client', () => ({ io: () => ({ on: vi.fn(), emit: vi.fn(), disconnect: vi.fn() }) }));
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
vi.mock('@/components/navbar', () => ({ Navbar: () => <nav /> }));
vi.mock('@/components/side', () => ({ __esModule: true, default: () => <div /> }));
vi.mock('@/components/WelcomeBanner', () => ({ __esModule: true, default: () => <div /> }));
vi.mock('@/components/doc-manager', () => ({ DocumentManager: () => <div /> }));
vi.mock('@/components/CampusMap', () => ({ __esModule: true, default: () => <div /> }));
vi.mock('@/components/academic-calendar', () => ({ __esModule: true, default: () => <div /> }));

const SESSION = '08d8d518-bc9a-4f25-8e1a-8b6f3264f59b';

const sseBody = (payloads: object[]) =>
  payloads.map((payload, i) => `id: ${i}\ndata: ${JSON.stringify(payload)}\n\n`).join('');

const ANSWER = sseBody([
  { type: 'chunk', stage: 'generation', content: 'DKU offers 24 undergraduate majors.' },
  { type: 'end', stage: 'end', content: '' },
]);

const mockFetch = vi.fn();

// PromptRecs shuffles with Math.random; pin it so the first card is known.
const FIRST_PROMPT = 'What majors are available at Duke Kunshan University?';
// The card's accessible name also carries its emoji.
const firstCard = () => screen.findByRole('button', { name: new RegExp(FIRST_PROMPT.replace('?', '\\?')) });

beforeEach(() => {
  vi.spyOn(Math, 'random').mockReturnValue(0.5);
  vi.stubGlobal('fetch', mockFetch);
  mockFetch.mockReset();
  mockFetch.mockImplementation(async (_url: string, init?: RequestInit) => {
    if ((init?.method ?? 'GET') === 'POST') {
      return { ok: true, status: 202, json: async () => ({ chatId: 'chat-1', sessionId: SESSION }) };
    }
    return {
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
                : ((sent = true), { done: false, value: encoder.encode(ANSWER) }),
          };
        },
      },
    };
  });
  vi.mocked(useRouter).mockReturnValue({ push: vi.fn() } as unknown as ReturnType<typeof useRouter>);
  vi.mocked(usePathname).mockReturnValue('/');
  vi.mocked(Cookies.get).mockReturnValue('true' as unknown as ReturnType<typeof Cookies.get>);
  vi.mocked(convos.getCurrentSessionId).mockReturnValue(SESSION);
  vi.mocked(convos.getNewSession).mockResolvedValue(SESSION);
  vi.mocked(convos.getSessionMessages).mockResolvedValue([]);
});

const posts = () => mockFetch.mock.calls.filter(([, init]) => init?.method === 'POST');
const chatLog = () => document.getElementById('chat-log') as HTMLElement;

describe('starting a chat from a recommended prompt', () => {
  it('sends the question exactly once', async () => {
    const user = userEvent.setup();
    render(<ChatPage />);

    await user.click(await firstCard());

    await waitFor(() => expect(posts()).toHaveLength(1));
    expect(JSON.parse(posts()[0][1].body).messages).toEqual([
      { role: 'user', content: FIRST_PROMPT },
    ]);

    // The old implementation fired several submit paths a tick apart, so give
    // any stragglers time to land before declaring the turn single.
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(posts()).toHaveLength(1);
    // User turns are the right-aligned rows in the log.
    expect(chatLog().querySelectorAll(':scope > .justify-end')).toHaveLength(1);
  });

  it('leaves the input empty afterwards', async () => {
    const user = userEvent.setup();
    render(<ChatPage />);

    await user.click(await firstCard());

    await waitFor(() => expect(posts()).toHaveLength(1));
    expect((document.getElementById('ai-input') as HTMLTextAreaElement).value).toBe('');
  });
});
