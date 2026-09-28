import type {
  AttendanceSeed,
  Badge,
  CountdownOffsets,
  HomeworkSeed,
  LessonData,
  Level,
  MockExam,
  Notification,
  Ranking,
  Scores,
  Student,
} from './types';

const H = 3_600_000;
const D = 86_400_000;

export const student: Student = {
  name: 'Aziza Karimova',
  initials: 'AK',
  group: 'Evening Group B',
  joined: 'June 2026',
  xp: 6420,
  streak: 12,
  streakShield: 1,
  bridge: 58,
};

export const scores: Scores = {
  math: 710,
  mathTotal: 800,
  rw: 630,
  rwTotal: 800,
  best: 1340,
  goal: 1450,
  // Fixed test day — matches component.reference.js (Nov 7 2026, 09:00 local)
  // and the "40d 08h" countdown in the screenshots.
  testDate: '2026-11-07T09:00:00',
};

export const levels: Level[] = [
  { name: 'Foundation', xp: 0 },
  { name: 'Pillar', xp: 1000 },
  { name: 'Beam', xp: 3000 },
  { name: 'Span', xp: 6000 },
  { name: 'Arch', xp: 10000 },
  { name: 'Crossing', xp: 15000 },
];

// Offsets chosen to reproduce the design's status mix exactly:
// 1 not-started, 1 in-progress, 1 overdue, 3 completed.
export const homework: HomeworkSeed[] = [
  { id: 'hw1', title: 'Linear Equations Practice Set', subject: 'Math', total: 20, done: 7, xp: 100, gen: 'math', dueOffsetMs: 42 * H },
  { id: 'hw2', title: 'Reading: Main Idea & Purpose', subject: 'R&W', total: 6, done: 0, xp: 100, gen: 'read', dueOffsetMs: 18 * H },
  { id: 'hw3', title: 'Systems of Equations', subject: 'Math', total: 18, done: 0, xp: 100, gen: 'math', dueOffsetMs: -30 * H },
  { id: 'hw4', title: 'Vocabulary in Context', subject: 'R&W', total: 20, done: 20, xp: 100, dueOffsetMs: -3 * D, submitted: true, score: 18 },
  { id: 'hw5', title: 'Command of Evidence', subject: 'R&W', total: 18, done: 18, xp: 100, dueOffsetMs: -5 * D, submitted: true, score: 16 },
  { id: 'hw6', title: 'Ratios & Proportions', subject: 'Math', total: 20, done: 20, xp: 100, dueOffsetMs: -7 * D, submitted: true, score: 20 },
];

export const rankings: Ranking[] = [
  { rank: 1, name: 'Mei Lin Chen', level: 'Arch', xp: 11240, streak: 21, ch: 0, badges: ['trophy', 'math'], group: 'Evening Group A' },
  { rank: 2, name: 'Diego Fernández', level: 'Arch', xp: 9980, streak: 15, ch: 1, badges: ['book', 'shield'], group: 'Evening Group B' },
  { rank: 3, name: 'Priya Nair', level: 'Span', xp: 8150, streak: 9, ch: 2, badges: ['math'], group: 'Evening Group A' },
  { rank: 4, name: 'Aziza Karimova', level: 'Span', xp: 6420, streak: 12, ch: 3, badges: ['math', 'trophy'], group: 'Evening Group B', me: true },
  { rank: 5, name: 'Jamal Washington', level: 'Span', xp: 6180, streak: 7, ch: -1, badges: ['book'], group: 'Evening Group B' },
  { rank: 6, name: 'Sofia Rossi', level: 'Span', xp: 5940, streak: 18, ch: 2, badges: ['shield'], group: 'Evening Group A' },
  { rank: 7, name: 'Omar Haddad', level: 'Beam', xp: 4520, streak: 4, ch: -2, badges: ['math'], group: 'Evening Group B' },
  { rank: 8, name: 'Yuki Tanaka', level: 'Beam', xp: 3890, streak: 11, ch: 1, badges: ['book'], group: 'Evening Group A' },
  { rank: 9, name: 'Lucas Martins', level: 'Beam', xp: 3210, streak: 3, ch: 0, badges: [], group: 'Evening Group B' },
  { rank: 10, name: 'Amara Okafor', level: 'Pillar', xp: 2740, streak: 6, ch: 5, badges: ['shield'], group: 'Evening Group A' },
];

// Session days within the month (anchored to the current month by T3.2).
// present/late = attended (9 of 11 held → 92%); 2 upcoming are in the future.
export const attendance: AttendanceSeed[] = [
  { day: 2, status: 'present', topic: 'Functions & Graphs', note: 'On time. Strong participation.' },
  { day: 4, status: 'absent', topic: 'Word Problems', note: 'Missed — no notice given.' },
  { day: 7, status: 'present', topic: 'Ratios & Proportions', note: 'On time.' },
  { day: 9, status: 'late', topic: 'Reading: Command of Evidence', note: 'Arrived 12 minutes late.' },
  { day: 11, status: 'present', topic: 'Vocabulary Lab', note: 'On time.' },
  { day: 14, status: 'present', topic: 'Systems of Equations', note: 'On time.' },
  { day: 16, status: 'excused', topic: 'Grammar & Usage', note: 'Excused absence — school event.' },
  { day: 18, status: 'present', topic: 'Data Analysis', note: 'On time.' },
  { day: 21, status: 'present', topic: 'Linear Equations Review', note: 'On time.' },
  { day: 23, status: 'present', topic: 'Practice Test Debrief', note: 'On time. Reviewed practice test 4.' },
  { day: 25, status: 'present', topic: 'Essay Structure', note: 'On time.' },
  { day: 28, status: 'upcoming', topic: 'Linear Equations in Two Variables', note: 'Upcoming live session.' },
  { day: 30, status: 'upcoming', topic: 'Probability Basics', note: 'Upcoming live session.' },
];

