// src/screens/NumberQuizScreen.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions, Easing } from 'react-native';
import * as Speech from 'expo-speech';
import PhoneSafe from '../components/PhoneSafe';
import { C } from '../theme';
import { shuffle } from '../utils';
import GameHeader from '../components/GameHeader';
import { useAudio } from '../hooks/useAudio';
import type { ScreenProps } from '../navigation/types';
import { MATH_ICONS, MATH_BASE_POOL, type MathQuestion, type MathOp } from '../data/GameAssets';

const { width: SW } = Dimensions.get('window');
const TOTAL = 200;

type Op = MathOp;
type Question = MathQuestion;

const BASE_POOL = MATH_BASE_POOL;

function buildPool(): Question[] {
  const result: Question[] = [];
  while (result.length < TOTAL) result.push(...shuffle(BASE_POOL));
  return result.slice(0, TOTAL);
}

const POOL = buildPool();

const OP_DARK: Record<Op, string> = { '+': '#4CAF50', '−': '#FF5252', '×': '#9C27B0' };
const OP_WORD: Record<Op, string> = { '+': 'plus', '−': 'minus', '×': 'times' };

export default function NumberQuizScreen({ navigation }: ScreenProps<'NumberQuiz'>) {
  const { playSound } = useAudio();
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [icon, setIcon] = useState(MATH_ICONS[0]);

  const q = POOL[idx];
  const shake = useRef(new Animated.Value(0)).current;
  const slideIn = useRef(new Animated.Value(SW)).current;
  const cardBounce = useRef(new Animated.Value(1)).current;
  const mascotAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    slideIn.setValue(SW);
    Animated.spring(slideIn, { toValue: 0, damping: 12, stiffness: 90, useNativeDriver: true }).start();

    // Change icon every round to keep it fresh
    setIcon(MATH_ICONS[Math.floor(Math.random() * MATH_ICONS.length)]);

    Speech.stop();
    Speech.speak(`${q.a} ${OP_WORD[q.op]} ${q.b} equals?`, { rate: 0.9, pitch: 1.1 });
  }, [idx]);

  const advance = (sc: number) => {
    if (idx + 1 >= TOTAL) {
      navigation.navigate('Reward', { from: 'NumberQuiz', stars: 3 });
      return;
    }
    setIdx(i => i + 1);
    setPicked(null);
  };

  const pick = (n: number) => {
    if (picked !== null) return;
    setPicked(n);
    const isCorr = n === q.answer;

    Speech.stop();
    Speech.speak(
      `${q.a} ${OP_WORD[q.op]} ${q.b} equals ${q.answer}. Your answer is ${isCorr ? 'correct' : 'wrong'}.`,
      { rate: 1.0, pitch: 1.1 }
    );

    if (isCorr) {
      const ns = score + 1;
      setScore(ns);
      setStreak(s => s + 1);

      Animated.sequence([
        Animated.spring(cardBounce, { toValue: 1.1, tension: 200, friction: 5, useNativeDriver: true }),
        Animated.spring(cardBounce, { toValue: 1, tension: 200, friction: 8, useNativeDriver: true }),
      ]).start();

      Animated.sequence([
        Animated.timing(mascotAnim, { toValue: -20, duration: 150, useNativeDriver: true }),
        Animated.timing(mascotAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      ]).start();

      setTimeout(() => advance(ns), 2200);
    } else {
      setStreak(0);
      Animated.sequence([
        Animated.timing(shake, { toValue: 15, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -15, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 10, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
      setTimeout(() => advance(score), 2500);
    }
  };

  const isCorrect = picked === q.answer;
  const opDark = OP_DARK[q.op];

  const renderVisual = (count: number) => (
    <View style={s.visualRow}>
      {Array.from({ length: Math.min(count, 10) }).map((_, i) => (
        <Text key={i} style={s.visualIcon}>{icon}</Text>
      ))}
      {count > 10 && <Text style={s.visualIcon}>...</Text>}
    </View>
  );

  return (
    <PhoneSafe bg="#EEF2FF">
      <GameHeader onBack={() => navigation.goBack()} title="Math Challenge! 🧮" score={score} scoreBg={opDark} scoreTextColor="#fff" />


      <Animated.View style={[s.card, { transform: [{ translateX: slideIn }, { translateX: shake }, { scale: cardBounce }] }]}>
        <View style={s.mathRow}>
          <View style={s.numBox}>
            {renderVisual(q.a)}
            <Text style={s.cardNum}>{q.a}</Text>
          </View>
          <Text style={[s.opChar, { color: opDark }]}>{q.op === '−' ? '−' : q.op === '×' ? '×' : '+'}</Text>
          <View style={s.numBox}>
            {renderVisual(q.b)}
            <Text style={s.cardNum}>{q.b}</Text>
          </View>
        </View>

        <View style={s.eqLine} />

        <View style={s.answerCircle}>
          <Text style={[s.answerT, { color: picked === null ? '#ccc' : opDark }]}>
            {picked === null ? '?' : isCorrect ? q.answer : '✗'}
          </Text>
        </View>
      </Animated.View>

      <View style={s.grid}>
        {q.options.map(n => {
          const isSelected = picked === n;
          const isCorrectChoice = n === q.answer;
          const bg = !picked ? '#fff' : (isCorrectChoice ? '#5EE39F' : (isSelected ? '#FF5E5E' : '#fff'));

          return (
            <Pressable key={n} onPress={() => pick(n)} disabled={picked !== null}
              style={[s.opt, { backgroundColor: bg, elevation: isSelected ? 0 : 5 }]}>
              <Text style={[s.optT, { color: picked && (isSelected || isCorrectChoice) ? '#fff' : C.ink }]}>{n}</Text>
            </Pressable>
          );
        })}
      </View>
    </PhoneSafe>
  );
}

const s = StyleSheet.create({
  mascotArea: { alignItems: 'center', height: 100, justifyContent: 'center' },
  mascot: { fontSize: 55 },
  streakText: { fontSize: 14, fontWeight: '900', color: '#FF5722', marginTop: 4 },
  card: { marginHorizontal: 20, backgroundColor: '#fff', borderRadius: 40, padding: 25, elevation: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 15 },
  mathRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  numBox: { alignItems: 'center' },
  cardNum: { fontSize: 60, fontWeight: '900', color: C.ink },
  opChar: { fontSize: 40, fontWeight: '900' },
  visualRow: { flexDirection: 'row', flexWrap: 'wrap', width: 80, justifyContent: 'center', marginBottom: 10 },
  visualIcon: { fontSize: 16 },
  eqLine: { width: '80%', height: 4, backgroundColor: '#eee', marginVertical: 20, borderRadius: 2 },
  answerCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#F8F9FA', alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#eee' },
  answerT: { fontSize: 44, fontWeight: '900' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 15, marginTop: 30, paddingHorizontal: 20 },
  opt: { width: '45%', height: 80, borderRadius: 25, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6 },
  optT: { fontSize: 36, fontWeight: '900' },
});



