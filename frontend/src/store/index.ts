import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  homework as seedHomework,
  levels,
  newMockExam,
  student,
  type HomeworkSeed,
  type MockExam,
} from '../data';
import { makeAnchor } from '../data/anchor';
import { clearServiceCache } from '../services';
import { levelInfo } from '../utils';
import { BRIDGE_PER_SUBMIT, XP_MOCK_EXAM, XP_HOMEWORK_ONTIME, XP_PER_CORRECT } from '../data/seed';

export type Theme = 'light' | 'dark';
export type CelebrationKind = 'levelup' | 'bestscore' | 'badge';

export interface Celebration {
  kind: CelebrationKind;
  kicker: string;
  title: string;
  body: string;
  cta: string;
}

export interface ReviewItem {
  stem: string;
  choices: string[];
  answer: number;
  chosen?: number;
  explanation: string;
}

export interface LastResult {
  hwId: string;
  hwTitle: string;
  correct: number;
  total: number;
  answered: number;
  xpEarned: number;
  onTime: boolean;
  review: ReviewItem[];
}

export interface Profile {
  name: string;
  /** data-URL of an uploaded photo, or null for initials */
  avatar: string | null;
  bio: string;
  email: string;
}

interface StoreState {
  theme: Theme;
  profile: Profile;
  /** persisted seed anchor (ms) — all demo dates resolve against this */
  anchor: number;
  xp: number;
  bridge: number;
  streak: number;
  homework: HomeworkSeed[];
  extraTests: MockExam[];
  // UI filters
  hwFilter: string;
  leaderTab: string;
  leaderGroup: string;
  practiceFilter: 'total' | 'math' | 'rw' | 'all';
  notifUnread: boolean;
  // transient (not persisted)
  celebration: Celebration | null;
  lastResult: LastResult | null;

  // actions
  toggleTheme: () => void;
  updateProfile: (p: Partial<Profile>) => void;
  setHwFilter: (f: string) => void;
  setLeaderTab: (t: string) => void;
  setLeaderGroup: (g: string) => void;
  setPracticeFilter: (f: 'total' | 'math' | 'rw' | 'all') => void;
  markAllRead: () => void;
  submitHomework: (id: string, correct: number, answered: number, review: ReviewItem[]) => void;
  startMock: () => void;
  dismissCelebration: () => void;
  resetDemo: () => void;
}

const cloneHomework = () => seedHomework.map((h) => ({ ...h }));

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      profile: {
        name: student.name,
        avatar: null,
        bio: 'Evening Group B learner — building toward a 1450 by test day.',
        email: 'aziza.karimova@scorebridge.app',
      },
      anchor: makeAnchor(),
      xp: student.xp,
      bridge: student.bridge,
      streak: student.streak,
      homework: cloneHomework(),
      extraTests: [],
      hwFilter: 'All',
      leaderTab: 'This week',
      leaderGroup: 'All groups',
      practiceFilter: 'total',
      notifUnread: true,
      celebration: null,
      lastResult: null,

      toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
      updateProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
      setHwFilter: (hwFilter) => set({ hwFilter }),
      setLeaderTab: (leaderTab) => set({ leaderTab }),
      setLeaderGroup: (leaderGroup) => set({ leaderGroup }),
      setPracticeFilter: (practiceFilter) => set({ practiceFilter }),
      markAllRead: () => set({ notifUnread: false }),

      submitHomework: (id, correct, answered, review) => {
        const s = get();
        const hw = s.homework.find((h) => h.id === id);
        if (!hw) return;
        const now = Date.now();
        const due = s.anchor + hw.dueOffsetMs;
        const onTime = due >= now;
        const xpEarned = correct * XP_PER_CORRECT + (onTime ? XP_HOMEWORK_ONTIME : 0);
        const oldLevel = levelInfo(s.xp, levels).name;
        const newXp = s.xp + xpEarned;
        const homework = s.homework.map((h) =>
          h.id === id ? { ...h, submitted: true, score: correct, done: h.total } : h,
        );
        const newLevel = levelInfo(newXp, levels).name;
        set({
          homework,
          xp: newXp,
          bridge: Math.min(100, s.bridge + BRIDGE_PER_SUBMIT),
          lastResult: { hwId: id, hwTitle: hw.title, correct, total: hw.total, answered, xpEarned, onTime, review },
          celebration:
            newLevel !== oldLevel
              ? { kind: 'levelup', kicker: 'Level up', title: `You reached ${newLevel}`, body: 'A new stage of your bridge is now unlocked.', cta: 'Continue' }
              : s.celebration,
        });
      },

      startMock: () => {
        const s = get();
        const best = Math.max(...[...[1180, 1240, 1290, 1340], ...s.extraTests.map((t) => t.total), newMockExam.total]);
        set({
          extraTests: [...s.extraTests, newMockExam],
          xp: s.xp + XP_MOCK_EXAM,
          bridge: Math.min(100, s.bridge + BRIDGE_PER_SUBMIT),
          celebration: {
            kind: 'bestscore',
            kicker: 'New best score',
            title: `${best}, a new high`,
            body: 'Your best improved by 40 points, closer to your goal.',
            cta: 'Continue',
          },
        });
      },

      dismissCelebration: () => set({ celebration: null }),

      resetDemo: () => {
        clearServiceCache();
        set({
          anchor: makeAnchor(),
          xp: student.xp,
          bridge: student.bridge,
          streak: student.streak,
          homework: cloneHomework(),
          extraTests: [],
          hwFilter: 'All',
          leaderTab: 'This week',
          leaderGroup: 'All groups',
          practiceFilter: 'total',
          notifUnread: true,
          celebration: null,
          lastResult: null,
        });
      },
    }),
    {
      name: 'scorebridge',
      // only durable state is persisted; transient UI (celebration/lastResult) is not
      partialize: (s) => ({
        theme: s.theme,
        profile: s.profile,
        anchor: s.anchor,
        xp: s.xp,
        bridge: s.bridge,
        streak: s.streak,
        homework: s.homework,
        extraTests: s.extraTests,
        hwFilter: s.hwFilter,
        leaderTab: s.leaderTab,
        leaderGroup: s.leaderGroup,
        practiceFilter: s.practiceFilter,
        notifUnread: s.notifUnread,
      }),
    },
  ),
);
