// src/screens/MemoryFlipScreen.tsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, Pressable,
  Animated, Dimensions,
} from 'react-native';
import PhoneSafe from '../components/PhoneSafe';
import { C } from '../theme';
import type { ScreenProps } from '../navigation/types';

const { width: SW } = Dimensions.get('window');
const COLS   = 4;
const PAD    = 14;
const GAP    = 10;
const CARD_W = (SW - PAD * 2 - GAP * (COLS - 1)) / COLS;
const CARD_H = CARD_W * 1.2;

const PAIRS = ['🐱','🐶','🐸','🦁','🐼','🦊','🐧','🦋'];

// ─── Build deck ───────────────────────────────────────────────────────────────

interface Card { id: number; pairId: number; emoji: string }

function buildDeck(): Card[] {
  return shuffle([...PAIRS, ...PAIRS].map((emoji, i) => ({
    id: i,
    pairId: PAIRS.indexOf(emoji),
    emoji,
  })));
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ─── Single card ─────────────────────────────────────────────────────────────

type CardStatus = 'hidden' | 'revealed' | 'matched';

function MemCard({ card, status, onPress }: {
  card:    Card;
  status:  CardStatus;
  onPress: () => void;
}) {
  const rot     = useRef(new Animated.Value(status === 'hidden' ? 0 : 1)).current;
  const matchSc = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (status === 'hidden') {
      Animated.spring(rot, { toValue: 0, tension: 100, friction: 10, useNativeDriver: true }).start();
    } else {
      Animated.spring(rot, { toValue: 1, tension: 100, friction: 10, useNativeDriver: true }).start();
    }
  }, [status]);

  useEffect(() => {
    if (status === 'matched') {
      Animated.sequence([
        Animated.spring(matchSc, { toValue: 1.25, tension: 200, friction: 5, useNativeDriver: true }),
        Animated.spring(matchSc, { toValue: 1,    tension: 200, friction: 8, useNativeDriver: true }),
      ]).start();
    }
  }, [status]);

  const frontRot = rot.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
  const backRot  = rot.interpolate({ inputRange: [0, 1], outputRange: ['0deg',   '180deg'] });
  const frontOp  = rot.interpolate({ inputRange: [0.49, 0.5], outputRange: [0, 1] });
  const backOp   = rot.interpolate({ inputRange: [0.49, 0.5], outputRange: [1, 0] });

  const bgColor = status === 'matched' ? C.mint
                : status === 'revealed' ? C.cream
                : C.blue;

  return (
    <Pressable
      onPress={status === 'hidden' ? onPress : undefined}
      style={{ width: CARD_W, height: CARD_H }}
    >
      {/* Back (hidden) */}
      <Animated.View style={[
        mc.side,
        { backgroundColor: C.blue, opacity: backOp, transform: [{ rotateY: backRot }, { scale: matchSc }] }
      ]}>
        <Text style={mc.backQ}>❓</Text>
      </Animated.View>

      {/* Front (emoji) */}
      <Animated.View style={[
        mc.side,
        { backgroundColor: bgColor, opacity: frontOp, transform: [{ rotateY: frontRot }, { scale: matchSc }] }
      ]}>
        <Text style={mc.emoji}>{card.emoji}</Text>
        {status === 'matched' && <Text style={mc.tick}>✓</Text>}
      </Animated.View>
    </Pressable>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function MemoryFlipScreen({ navigation }: ScreenProps<'MemoryFlip'>) {
  const [deck,     setDeck]     = useState<Card[]>(buildDeck);
  const [statuses, setStatuses] = useState<CardStatus[]>(() => new Array(16).fill('hidden'));
  const [moves,    setMoves]    = useState(0);
  const [matched,  setMatched]  = useState(0);
  const busy    = useRef(false);
  const first   = useRef<number | null>(null);   // index of first revealed card

  const total = PAIRS.length;  // 8 pairs
  const done  = matched === total;

  const restart = () => {
    setDeck(buildDeck());
    setStatuses(new Array(16).fill('hidden'));
    setMoves(0);
    setMatched(0);
    busy.current  = false;
    first.current = null;
  };

  const tap = useCallback((idx: number) => {
    // Guards
    if (busy.current) return;
    if (statuses[idx] !== 'hidden') return;
    if (first.current === idx) return;

    if (first.current === null) {
      // First card of the pair
      first.current = idx;
      setStatuses(prev => prev.map((s, i) => i === idx ? 'revealed' : s) as CardStatus[]);
    } else {
      // Second card — evaluate
      const firstIdx = first.current;
      first.current  = null;
      busy.current   = true;

      const nextStatuses = statuses.map((s, i) =>
        i === idx ? 'revealed' : s
      ) as CardStatus[];
      setStatuses(nextStatuses);
      setMoves(m => m + 1);

      const isMatch = deck[firstIdx].pairId === deck[idx].pairId;

      if (isMatch) {
        setTimeout(() => {
          setStatuses(prev => prev.map((s, i) =>
            i === firstIdx || i === idx ? 'matched' : s
          ) as CardStatus[]);
          setMatched(m => m + 1);
          busy.current = false;
        }, 500);
      } else {
        // Flip both back
        setTimeout(() => {
          setStatuses(prev => prev.map((s, i) =>
            (i === firstIdx || i === idx) && s === 'revealed' ? 'hidden' : s
          ) as CardStatus[]);
          busy.current = false;
        }, 1000);
      }
    }
  }, [statuses, deck]);

  const stars = moves <= 12 ? 3 : moves <= 18 ? 2 : 1;

  return (
    <PhoneSafe bg="#D9EEFF">
      {/* Header */}
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}>
          <Text style={s.backT}>←</Text>
        </Pressable>
        <Text style={s.title}>Memory Flip 🃏</Text>
        <View style={s.movePill}>
          <Text style={s.moveT}>🔄 {moves}</Text>
        </View>
      </View>

      {/* Progress */}
      <View style={s.progressRow}>
        <View style={s.progressBar}>
          <View style={[s.progressFill, { width: `${(matched / total) * 100}%` }]}/>
        </View>
        <Text style={s.progressLbl}>{matched}/{total} pairs</Text>
      </View>

      {/* How to play hint */}
      {moves === 0 && !done && (
        <Text style={s.hint}>Tap two cards to find matching animals! 🐾</Text>
      )}

      {/* Win screen */}
      {done ? (
        <View style={s.winBox}>
          <Text style={s.winEmoji}>🎉</Text>
          <Text style={s.winTitle}>You matched them all!</Text>
          <Text style={s.winSub}>Finished in {moves} moves</Text>
          <View style={s.starsRow}>
            {[1,2,3].map(i => (
              <Text key={i} style={{ fontSize: 36, opacity: i <= stars ? 1 : 0.25 }}>⭐</Text>
            ))}
          </View>
          <Pressable style={[s.btn, { backgroundColor: C.mint }]}
            onPress={() => navigation.navigate('Reward', { from: 'MemoryFlip', stars })}>
            <Text style={s.btnT}>Collect Stars!</Text>
          </Pressable>
          <Pressable style={[s.btn, { backgroundColor: C.blue, marginTop: 10 }]} onPress={restart}>
            <Text style={s.btnT}>Play Again 🔄</Text>
          </Pressable>
        </View>
      ) : (
        <View style={s.grid}>
          {deck.map((card, idx) => (
            <MemCard
              key={card.id}
              card={card}
              status={statuses[idx]}
              onPress={() => tap(idx)}
            />
          ))}
        </View>
      )}
    </PhoneSafe>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const mc = StyleSheet.create({
  side:   { position: 'absolute', width: '100%', height: '100%', borderRadius: 12, borderWidth: 3, borderColor: C.ink, alignItems: 'center', justifyContent: 'center', backfaceVisibility: 'hidden' },
  backQ:  { fontSize: 24 },
  emoji:  { fontSize: CARD_W * 0.45 },
  tick:   { position: 'absolute', top: 4, right: 6, fontSize: 14, fontWeight: '900', color: C.mintDeep },
});

const s = StyleSheet.create({
  header:      { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  back:        { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', borderWidth: 3, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  backT:       { fontSize: 20, fontWeight: '900', color: C.ink },
  title:       { flex: 1, textAlign: 'center', fontWeight: '900', fontSize: 20, color: C.ink },
  movePill:    { backgroundColor: C.yellow, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 3, borderColor: C.ink },
  moveT:       { fontWeight: '900', fontSize: 13, color: C.ink },
  progressRow: { paddingHorizontal: 16, gap: 4, marginBottom: 4 },
  progressBar: { height: 12, backgroundColor: '#fff', borderRadius: 7, borderWidth: 3, borderColor: C.ink, overflow: 'hidden' },
  progressFill:{ height: '100%', backgroundColor: C.mint, borderRadius: 5 },
  progressLbl: { textAlign: 'center', fontSize: 12, fontWeight: '800', color: C.inkSoft },
  hint:        { textAlign: 'center', fontSize: 14, fontWeight: '700', color: C.inkSoft, marginBottom: 6, paddingHorizontal: 20 },
  grid:        { flexDirection: 'row', flexWrap: 'wrap', gap: GAP, paddingHorizontal: PAD },
  winBox:      { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  winEmoji:    { fontSize: 72 },
  winTitle:    { fontSize: 30, fontWeight: '900', color: C.ink, marginTop: 10 },
  winSub:      { fontSize: 16, fontWeight: '700', color: C.inkSoft, marginTop: 4 },
  starsRow:    { flexDirection: 'row', gap: 8, marginTop: 16, marginBottom: 24 },
  btn:         { borderRadius: 20, borderWidth: 3.5, borderColor: C.ink, paddingHorizontal: 32, paddingVertical: 14 },
  btnT:        { fontSize: 18, fontWeight: '900', color: '#fff' },
});
