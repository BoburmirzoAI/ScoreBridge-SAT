import type { IconName } from '../icons';

/**
 * Domain types for Scorebridge seed data. Values come from
 * design/source/component.reference.js — do not invent.
 *
 * Dates that drive live countdowns are stored as OFFSETS (ms from "now") so
 * the relative-date engine (T3.2) can anchor them at first load; only the test
 * day is a fixed calendar instant.
 */

export type Subject = 'Math' | 'R&W';
export type HomeworkGen = 'math' | 'read';
export type HomeworkStatus = 'notstarted' | 'inprogress' | 'overdue' | 'completed';

export interface Student {
  name: string;
  initials: string;
  group: string;
  joined: string;
  xp: number;
  streak: number;
  streakShield: number;
  /** bridge built %, 0–100 */
  bridge: number;
}

export interface Scores {
  math: number;
  mathTotal: number;
  rw: number;
  rwTotal: number;
  /** best total (rings center) */
  best: number;
  goal: number;
  /** fixed calendar instant (local ISO, no Z) */
  testDate: string;
}

export interface Level {
  name: string;
  xp: number;
}

/** Raw homework seed; status is always computed, never stored. */
export interface HomeworkSeed {
  id: string;
  title: string;
  subject: Subject;
  total: number;
  done: number;
  xp: number;
  gen?: HomeworkGen;
  /** due date as ms offset from anchor "now" */
  dueOffsetMs: number;
  submitted?: boolean;
  score?: number;
}

export interface Ranking {
  rank: number;
  name: string;
  level: string;
  xp: number;
  streak: number;
  /** weekly rank change (+/-/0) */
  ch: number;
  badges: IconName[];
  group: string;
  me?: boolean;
}

export type AttStatus = 'present' | 'late' | 'excused' | 'absent' | 'upcoming';

export interface AttendanceSeed {
  /** day of month (anchored to the current month by T3.2) */
  day: number;
  status: AttStatus;
  topic: string;
  note: string;
}

export interface MockExam {
  date: string;
  total: number;
  math: number;
  rw: number;
}

export interface Badge {
  id: string;
  name: string;
  desc: string;
  earned: boolean;
  /** 0–1 progress when not earned */
  prog?: number;
  icon: IconName;
}

export interface Notification {
  icon: IconName;
  iconColor: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

export type LessonState = 'done' | 'current' | 'locked';

export interface Chapter {
  t: string;
  label: string;
  state: LessonState;
}

export interface TimelineItem {
  label: string;
  date: string;
  title: string;
  state: LessonState;
}

export interface Material {
  name: string;
  type: string;
}

export interface UpNextItem {
  title: string;
  dur: string;
  state: 'next' | 'locked';
}

export interface LessonData {
  title: string;
  teacher: string;
  group: string;
  block: string;
  date: string;
  rating: number;
  duration: string;
  resume: string;
  /** playback progress %, 0–100 */
  progress: number;
  chapters: Chapter[];
  timeline: TimelineItem[];
  materials: Material[];
  upnext: UpNextItem[];
}

/** ms offsets from anchor "now" (except testDay which is fixed). */
export interface CountdownOffsets {
  liveMs: number;
  joinOpenMs: number;
  nextSessionMs: number;
  planResetMs: number;
  weeklyCloseMs: number;
  nextMockMs: number;
  streakMs: number;
}
