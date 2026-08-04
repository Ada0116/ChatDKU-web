// Dev-only stand-in for Django's ChatStream. Emits the same wire format:
// an `id:` line followed by a `data:` line holding one agent payload, blank-line
// terminated. Payload types come from chatdku.core.intermediate_tracing.EventStream:
// reasoning -> chunk -> end (chunk_batch is unpacked into individual chunks by Django).

interface StreamEvent {
  type: 'reasoning' | 'chunk' | 'end';
  stage: string;
  content: string;
}

const EVENTS: StreamEvent[] = [
  { type: 'reasoning', stage: 'start', content: 'Agent started' },
  {
    type: 'reasoning',
    stage: 'Planner',
    content:
      '1. Look up DKU course registration policy (window, credit requirements, prerequisites). 2. Check the shopping-cart and override process. 3. Summarise the steps with the relevant offices.',
  },
  {
    type: 'reasoning',
    stage: 'Executor',
    content: 'VectorQuery: DKU course registration policy deadline requirements credit hours',
  },
  {
    type: 'chunk',
    stage: 'generation',
    content:
      'To register for courses at Duke Kunshan University, log in to the DKU student portal during your designated registration window. ',
  },
  { type: 'chunk', stage: 'generation', content: 'Priority is determined by academic standing and credit hours completed.\n\n' },
  { type: 'chunk', stage: 'generation', content: '**Key steps:**\n\n' },
  {
    type: 'chunk',
    stage: 'generation',
    content:
      "1. **Check your registration time** — your window is listed in the Registrar's portal. Seniors register first, then juniors, sophomores and first-years.\n\n",
  },
  {
    type: 'chunk',
    stage: 'generation',
    content:
      '2. **Review prerequisites** — the system blocks enrollment when requirements are unmet.\n\n',
  },
  {
    type: 'chunk',
    stage: 'generation',
    content:
      '3. **Stage your selections** — add courses to your shopping cart during the browsing period.\n\n',
  },
  {
    type: 'chunk',
    stage: 'generation',
    content:
      'If you hit a registration hold or need an instructor override, contact the Office of the Registrar at registrar@dukekunshan.edu.cn with your student ID.',
  },
  { type: 'end', stage: 'end', content: '' },
];

const delayFor = (event: StreamEvent) => (event.type === 'reasoning' ? 600 : 120);

export function mockChatStream(): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      let id = 0;
      for (const event of EVENTS) {
        id += 1;
        controller.enqueue(encoder.encode(`id: mock-${id}\ndata: ${JSON.stringify(event)}\n\n`));
        await new Promise((resolve) => setTimeout(resolve, delayFor(event)));
      }
      controller.close();
    },
  });
}
