// components/academic-calendar/calendar-utils.ts

import { EventType, CalendarEvent } from "./types";

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const WEEKDAYS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

export const getEventStyles = (type: EventType) => {
  switch (type) {
    case "holiday":
      return {
        bg: "bg-red-100 dark:bg-red-500/15",
        text: "text-red-700 dark:text-red-300",
        border: "border-red-200 dark:border-red-500/20",
      };
    case "move":
      return {
        bg: "bg-green-100 dark:bg-green-500/15",
        text: "text-green-700 dark:text-green-300",
        border: "border-green-200 dark:border-green-500/20",
      };
    case "registration":
      return {
        bg: "bg-blue-100 dark:bg-blue-500/15",
        text: "text-blue-700 dark:text-blue-300",
        border: "border-blue-200 dark:border-blue-500/20",
      };
    case "exam":
      return {
        bg: "bg-purple-100 dark:bg-purple-500/15",
        text: "text-purple-700 dark:text-purple-300",
        border: "border-purple-200 dark:border-purple-500/20",
      };
    default:
      return {
        bg: "bg-amber-100 dark:bg-amber-500/15",
        text: "text-amber-700 dark:text-amber-300",
        border: "border-amber-200 dark:border-amber-500/20",
      };
  }
};

export const formatDateKey = (
  year: number,
  month: number,
  day: number
) => {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

export const isDateInRange = (
  target: string,
  start: string,
  end?: string
) => {
  const targetDate = new Date(target).getTime();
  const startDate = new Date(start).getTime();
  const endDate = end ? new Date(end).getTime() : startDate;
  return targetDate >= startDate && targetDate <= endDate;
};

/** Convert "YYYY-MM-DD" to "YYYYMMDD" for iCalendar format */
const toICSDate = (dateStr: string): string => {
  return dateStr.replace(/-/g, "");
};

/** Get the day after a given date string, as "YYYYMMDD" */
const nextDay = (dateStr: string): string => {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
};

/** Escape special characters in iCalendar text fields */
const escapeICS = (text: string): string => {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
};

/** Generate an .ics file content for a single calendar event */
export const generateEventICS = (event: CalendarEvent): string => {
  const uid = `${event.id}@chatdku-calendar`;
  const now = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  const dtStart = toICSDate(event.startDate);
  // iCalendar DTEND is exclusive, so use the day after endDate (or startDate)
  const dtEnd = event.endDate ? nextDay(event.endDate) : nextDay(event.startDate);
  const summary = escapeICS(event.title);
  const description = event.description ? escapeICS(event.description) : "";

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ChatDKU//Academic Calendar//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART;VALUE=DATE:${dtStart}`,
    `DTEND;VALUE=DATE:${dtEnd}`,
    `SUMMARY:${summary}`,
    description ? `DESCRIPTION:${description}` : null,
    "TRANSP:TRANSPARENT",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
};

/** Trigger a file download in the browser */
export const downloadCalendarFile = (event: CalendarEvent): void => {
  const icsContent = generateEventICS(event);
  const blob = new Blob([icsContent], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${event.id}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
