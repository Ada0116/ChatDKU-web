import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AIInput } from './ai-input';

vi.mock('next/navigation', () => ({ usePathname: () => '/' }));

const socket = { emit: vi.fn(), on: vi.fn(), disconnect: vi.fn() };
vi.mock('socket.io-client', () => ({ io: vi.fn(() => socket) }));

const getUserMedia = vi.fn();
Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  configurable: true,
  value: { getUserMedia },
});

class MockMediaRecorder {
  static isTypeSupported() {
    return true;
  }
  state = 'inactive';
  mimeType: string;
  ondataavailable: ((event: { data: Blob }) => void) | null = null;
  onstop: (() => void) | null = null;

  constructor(_stream: MediaStream, options?: { mimeType?: string }) {
    this.mimeType = options?.mimeType ?? 'audio/webm';
  }
  start() {
    this.state = 'recording';
  }
  stop() {
    this.state = 'inactive';
    this.onstop?.();
  }
}
globalThis.MediaRecorder = MockMediaRecorder as unknown as typeof MediaRecorder;

const stream = { getTracks: () => [{ stop: vi.fn() }] } as unknown as MediaStream;
const textbox = () => screen.getByPlaceholderText('Type your message...');

beforeEach(() => {
  getUserMedia.mockReset().mockResolvedValue(stream);
  socket.emit.mockReset();
  socket.on.mockReset();
  socket.disconnect.mockReset();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('typing and submitting', () => {
  it('reports each change to the caller', async () => {
    const onInputChange = vi.fn();
    const user = userEvent.setup();

    render(<AIInput onInputChange={onInputChange} />);
    await user.type(textbox(), 'Hello world');

    expect(onInputChange).toHaveBeenLastCalledWith('Hello world');
  });

  it('submits on Enter', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<AIInput onSubmit={onSubmit} />);
    await user.type(textbox(), 'Test message');
    await user.keyboard('{Enter}');

    expect(onSubmit).toHaveBeenCalledWith('Test message');
  });

  it('inserts a newline on Shift+Enter instead of submitting', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<AIInput onSubmit={onSubmit} />);
    await user.type(textbox(), 'Test message');
    await user.keyboard('{Shift>}{Enter}{/Shift}');

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits with the send button once there is text', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<AIInput onSubmit={onSubmit} />);
    await user.type(textbox(), 'Test message');
    await user.click(screen.getByRole('button', { name: 'Send message' }));

    expect(onSubmit).toHaveBeenCalledWith('Test message');
  });

  it('does not submit blank input', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<AIInput onSubmit={onSubmit} />);
    await user.type(textbox(), '   ');
    await user.keyboard('{Enter}');

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('clears the box after a submit', async () => {
    const user = userEvent.setup();

    render(<AIInput onSubmit={vi.fn()} />);
    await user.type(textbox(), 'Test message');
    await user.keyboard('{Enter}');

    await waitFor(() => expect(textbox()).toHaveValue(''));
  });
});

describe('props', () => {
  it('honours a custom placeholder', () => {
    render(<AIInput placeholder="Preparing your chat session..." />);

    expect(screen.getByPlaceholderText('Preparing your chat session...')).toBeInTheDocument();
  });

  it('disables the textarea and the mic when disabled', () => {
    render(<AIInput disabled />);

    expect(screen.getByPlaceholderText('Type your message...')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Start voice input' })).toBeDisabled();
  });

  it('blocks submission while a reply is pending', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<AIInput onSubmit={onSubmit} submitDisabled />);
    await user.type(textbox(), 'Test message');
    await user.keyboard('{Enter}');

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows an active reference and can clear it', async () => {
    const onClearReference = vi.fn();
    const user = userEvent.setup();

    render(<AIInput activeReference="Water Pavilion" onClearReference={onClearReference} />);
    expect(screen.getByText('Water Pavilion')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear reference' }));
    expect(onClearReference).toHaveBeenCalled();
  });
});

describe('voice input', () => {
  it('requests the microphone with the transcriber settings', async () => {
    const user = userEvent.setup();

    render(<AIInput />);
    await user.click(screen.getByRole('button', { name: 'Start voice input' }));

    expect(getUserMedia).toHaveBeenCalledWith({
      audio: {
        channelCount: 1,
        sampleRate: 16000,
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    });
  });

  it('switches the placeholder while listening', async () => {
    const user = userEvent.setup();

    render(<AIInput />);
    await user.click(screen.getByRole('button', { name: 'Start voice input' }));

    expect(await screen.findByPlaceholderText('Listening...')).toBeInTheDocument();
  });

  it('stops on a second press', async () => {
    const user = userEvent.setup();

    render(<AIInput />);
    await user.click(screen.getByRole('button', { name: 'Start voice input' }));
    await user.click(await screen.findByRole('button', { name: 'Stop voice input' }));

    await waitFor(() =>
      expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument(),
    );
  });

  it('survives a denied microphone', async () => {
    getUserMedia.mockRejectedValue(new Error('Permission denied'));
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const user = userEvent.setup();

    render(<AIInput />);
    await user.click(screen.getByRole('button', { name: 'Start voice input' }));

    // Still usable: no crash, and the box is not stuck in listening mode.
    expect(await screen.findByPlaceholderText('Type your message...')).toBeInTheDocument();
    errorSpy.mockRestore();
  });

  it('feeds transcribed text into the input', async () => {
    const onInputChange = vi.fn();
    const user = userEvent.setup();

    render(<AIInput onInputChange={onInputChange} />);
    await user.click(screen.getByRole('button', { name: 'Start voice input' }));

    await waitFor(() => expect(socket.on).toHaveBeenCalled());
    const handler = socket.on.mock.calls.find(([event]) => event === 'audio_transcribed')?.[1];
    expect(handler).toBeTypeOf('function');

    handler({ text: 'what are the dining hours' });

    await waitFor(() =>
      expect(screen.getByDisplayValue('what are the dining hours')).toBeInTheDocument(),
    );
  });
});
