import { CalendarEvent } from "./types";

export const EVENTS_2025_2026: CalendarEvent[] = [
  // =========================
  // FALL 2025
  // =========================

  {
    id: "2025-intl-movein",
    title: "International Student Move-in Day",
    type: "move",
    startDate: "2025-08-08",
    priority: "high",
    description:
      "All new international undergraduate students (Class of 2029) and international first-year graduate students move in at 9:00 AM.",
  },

  {
    id: "2025-cn-movein",
    title: "Chinese Student Move-in Day",
    type: "move",
    startDate: "2025-08-10",
    priority: "high",
    description:
      "All new Chinese undergraduate students (Class of 2029) and Chinese first-year graduate students move in at 9:00 AM.",
  },

  {
    id: "2025-returning-movein",
    title: "Returning Students Move-in Day",
    type: "move",
    startDate: "2025-08-15",
    priority: "high",
    description:
      "Returning undergraduate and graduate students move in at 9:00 AM.",
  },

  {
    id: "2025-fall-classes-begin",
    title: "Classes Begin",
    type: "academic",
    startDate: "2025-08-18",
    priority: "high",
    description: "Undergraduate and graduate classes begin.",
  },

  {
    id: "2025-dropadd-7wk",
    title: "Drop/Add Ends (1st 7-Week)",
    type: "registration",
    startDate: "2025-08-21",
    priority: "medium",
    description: "Drop/add ends for first 7-week undergraduate session.",
  },

  {
    id: "2025-dropadd-14wk",
    title: "Drop/Add Ends (14-Week)",
    type: "registration",
    startDate: "2025-08-28",
    priority: "medium",
    description: "Drop/add ends for 14-week undergraduate session.",
  },

  {
    id: "2025-grad-dropadd",
    title: "Graduate Drop/Add Ends",
    type: "registration",
    startDate: "2025-08-29",
    priority: "low",
    description: "Drop/add ends for graduate classes.",
  },

  {
    id: "2025-withdraw-7wk",
    title: "Withdraw Deadline (1st 7-Week)",
    type: "academic",
    startDate: "2025-09-18",
    priority: "medium",
    description:
      "Last day to withdraw with a W grade of first 7-week classes; Last day to change grading basis of first 7-week classes; Last day to resolve I grade of second seven-week classes in spring 2025.",
  },

  {
    id: "2025-national-day",
    title: "National Day & Mid-Autumn Holiday",
    type: "holiday",
    startDate: "2025-10-01",
    endDate: "2025-10-08",
    priority: "high",
    description: "National Day Holiday and Mid-autumn Festival – No classes.",
  },

  {
    id: "2025-classes-resume-wed",
    title: "Classes Resume (Wednesday Schedule)",
    type: "academic",
    startDate: "2025-10-09",
    priority: "low",
    description:
      "All classes resume. The Wednesday class meeting schedule is in effect on this day.",
  },

  {
    id: "2025-thu-schedule-oct10",
    title: "Thursday Schedule & 1st 7-Week Ends",
    type: "academic",
    startDate: "2025-10-10",
    priority: "medium",
    description:
      "The Thursday meeting schedule is in effect on this day. First 7-week undergraduate session ends.",
  },

  {
    id: "2025-reading-oct",
    title: "Undergraduate Reading Period",
    type: "academic",
    startDate: "2025-10-11",
    endDate: "2025-10-12",
    priority: "medium",
    description: "Undergraduate reading period.",
  },

  {
    id: "2025-7wk-finals",
    title: "1st 7-Week Final Exams",
    type: "exam",
    startDate: "2025-10-13",
    endDate: "2025-10-16",
    priority: "high",
    description:
      "First 7-week undergraduate session final examinations. Graduate classes continue.",
  },

  {
    id: "2025-second7wk-begin",
    title: "2nd 7-Week Session Begins",
    type: "academic",
    startDate: "2025-10-20",
    priority: "medium",
    description: "Second 7-week undergraduate session begins.",
  },

  {
    id: "2025-second7wk-dropadd",
    title: "Drop/Add Ends (2nd 7-Week)",
    type: "registration",
    startDate: "2025-10-23",
    priority: "low",
    description: "Drop/add ends for second 7-week undergraduate session.",
  },

  {
    id: "2025-withdraw-14wk",
    title: "Withdraw Deadline (14-Week)",
    type: "academic",
    startDate: "2025-11-06",
    priority: "medium",
    description:
      "Last day to withdraw with a W grade of 14-week classes. Last day to change grading basis of 14-week classes.",
  },

  {
    id: "2025-grad-end",
    title: "Graduate Classes End",
    type: "academic",
    startDate: "2025-11-20",
    priority: "medium",
    description:
      "Graduate classes end (ECE classes continue); Last day to withdraw with a W grade of second 7-week classes; Last day to change grading basis of second 7-week classes; Last day to resolve I grade of first 7-week classes.",
  },

  {
    id: "2025-grad-reading",
    title: "Graduate Reading Days",
    type: "academic",
    startDate: "2025-11-21",
    endDate: "2025-11-25",
    priority: "low",
    description: "Graduate reading days; ECE classes continue.",
  },

  {
    id: "2025-grad-exams",
    title: "Graduate Final Exams",
    type: "exam",
    startDate: "2025-11-26",
    endDate: "2025-11-28",
    priority: "medium",
    description: "Graduate final exams.",
  },

  {
    id: "2025-ece-end",
    title: "ECE Classes End",
    type: "academic",
    startDate: "2025-11-27",
    priority: "low",
    description: "ECE classes end.",
  },

  {
    id: "2025-ece-reading",
    title: "ECE Reading Days",
    type: "academic",
    startDate: "2025-11-28",
    endDate: "2025-12-02",
    priority: "low",
    description: "ECE program reading days.",
  },

  {
    id: "2025-ece-exams",
    title: "ECE Exam Period",
    type: "exam",
    startDate: "2025-12-03",
    endDate: "2025-12-05",
    priority: "medium",
    description: "ECE program exam period.",
  },

  {
    id: "2025-second7wk-end",
    title: "2nd 7-Week Session Ends",
    type: "academic",
    startDate: "2025-12-04",
    priority: "medium",
    description: "Second 7-week undergraduate session ends.",
  },

  {
    id: "2025-reading-dec",
    title: "Undergraduate Reading Period",
    type: "academic",
    startDate: "2025-12-05",
    endDate: "2025-12-07",
    priority: "medium",
    description: "Undergraduate reading period.",
  },

  {
    id: "2025-finals",
    title: "Undergraduate Final Exams",
    type: "exam",
    startDate: "2025-12-08",
    endDate: "2025-12-11",
    priority: "high",
    description: "Undergraduate final examinations.",
  },

  {
    id: "2025-winter-break",
    title: "Residence Halls Close for Winter Break",
    type: "move",
    startDate: "2025-12-12",
    priority: "medium",
    description: "All residence halls close for Winter Break at 1:00 PM.",
  },

  // =========================
  // SPRING 2026
  // =========================

  {
    id: "2026-dorms-open",
    title: "Residence Halls Reopen",
    type: "move",
    startDate: "2026-01-03",
    priority: "medium",
    description: "All residence halls reopen at 9:00 AM.",
  },

  {
    id: "2026-spring-begin",
    title: "Classes Begin",
    type: "academic",
    startDate: "2026-01-05",
    priority: "high",
    description: "Undergraduate and graduate classes begin.",
  },

  {
    id: "2026-dropadd-7wk-sp",
    title: "Drop/Add Ends (1st 7-Week)",
    type: "registration",
    startDate: "2026-01-08",
    priority: "medium",
    description: "Drop/add ends for first 7-week undergraduate session.",
  },

  {
    id: "2026-dropadd-14wk-sp",
    title: "Drop/Add Ends (14-Week)",
    type: "registration",
    startDate: "2026-01-15",
    priority: "medium",
    description: "Drop/add ends for 14-week undergraduate session.",
  },

  {
    id: "2026-grad-dropadd-sp",
    title: "Graduate Drop/Add Ends",
    type: "registration",
    startDate: "2026-01-16",
    priority: "low",
    description: "Drop/add ends for graduate classes.",
  },

  {
    id: "2026-withdraw-7wk-sp",
    title: "Withdraw Deadline (1st 7-Week)",
    type: "academic",
    startDate: "2026-02-05",
    priority: "medium",
    description:
      "Last day to withdraw with a W grade of first 7-week classes; Last day to change grading basis of first 7-week classes; Last day to resolve I grade of fall 2025 second 7-week classes.",
  },

  {
    id: "2026-mon-schedule-feb13",
    title: "Monday Schedule in Effect",
    type: "academic",
    startDate: "2026-02-13",
    priority: "low",
    description: "The Monday class schedule is in effect on this day.",
  },

  {
    id: "2026-spring-festival",
    title: "Spring Festival Holiday",
    type: "holiday",
    startDate: "2026-02-16",
    endDate: "2026-02-23",
    priority: "high",
    description: "Spring Festival Holiday – Chinese New Year – No classes.",
  },

  {
    id: "2026-classes-resume-feb",
    title: "Classes Resume",
    type: "academic",
    startDate: "2026-02-24",
    priority: "low",
    description: "All classes resume.",
  },

  {
    id: "2026-first7wk-end-sp",
    title: "1st 7-Week Session Ends",
    type: "academic",
    startDate: "2026-02-26",
    priority: "medium",
    description: "First 7-week undergraduate session ends.",
  },

  {
    id: "2026-reading-feb",
    title: "Undergraduate Reading Days",
    type: "academic",
    startDate: "2026-02-27",
    endDate: "2026-03-01",
    priority: "medium",
    description: "Undergraduate Reading Days.",
  },

  {
    id: "2026-7wk-finals-sp",
    title: "1st 7-Week Final Exams",
    type: "exam",
    startDate: "2026-03-02",
    endDate: "2026-03-05",
    priority: "high",
    description:
      "First 7-week undergraduate session final examinations. Graduate classes continue.",
  },

  {
    id: "2026-spring-recess",
    title: "Mini-term Week / Spring Recess",
    type: "holiday",
    startDate: "2026-03-09",
    endDate: "2026-03-13",
    priority: "medium",
    description:
      "Mini-term week for undergraduate students; Spring recess for graduate programs.",
  },

  {
    id: "2026-second7wk-begin-sp",
    title: "2nd 7-Week Session Begins",
    type: "academic",
    startDate: "2026-03-16",
    priority: "medium",
    description: "Second 7-week undergraduate session begins.",
  },

  {
    id: "2026-second7wk-dropadd-sp",
    title: "Drop/Add Ends (2nd 7-Week)",
    type: "registration",
    startDate: "2026-03-19",
    priority: "low",
    description: "Drop/add ends for second 7-week undergraduate session.",
  },

  {
    id: "2026-withdraw-14wk-sp",
    title: "Withdraw Deadline (14-Week)",
    type: "academic",
    startDate: "2026-04-02",
    priority: "medium",
    description:
      "Last day to withdraw with a W grade of 14-week classes. Last day to change grading basis of 14-week classes.",
  },

  {
    id: "2026-qingming",
    title: "Qing Ming Holiday",
    type: "holiday",
    startDate: "2026-04-03",
    endDate: "2026-04-05",
    priority: "high",
    description: "Qing Ming – Tomb Sweeping Day – No classes.",
  },

  {
    id: "2026-grad-end-sp",
    title: "Graduate Classes End",
    type: "academic",
    startDate: "2026-04-16",
    priority: "medium",
    description:
      "Graduate classes end (ECE classes continue); Last day to withdraw with a W grade of second 7-week classes; Last day to change grading basis for second 7-week classes; Last day for I grade change of spring 2026 first 7-week classes.",
  },

  {
    id: "2026-grad-reading-sp",
    title: "Graduate Reading Days",
    type: "academic",
    startDate: "2026-04-17",
    endDate: "2026-04-21",
    priority: "low",
    description: "Graduate Reading Days.",
  },

  {
    id: "2026-grad-exams-sp",
    title: "Graduate Final Exams",
    type: "exam",
    startDate: "2026-04-22",
    endDate: "2026-04-24",
    priority: "medium",
    description: "Graduate exams; ECE classes continue.",
  },

  {
    id: "2026-ece-end-sp",
    title: "ECE Classes End",
    type: "academic",
    startDate: "2026-04-23",
    priority: "low",
    description: "ECE classes end.",
  },

  {
    id: "2026-ece-reading-sp",
    title: "ECE Reading Days",
    type: "academic",
    startDate: "2026-04-24",
    endDate: "2026-04-26",
    priority: "low",
    description: "ECE program reading days.",
  },

  {
    id: "2026-ece-exams-sp",
    title: "ECE Exam Period",
    type: "exam",
    startDate: "2026-04-27",
    endDate: "2026-04-29",
    priority: "medium",
    description: "ECE program exam period.",
  },

  {
    id: "2026-labor-day",
    title: "Labor Day Holiday",
    type: "holiday",
    startDate: "2026-05-01",
    endDate: "2026-05-03",
    priority: "high",
    description: "International Labor Day Holiday – No classes.",
  },

  {
    id: "2026-undergrad-reading",
    title: "Undergraduate Reading Days",
    type: "academic",
    startDate: "2026-05-01",
    endDate: "2026-05-03",
    priority: "medium",
    description: "Undergraduate Reading Days.",
  },

  {
    id: "2026-finals-sp",
    title: "Undergraduate Final Exams",
    type: "exam",
    startDate: "2026-05-04",
    endDate: "2026-05-07",
    priority: "high",
    description: "Undergraduate final exam period.",
  },

  {
    id: "2026-commencement",
    title: "Commencement",
    type: "academic",
    startDate: "2026-05-15",
    priority: "high",
    description: "Graduate and Undergraduate Commencement.",
  },

  {
    id: "2026-residence-close",
    title: "Residence Halls Close",
    type: "move",
    startDate: "2026-05-16",
    priority: "medium",
    description: "All residence halls close at 1:00 PM.",
  },
];