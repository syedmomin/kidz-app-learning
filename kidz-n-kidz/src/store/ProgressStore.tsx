// src/store/ProgressStore.tsx — global progress state with AsyncStorage persistence
import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@bumbloo/progress/v1';

export type Progress = {
  name: string;
  avatar: number; // 0..4
  stars: number;
  coins: number;
  streak: number;
  lastPlayedISO: string | null;
  lettersCompleted: string[]; // ['A','B',...]
  numbersCompleted: number[]; // [1,2,3...]
  colorsCompleted: boolean;
  wordsCompleted: string[]; // ['CAT','DOG'...]
  storiesRead: number;
  gamesPlayed: Record<string, number>;
  badges: string[];
  soundOn: boolean;
  musicOn: boolean;
};

const DEFAULT: Progress = {
  name: 'Lily',
  avatar: 0,
  stars: 0,
  coins: 0,
  streak: 0,
  lastPlayedISO: null,
  lettersCompleted: [],
  numbersCompleted: [],
  colorsCompleted: false,
  wordsCompleted: [],
  storiesRead: 0,
  gamesPlayed: {},
  badges: [],
  soundOn: true,
  musicOn: true,
};

type Ctx = {
  p: Progress;
  loading: boolean;
  update: (patch: Partial<Progress>) => Promise<void>;
  addStars: (n: number) => Promise<void>;
  addCoins: (n: number) => Promise<void>;
  completeLetter: (letter: string) => Promise<void>;
  completeNumber: (n: number) => Promise<void>;
  completeWord: (w: string) => Promise<void>;
  completeStory: () => Promise<void>;
  playGame: (id: string) => Promise<void>;
  awardBadge: (id: string) => Promise<void>;
  touchStreak: () => Promise<void>;
  reset: () => Promise<void>;
};

const Ctx = createContext<Ctx | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [p, setP] = useState<Progress>(DEFAULT);
  const [loading, setLoading] = useState(true);

  // Load on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setP({ ...DEFAULT, ...JSON.parse(raw) });
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = useCallback(async (next: Progress) => {
    setP(next);
    try { await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  }, []);

  const update = useCallback(async (patch: Partial<Progress>) => {
    await persist({ ...p, ...patch });
  }, [p, persist]);

  const addStars = useCallback(async (n: number) => {
    await persist({ ...p, stars: p.stars + n });
  }, [p, persist]);

  const addCoins = useCallback(async (n: number) => {
    await persist({ ...p, coins: p.coins + n });
  }, [p, persist]);

  const completeLetter = useCallback(async (letter: string) => {
    if (p.lettersCompleted.includes(letter)) return;
    const next = {
      ...p,
      lettersCompleted: [...p.lettersCompleted, letter],
      stars: p.stars + 3,
      coins: p.coins + 2,
    };
    await persist(next);
  }, [p, persist]);

  const completeNumber = useCallback(async (n: number) => {
    if (p.numbersCompleted.includes(n)) return;
    await persist({
      ...p,
      numbersCompleted: [...p.numbersCompleted, n],
      stars: p.stars + 2,
      coins: p.coins + 1,
    });
  }, [p, persist]);

  const completeWord = useCallback(async (w: string) => {
    if (p.wordsCompleted.includes(w)) return;
    await persist({
      ...p,
      wordsCompleted: [...p.wordsCompleted, w],
      stars: p.stars + 2,
      coins: p.coins + 1,
    });
  }, [p, persist]);

  const completeStory = useCallback(async () => {
    await persist({ ...p, storiesRead: p.storiesRead + 1, stars: p.stars + 4, coins: p.coins + 3 });
  }, [p, persist]);

  const playGame = useCallback(async (id: string) => {
    await persist({
      ...p,
      gamesPlayed: { ...p.gamesPlayed, [id]: (p.gamesPlayed[id] || 0) + 1 },
      stars: p.stars + 1,
    });
  }, [p, persist]);

  const awardBadge = useCallback(async (id: string) => {
    if (p.badges.includes(id)) return;
    await persist({ ...p, badges: [...p.badges, id] });
  }, [p, persist]);

  const touchStreak = useCallback(async () => {
    const today = new Date().toISOString().slice(0, 10);
    if (p.lastPlayedISO === today) return;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const nextStreak = p.lastPlayedISO === yesterday ? p.streak + 1 : 1;
    await persist({ ...p, lastPlayedISO: today, streak: nextStreak });
  }, [p, persist]);

  const reset = useCallback(async () => {
    await persist(DEFAULT);
  }, [persist]);

  return (
    <Ctx.Provider value={{
      p, loading, update, addStars, addCoins,
      completeLetter, completeNumber, completeWord, completeStory,
      playGame, awardBadge, touchStreak, reset,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useProgress() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useProgress must be inside ProgressProvider');
  return v;
}
