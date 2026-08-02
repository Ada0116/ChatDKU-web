import { CalendarEvent } from "./types";

export const EVENTS_2024_2025: CalendarEvent[] = [
  // =========================
  // FALL 2024
  // =========================

  {
    id: "2024-intl-movein",
    title: "International Student Move-in Day",
    type: "move",
    startDate: "2024-08-09",
    priority: "high",
    description:
      "All new international undergraduate students (Class of 2028) and international first-year graduate students move in at 9:00 AM.",
  },

  {
    id: "2024-cn-movein",
    title: "Chinese Student Move-in Day",
    type: "move",
    startDate: "2024-08-11",
    priority: "high",
    description:
      "All new Chinese undergraduate students (Class of 2028) and Chinese first-year graduate students move in at 9:00 AM.",
  },

  {
    id: "2024-returning-movein",
    title: "Returning Students Move-in Day",
    type: "move",
    startDate: "2024-08-16",
    priority: "high",
    description:
      "Returning undergraduate and graduate students move in at 9:00 AM.",
  },

  {
    id: "2024-fall-classes-begin",
    title: "Classes Begin",
    type: "academic",
    startDate: "2024-08-19",
    priority: "high",
    description: "Undergraduate and graduate classes begin.",
  },

  {
    id: "2024-dropadd-7wk",
    title: "Drop/Add Ends (1st 7-Week)",
    type: "registration",
    startDate: "2024-08-22",
    priority: "medium",
    description: "Drop/add ends for first 7-week undergraduate session.",
  },

  {
    id: "2024-dropadd-14wk",
    title: "Drop/Add Ends (14-Week)",
    type: "registration",
    startDate: "2024-08-29",
    priority: "medium",
    description: "Drop/add ends for 14-week undergraduate session.",
  },

  {
    id: "2024-grad-dropadd",
    title: "Graduate Drop/Add Ends",
    type: "registration",
    startDate: "2024-08-30",
    priority: "low",
    description: "Drop/add ends for graduate classes.",
  },

  {
    id: "2024-mid-autumn",
    title: "Mid-Autumn Festival",
    type: "holiday",
    startDate: "2024-09-14",
    endDate: "2024-09-17",
    priority: "high",
    description: "Mid-Autumn Festival – No classes.",
  },

  {
    id: "2024-mon-schedule-sep18",
    title: "Monday Schedule in Effect (Classes Resume)",
    type: "academic",
    startDate: "2024-09-18",
    priority: "low",
    description:
      "Classes resume and the Monday class meeting schedule is in effect on this day.",
  },

  {
    id: "2024-tue-schedule-sep19",
    title: "Tuesday Schedule in Effect",
    type: "academic",
    startDate: "2024-09-19",
    priority: "low",
    description: "The Tuesday class meeting schedule is in effect on this day.",
  },

  {
    id: "2024-wed-schedule-sep20",
    title: "Wednesday Schedule in Effect",
    type: "academic",
    startDate: "2024-09-20",
    priority: "low",
    description: "The Wednesday class meeting schedule is in effect on this day.",
  },

  {
    id: "2024-withdraw-7wk",
    title: "Withdraw Deadline (1st 7-Week)",
    type: "academic",
    startDate: "2024-09-21",
    priority: "medium",
    description:
      "The Thursday class meeting schedule is in effect on this day; Last day to withdraw with a W grade of first 7-week classes; Last day to change grading basis of first 7-week classes; Last day to resolve I grade of second seven-week classes in spring 2024.",
  },

  {
    id: "2024-national-day",
    title: "National Day Holiday",
    type: "holiday",
    startDate: "2024-10-01",
    endDate: "2024-10-07",
    priority: "high",
    description: "National Day Holiday – No classes.",
  },

  {
    id: "2024-classes-resume-oct",
    title: "Classes Resume",
    type: "academic",
    startDate: "2024-10-08",
    priority: "low",
    description: "All classes resume.",
  },

  {
    id: "2024-first7wk-end",
    title: "1st 7-Week Session Ends",
    type: "academic",
    startDate: "2024-10-10",
    priority: "medium",
    description: "First 7-week undergraduate session ends.",
  },

  {
    id: "2024-reading-oct",
    title: "Undergraduate Reading Period",
    type: "academic",
    startDate: "2024-10-11",
    endDate: "2024-10-13",
    priority: "medium",
    description: "Undergraduate reading period.",
  },

  {
    id: "2024-7wk-finals",
    title: "1st 7-Week Final Exams",
    type: "exam",
    startDate: "2024-10-14",
    endDate: "2024-10-17",
    priority: "high",
    description:
      "First 7-week undergraduate session final examinations. Graduate classes continue.",
  },

  {
    id: "2024-second7wk-begin",
    title: "2nd 7-Week Session Begins",
    type: "academic",
    startDate: "2024-10-21",
    priority: "medium",
    description: "Second 7-week undergraduate session begins.",
  },

  {
    id: "2024-second7wk-dropadd",
    title: "Drop/Add Ends (2nd 7-Week)",
    type: "registration",
    startDate: "2024-10-24",
    priority: "low",
    description: "Drop/add ends for second 7-week undergraduate session.",
  },

  {
    id: "2024-withdraw-14wk",
    title: "Withdraw Deadline (14-Week)",
    type: "academic",
    startDate: "2024-11-07",
    priority: "medium",
    description:
      "Last day to withdraw with a W grade of 14-week classes.",
  },

  {
    id: "2024-grad-end",
    title: "Graduate Classes End",
    type: "academic",
    startDate: "2024-11-21",
    priority: "medium",
    description:
      "Graduate classes end (ECE classes continue); Last day to withdraw with a W grade of second 7-week classes; Last day to change grading basis of second 7-week classes; Last day to resolve I grade of first 7-week classes.",
  },

  {
    id: "2024-grad-reading",
    title: "Graduate Reading Days",
    type: "academic",
    startDate: "2024-11-22",
    endDate: "2024-11-26",
    priority: "low",
    description: "Graduate reading days; ECE classes continue.",
  },

  {
    id: "2024-grad-exams",
    title: "Graduate Final Exams",
    type: "exam",
    startDate: "2024-11-27",
    endDate: "2024-11-29",
    priority: "medium",
    description: "Graduate final exams.",
  },

  {
    id: "2024-ece-end",
    title: "ECE Classes End",
    type: "academic",
    startDate: "2024-11-28",
    priority: "low",
    description: "ECE classes end.",
  },

  {
    id: "2024-ece-reading",
    title: "ECE Reading Days",
    type: "academic",
    startDate: "2024-11-29",
    endDate: "2024-12-03",
    priority: "low",
    description: "ECE program reading days.",
  },

  {
    id: "2024-ece-exams",
    title: "ECE Exam Period",
    type: "exam",
    startDate: "2024-12-04",
    endDate: "2024-12-06",
    priority: "medium",
    description: "ECE program exam period.",
  },

  {
    id: "2024-second7wk-end",
    title: "2nd 7-Week Session Ends",
    type: "academic",
    startDate: "2024-12-05",
    priority: "medium",
    description: "Second 7-week undergraduate session ends.",
  },

  {
    id: "2024-reading-dec",
    title: "Undergraduate Reading Period",
    type: "academic",
    startDate: "2024-12-06",
    endDate: "2024-12-08",
    priority: "medium",
    description: "Undergraduate reading period.",
  },

  {
    id: "2024-finals",
    title: "Undergraduate Final Exams",
    type: "exam",
    startDate: "2024-12-09",
    endDate: "2024-12-12",
    priority: "high",
    description: "Undergraduate final examinations.",
  },

  {
    id: "2024-winter-break",
    title: "Residence Halls Close for Winter Break",
    type: "move",
    startDate: "2024-12-13",
    priority: "medium",
    description: "All residence halls close for Winter Break at 1:00 PM.",
  },

  // =========================
  // SPRING 2025
  // =========================

  {
    id: "2024-extended-requirement",
    title: "Extended Requirement (Theory)",
    type: "academic",
    startDate: "2024-12-13",
    endDate: "2024-12-16",
    priority: "low",
    description:
      "Extended Requirement (theory) for Class of 2028 — required for mainland Chinese students and optional for HMT students.",
  },

  {
    id: "2024-cn-moveout",
    title: "First-Year Chinese Students Move-out",
    type: "move",
    startDate: "2024-12-17",
    priority: "medium",
    description: "First-year Chinese students move out at 1:00 PM.",
  },

  {
    id: "2025-dorms-open",
    title: "Residence Halls Reopen",
    type: "move",
    startDate: "2025-01-03",
    priority: "medium",
    description: "All residence halls reopen at 9:00 AM.",
  },

  {
    id: "2025-spring-begin",
    title: "Classes Begin",
    type: "academic",
    startDate: "2025-01-06",
    priority: "high",
    description: "Undergraduate and graduate classes begin.",
  },

  {
    id: "2025-dropadd-7wk",
    title: "Drop/Add Ends (1st 7-Week)",
    type: "registration",
    startDate: "2025-01-09",
    priority: "medium",
    description: "Drop/add ends for first 7-week undergraduate session.",
  },

  {
    id: "2025-dropadd-14wk",
    title: "Drop/Add Ends (14-Week)",
    type: "registration",
    startDate: "2025-01-16",
    priority: "medium",
    description: "Drop/add ends for 14-week undergraduate session.",
  },

  {
    id: "2025-grad-dropadd",
    title: "Graduate Drop/Add Ends",
    type: "registration",
    startDate: "2025-01-17",
    priority: "low",
    description: "Drop/add ends for graduate classes.",
  },

  {
    id: "2025-mon-schedule-jan24",
    title: "Monday Schedule in Effect",
    type: "academic",
    startDate: "2025-01-24",
    priority: "low",
    description: "The Monday class meeting schedule is in effect on this day.",
  },

  {
    id: "2025-spring-festival",
    title: "Spring Festival Holiday",
    type: "holiday",
    startDate: "2025-01-25",
    endDate: "2025-02-04",
    priority: "high",
    description: "Spring Festival Holiday – Chinese New Year – No classes.",
  },

  {
    id: "2025-classes-resume-feb5",
    title: "Classes Resume (Tuesday Schedule)",
    type: "academic",
    startDate: "2025-02-05",
    priority: "low",
    description:
      "All classes resume. The Tuesday class meeting schedule is in effect on this day.",
  },

  {
    id: "2025-wed-schedule-feb6",
    title: "Wednesday Schedule in Effect",
    type: "academic",
    startDate: "2025-02-06",
    priority: "low",
    description: "The Wednesday class meeting schedule is in effect on this day.",
  },

  {
    id: "2025-thu-schedule-feb7",
    title: "Thursday Schedule in Effect",
    type: "academic",
    startDate: "2025-02-07",
    priority: "low",
    description: "The Thursday class meeting schedule is in effect on this day.",
  },

  {
    id: "2025-withdraw-7wk",
    title: "Withdraw Deadline (1st 7-Week)",
    type: "academic",
    startDate: "2025-02-13",
    priority: "medium",
    description:
      "Last day to withdraw with a W grade of first 7-week classes; Last day to change grading basis of first 7-week classes; Last day to resolve I grade of fall 2024 second 7-week classes.",
  },

  {
    id: "2025-first7wk-end",
    title: "1st 7-Week Session Ends",
    type: "academic",
    startDate: "2025-02-27",
    priority: "medium",
    description: "First 7-week undergraduate session ends.",
  },

  {
    id: "2025-reading-feb",
    title: "Undergraduate Reading Days",
    type: "academic",
    startDate: "2025-02-28",
    endDate: "2025-03-02",
    priority: "medium",
    description: "Undergraduate Reading Days.",
  },

  {
    id: "2025-7wk-finals",
    title: "1st 7-Week Final Exams",
    type: "exam",
    startDate: "2025-03-03",
    endDate: "2025-03-06",
    priority: "high",
    description:
      "First 7-week undergraduate session final examinations. Graduate classes continue.",
  },

  {
    id: "2025-spring-recess",
    title: "Mini-term Week / Spring Recess",
    type: "holiday",
    startDate: "2025-03-10",
    endDate: "2025-03-14",
    priority: "medium",
    description:
      "Mini-term week for undergraduate students; Spring recess for graduate programs.",
  },

  {
    id: "2025-second7wk-begin",
    title: "2nd 7-Week Session Begins",
    type: "academic",
    startDate: "2025-03-17",
    priority: "medium",
    description: "Second 7-week undergraduate session begins.",
  },

  {
    id: "2025-second7wk-dropadd",
    title: "Drop/Add Ends (2nd 7-Week)",
    type: "registration",
    startDate: "2025-03-20",
    priority: "low",
    description: "Drop/add ends for second 7-week undergraduate session.",
  },

  {
    id: "2025-withdraw-14wk",
    title: "Withdraw Deadline (14-Week)",
    type: "academic",
    startDate: "2025-04-03",
    priority: "medium",
    description:
      "Last day to withdraw with a W grade of 14-week classes.",
  },

  {
    id: "2025-qingming",
    title: "Qing Ming Holiday",
    type: "holiday",
    startDate: "2025-04-04",
    endDate: "2025-04-06",
    priority: "high",
    description: "Qing Ming – Tomb Sweeping Day – No classes.",
  },

  {
    id: "2025-grad-end",
    title: "Graduate Classes End",
    type: "academic",
    startDate: "2025-04-17",
    priority: "medium",
    description:
      "Graduate classes end (ECE classes continue); Last day to withdraw with a W grade of second 7-week classes; Last day to change grading basis for second 7-week classes; Last day for I grade change of spring 2025 first 7-week classes.",
  },

  {
    id: "2025-grad-reading",
    title: "Graduate Reading Days",
    type: "academic",
    startDate: "2025-04-18",
    endDate: "2025-04-22",
    priority: "low",
    description: "Graduate Reading Days.",
  },

  {
    id: "2025-grad-exams",
    title: "Graduate Final Exams",
    type: "exam",
    startDate: "2025-04-23",
    endDate: "2025-04-25",
    priority: "medium",
    description: "Graduate exams; ECE classes continue.",
  },

  {
    id: "2025-ece-end",
    title: "ECE Classes End",
    type: "academic",
    startDate: "2025-04-24",
    priority: "low",
    description: "ECE classes end.",
  },

  {
    id: "2025-mon-schedule-apr25",
    title: "Monday Schedule in Effect",
    type: "academic",
    startDate: "2025-04-25",
    priority: "low",
    description:
      "The Monday class meeting schedule is in effect on this day (undergraduate classes only).",
  },

  {
    id: "2025-ece-reading",
    title: "ECE Reading Days",
    type: "academic",
    startDate: "2025-04-25",
    endDate: "2025-04-27",
    priority: "low",
    description: "ECE program reading days.",
  },

  {
    id: "2025-ece-exams",
    title: "ECE Exam Period",
    type: "exam",
    startDate: "2025-04-28",
    endDate: "2025-04-30",
    priority: "medium",
    description: "ECE program exam period.",
  },

  {
    id: "2025-tue-schedule-apr28",
    title: "Tuesday Schedule in Effect",
    type: "academic",
    startDate: "2025-04-28",
    priority: "low",
    description:
      "The Tuesday class meeting schedule is in effect on this day (undergraduate classes only).",
  },

  {
    id: "2025-wed-schedule-apr29",
    title: "Wednesday Schedule in Effect",
    type: "academic",
    startDate: "2025-04-29",
    priority: "low",
    description:
      "The Wednesday class meeting schedule is in effect on this day (undergraduate classes only).",
  },

  {
    id: "2025-thu-schedule-apr30",
    title: "Thursday Schedule in Effect",
    type: "academic",
    startDate: "2025-04-30",
    priority: "low",
    description:
      "The Thursday class meeting schedule is in effect on this day (undergraduate classes only).",
  },

  {
    id: "2025-labor-day",
    title: "Labor Day Holiday",
    type: "holiday",
    startDate: "2025-05-01",
    endDate: "2025-05-04",
    priority: "high",
    description: "International Labor Day Holiday – No classes.",
  },

  {
    id: "2025-undergrad-reading",
    title: "Undergraduate Reading Days",
    type: "academic",
    startDate: "2025-05-01",
    endDate: "2025-05-04",
    priority: "medium",
    description: "Undergraduate Reading Days.",
  },

  {
    id: "2025-finals",
    title: "Undergraduate Final Exams",
    type: "exam",
    startDate: "2025-05-05",
    endDate: "2025-05-08",
    priority: "high",
    description: "Undergraduate final exam period.",
  },

  {
    id: "2025-commencement",
    title: "Commencement",
    type: "academic",
    startDate: "2025-05-16",
    priority: "high",
    description: "Graduate and Undergraduate Commencement.",
  },

  {
    id: "2025-residence-close",
    title: "Residence Halls Close",
    type: "move",
    startDate: "2025-05-17",
    priority: "medium",
    description: "All residence halls close at 1:00 PM.",
  },
];
