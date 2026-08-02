// components/academic-calendar/types.ts

export type EventType =
  | "holiday"
  | "academic"
  | "move"
  | "registration"
  | "exam";

export type CalendarEvent = {
  id: string;
  title: string;
  type: EventType;
  startDate: string;
  endDate?: string;
  priority?: "high" | "medium" | "low";
  description?: string;
};
