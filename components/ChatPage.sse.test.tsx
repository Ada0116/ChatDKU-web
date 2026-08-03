import { TextEncoder, TextDecoder } from 'util';
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import ChatPage from './ChatPage';

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));
jest.mock('js-cookie', () => ({ get: jest.fn(), set: jest.fn() }));
jest.mock('@/lib/convosNew', () => ({
  getNewSession: jest.fn(),
  getCurrentSessionId: jest.fn(),
  getStoredEndpoint: jest.fn(),
  getSessionMessages: jest.fn(),
}));
jest.mock('@/components/ui/ai-input', () => ({
  AIInput: ({ onSubmit }: any) => (
    <button data-testid="submit-button" onClick={() => onSubmit?.('What majors are available at Duke Kunshan University?')}>
      Submit
    </button>
  ),
}));
jest.mock('@/components/navbar', () => ({ Navbar: () => <div /> }));
jest.mock('@/components/side', () => ({ __esModule: true, default: () => <div /> }));
jest.mock('@/components/WelcomeBanner', () => ({ __esModule: true, default: () => <div /> }));
jest.mock('@/components/doc-manager', () => ({ DocumentManager: () => <div /> }));
jest.mock('@/components/prompt_recs', () => ({ PromptRecs: () => <div /> }));
jest.mock('@/components/CampusMap', () => ({ __esModule: true, default: () => <div /> }));
jest.mock('@/components/academic-calendar', () => ({ __esModule: true, default: () => <div /> }));

// Exactly what Django's ChatStream.event_stream() writes on the wire:
// an `id:` line, then a `data:` line holding the agent payload, blank-line terminated.
const SSE_WIRE = [
  'id: 1778491510817-0\ndata: {"type": "reasoning", "stage": "start", "content": "Agent started"}\n\n',
  ':\n\n', // heartbeat
  'id: 1778491528244-0\ndata: {"type": "reasoning", "stage": "Planner", "content": "1. Search majors."}\n\n',
  'id: 1778491550524-0\ndata: {"type": "chunk", "stage": "generation", "content": "DKU offers **Data Science**, "}\n\n',
  'id: 1778491550524-1\ndata: {"type": "chunk", "stage": "generation", "content": "Applied Mathematics and more."}\n\n',
  'id: 1778491550524-2\ndata: {"type": "end", "stage": "end", "content": ""}\n\n',
];

const readerFrom = (parts: string[]) => {
  const encoder = new TextEncoder();
  let i = 0;
  return {
    read: async () =>
      i < parts.length
        ? { done: false, value: encoder.encode(parts[i++]) }
        : { done: true, value: undefined },
  };
};

const ERROR_WIRE = [
  'id: 1\ndata: {"type": "reasoning", "stage": "start", "content": "Agent started"}\n\n',
  'id: 2\ndata: {"type": "error", "stage": "error", "content": "tool server unreachable"}\n\n',
  'id: 3\ndata: {"type": "end", "stage": "end", "content": ""}\n\n',
];

describe('ChatPage SSE streaming', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', { value: jest.fn(), writable: true });
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    (Cookies.get as jest.Mock).mockReturnValue('true');
    const convos = require('@/lib/convosNew');
    convos.getCurrentSessionId.mockReturnValue('session-abc');
    convos.getNewSession.mockResolvedValue('session-abc');
    convos.getStoredEndpoint.mockReturnValue('/api/chat');
  });

  it('renders the streamed answer, not the POST envelope', async () => {
    const calls: string[] = [];
    global.fetch = jest.fn(async (url: any, init: any) => {
      calls.push(`${init?.method || 'GET'} ${url}`);
      if ((init?.method || 'GET') === 'POST') {
        return {
          ok: true,
          status: 202,
          json: async () => ({ chatId: 'chat-123', sessionId: 'session-abc' }),
        };
      }
      return { ok: true, status: 200, body: { getReader: () => readerFrom(SSE_WIRE) } };
    }) as any;

    render(<ChatPage />);
    const submit = await screen.findByTestId('submit-button');
    submit.click();

    await waitFor(() => {
      const log = document.getElementById('chat-log')!;
      expect(log.textContent).toContain('Applied Mathematics and more.');
    });

    const log = document.getElementById('chat-log')!;
    expect(log.textContent).toContain('DKU offers Data Science,');
    expect(log.textContent).not.toContain('chatId');
    expect(log.innerHTML).toContain('<strong>Data Science</strong>');
    expect(calls).toEqual([
      'POST /api/chat',
      'GET /api/chat/chat-123?sessionId=session-abc',
    ]);
  });

  it('surfaces an agent error event instead of an empty answer', async () => {
    global.fetch = jest.fn(async (url: any, init: any) => {
      if ((init?.method || 'GET') === 'POST') {
        return { ok: true, status: 202, json: async () => ({ chatId: 'chat-456' }) };
      }
      return { ok: true, status: 200, body: { getReader: () => readerFrom(ERROR_WIRE) } };
    }) as any;

    render(<ChatPage />);
    const submit = await screen.findByTestId('submit-button');
    submit.click();

    await waitFor(() => {
      const log = document.getElementById('chat-log')!;
      expect(log.textContent).toContain('Something went wrong while generating a response.');
    });
  });
});
