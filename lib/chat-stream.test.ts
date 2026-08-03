import { beforeAll, describe, expect, it } from 'vitest';
import {
  configureMarked,
  eventText,
  parseFrame,
  parseMarkdown,
  splitFrames,
  stripThinkBlocks,
  type StreamEvent,
} from './chat-stream';

// Frames exactly as Django's ChatStream writes them: an `id:` line, a `data:`
// line holding one agent payload, terminated by a blank line.
const frame = (payload: object, id = '1778491510817-0') =>
  `id: ${id}\ndata: ${JSON.stringify(payload)}\n\n`;

beforeAll(() => {
  configureMarked();
});

describe('parseMarkdown', () => {
  it('renders gfm markdown', () => {
    expect(parseMarkdown('**bold**')).toContain('<strong>bold</strong>');
    expect(parseMarkdown('- one\n- two')).toContain('<li>one</li>');
  });

  it('renders single newlines as breaks', () => {
    expect(parseMarkdown('one\ntwo')).toContain('<br>');
  });

  it('returns an empty string for empty input', () => {
    expect(parseMarkdown('')).toBe('');
  });

  it('drops <think> blocks before rendering', () => {
    const html = parseMarkdown('<think>secret reasoning</think>The answer is 42.');
    expect(html).not.toContain('secret reasoning');
    expect(html).toContain('The answer is 42.');
  });

  it('escapes nothing that would break links', () => {
    expect(parseMarkdown('[DKU](https://dukekunshan.edu.cn)')).toContain(
      'href="https://dukekunshan.edu.cn"',
    );
  });
});

describe('stripThinkBlocks', () => {
  it('removes multiple and multiline blocks', () => {
    const input = '<think>a\nb</think>keep<THINK>c</THINK> this';
    expect(stripThinkBlocks(input)).toBe('keep this');
  });

  it('leaves ordinary text untouched', () => {
    expect(stripThinkBlocks('no markers here')).toBe('no markers here');
  });
});

describe('splitFrames', () => {
  it('splits complete frames and keeps the partial tail', () => {
    const buffer = `${frame({ type: 'chunk', content: 'a' })}id: 2\ndata: {"type"`;
    const { frames, rest } = splitFrames(buffer);

    expect(frames).toHaveLength(1);
    expect(rest).toBe('id: 2\ndata: {"type"');
  });

  it('returns no frames when nothing is terminated yet', () => {
    const { frames, rest } = splitFrames('id: 1\ndata: {}');
    expect(frames).toEqual([]);
    expect(rest).toBe('id: 1\ndata: {}');
  });

  it('reassembles a payload split across two reads', () => {
    const whole = frame({ type: 'chunk', stage: 'generation', content: 'hello' });
    const first = whole.slice(0, 20);
    const second = whole.slice(20);

    const step1 = splitFrames(first);
    expect(step1.frames).toEqual([]);

    const step2 = splitFrames(step1.rest + second);
    expect(step2.frames).toHaveLength(1);
    expect(parseFrame(step2.frames[0])?.content).toBe('hello');
  });
});

describe('parseFrame', () => {
  it('parses a Django frame into its payload', () => {
    const event = parseFrame(
      'id: 1778491528244-0\ndata: {"type": "reasoning", "stage": "Planner", "content": "step one"}',
    );

    expect(event).toEqual({ type: 'reasoning', stage: 'Planner', content: 'step one' });
  });

  it('unwraps the { id, data } envelope used by the dev mock', () => {
    const event = parseFrame(
      'data: {"id":"mock-1","data":{"type":"chunk","stage":"generation","content":"hi"}}',
    );

    expect(event).toEqual({ type: 'chunk', stage: 'generation', content: 'hi' });
  });

  it('ignores heartbeats, blank frames and comments', () => {
    expect(parseFrame(':')).toBeNull();
    expect(parseFrame('')).toBeNull();
    expect(parseFrame('   \n  ')).toBeNull();
    expect(parseFrame('event: ping')).toBeNull();
  });

  it('ignores malformed json rather than throwing', () => {
    expect(parseFrame('data: {"type": "chunk"')).toBeNull();
    expect(parseFrame('data: not json at all')).toBeNull();
  });

  it('ignores payloads without a type', () => {
    expect(parseFrame('data: {"stage":"Planner"}')).toBeNull();
  });

  it('keeps content that itself contains newlines and colons', () => {
    const event = parseFrame(frame({ type: 'chunk', content: 'a: b\\nc' }).trimEnd());
    expect(event?.content).toBe('a: b\\nc');
  });
});

describe('eventText', () => {
  it('returns chunk content', () => {
    expect(eventText({ type: 'chunk', content: 'hello ' })).toBe('hello ');
  });

  it('concatenates every chunk in a batch', () => {
    const event: StreamEvent = {
      type: 'chunk_batch',
      chunks: [{ content: 'one ' }, { content: 'two' }, {}],
    };
    expect(eventText(event)).toBe('one two');
  });

  it('contributes nothing for reasoning, error and end', () => {
    expect(eventText({ type: 'reasoning', content: 'thinking' })).toBe('');
    expect(eventText({ type: 'error', content: 'boom' })).toBe('');
    expect(eventText({ type: 'end', content: '' })).toBe('');
  });
});

describe('a full Django stream', () => {
  it('accumulates only the answer text', () => {
    const wire = [
      frame({ type: 'reasoning', stage: 'start', content: 'Agent started' }),
      ':\n\n',
      frame({ type: 'reasoning', stage: 'Planner', content: 'look up majors' }),
      frame({ type: 'chunk', stage: 'generation', content: 'DKU offers ' }),
      frame({ type: 'chunk', stage: 'generation', content: '**24** majors.' }),
      frame({ type: 'end', stage: 'end', content: '' }),
    ].join('');

    const { frames, rest } = splitFrames(wire);
    const answer = frames
      .map(parseFrame)
      .filter((event): event is StreamEvent => event !== null)
      .map(eventText)
      .join('');

    expect(rest).toBe('');
    expect(answer).toBe('DKU offers **24** majors.');
    expect(parseMarkdown(answer)).toContain('<strong>24</strong>');
  });
});
