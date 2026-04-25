// src/screens/NumberQuizScreen.tsx — math quiz: add / subtract / multiply
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

// ─── Question bank ────────────────────────────────────────────────────────────

type OpType = 'add' | 'sub' | 'mul';

interface Q {
  op: OpType;
  a: number;
  b: number;
  answer: number;
  options: number[];
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function makeOptions(answer: number, op: OpType): number[] {
  const wrong = new Set<number>();
  const spread = op === 'mul' ? [answer - 2, answer + 2, answer - answer / 2 | 0, answer + 3, answer - 3, answer * 2] : [answer - 1, answer + 1, answer - 2, answer + 2, answer + 3, answer - 3];
  for (const w of spread) {
    if (w !== answer && w >= 0 && wrong.size < 3) wrong.add(w);
  }
  while (wrong.size < 3) wrong.add(answer + wrong.size + 4);
  return shuffle([answer, ...wrong]);
}

function makeQ(op: OpType, a: number, b: number): Q {
  const answer = op === 'add' ? a + b : op === 'sub' ? a - b : a * b;
  return { op, a, b, answer, options: makeOptions(answer, op) };
}

const BANK: Q[] = shuffle([
  makeQ('add', 3, 4),
  makeQ('add', 5, 6),
  makeQ('add', 7, 8),
  makeQ('add', 9, 3),
  makeQ('add', 6, 7),
  makeQ('sub', 9, 4),
  makeQ('sub', 8, 3),
  makeQ('sub', 7, 2),
  makeQ('sub', 10, 6),
  makeQ('sub', 12, 5),
  makeQ('mul', 2, 3),
  makeQ('mul', 3, 4),
  makeQ('mul', 2, 5),
  makeQ('mul', 4, 3),
  makeQ('mul', 2, 6),
]);

const TOTAL = 10;
const QUESTIONS = BANK.slice(0, TOTAL);

// ─── Config per op ────────────────────────────────────────────────────────────

const OP_LABEL: Record<OpType, string> = { add: '+', sub: '−', mul: '×' };
const OP_NAME:  Record<OpType, string> = { add: 'Addition', sub: 'Subtraction', mul: 'Multiply' };
const OP_EMOJI: Record<OpType, string> = { add: '➕', sub: '➖', mul: '✖️' };
const OP_COLOR: Record<OpType, string> = { add: '#D9FFE8', sub: '#FFE0E0', mul: '#EBD9FF' };
const OP_DARK:  Record<OpType, string> = { add: C.mint, sub: C.coral, mul: C.purple };

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function NumberQuizScreen({ navigation }: ScreenProps<'NumberQuiz'>) {
  const [idx, setIdx]       = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore]   = useState(0);
  const [streak, setStreak] = useState(0);

