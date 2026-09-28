import { describe, expect, it } from 'vitest';
import { homeworkAction, homeworkStatus, statusMeta, type HomeworkLike } from './homework';

const NOW = 1_000_000_000;
const D = 86_400_000;
const base: HomeworkLike = { done: 0, due: NOW + 2 * D, total: 20 };

describe('homeworkStatus (computed)', () => {
  it('submitted → completed', () => {
    expect(homeworkStatus({ ...base, submitted: true }, NOW)).toBe('completed');
  });
  it('past due → overdue', () => {
    expect(homeworkStatus({ ...base, due: NOW - 2 * D }, NOW)).toBe('overdue');
  });
  it('future + progress → inprogress', () => {
    expect(homeworkStatus({ ...base, done: 5 }, NOW)).toBe('inprogress');
  });
  it('future + no progress → notstarted', () => {
    expect(homeworkStatus(base, NOW)).toBe('notstarted');
  });
});

describe('status meta + action', () => {
  it('maps labels', () => {
    expect(statusMeta('overdue').label).toBe('Overdue');
    expect(statusMeta('completed').icon).toBe('checkSm');
  });
  it('maps actions', () => {
    expect(homeworkAction('completed')).toBe('Review');
    expect(homeworkAction('inprogress')).toBe('Continue');
    expect(homeworkAction('overdue')).toBe('Finish now');
    expect(homeworkAction('notstarted')).toBe('Start');
  });
});
