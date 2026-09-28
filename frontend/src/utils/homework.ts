import type { IconName } from '../icons';
import type { HomeworkStatus } from '../data/types';
import { cdMed } from './countdown';

/** Minimal shape needed to compute status (an anchored homework). */
export interface HomeworkLike {
  submitted?: boolean;
  done: number;
  /** absolute due instant (ms) */
  due: number;
  total: number;
  score?: number;
  submittedLabel?: string;
}

const DAY = 864e5;

/**
 * Status is ALWAYS computed, never stored — ported from computeStatus():
 * submitted → completed; days-to-due < 0 → overdue; done > 0 → inprogress;
 * else not-started.
 */
export function homeworkStatus(hw: HomeworkLike, now: number): HomeworkStatus {
  if (hw.submitted) return 'completed';
  const days = Math.ceil((hw.due - now) / DAY);
  if (days < 0) return 'overdue';
  if (hw.done > 0) return 'inprogress';
  return 'notstarted';
}

export interface StatusMeta {
  label: string;
  color: string;
  bg: string;
  icon: IconName;
}

export function statusMeta(st: HomeworkStatus): StatusMeta {
  return {
    notstarted: { label: 'Not started', color: 'var(--st-none)', bg: 'var(--st-none-bg)', icon: 'clock' as IconName },
    inprogress: { label: 'In progress', color: 'var(--st-prog)', bg: 'var(--st-prog-bg)', icon: 'playO' as IconName },
    overdue: { label: 'Overdue', color: 'var(--st-over)', bg: 'var(--st-over-bg)', icon: 'flag' as IconName },
    completed: { label: 'Completed', color: 'var(--st-done)', bg: 'var(--st-done-bg)', icon: 'checkSm' as IconName },
  }[st];
}

export function homeworkAction(st: HomeworkStatus): string {
  return st === 'completed' ? 'Review' : st === 'inprogress' ? 'Continue' : st === 'overdue' ? 'Finish now' : 'Start';
}

export function homeworkDueText(hw: HomeworkLike, st: HomeworkStatus, now: number): string {
  if (st === 'completed') return `Submitted ${hw.submittedLabel ?? ''} · ${hw.score}/${hw.total}`;
  const base = cdMed(hw.due, now);
  return cdParts_past(hw.due, now) ? base : `${base} left`;
}

/** due is soon (<24h) and not completed → emphasize in oxblood */
export function homeworkDueUrgent(hw: HomeworkLike, st: HomeworkStatus, now: number): boolean {
  return st !== 'completed' && hw.due - now < DAY;
}

function cdParts_past(target: number, now: number): boolean {
  return target - now < 0;
}