  const shake    = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(1)).current;

  const q = QUESTIONS[idx];

  // slide card in on mount / question change
  useEffect(() => {
    cardAnim.setValue(SW);
    Animated.spring(cardAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }).start();
  }, [idx]);

  // ── sound ────────────────────────────────────────────────────────────────────
  const playCorrect = useCallback(async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/music/happy.mp3'),
        { shouldPlay: true, volume: 0.6 },
      );
      setTimeout(() => sound.unloadAsync(), 900);
    } catch (_) {}
  }, []);

  // ── answer pick ───────────────────────────────────────────────────────────────
  const pick = async (n: number) => {
    if (picked !== null) return;
    setPicked(n);

    if (n === q.answer) {
      // correct
      setScore(s => s + 1);
      setStreak(s => s + 1);
      playCorrect();
      Animated.sequence([
        Animated.spring(successScale, { toValue: 1.18, tension: 180, friction: 6, useNativeDriver: true }),
        Animated.spring(successScale, { toValue: 1,    tension: 180, friction: 6, useNativeDriver: true }),
      ]).start();
      setTimeout(advance, 1300);
    } else {
      // wrong
      setStreak(0);
      Animated.sequence([
        Animated.timing(shake, { toValue: 14,  duration: 55, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -14, duration: 55, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 10,  duration: 55, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -10, duration: 55, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0,   duration: 55, useNativeDriver: true }),
      ]).start();
      // allow manual next after wrong
    }
  };

  const advance = () => {
    if (idx + 1 >= TOTAL) {
      navigation.navigate('Reward', {
        from: 'NumberQuiz',
        stars: score + (picked === q.answer ? 1 : 0) >= TOTAL * 0.8 ? 3
             : score + (picked === q.answer ? 1 : 0) >= TOTAL * 0.5 ? 2 : 1,
      });
    } else {
      setIdx(i => i + 1);
      setPicked(null);
    }
  };

  const isCorrect = picked === q.answer;
  const opColor   = OP_COLOR[q.op];
  const opDark    = OP_DARK[q.op];
  const progress  = idx / TOTAL;

  return (
    <PhoneSafe bg="#F5F0FF">
      {/* ── Header ── */}
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}>
          <Text style={s.backT}>←</Text>
        </Pressable>
        <Text style={s.title}>Math Quiz</Text>
        <View style={[s.scorePill, { backgroundColor: opDark }]}>
          <Text style={s.scoreT}>⭐ {score}</Text>
        </View>
      </View>

      {/* ── Progress ── */}
      <View style={s.progressWrap}>
        <View style={s.progressTrack}>
          <Animated.View style={[s.progressFill, { width: `${progress * 100}%`, backgroundColor: opDark }]}/>
        </View>
        <Text style={s.progressLbl}>{idx + 1} / {TOTAL}</Text>
      </View>

      {/* ── Op badge ── */}
      <View style={[s.opBadge, { backgroundColor: opColor, borderColor: opDark }]}>
        <Text style={s.opBadgeT}>{OP_EMOJI[q.op]}  {OP_NAME[q.op]}</Text>
      </View>

      {streak >= 2 && (
        <Text style={s.streakBanner}>🔥 {streak} in a row!</Text>
      )}

      {/* ── Question card ── */}
      <Animated.View style={[s.card, { backgroundColor: opColor, borderColor: opDark, transform: [{ translateX: cardAnim }, { translateX: shake }, { scale: successScale }] }]}>
        <Text style={s.cardA}>{q.a}</Text>
        <View style={[s.opCircle, { backgroundColor: opDark }]}>
          <Text style={s.opCircleT}>{OP_LABEL[q.op]}</Text>
        </View>
        <Text style={s.cardA}>{q.b}</Text>
        <Text style={[s.cardEq, { color: opDark }]}>=</Text>
        <View style={s.blankBox}>
          <Text style={s.blankT}>
            {picked !== null ? (isCorrect ? q.answer : '✗') : '?'}
          </Text>
        </View>
      </Animated.View>

      {/* ── Answer grid ── */}
      <View style={s.grid}>
        {q.options.map((n) => {
          const isP       = picked === n;
          const isRight   = isP && n === q.answer;
          const isWrong   = isP && n !== q.answer;
          const isReveal  = picked !== null && n === q.answer && !isP;
          const btnBg     = isRight || isReveal ? C.mint
                          : isWrong ? C.coral
                          : '#fff';
          const txtColor  = isRight || isReveal || isWrong ? '#fff' : C.ink;
          return (
            <Pressable key={n} onPress={() => pick(n)}
              style={({ pressed }) => [s.optBtn, { backgroundColor: btnBg, opacity: pressed && picked === null ? 0.75 : 1, borderColor: isRight || isReveal ? C.mintDeep : isWrong ? C.coralDeep : C.ink }]}>
              <Text style={[s.optT, { color: txtColor }]}>{n}</Text>
              {(isRight || isReveal) && <Text style={s.optIcon}>✓</Text>}
              {isWrong && <Text style={s.optIcon}>✗</Text>}
            </Pressable>
          );
        })}
      </View>

      {/* ── Next button (only shown after wrong answer) ── */}
      {picked !== null && !isCorrect && (
        <Pressable onPress={advance} style={[s.nextBtn, { backgroundColor: C.blue, borderColor: C.blueDeep }]}>
          <Text style={s.nextBtnT}>{idx + 1 >= TOTAL ? '🏆 Finish' : 'Next →'}</Text>
        </Pressable>
      )}

      {/* auto-advance message */}
      {picked !== null && isCorrect && (
        <Text style={[s.autoMsg, { color: opDark }]}>🎉 Correct! Next question coming…</Text>
      )}
    </PhoneSafe>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  header:       { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 8 },
  back:         { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', borderWidth: 3, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  backT:        { fontSize: 20, fontWeight: '900', color: C.ink },
  title:        { flex: 1, textAlign: 'center', fontWeight: '900', fontSize: 22, color: C.ink },
  scorePill:    { borderRadius: 14, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 3, borderColor: C.ink },
  scoreT:       { fontWeight: '900', fontSize: 15, color: '#fff' },

  progressWrap: { paddingHorizontal: 20, gap: 4 },
  progressTrack:{ height: 14, backgroundColor: '#E0DCF0', borderRadius: 8, borderWidth: 3, borderColor: C.ink, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 6 },
  progressLbl:  { textAlign: 'center', fontWeight: '800', fontSize: 13, color: C.inkSoft },

  opBadge:      { alignSelf: 'center', marginTop: 10, borderWidth: 3, borderRadius: 20, paddingHorizontal: 18, paddingVertical: 7 },
  opBadgeT:     { fontWeight: '800', fontSize: 15, color: C.ink },

  streakBanner: { textAlign: 'center', fontWeight: '900', fontSize: 16, color: C.coral, marginTop: 4 },

  card:         {
    marginHorizontal: 20, marginTop: 14, borderRadius: 32, borderWidth: 4,
    paddingVertical: 28, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 6,
  },
  cardA:        { fontSize: 72, fontWeight: '900', color: C.ink },
  opCircle:     { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: C.ink },
  opCircleT:    { fontSize: 30, fontWeight: '900', color: '#fff' },
  cardEq:       { fontSize: 60, fontWeight: '900' },
  blankBox:     { width: 80, height: 80, borderRadius: 20, backgroundColor: '#fff', borderWidth: 4, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  blankT:       { fontSize: 42, fontWeight: '900', color: C.ink },

  grid:         { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 14, marginTop: 22, paddingHorizontal: 20 },
  optBtn:       { width: (SW - 40 - 14) / 2, height: 76, borderRadius: 22, borderWidth: 4, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  optT:         { fontSize: 40, fontWeight: '900' },
  optIcon:      { fontSize: 24 },

  nextBtn:      { margin: 20, marginTop: 18, height: 60, borderRadius: 22, borderWidth: 4, alignItems: 'center', justifyContent: 'center' },
  nextBtnT:     { fontSize: 22, fontWeight: '900', color: '#fff' },

  autoMsg:      { textAlign: 'center', fontWeight: '800', fontSize: 15, marginTop: 16 },
});
