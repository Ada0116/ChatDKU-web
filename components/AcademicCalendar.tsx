
// components/AcademicCalendar.tsx
"use client";

import { useState } from "react";

type EventType =
  | "holiday"
  | "academic"
  | "movein"
  | "registration"
  | "exam";

type CalendarEvent = {
  id: string;
  title: string;
  type: EventType;
  startDate: string;
  endDate?: string;

  priority?: "high" | "medium" | "low";

  description?: string;
};



const EVENTS: CalendarEvent[] = [
  // =========================
  // FALL 2025
  // =========================

  {
    id: "2025-intl-movein",
    title: "International Student Move-in",
    type: "movein",
    startDate: "2025-08-08",
    priority: "high",
    description:
      "All new international undergraduate students (Class of 2029) and international first-year graduate students move in at 9:00 AM.",
  },

  {
    id: "2025-cn-movein",
    title: "Chinese Student Move-in",
    type: "movein",
    startDate: "2025-08-10",
    priority: "high",
    description:
      "All new Chinese undergraduate students (Class of 2029) and Chinese first-year graduate students move in at 9:00 AM.",
  },

  {
    id: "2025-returning-movein",
    title: "Returning Students Move-in",
    type: "movein",
    startDate: "2025-08-15",
    priority: "high",
  },

  {
    id: "2025-fall-classes-begin",
    title: "Classes Begin",
    type: "academic",
    startDate: "2025-08-18",
    priority: "high",
  },

  {
    id: "2025-dropadd-7wk",
    title: "Drop/Add Deadline",
    type: "registration",
    startDate: "2025-08-21",
    priority: "medium",
    description: "Drop/add ends for first 7-week undergraduate session.",
  },

  {
    id: "2025-dropadd-14wk",
    title: "Drop/Add Deadline",
    type: "registration",
    startDate: "2025-08-28",
    priority: "medium",
    description: "Drop/add ends for 14-week undergraduate session.",
  },

  {
    id: "2025-grad-dropadd",
    title: "Graduate Drop/Add",
    type: "registration",
    startDate: "2025-08-29",
    priority: "low",
  },

  {
    id: "2025-withdrawal-deadline",
    title: "Withdraw Deadline",
    type: "academic",
    startDate: "2025-09-18",
    priority: "medium",
    description:
      "Last day to withdraw with W grade for first 7-week classes.",
  },

  {
    id: "2025-national-day",
    title: "National Day Holiday",
    type: "holiday",
    startDate: "2025-10-01",
    endDate: "2025-10-08",
    priority: "high",
    description:
      "National Day Holiday and Mid-autumn Festival – No classes.",
  },

  {
    id: "2025-classes-resume",
    title: "Classes Resume",
    type: "academic",
    startDate: "2025-10-09",
    priority: "low",
  },

  {
    id: "2025-first7wk-end",
    title: "1st 7-Week Ends",
    type: "academic",
    startDate: "2025-10-10",
    priority: "medium",
  },

  {
    id: "2025-reading-period-oct",
    title: "Reading Period",
    type: "academic",
    startDate: "2025-10-11",
    endDate: "2025-10-12",
    priority: "medium",
  },

  {
    id: "2025-7wk-finals",
    title: "7-Week Finals",
    type: "exam",
    startDate: "2025-10-13",
    endDate: "2025-10-16",
    priority: "high",
  },

  {
    id: "2025-second7wk-begin",
    title: "2nd 7-Week Begins",
    type: "academic",
    startDate: "2025-10-20",
    priority: "medium",
  },

  {
    id: "2025-second7wk-dropadd",
    title: "Drop/Add Deadline",
    type: "registration",
    startDate: "2025-10-23",
    priority: "low",
  },

  {
    id: "2025-withdraw-14wk",
    title: "Withdraw Deadline",
    type: "academic",
    startDate: "2025-11-06",
    priority: "medium",
  },

  {
    id: "2025-grad-classes-end",
    title: "Graduate Classes End",
    type: "academic",
    startDate: "2025-11-20",
    priority: "medium",
  },

  {
    id: "2025-grad-reading",
    title: "Graduate Reading Days",
    type: "academic",
    startDate: "2025-11-21",
    endDate: "2025-11-25",
    priority: "low",
  },

  {
    id: "2025-grad-exams",
    title: "Graduate Exams",
    type: "exam",
    startDate: "2025-11-26",
    endDate: "2025-11-28",
    priority: "medium",
  },

  {
    id: "2025-ece-end",
    title: "ECE Classes End",
    type: "academic",
    startDate: "2025-11-27",
    priority: "low",
  },

  {
    id: "2025-ece-reading",
    title: "ECE Reading Days",
    type: "academic",
    startDate: "2025-11-28",
    endDate: "2025-12-02",
    priority: "low",
  },

  {
    id: "2025-ece-exams",
    title: "ECE Exam Period",
    type: "exam",
    startDate: "2025-12-03",
    endDate: "2025-12-05",
    priority: "medium",
  },

  {
    id: "2025-second7wk-end",
    title: "2nd 7-Week Ends",
    type: "academic",
    startDate: "2025-12-04",
    priority: "medium",
  },

  {
    id: "2025-reading-dec",
    title: "Reading Period",
    type: "academic",
    startDate: "2025-12-05",
    endDate: "2025-12-07",
    priority: "medium",
  },

  {
    id: "2025-finals",
    title: "Final Exams",
    type: "exam",
    startDate: "2025-12-08",
    endDate: "2025-12-11",
    priority: "high",
  },

  {
    id: "2025-winter-break",
    title: "Residence Halls Close",
    type: "holiday",
    startDate: "2025-12-12",
    priority: "medium",
  },

  {
    id: "2025-extended-training",
    title: "Extended Requirement",
    type: "academic",
    startDate: "2025-12-12",
    endDate: "2025-12-18",
    priority: "low",
  },

  {
    id: "2025-extended-checkout",
    title: "Extended Requirement Checkout",
    type: "academic",
    startDate: "2025-12-19",
    priority: "low",
  },

  // =========================
  // SPRING 2026
  // =========================

  {
    id: "2026-dorms-open",
    title: "Residence Halls Reopen",
    type: "movein",
    startDate: "2026-01-03",
    priority: "medium",
  },

  {
    id: "2026-spring-begin",
    title: "Classes Begin",
    type: "academic",
    startDate: "2026-01-05",
    priority: "high",
  },

  {
    id: "2026-dropadd-7wk",
    title: "Drop/Add Deadline",
    type: "registration",
    startDate: "2026-01-08",
    priority: "low",
  },

  {
    id: "2026-dropadd-14wk",
    title: "Drop/Add Deadline",
    type: "registration",
    startDate: "2026-01-15",
    priority: "low",
  },

  {
    id: "2026-grad-dropadd",
    title: "Graduate Drop/Add",
    type: "registration",
    startDate: "2026-01-16",
    priority: "low",
  },

  {
    id: "2026-withdraw-deadline",
    title: "Withdraw Deadline",
    type: "academic",
    startDate: "2026-02-05",
    priority: "medium",
  },

  {
    id: "2026-special-schedule",
    title: "Monday Schedule in Effect",
    type: "academic",
    startDate: "2026-02-13",
    priority: "low",
  },

  {
    id: "2026-spring-festival",
    title: "Spring Festival Holiday",
    type: "holiday",
    startDate: "2026-02-16",
    endDate: "2026-02-23",
    priority: "high",
  },

  {
    id: "2026-classes-resume",
    title: "Classes Resume",
    type: "academic",
    startDate: "2026-02-24",
    priority: "low",
  },

  {
    id: "2026-first7wk-end",
    title: "1st 7-Week Ends",
    type: "academic",
    startDate: "2026-02-26",
    priority: "medium",
  },

  {
    id: "2026-reading-days",
    title: "Reading Days",
    type: "academic",
    startDate: "2026-02-27",
    endDate: "2026-03-01",
    priority: "medium",
  },

  {
    id: "2026-first7wk-finals",
    title: "7-Week Finals",
    type: "exam",
    startDate: "2026-03-02",
    endDate: "2026-03-05",
    priority: "high",
  },

  {
    id: "2026-spring-recess",
    title: "Spring Recess",
    type: "holiday",
    startDate: "2026-03-09",
    endDate: "2026-03-13",
    priority: "medium",
  },

  {
    id: "2026-second7wk-begin",
    title: "2nd 7-Week Begins",
    type: "academic",
    startDate: "2026-03-16",
    priority: "medium",
  },

  {
    id: "2026-second7wk-dropadd",
    title: "Drop/Add Deadline",
    type: "registration",
    startDate: "2026-03-19",
    priority: "low",
  },

  {
    id: "2026-qingming",
    title: "Qing Ming Holiday",
    type: "holiday",
    startDate: "2026-04-03",
    endDate: "2026-04-05",
    priority: "high",
  },

  {
    id: "2026-grad-end",
    title: "Graduate Classes End",
    type: "academic",
    startDate: "2026-04-16",
    priority: "medium",
  },

  {
    id: "2026-grad-reading",
    title: "Graduate Reading Days",
    type: "academic",
    startDate: "2026-04-17",
    endDate: "2026-04-21",
    priority: "low",
  },

  {
    id: "2026-grad-exams",
    title: "Graduate Exams",
    type: "exam",
    startDate: "2026-04-22",
    endDate: "2026-04-24",
    priority: "medium",
  },

  {
    id: "2026-ece-reading",
    title: "ECE Reading Days",
    type: "academic",
    startDate: "2026-04-24",
    endDate: "2026-04-26",
    priority: "low",
  },

  {
    id: "2026-ece-exams",
    title: "ECE Exam Period",
    type: "exam",
    startDate: "2026-04-27",
    endDate: "2026-04-29",
    priority: "medium",
  },

  {
    id: "2026-second7wk-end",
    title: "2nd 7-Week Ends",
    type: "academic",
    startDate: "2026-04-30",
    priority: "medium",
  },

  {
    id: "2026-labor-day",
    title: "Labor Day Holiday",
    type: "holiday",
    startDate: "2026-05-01",
    endDate: "2026-05-03",
    priority: "high",
  },

  {
    id: "2026-undergrad-reading",
    title: "Reading Days",
    type: "academic",
    startDate: "2026-05-01",
    endDate: "2026-05-03",
    priority: "medium",
  },

  {
    id: "2026-final-exams",
    title: "Final Exams",
    type: "exam",
    startDate: "2026-05-04",
    endDate: "2026-05-07",
    priority: "high",
  },

  {
    id: "2026-extended-training",
    title: "Extended Training",
    type: "academic",
    startDate: "2026-05-11",
    endDate: "2026-05-14",
    priority: "low",
  },

  {
    id: "2026-commencement",
    title: "Commencement",
    type: "academic",
    startDate: "2026-05-15",
    priority: "high",
  },

  {
    id: "2026-residence-close",
    title: "Residence Halls Close",
    type: "holiday",
    startDate: "2026-05-16",
    priority: "medium",
  },

  {
    id: "2026-summer-session",
    title: "Summer Session Starts",
    type: "academic",
    startDate: "2026-07-06",
    priority: "medium",
  },

  {
    id: "2026-summer-exams",
    title: "Summer Session Exams",
    type: "exam",
    startDate: "2026-08-13",
    priority: "medium",
  },

  // =========================
  // FALL 2026
  // =========================

  {
    id: "2026-intl-movein",
    title: "International Student Move-in",
    type: "movein",
    startDate: "2026-08-14",
    priority: "high",
  },

  {
    id: "2026-cn-movein",
    title: "Chinese Student Move-in",
    type: "movein",
    startDate: "2026-08-16",
    priority: "high",
  },

  {
    id: "2026-returning-movein",
    title: "Returning Students Move-in",
    type: "movein",
    startDate: "2026-08-21",
    priority: "high",
  },

  {
    id: "2026-fall-begin",
    title: "Classes Begin",
    type: "academic",
    startDate: "2026-08-24",
    priority: "high",
  },

  {
    id: "2026-mid-autumn",
    title: "Mid-Autumn Festival",
    type: "holiday",
    startDate: "2026-09-25",
    endDate: "2026-09-27",
    priority: "high",
  },

  {
    id: "2026-national-day",
    title: "National Day Holiday",
    type: "holiday",
    startDate: "2026-10-01",
    endDate: "2026-10-11",
    priority: "high",
  },

  {
    id: "2026-reading-oct",
    title: "Reading Period",
    type: "academic",
    startDate: "2026-10-16",
    endDate: "2026-10-18",
    priority: "medium",
  },

  {
    id: "2026-first7wk-finals",
    title: "7-Week Finals",
    type: "exam",
    startDate: "2026-10-19",
    endDate: "2026-10-22",
    priority: "high",
  },

  {
    id: "2026-grad-reading",
    title: "Graduate Reading Days",
    type: "academic",
    startDate: "2026-11-27",
    endDate: "2026-12-01",
    priority: "low",
  },

  {
    id: "2026-grad-exams",
    title: "Graduate Exams",
    type: "exam",
    startDate: "2026-12-02",
    endDate: "2026-12-04",
    priority: "medium",
  },

  {
    id: "2026-finals",
    title: "Final Exams",
    type: "exam",
    startDate: "2026-12-14",
    endDate: "2026-12-17",
    priority: "high",
  },

  {
    id: "2026-winter-break",
    title: "Winter Break",
    type: "holiday",
    startDate: "2026-12-18",
    priority: "medium",
  },

  // =========================
  // SPRING 2027
  // =========================

  {
    id: "2027-dorm-open",
    title: "Residence Halls Reopen",
    type: "movein",
    startDate: "2027-01-09",
    priority: "medium",
  },

  {
    id: "2027-spring-begin",
    title: "Classes Begin",
    type: "academic",
    startDate: "2027-01-11",
    priority: "high",
  },

  {
    id: "2027-spring-festival",
    title: "Spring Festival Holiday",
    type: "holiday",
    startDate: "2027-02-05",
    endDate: "2027-02-14",
    priority: "high",
  },

  {
    id: "2027-reading-days",
    title: "Reading Days",
    type: "academic",
    startDate: "2027-03-05",
    endDate: "2027-03-07",
    priority: "medium",
  },

  {
    id: "2027-first7wk-finals",
    title: "7-Week Finals",
    type: "exam",
    startDate: "2027-03-08",
    endDate: "2027-03-11",
    priority: "high",
  },

  {
    id: "2027-spring-recess",
    title: "Spring Recess",
    type: "holiday",
    startDate: "2027-03-15",
    endDate: "2027-03-19",
    priority: "medium",
  },

  {
    id: "2027-qingming",
    title: "Qing Ming Holiday",
    type: "holiday",
    startDate: "2027-04-05",
    priority: "high",
  },

  {
    id: "2027-grad-reading",
    title: "Graduate Reading Days",
    type: "academic",
    startDate: "2027-04-23",
    endDate: "2027-04-27",
    priority: "low",
  },

  {
    id: "2027-grad-exams",
    title: "Graduate Exams",
    type: "exam",
    startDate: "2027-04-28",
    endDate: "2027-04-30",
    priority: "medium",
  },

  {
    id: "2027-ece-reading",
    title: "ECE Reading Days",
    type: "academic",
    startDate: "2027-04-30",
    endDate: "2027-05-04",
    priority: "low",
  },

  {
    id: "2027-labor-day",
    title: "Labor Day Holiday",
    type: "holiday",
    startDate: "2027-05-01",
    endDate: "2027-05-03",
    priority: "high",
  },

  {
    id: "2027-ece-exams",
    title: "ECE Exam Period",
    type: "exam",
    startDate: "2027-05-05",
    endDate: "2027-05-07",
    priority: "medium",
  },

  {
    id: "2027-undergrad-reading",
    title: "Reading Days",
    type: "academic",
    startDate: "2027-05-08",
    endDate: "2027-05-09",
    priority: "medium",
  },

  {
    id: "2027-final-exams",
    title: "Final Exams",
    type: "exam",
    startDate: "2027-05-10",
    endDate: "2027-05-13",
    priority: "high",
  },

  {
    id: "2027-commencement",
    title: "Commencement",
    type: "academic",
    startDate: "2027-05-21",
    priority: "high",
  },

  {
    id: "2027-residence-close",
    title: "Residence Halls Close",
    type: "holiday",
    startDate: "2027-05-22",
    priority: "medium",
  },
];


