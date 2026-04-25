// src/screens/NumberQuizScreen.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable,
  Animated, Dimensions,
} from 'react-native';
import { Audio } from 'expo-av';
import PhoneSafe from '../components/PhoneSafe';
import { C } from '../theme';
import type { ScreenProps } from '../navigation/types';

const { width: SW } = Dimensions.get('window');

// ─── Types ────────────────────────────────────────────────────────────────────

type Op = '+' | '−' | '×';

interface Question {
  a:       number;
  b:       number;
  op:      Op;
  answer:  number;
  options: number[];
}

// ─── Question builder ─────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Wrong options are close but never equal to answer, always >= 0
function makeOptions(answer: number, op: Op): number[] {
  const offsets = op === '×'
    ? [-answer, answer, 2, -2, 3, -3, answer - 1, answer + 1]
    : [-2, -1, 1, 2, 3, -3];

  const wrongs = new Set<number>();
  for (const d of shuffle(offsets)) {
    const w = answer + d;
    if (w !== answer && w >= 0 && w <= 99) wrongs.add(w);
    if (wrongs.size === 3) break;
  }
  // fallback if not enough
  let pad = 1;
  while (wrongs.size < 3) { wrongs.add(answer + pad * 4); pad++; }

  return shuffle([answer, ...wrongs]);
}

function makeQ(a: number, b: number, op: Op): Question {
  const answer = op === '+' ? a + b : op === '−' ? a - b : a * b;
  return { a, b, op, answer, options: makeOptions(answer, op) };
}

// Pool of 20 questions (no repeats in a session), shuffled each time
function buildPool(): Question[] {
  return shuffle([
    makeQ(3,4,'+'), makeQ(5,6,'+'), makeQ(7,3,'+'), makeQ(8,4,'+'), makeQ(6,5,'+'),
    makeQ(9,2,'+'), makeQ(4,4,'+'), makeQ(7,5,'+'),
    makeQ(9,4,'−'), makeQ(8,3,'−'), makeQ(7,2,'−'), makeQ(10,6,'−'), makeQ(12,5,'−'),
    makeQ(11,4,'−'), makeQ(9,3,'−'),
    makeQ(2,3,'×'), makeQ(3,4,'×'), makeQ(2,5,'×'), makeQ(4,3,'×'), makeQ(2,6,'×'),
  ]);
}

const POOL  = buildPool();
const TOTAL = 10;

// ─── Op config ───────────────────────────────────────────────────────────────

