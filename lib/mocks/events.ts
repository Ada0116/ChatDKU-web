// Dev-only stand-ins for Django's WeeklyEventsView (chat/views.py). Shapes match
// the view's hand-built payload exactly: dates are YYYY-MM-DD, times are
// HH:MM:SS or null, and the remaining fields are blank strings rather than null
// because the model declares them `blank=True`, not `null=True`.

export interface MockWeeklyEvent {
  title: string;
  date: string;
  start_time: string | null;
  end_time: string | null;
  location: string;
  sponsor: string;
  open_to: string;
  speaker: string;
  url: string;
}

const TEMPLATES: Omit<MockWeeklyEvent, 'date'>[] = [
  {
    title: 'Signature Work Poster Session',
    start_time: '13:00:00',
    end_time: '15:00:00',
    location: 'Innovation Building Atrium',
    sponsor: 'Undergraduate Studies',
    open_to: 'All students',
    speaker: '',
    url: 'https://dukekunshan.edu.cn/events/signature-work',
  },
  {
    title: 'Career Talk: Working in Tech After DKU',
    start_time: '18:30:00',
    end_time: '20:00:00',
    location: 'AB 1079',
    sponsor: 'Career Services',
    open_to: 'Undergraduates',
    speaker: 'Alumni Panel',
    url: 'https://dukekunshan.edu.cn/events/career-talk',
  },
  {
    title: 'Library Quiet Hours',
    start_time: null,
    end_time: null,
    location: 'LIB 2F',
    sponsor: 'DKU Library',
    open_to: 'Everyone',
    speaker: '',
    url: '',
  },
];

/** Spreads the templates across the requested window, mirroring Django's ordering. */
export function mockWeeklyEvents(startDate: string, endDate: string): MockWeeklyEvent[] {
  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) return [];

  const spanDays = Math.floor((end.getTime() - start.getTime()) / 86_400_000) + 1;

  return TEMPLATES.map((template, index) => {
    const day = new Date(start);
    day.setUTCDate(start.getUTCDate() + Math.min(index, spanDays - 1));
    return { ...template, date: day.toISOString().split('T')[0] };
  });
}