const MONTHS = [
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

const WEEKDAYS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

const getEventStyles = (type: EventType) => {
  switch (type) {
    case "holiday":
      return {
        bg: "bg-red-100 dark:bg-red-500/15",
        text: "text-red-700 dark:text-red-300",
        border:
          "border-red-200 dark:border-red-500/20",
      };

    case "movein":
      return {
        bg: "bg-green-100 dark:bg-green-500/15",
        text:
          "text-green-700 dark:text-green-300",
        border:
          "border-green-200 dark:border-green-500/20",
      };

    case "registration":
        return {
            bg: "bg-blue-100 dark:bg-blue-500/15",
            text: "text-blue-700 dark:text-blue-300",
            border:
            "border-blue-200 dark:border-blue-500/20",
        };
    case "exam":
        return {
            bg: "bg-purple-100 dark:bg-purple-500/15",
            text: "text-purple-700 dark:text-purple-300",
            border:
            "border-purple-200 dark:border-purple-500/20",
        };

    default:
      return {
        bg: "bg-amber-100 dark:bg-amber-500/15",
        text:
          "text-amber-700 dark:text-amber-300",
        border:
          "border-amber-200 dark:border-amber-500/20",
      };
  }
};

const formatDateKey = (
  year: number,
  month: number,
  day: number
) => {
  return `${year}-${String(month + 1).padStart(
    2,
    "0"
  )}-${String(day).padStart(2, "0")}`;
};

const isDateInRange = (
  target: string,
  start: string,
  end?: string
) => {
  const targetDate = new Date(target).getTime();

  const startDate = new Date(start).getTime();

  const endDate = end
    ? new Date(end).getTime()
    : startDate;

  return (
    targetDate >= startDate &&
    targetDate <= endDate
  );
};

export default function AcademicCalendar() {
  const today = new Date();

  const [year, setYear] = useState(
    today.getFullYear()
  );

  const [month, setMonth] = useState(
    today.getMonth()
  );

  const todayKey = formatDateKey(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const [selectedDate, setSelectedDate] =
    useState(todayKey);

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();

  const leadingEmpty =
    firstDay === 0 ? 6 : firstDay - 1;

  const totalCells = 42;

  const calendarCells: (number | null)[] = [];

  // 前置空白
  for (let i = 0; i < leadingEmpty; i++) {
    calendarCells.push(null);
  }

  // 当前月份
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(day);
  }

  // 后置空白
  while (calendarCells.length < totalCells) {
    calendarCells.push(null);
  }

  const getEventsForDate = (
    dateKey: string
  ) => {
    return EVENTS.filter((event) =>
      isDateInRange(
        dateKey,
        event.startDate,
        event.endDate
      )
    );
  };

  const selectedEvents =
    getEventsForDate(selectedDate);

  return (
    <div className="w-full h-[calc(100vh-110px)] max-w-6xl mx-auto px-4 py-3">

      <div className="h-full overflow-hidden rounded-[30px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f1117] shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">

          <h2 className="text-2xl font-bold tracking-tight">
            Academic Calendar
          </h2>

          <div className="flex items-center gap-2">

            <button
              onClick={() => {
                if (month === 0) {
                  setMonth(11);
                  setYear((y) => y - 1);
                } else {
                  setMonth((m) => m - 1);
                }
              }}
              className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:scale-105 transition-all"
            >
              ←
            </button>

            <div className="min-w-[150px] text-center font-semibold text-lg">
              {MONTHS[month]} {year}
            </div>

            <button
              onClick={() => {
                if (month === 11) {
                  setMonth(0);
                  setYear((y) => y + 1);
                } else {
                  setMonth((m) => m + 1);
                }
              }}
              className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:scale-105 transition-all"
            >
              →
            </button>

          </div>
        </div>

        {/* MAIN */}
        <div className="grid grid-cols-[1.5fr_0.5fr] h-[calc(100%-73px)]">

          {/* LEFT */}
          <div className="p-4 flex flex-col h-full overflow-hidden">

            {/* WEEK HEADER */}
            <div className="grid grid-cols-7 gap-2 mb-2 flex-shrink-0">

              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-gray-400"
                >
                  {day}
                </div>
              ))}

            </div>

            {/* CALENDAR */}
            <div className="grid grid-cols-7 grid-rows-6 gap-2 flex-1 min-h-0">

              {calendarCells.map((day, index) => {

                if (!day) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="rounded-2xl bg-transparent"
                    />
                  );
                }

                const dateKey = formatDateKey(
                  year,
                  month,
                  day
                );

                const events =
                  getEventsForDate(dateKey);

                const isToday =
                  dateKey === todayKey;

                const isSelected =
                  selectedDate === dateKey;

                return (
                  <button
                    key={dateKey}
                    onClick={() =>
                      setSelectedDate(dateKey)
                    }
                    className={`
                      relative
                      rounded-2xl
                      overflow-hidden
                      border
                      p-2
                      text-left
                      transition-all
                      duration-200
                      hover:scale-[1.02]
                      min-h-0
                      h-full

                      ${
                        isSelected
                          ? "border-blue-300 bg-blue-50 dark:bg-blue-500/10 dark:border-blue-500/30 shadow-md"
                          : isToday
                          ? "border-amber-300 dark:border-amber-500/40 bg-amber-50/90 dark:bg-amber-500/15 shadow-sm"
                          : "border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-700"
                      }
                    `}
                  >

                    {/* EVENT BG */}
                    {events.length > 0 && (
                      <div
                        className={`
                          absolute inset-0
                          ${
                            getEventStyles(
                              events[0].type
                            ).bg
                          }
                        `}
                      />
                    )}

                    {/* CONTENT */}
                    <div className="relative z-10 h-full flex flex-col overflow-hidden">

                      {/* DAY */}
                      <div
                        className={`
                          text-sm font-bold flex-shrink-0

                          ${
                            events.length > 0
                              ? getEventStyles(
                                  events[0].type
                                ).text
                              : "text-gray-700 dark:text-gray-200"
                          }
                        `}
                      >
                        {day}
                      </div>

                      {/* EVENTS */}
                      <div className="mt-1 overflow-hidden flex-1">

                        {events.slice(0, 2).map(
                          (event) => (
                            <div
                              key={event.id}
                              className={`
                                text-[10px]
                                leading-tight
                                font-medium
                                mb-1
                                break-words
                                line-clamp-2

                                ${
                                  getEventStyles(
                                    event.type
                                  ).text
                                }
                              `}
                            >
                              {event.title}
                            </div>
                          )
                        )}

                      </div>

                    </div>
                  </button>
                );
              })}

            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="border-l border-gray-100 dark:border-gray-800 bg-gray-50/40 dark:bg-black/20 p-5 overflow-y-auto">

            <h3 className="text-lg font-bold">
              {selectedDate}
            </h3>

            <div className="mt-5 space-y-3">

              {selectedEvents.length === 0 ? (

                <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center text-sm text-gray-500">
                  No events
                </div>

              ) : (

                selectedEvents.map((event) => {
                  const style =
                    getEventStyles(event.type);

                  return (
                    <div
                      key={event.id}
                      className={`
                        rounded-2xl
                        border
                        p-4
                        ${style.bg}
                        ${style.border}
                      `}
                    >

                      <div
                        className={`font-semibold ${style.text}`}
                      >
                        {event.title}
                      </div>

                      <div className="mt-2 text-xs text-gray-500 capitalize">
                        {event.type}
                      </div>

                      <div className="mt-1 text-xs text-gray-400">
                        {event.startDate}

                        {event.endDate &&
                          ` → ${event.endDate}`}
                      </div>

                    </div>
                  );
                })

              )}

            </div>

            {/* LEGEND */}
            <div className="mt-7">

              <div className="text-sm font-semibold text-gray-500 mb-3">
                Categories
              </div>

              <div className="space-y-2 text-sm">

                {[
                  {
                    label: "Holiday",
                    type: "holiday",
                  },

                  {
                    label: "Academic",
                    type: "academic",
                  },

                  {
                    label: "Move-in",
                    type: "movein",
                  },

                  {
                    label: "Registration",
                    type: "registration",
                  },
                  {
                    label: "Exam",
                    type: "exam",
                    },
                ].map((item) => {
                  const style =
                    getEventStyles(
                      item.type as EventType
                    );

                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-2"
                    >
                      <div
                        className={`
                          w-3 h-3 rounded-full
                          ${style.bg}
                          border ${style.border}
                        `}
                      />

                      {item.label}
                    </div>
                  );
                })}

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
