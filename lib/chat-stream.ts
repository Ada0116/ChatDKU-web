import { marked } from 'marked';

// Pure helpers for rendering and for reading the chat SSE wire format. The
// DOM-driving side of streaming lives in components/ChatPage.tsx; everything
// here is string in, value out, so it can be tested directly.

export function configureMarked(): void {
  marked.setOptions({ breaks: true, gfm: true });
}

/** Renders markdown to HTML, dropping any <think> blocks the model emits. */
export function parseMarkdown(content: string): string {
  if (!content) return '';
  const cleaned = stripThinkBlocks(content);
  const parsed = marked.parse(cleaned) as unknown;
  // marked can be configured asynchronously; fall back to the raw text then.
  if (typeof (parsed as { then?: unknown })?.then === 'function') {
    return cleaned;
  }
  return typeof parsed === 'string' && parsed.trim().length > 0 ? parsed : cleaned;
}

export function stripThinkBlocks(content: string): string {
  return content.replace(/<think>[\s\S]*?<\/think>/gi, '');
}

/**
 * One agent payload, as emitted by chatdku.core.intermediate_tracing.EventStream
 * and relayed by Django's ChatStream view.
 */
export interface StreamEvent {
  type: 'reasoning' | 'chunk' | 'chunk_batch' | 'error' | 'end';
  stage?: string;
  content?: string;
  chunks?: { content?: string }[];
}

/**
 * Splits an SSE buffer into complete frames, returning any partial trailing
 * frame so the caller can prepend it to the next read.
 */
export function splitFrames(buffer: string): { frames: string[]; rest: string } {
  const parts = buffer.split('\n\n');
  const rest = parts.pop() ?? '';
  return { frames: parts, rest };
}

/**
 * Parses one SSE frame (optional `id:` line, one `data:` line) into an event.
 * Returns null for heartbeats, malformed JSON and anything without a type.
 */
export function parseFrame(frame: string): StreamEvent | null {
  if (!frame.trim()) return null;

  const dataLine = frame.split('\n').find((line) => line.startsWith('data: '));
  if (!dataLine) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(dataLine.slice(6));
  } catch {
    return null;
  }

  // The dev mock wraps payloads as { id, data }; Django sends them bare.
  const event = ((parsed as { data?: StreamEvent })?.data ?? parsed) as StreamEvent;
  return event?.type ? event : null;
}

/** Text carried by one event: chunk content, or every chunk in a batch. */
export function eventText(event: StreamEvent): string {
  if (event.type === 'chunk') return event.content ?? '';
  if (event.type === 'chunk_batch') {
    return (event.chunks ?? []).map((chunk) => chunk.content ?? '').join('');
  }
  return '';
}
