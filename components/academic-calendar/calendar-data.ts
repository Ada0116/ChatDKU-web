// components/academic-calendar/calendar-data.ts
// Combined calendar data from all academic years

import { CalendarEvent } from "./types";
import { EVENTS_2024_2025 } from "./calendar-data-2024-2025";
import { EVENTS_2025_2026 } from "./calendar-data-2025-2026";
import { EVENTS_2026_2027 } from "./calendar-data-2026-2027";

export const EVENTS: CalendarEvent[] = [
  ...EVENTS_2024_2025,
  ...EVENTS_2025_2026,
  ...EVENTS_2026_2027,
];
