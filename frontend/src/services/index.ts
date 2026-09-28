import {
  attendance,
  attendanceRate,
  attendanceStreak,
  avgRating,
  badges,
  countdownOffsets,
  homework,
  lesson,
  levels,
  mockExams,
  notifications,
  rankings,
  scores,
  student,
} from '../data';

/**
 * Async service layer — the single seam pages read data through (never the
 * `data/` modules directly), so it can later be swapped for Supabase.
 *
 * Amendment 3: the FIRST fetch of each dataset simulates ~300–400ms latency;
 * results are cached, so subsequent navigation is instant.
 */

const cache = new Map<string, unknown>();

function delay(): Promise<void> {
  const ms = 300 + Math.random() * 100;
  return new Promise((r) => setTimeout(r, ms));
}

async function once<T>(key: string, produce: () => T): Promise<T> {
  if (cache.has(key)) return cache.get(key) as T;
  await delay();
  const value = produce();
  cache.set(key, value);
  return value;
}

/** Clear the latency cache (used by "Reset demo data" so loading states show again). */
export function clearServiceCache(): void {
  cache.clear();
}

export const getStudent = () => once('student', () => student);
export const getScores = () => once('scores', () => scores);
export const getLevels = () => once('levels', () => levels);
export const getHomework = () => once('homework', () => homework);
export const getLesson = () => once('lesson', () => lesson);
export const getRankings = () => once('rankings', () => rankings);
export const getMockExams = () => once('mockExams', () => mockExams);
export const getBadges = () => once('badges', () => badges);
export const getNotifications = () => once('notifications', () => notifications);
export const getCountdownOffsets = () => once('countdowns', () => countdownOffsets);
export const getAttendance = () =>
  once('attendance', () => ({
    sessions: attendance,
    rate: attendanceRate,
    streak: attendanceStreak,
    avgRating,
  }));
