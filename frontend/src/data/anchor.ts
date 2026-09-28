import { attendance, countdownOffsets, homework, scores } from './seed';
import type { AttendanceSeed, CountdownOffsets, HomeworkSeed } from './types';

/**
 * Relative-date seeding engine (amendment 1).
 *
 * All demo dates are stored as offsets from an "anchor" — the moment the demo
 * was first seeded (persisted in the store, T5.1). Anchoring here keeps the
 * homework status mix at exactly 1 not-started / 1 in-progress / 1 overdue /
 * 3 completed and every countdown live, regardless of when the app is opened.
 * "Reset demo data" simply calls makeAnchor() again.
 *
 * Only the test day is a fixed calendar instant (scores.testDate).
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** A fresh anchor = now. */
export function makeAnchor(): number {
  return Date.now();
}

export interface AnchoredHomework extends HomeworkSeed {
  /** absolute due instant (ms) */
  due: number;
  /** "Sep 24"-style label for submitted homework */
  submittedLabel?: string;
}

export function anchorHomework(anchor: number, seed: HomeworkSeed[] = homework): AnchoredHomework[] {
  return seed.map((hw) => {
    const due = anchor + hw.dueOffsetMs;
    return {
      ...hw,
      due,
      submittedLabel: hw.submitted ? monthDay(new Date(due)) : undefined,
    };
  });
}

export interface AnchoredCountdowns {
  /** fixed test day */
  testDay: number;
  live: number;
  joinOpen: number;
  nextSession: number;
  planReset: number;
  weeklyClose: number;
  nextMock: number;
  streak: number;
}

export function anchorCountdowns(anchor: number, off: CountdownOffsets = countdownOffsets): AnchoredCountdowns {
  return {
    testDay: new Date(scores.testDate).getTime(),
    live: anchor + off.liveMs,
    joinOpen: anchor + off.joinOpenMs,
    nextSession: anchor + off.nextSessionMs,
    planReset: anchor + off.planResetMs,
    weeklyClose: anchor + off.weeklyCloseMs,
    nextMock: anchor + off.nextMockMs,
    streak: anchor + off.streakMs,
  };
}

export interface AnchoredSession extends AttendanceSeed {
  /** actual date this session lands on in the anchor's month */
  date: Date;
}

/** Spread the session log across the anchor's current month (day clamped to month length). */
export function anchorAttendance(anchor: number, seed: AttendanceSeed[] = attendance): AnchoredSession[] {
  const a = new Date(anchor);
  const year = a.getFullYear();
  const month = a.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return seed.map((s) => ({
    ...s,
    date: new Date(year, month, Math.min(s.day, daysInMonth), 18, 0, 0),
  }));
}

/** "Sep 24" */
export function monthDay(d: Date): string {
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}
