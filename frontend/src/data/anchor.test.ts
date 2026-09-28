import { describe, expect, it } from 'vitest';
import { anchorCountdowns, anchorHomework } from './anchor';
import { scores } from './seed';
import { homeworkStatus } from '../utils/homework';
import type { HomeworkStatus } from './types';

describe('relative-date seeding', () => {
  it('resolves the exact status mix 1/1/1/3 at the anchor moment', () => {
    const anchor = Date.now();
    const list = anchorHomework(anchor);
    const counts: Record<HomeworkStatus, number> = { notstarted: 0, inprogress: 0, overdue: 0, completed: 0 };
    list.forEach((hw) => {
      counts[homeworkStatus(hw, anchor)]++;
    });
    expect(counts).toEqual({ notstarted: 1, inprogress: 1, overdue: 1, completed: 3 });
  });

  it('still holds a few minutes later', () => {
    const anchor = Date.now();
    const later = anchor + 5 * 60_000;
    const counts = anchorHomework(anchor).map((hw) => homeworkStatus(hw, later));
    expect(counts.filter((s) => s === 'completed')).toHaveLength(3);
    expect(counts.filter((s) => s === 'overdue')).toHaveLength(1);
  });

  it('completed homework gets a submitted label', () => {
    const list = anchorHomework(Date.now());
    const completed = list.filter((h) => h.submitted);
    completed.forEach((h) => expect(h.submittedLabel).toMatch(/^[A-Z][a-z]{2} \d{1,2}$/));
  });

  it('test day is a fixed calendar instant', () => {
    const cd = anchorCountdowns(Date.now());
    expect(cd.testDay).toBe(new Date(scores.testDate).getTime());
  });

  it('countdown targets are offset from the anchor', () => {
    const anchor = 1_700_000_000_000;
    const cd = anchorCountdowns(anchor);
    expect(cd.live).toBeGreaterThan(anchor);
    expect(cd.nextMock).toBeGreaterThan(cd.live);
  });
});