const OP_BG:   Record<Op, string> = { '+': '#D9FFE8', '−': '#FFE0E0', '×': '#EBD9FF' };
const OP_DARK: Record<Op, string> = { '+': C.mintDeep, '−': C.coralDeep, '×': C.purpleDeep };
const OP_NAME: Record<Op, string> = { '+': 'Addition', '−': 'Subtraction', '×': 'Multiply' };
const OP_EMOJI:Record<Op, string> = { '+': '➕', '−': '➖', '×': '✖️' };

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function NumberQuizScreen({ navigation }: ScreenProps<'NumberQuiz'>) {
  const [idx,    setIdx]    = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score,  setScore]  = useState(0);
  const [streak, setStreak] = useState(0);

  const q = POOL[idx];

  const shake     = useRef(new Animated.Value(0)).current;
  const slideIn   = useRef(new Animated.Value(SW)).current;
  const cardBounce= useRef(new Animated.Value(1)).current;

  // Slide card in on each new question
  useEffect(() => {
    slideIn.setValue(SW);
    Animated.spring(slideIn, { toValue: 0, tension: 60, friction: 11, useNativeDriver: true }).start();
  }, [idx]);

  // ── Sound ────────────────────────────────────────────────────────────────────
  const playCorrect = useCallback(async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/music/happy.mp3'),
        { shouldPlay: true, volume: 0.55 },
      );
      setTimeout(() => sound.unloadAsync(), 900);
    } catch (_) {}
  }, []);

  // ── Answer pick ───────────────────────────────────────────────────────────────
  const pick = (n: number) => {
    if (picked !== null) return;
    setPicked(n);

    if (n === q.answer) {
      const ns = score + 1;
      setScore(ns);
      setStreak(s => s + 1);
      playCorrect();
      // Bounce the card on correct
      Animated.sequence([
        Animated.spring(cardBounce, { toValue: 1.06, tension: 200, friction: 5, useNativeDriver: true }),
        Animated.spring(cardBounce, { toValue: 1,    tension: 200, friction: 8, useNativeDriver: true }),
      ]).start();
      setTimeout(() => advance(ns), 1300);
    } else {
      setStreak(0);
      Animated.sequence([
        Animated.timing(shake, { toValue: 14,  duration: 55, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -14, duration: 55, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 10,  duration: 55, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -10, duration: 55, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0,   duration: 55, useNativeDriver: true }),
      ]).start();
    }
  };

  const advance = (currentScore: number) => {
    if (idx + 1 >= TOTAL) {
      navigation.navigate('Reward', {
        from:  'NumberQuiz',
        stars: currentScore >= 9 ? 3 : currentScore >= 6 ? 2 : 1,
      });
      return;
    }
    setIdx(i => i + 1);
    setPicked(null);
    cardBounce.setValue(1);
  };

  const isCorrect = picked === q.answer;
  const opBg      = OP_BG[q.op];
  const opDark    = OP_DARK[q.op];

  // Option button style
  const optBg = (n: number) => {
    if (picked === null) return '#fff';
    if (n === q.answer)  return C.mint;
    if (n === picked)    return C.coral;
    return '#fff';
  };
  const optColor = (n: number) => {
    if (picked === null) return C.ink;
    if (n === q.answer || n === picked) return '#fff';
    return C.ink;
  };

  return (
    <PhoneSafe bg="#F5F0FF">
      {/* Header */}
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}>
          <Text style={s.backT}>←</Text>
        </Pressable>
        <Text style={s.title}>Math Quiz</Text>
        <View style={[s.scorePill, { backgroundColor: opDark }]}>
          <Text style={s.scoreT}>⭐ {score}</Text>
        </View>
      </View>

      {/* Progress */}
      <View style={s.progressBar}>
        <View style={[s.progressFill, { width: `${(idx / TOTAL) * 100}%`, backgroundColor: opDark }]}/>
      </View>
      <Text style={s.progressLbl}>{idx + 1} / {TOTAL}</Text>

      {/* Op badge */}
      <View style={[s.opBadge, { backgroundColor: opBg, borderColor: opDark }]}>
        <Text style={s.opBadgeT}>{OP_EMOJI[q.op]}  {OP_NAME[q.op]}</Text>
      </View>

      {/* Streak */}
      {streak >= 2 && (
        <Text style={s.streak}>🔥 {streak} correct in a row!</Text>
      )}

      {/* Question card */}
      <Animated.View style={[
        s.card,
        { backgroundColor: opBg, borderColor: opDark },
        { transform: [{ translateX: slideIn }, { translateX: shake }, { scale: cardBounce }] },
      ]}>
        <Text style={s.cardNum}>{q.a}</Text>
        <View style={[s.opCircle, { backgroundColor: opDark }]}>
          <Text style={s.opCircleT}>{q.op}</Text>
        </View>
        <Text style={s.cardNum}>{q.b}</Text>
        <Text style={[s.cardEq, { color: opDark }]}>=</Text>
        <View style={s.answerBox}>
          <Text style={s.answerT}>
            {picked === null ? '?' : isCorrect ? q.answer : '✗'}
          </Text>
        </View>
      </Animated.View>

      {/* 2×2 answer grid */}
      <View style={s.grid}>
        {q.options.map(n => (
          <Pressable
            key={n}
            onPress={() => pick(n)}
            disabled={picked !== null}
            style={({ pressed }) => [
              s.opt,
              {
                backgroundColor: optBg(n),
                borderColor: picked !== null && n === q.answer ? C.mintDeep : picked === n ? C.coralDeep : C.ink,
                transform: [{ scale: pressed && picked === null ? 0.92 : 1 }],
              },
            ]}
          >
            <Text style={[s.optT, { color: optColor(n) }]}>{n}</Text>
            {picked !== null && n === q.answer && <Text style={s.optMark}>✓</Text>}
            {picked === n && n !== q.answer    && <Text style={s.optMark}>✗</Text>}
          </Pressable>
        ))}
      </View>

      {/* Feedback row */}
      {picked !== null && isCorrect && (
        <Text style={[s.feedback, { color: opDark }]}>🎉 Correct! Next question coming…</Text>
      )}
      {picked !== null && !isCorrect && (
        <Pressable onPress={() => advance(score)} style={[s.nextBtn, { backgroundColor: C.blue }]}>
          <Text style={s.nextT}>{idx + 1 >= TOTAL ? '🏆 Finish' : 'Next →'}</Text>
        </Pressable>
      )}
    </PhoneSafe>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  header:    { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 8 },
  back:      { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', borderWidth: 3, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  backT:     { fontSize: 20, fontWeight: '900', color: C.ink },
  title:     { flex: 1, textAlign: 'center', fontWeight: '900', fontSize: 22, color: C.ink },
  scorePill: { borderRadius: 14, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 3, borderColor: C.ink },
  scoreT:    { fontWeight: '900', fontSize: 15, color: '#fff' },

  progressBar:  { height: 14, marginHorizontal: 20, backgroundColor: '#E0DCF0', borderRadius: 8, borderWidth: 3, borderColor: C.ink, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 6 },
  progressLbl:  { textAlign: 'center', fontWeight: '800', fontSize: 13, color: C.inkSoft, marginTop: 4 },

  opBadge:  { alignSelf: 'center', marginTop: 10, borderWidth: 3, borderRadius: 20, paddingHorizontal: 18, paddingVertical: 7 },
  opBadgeT: { fontWeight: '800', fontSize: 15, color: C.ink },

  streak:   { textAlign: 'center', fontWeight: '900', fontSize: 15, color: C.coral, marginTop: 4 },

  card: {
    marginHorizontal: 20, marginTop: 12, borderRadius: 30, borderWidth: 4,
    paddingVertical: 26, paddingHorizontal: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12, shadowRadius: 8, elevation: 6,
  },
  cardNum:   { fontSize: 64, fontWeight: '900', color: C.ink },
  opCircle:  { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: C.ink },
  opCircleT: { fontSize: 26, fontWeight: '900', color: '#fff' },
  cardEq:    { fontSize: 52, fontWeight: '900' },
  answerBox: { width: 74, height: 74, borderRadius: 18, backgroundColor: '#fff', borderWidth: 4, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  answerT:   { fontSize: 36, fontWeight: '900', color: C.ink },

  grid:    { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginTop: 20, paddingHorizontal: 20 },
  opt:     { width: (SW - 40 - 12) / 2, height: 72, borderRadius: 20, borderWidth: 4, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  optT:    { fontSize: 36, fontWeight: '900' },
  optMark: { fontSize: 22, fontWeight: '900' },

  feedback: { textAlign: 'center', fontWeight: '800', fontSize: 15, marginTop: 14 },
  nextBtn:  { margin: 20, marginTop: 16, height: 56, borderRadius: 20, borderWidth: 3.5, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  nextT:    { fontSize: 20, fontWeight: '900', color: '#fff' },
});