export const attendanceRate = 92;
export const attendanceStreak = 8;
export const avgRating = 4.8;

export const mockExams: MockExam[] = [
  { date: 'Aug 10', total: 1180, math: 620, rw: 560 },
  { date: 'Aug 24', total: 1240, math: 650, rw: 590 },
  { date: 'Sep 7', total: 1290, math: 680, rw: 610 },
  { date: 'Sep 21', total: 1340, math: 710, rw: 630 },
];

/** Appended by "Start new mock exam" (+300 XP, best-score celebration). */
export const newMockExam: MockExam = { date: 'Sep 27', total: 1380, math: 730, rw: 650 };

export const badges: Badge[] = [
  { id: 'first', name: 'First Brick', desc: 'Completed your very first task', earned: true, icon: 'brick' },
  { id: 'week', name: 'Week Warrior', desc: '7-day active streak', earned: true, icon: 'brick' },
  { id: 'attend', name: 'Perfect Attendance', desc: 'A full month, no absences', earned: false, prog: 0.83, icon: 'attendance' },
  { id: 'early', name: 'Early Bird', desc: 'Homework 2 days early', earned: true, icon: 'clock' },
  { id: 'matheng', name: 'Math Engineer', desc: '50 algebra questions aced', earned: true, icon: 'math' },
  { id: 'word', name: 'Word Architect', desc: 'Master 200 vocabulary words', earned: false, prog: 0.62, icon: 'book' },
  { id: 'rebuild', name: 'Rebuilder', desc: '+100 points on a practice test', earned: false, prog: 0.4, icon: 'target' },
  { id: 'topten', name: 'Top Ten', desc: 'Reach the weekly top 10', earned: true, icon: 'trophy' },
];

export const notifications: Notification[] = [
  { icon: 'homework', iconColor: 'var(--st-over)', title: 'Systems of Equations', body: 'is overdue. Finish today to keep your streak.', time: '20 min ago', unread: true },
  { icon: 'trophy', iconColor: 'var(--reward)', title: 'New badge', body: 'You earned Math Engineer.', time: '2 hours ago', unread: true },
  { icon: 'arrowUp', iconColor: 'var(--st-done)', title: 'Rank up', body: 'You climbed 3 places to #4 this week.', time: 'Today, 9:10', unread: false },
  { icon: 'clock', iconColor: 'var(--dim)', title: 'Live session', body: 'Linear Equations starts in 15 minutes.', time: 'Just now', unread: true },
];

export const lesson: LessonData = {
  title: 'Linear Equations in Two Variables',
  teacher: 'Mr. Daniel Reyes',
  group: 'Evening Group B',
  block: 'Block 3 · Lesson 8',
  date: '04 May 2026',
  rating: 4,
  duration: '28:15',
  resume: '12:40',
  progress: 45,
  chapters: [
    { t: '00:00', label: 'What is a linear equation?', state: 'done' },
    { t: '04:20', label: 'Slope-intercept form', state: 'done' },
    { t: '12:40', label: 'Two-variable systems', state: 'current' },
    { t: '19:10', label: 'Graphing solutions', state: 'locked' },
    { t: '24:00', label: 'Word problems in context', state: 'locked' },
  ],
  timeline: [
    { label: 'Block 3 · Lesson 6', date: '24 Apr 2026', title: 'Ratios & Proportions', state: 'done' },
    { label: 'Block 3 · Lesson 7', date: '01 May 2026', title: 'Word Problems in Context', state: 'done' },
    { label: 'Block 3 · Lesson 8', date: '04 May 2026', title: 'Linear Equations in Two Variables', state: 'current' },
    { label: 'Block 4 · Lesson 1', date: '08 May 2026', title: 'Systems of Equations', state: 'locked' },
    { label: 'Block 4 · Lesson 2', date: '11 May 2026', title: 'Graphing Systems Visually', state: 'locked' },
  ],
  materials: [
    { name: 'Practice Worksheet', type: 'PDF · 12 problems' },
    { name: 'Formula Sheet — Algebra', type: 'PDF · 1 page' },
    { name: 'Session Slides', type: 'PDF · 18 slides' },
  ],
  upnext: [
    { title: 'Graphing Systems Visually', dur: '22 min', state: 'next' },
    { title: 'Absolute Value Equations', dur: '19 min', state: 'locked' },
    { title: 'Inequalities on a Number Line', dur: '25 min', state: 'locked' },
  ],
};

// Countdown target offsets from anchor "now" (component.reference.js T{}).
export const countdownOffsets: CountdownOffsets = {
  liveMs: (42 * 60 + 15) * 1000,
  joinOpenMs: (14 * 60 + 32) * 1000,
  nextSessionMs: 27 * H,
  planResetMs: 5 * H + 12 * 60_000,
  weeklyCloseMs: 2 * D + 6 * H + 18 * 60_000,
  nextMockMs: 3 * D + 2 * H,
  streakMs: 5 * H + 12 * 60_000,
};

// XP economy
export const XP_HOMEWORK_ONTIME = 100;
export const XP_PER_CORRECT = 10;
export const XP_MOCK_EXAM = 300;
export const BRIDGE_PER_SUBMIT = 4;
