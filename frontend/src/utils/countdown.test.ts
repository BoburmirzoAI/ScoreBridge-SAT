import { describe, expect, it } from 'vitest';
import { cdBig, cdClock, cdMed, cdParts, cdShort, cdUrgent } from './countdown';

const H = 3_600_000;
const D = 86_400_000;

describe('countdown formatters', () => {
  it('cdParts splits an absolute diff', () => {
    const p = cdParts(1 * D + 6 * H, 0);
    expect(p).toMatchObject({ past: false, d: 1, h: 6, m: 0 });
  });

  it('cdParts flags past targets', () => {
    expect(cdParts(-1000, 0).past).toBe(true);
  });

  it('cdShort formats days/hours', () => {
    expect(cdShort(40 * D + 8 * H, 0)).toBe('40d 08h');
    expect(cdShort(8 * H + 5 * 60_000, 0)).toBe('8h 05m');
    expect(cdShort(12 * 60_000, 0)).toBe('12m');
  });

  it('cdMed prefixes overdue', () => {
    expect(cdMed(-(1 * D + 6 * H), 0)).toBe('Overdue by 1d 06h 00m');
    expect(cdMed(1 * D + 6 * H, 0)).toBe('1d 06h 00m');
  });

  it('cdBig always shows d/h/m', () => {
    expect(cdBig(40 * D + 8 * H + 55 * 60_000, 0)).toBe('40d 08h 55m');
  });

  it('cdClock is hh:mm:ss', () => {
    expect(cdClock((42 * 60 + 13) * 1000, 0)).toBe('00:42:13');
  });

  it('cdUrgent when past or under 24h', () => {
    expect(cdUrgent(-1, 0)).toBe(true);
    expect(cdUrgent(23 * H, 0)).toBe(true);
    expect(cdUrgent(25 * H, 0)).toBe(false);
  });
});
