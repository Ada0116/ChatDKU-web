import { CalendarEvent } from "./types";

export const EVENTS_2026_2027: CalendarEvent[] = [
  // =========================
  // FALL 2026
  // =========================

  {
    id: "2026-intl-movein",
    title: "International Student Move-in Day",
    type: "move",
    startDate: "2026-08-14",
    priority: "high",
    description:
      "All new international undergraduate students (Class of 2030) and international first-year graduate students move in at 9:00 AM.",
  },

  {
    id: "2026-cn-movein",
    title: "Chinese Student Move-in Day",
    type: "move",
    startDate: "2026-08-16",
    priority: "high",
    description:
      "All new Chinese undergraduate students (Class of 2030) and Chinese first-year graduate students move in at 9:00 AM.",
  },

  {
    id: "2026-returning-movein",
    title: "Returning Students Move-in Day",
    type: "move",
    startDate: "2026-08-21",
    priority: "high",
    description:
      "Returning undergraduate and graduate students move in at 9:00 AM.",
  },

  {
    id: "2026-fall-classes-begin",
    title: "Classes Begin",
    type: "academic",
    startDate: "2026-08-24",
    priority: "high",
    description: "Undergraduate and graduate classes begin.",
  },

  {
    id: "2026-dropadd-7wk",
    title: "Drop/Add Ends (1st 7-Week)",
    type: "registration",
    startDate: "2026-08-27",
    priority: "medium",
    description: "Drop/add ends for first 7-week undergraduate session.",
  },

  {
    id: "2026-dropadd-14wk",
    title: "Drop/Add Ends (14-Week)",
    type: "registration",
    startDate: "2026-09-03",
    priority: "medium",
    description: "Drop/add ends for 14-week undergraduate session.",
  },

  {
    id: "2026-grad-dropadd",
    title: "Graduate Drop/Add Ends",
    type: "registration",
    startDate: "2026-09-04",
    priority: "low",
    description: "Drop/add ends for graduate classes.",
  },

  {
    id: "2026-thu-schedule-sep",
    title: "Thursday Schedule in Effect",
    type: "academic",
    startDate: "2026-09-18",
    priority: "low",
    description:
      "Classes continue. The Thursday class meeting schedule is in effect on this day.",
  },

  {
    id: "2026-withdraw-7wk",
    title: "Withdraw Deadline (1st 7-Week)",
    type: "academic",
    startDate: "2026-09-24",
    priority: "medium",
    description:
      "Last day to withdraw with a W grade of first 7-week classes; Last day to change grading basis of first 7-week classes; Last day to resolve I grade of second seven-week classes in spring 2026.",
  },

  {
    id: "2026-mid-autumn",
    title: "Mid-Autumn Festival",
    type: "holiday",
    startDate: "2026-09-25",
    endDate: "2026-09-27",
    priority: "high",
    description: "Mid-Autumn Festival – No classes.",
  },

  {
    id: "2026-national-day",
    title: "National Day Holiday",
    type: "holiday",
    startDate: "2026-10-01",
    endDate: "2026-10-11",
    priority: "high",
    description: "National Day Holiday – No classes.",
  },

  {
    id: "2026-classes-resume-oct",
    title: "Classes Resume",
    type: "academic",
    startDate: "2026-10-12",
    priority: "low",
    description: "All classes resume.",
  },

  {
    id: "2026-first7wk-end",
    title: "1st 7-Week Session Ends",
    type: "academic",
    startDate: "2026-10-15",
    priority: "medium",
    description: "First 7-week undergraduate session ends.",
  },

  {
    id: "2026-reading-oct",
    title: "Undergraduate Reading Period",
    type: "academic",
    startDate: "2026-10-16",
    endDate: "2026-10-18",
    priority: "medium",
    description: "Undergraduate reading period.",
  },

  {
    id: "2026-7wk-finals",
    title: "1st 7-Week Final Exams",
    type: "exam",
    startDate: "2026-10-19",
    endDate: "2026-10-22",
    priority: "high",
    description:
      "First 7-week undergraduate session final examinations. Graduate classes continue.",
  },

  {
    id: "2026-second7wk-begin",
    title: "2nd 7-Week Session Begins",
    type: "academic",
    startDate: "2026-10-26",
    priority: "medium",
    description: "Second 7-week undergraduate session begins.",
  },

  {
    id: "2026-second7wk-dropadd",
    title: "Drop/Add Ends (2nd 7-Week)",
    type: "registration",
    startDate: "2026-10-29",
    priority: "low",
    description: "Drop/add ends for second 7-week undergraduate session.",
  },

  {
    id: "2026-withdraw-14wk",
    title: "Withdraw Deadline (14-Week)",
    type: "academic",
    startDate: "2026-11-12",
    priority: "medium",
    description:
      "Last day to withdraw with a W grade of 14-week classes. Last day to change grading basis of 14-week classes.",
  },

  {
    id: "2026-grad-end",
    title: "Graduate Classes End",
    type: "academic",
    startDate: "2026-11-26",
    priority: "medium",
    description:
      "Graduate classes end (ECE classes continue); Last day to withdraw with a W grade of second 7-week classes; Last day to change grading basis of second 7-week classes; Last day to resolve I grade of first 7-week classes.",
  },

  {
    id: "2026-grad-reading",
    title: "Graduate Reading Days",
    type: "academic",
    startDate: "2026-11-27",
    endDate: "2026-12-01",
    priority: "low",
    description: "Graduate reading days; ECE classes continue.",
  },

  {
    id: "2026-grad-exams",
    title: "Graduate Final Exams",
    type: "exam",
    startDate: "2026-12-02",
    endDate: "2026-12-04",
    priority: "medium",
    description: "Graduate final exams.",
  },

  {
    id: "2026-ece-end",
    title: "ECE Classes End",
    type: "academic",
    startDate: "2026-12-03",
    priority: "low",
    description: "ECE classes end.",
  },

  {
    id: "2026-ece-reading",
    title: "ECE Reading Days",
    type: "academic",
    startDate: "2026-12-04",
    endDate: "2026-12-08",
    priority: "low",
    description: "ECE program reading days.",
  },

  {
    id: "2026-ece-exams",
    title: "ECE Exam Period",
    type: "exam",
    startDate: "2026-12-09",
    endDate: "2026-12-11",
    priority: "medium",
    description: "ECE program exam period.",
  },

  {
    id: "2026-second7wk-end",
    title: "2nd 7-Week Session Ends",
    type: "academic",
    startDate: "2026-12-10",
    priority: "medium",
    description: "Second 7-week undergraduate session ends.",
  },

  {
    id: "2026-reading-dec",
    title: "Undergraduate Reading Period",
    type: "academic",
    startDate: "2026-12-11",
    endDate: "2026-12-13",
    priority: "medium",
    description: "Undergraduate reading period.",
  },

  {
    id: "2026-finals",
    title: "Undergraduate Final Exams",
    type: "exam",
    startDate: "2026-12-14",
    endDate: "2026-12-17",
    priority: "high",
    description: "Undergraduate final examinations.",
  },

  {
    id: "2026-winter-break",
    title: "Residence Halls Close for Winter Break",
    type: "move",
    startDate: "2026-12-18",
    priority: "medium",
    description: "All residence halls close for Winter Break at 1:00 PM.",
  },

  // =========================
  // SPRING 2027
  // =========================

  {
    id: "2027-dorms-open",
    title: "Residence Halls Reopen",
    type: "move",
    startDate: "2027-01-09",
    priority: "medium",
    description: "All residence halls reopen at 9:00 AM.",
  },

  {
    id: "2027-spring-begin",
    title: "Classes Begin",
    type: "academic",
    startDate: "2027-01-11",
    priority: "high",
    description: "Undergraduate and graduate classes begin.",
  },

  {
    id: "2027-dropadd-7wk",
    title: "Drop/Add Ends (1st 7-Week)",
    type: "registration",
    startDate: "2027-01-14",
    priority: "medium",
    description: "Drop/add ends for first 7-week undergraduate session.",
  },

  {
    id: "2027-dropadd-14wk",
    title: "Drop/Add Ends (14-Week)",
    type: "registration",
    startDate: "2027-01-21",
    priority: "medium",
    description: "Drop/add ends for 14-week undergraduate session.",
  },

  {
    id: "2027-grad-dropadd",
    title: "Graduate Drop/Add Ends",
    type: "registration",
    startDate: "2027-01-22",
    priority: "low",
    description: "Drop/add ends for graduate classes.",
  },

  {
    id: "2027-spring-festival",
    title: "Spring Festival Holiday",
    type: "holiday",
    startDate: "2027-02-05",
    endDate: "2027-02-14",
    priority: "high",
    description: "Spring Festival Holiday – Chinese New Year – No classes.",
  },

  {
    id: "2027-classes-resume-feb",
    title: "Classes Resume",
    type: "academic",
    startDate: "2027-02-15",
    priority: "low",
    description: "All classes resume.",
  },

  {
    id: "2027-withdraw-7wk",
    title: "Withdraw Deadline (1st 7-Week)",
    type: "academic",
    startDate: "2027-02-18",
    priority: "medium",
    description:
      "Last day to withdraw with a W grade of first 7-week classes; Last day to change grading basis of first 7-week classes; Last day to resolve I grade of fall 2026 second 7-week classes.",
  },

  {
    id: "2027-first7wk-end",
    title: "1st 7-Week Session Ends",
    type: "academic",
    startDate: "2027-03-04",
    priority: "medium",
    description: "First 7-week undergraduate session ends.",
  },

  {
    id: "2027-reading-mar",
    title: "Undergraduate Reading Days",
    type: "academic",
    startDate: "2027-03-05",
    endDate: "2027-03-07",
    priority: "medium",
    description: "Undergraduate Reading Days.",
  },

  {
    id: "2027-7wk-finals",
    title: "1st 7-Week Final Exams",
    type: "exam",
    startDate: "2027-03-08",
    endDate: "2027-03-11",
    priority: "high",
    description:
      "First 7-week undergraduate session final examinations. Graduate classes continue.",
  },

  {
    id: "2027-spring-recess",
    title: "Mini-term Week / Spring Recess",
    type: "holiday",
    startDate: "2027-03-15",
    endDate: "2027-03-19",
    priority: "medium",
    description:
      "Mini-term week for undergraduate students; Spring recess for graduate programs.",
  },

  {
    id: "2027-second7wk-begin",
    title: "2nd 7-Week Session Begins",
    type: "academic",
    startDate: "2027-03-22",
    priority: "medium",
    description: "Second 7-week undergraduate session begins.",
  },

  {
    id: "2027-second7wk-dropadd",
    title: "Drop/Add Ends (2nd 7-Week)",
    type: "registration",
    startDate: "2027-03-25",
    priority: "low",
    description: "Drop/add ends for second 7-week undergraduate session.",
  },

  {
    id: "2027-qingming",
    title: "Qing Ming Holiday",
    type: "holiday",
    startDate: "2027-04-05",
    priority: "high",
    description: "Qing Ming – Tomb Sweeping Day – No classes.",
  },

  {
    id: "2027-mon-schedule-apr6",
    title: "Monday Schedule in Effect",
    type: "academic",
    startDate: "2027-04-06",
    priority: "low",
    description: "The Monday class schedule is in effect on this day.",
  },

  {
    id: "2027-tue-schedule-apr7",
    title: "Tuesday Schedule in Effect",
    type: "academic",
    startDate: "2027-04-07",
    priority: "low",
    description: "The Tuesday class schedule is in effect on this day.",
  },

  {
    id: "2027-wed-schedule-apr8",
    title: "Wednesday Schedule in Effect",
    type: "academic",
    startDate: "2027-04-08",
    priority: "low",
    description: "The Wednesday class schedule is in effect on this day.",
  },

  {
    id: "2027-withdraw-14wk",
    title: "Withdraw Deadline (14-Week)",
    type: "academic",
    startDate: "2027-04-09",
    priority: "medium",
    description:
      "The Thursday class schedule is in effect on this day. Last day to withdraw with a W grade of 14-week classes. Last day to change grading basis of 14-week classes.",
  },

  {
    id: "2027-grad-end",
    title: "Graduate Classes End",
    type: "academic",
    startDate: "2027-04-22",
    priority: "medium",
    description:
      "Graduate classes end (ECE classes continue); Last day to withdraw with a W grade of second 7-week classes; Last day to change grading basis for second 7-week classes; Last day for I grade change of spring 2027 first 7-week classes.",
  },

  {
    id: "2027-grad-reading",
    title: "Graduate Reading Days",
    type: "academic",
    startDate: "2027-04-23",
    endDate: "2027-04-27",
    priority: "low",
    description: "Graduate Reading Days.",
  },

  {
    id: "2027-grad-exams",
    title: "Graduate Final Exams",
    type: "exam",
    startDate: "2027-04-28",
    endDate: "2027-04-30",
    priority: "medium",
    description: "Graduate exams; ECE classes continue.",
  },

  {
    id: "2027-ece-end",
    title: "ECE Classes End",
    type: "academic",
    startDate: "2027-04-29",
    priority: "low",
    description: "ECE classes end.",
  },

  {
    id: "2027-ece-reading",
    title: "ECE Reading Days",
    type: "academic",
    startDate: "2027-04-30",
    endDate: "2027-05-04",
    priority: "low",
    description: "ECE program reading days.",
  },

  {
    id: "2027-labor-day",
    title: "Labor Day Holiday",
    type: "holiday",
    startDate: "2027-05-01",
    endDate: "2027-05-03",
    priority: "high",
    description: "International Labor Day Holiday – No classes.",
  },

  {
    id: "2027-mon-schedule-may4",
    title: "Monday Schedule in Effect",
    type: "academic",
    startDate: "2027-05-04",
    priority: "low",
    description: "The Monday class schedule is in effect on this day.",
  },

  {
    id: "2027-tue-schedule-may5",
    title: "Tuesday Schedule in Effect",
    type: "academic",
    startDate: "2027-05-05",
    priority: "low",
    description: "The Tuesday class schedule is in effect on this day.",
  },

  {
    id: "2027-ece-exams",
    title: "ECE Exam Period",
    type: "exam",
    startDate: "2027-05-05",
    endDate: "2027-05-07",
    priority: "medium",
    description: "ECE program exam period.",
  },

  {
    id: "2027-wed-schedule-may6",
    title: "Wednesday Schedule in Effect",
    type: "academic",
    startDate: "2027-05-06",
    priority: "low",
    description: "The Wednesday class schedule is in effect on this day.",
  },

  {
    id: "2027-thu-schedule-may7",
    title: "Thursday Schedule in Effect",
    type: "academic",
    startDate: "2027-05-07",
    priority: "medium",
    description:
      "The Thursday class schedule is in effect on this day. Second 7-week undergraduate session ends.",
  },

  {
    id: "2027-reading-may",
    title: "Undergraduate Reading Days",
    type: "academic",
    startDate: "2027-05-08",
    endDate: "2027-05-09",
    priority: "medium",
    description: "Undergraduate Reading Days.",
  },

  {
    id: "2027-finals",
    title: "Undergraduate Final Exams",
    type: "exam",
    startDate: "2027-05-10",
    endDate: "2027-05-13",
    priority: "high",
    description: "Undergraduate final exam period.",
  },

  {
    id: "2027-commencement",
    title: "Commencement",
    type: "academic",
    startDate: "2027-05-21",
    priority: "high",
    description: "Graduate and Undergraduate Commencement.",
  },

  {
    id: "2027-residence-close",
    title: "Residence Halls Close",
    type: "move",
    startDate: "2027-05-22",
    priority: "medium",
    description: "All residence halls close at 1:00 PM.",
  },
];
