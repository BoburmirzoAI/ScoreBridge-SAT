import { describe, expect, it } from 'vitest';
import { levelInfo } from './level';
import { levels } from '../data';

describe('levelInfo', () => {
  it('resolves Span for 6420 XP with 3,580 to Arch', () => {
    const li = levelInfo(6420, levels);
    expect(li.name).toBe('Span');
    expect(li.nextName).toBe('Arch');
    expect(li.toNext).toBe('3,580');
    expect(li.pct).toBeCloseTo(10.5, 1);
  });

  it('clamps at the top level', () => {
    const li = levelInfo(20000, levels);
    expect(li.name).toBe('Crossing');
    expect(li.pct).toBeGreaterThanOrEqual(0);
    expect(li.pct).toBeLessThanOrEqual(100);
  });

  it('starts at Foundation', () => {
    expect(levelInfo(0, levels).name).toBe('Foundation');
  });
});
