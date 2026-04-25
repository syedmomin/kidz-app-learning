// src/screens/NumberQuizScreen.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions, Easing } from 'react-native';
import * as Speech from 'expo-speech';
import PhoneSafe from '../components/PhoneSafe';
import { C } from '../theme';
import { useAudio } from '../hooks/useAudio';
import type { ScreenProps } from '../navigation/types';

const { width: SW } = Dimensions.get('window');
const TOTAL = 15;

type Op = '+' | '−' | '×';
interface Question { a: number; b: number; op: Op; answer: number; options: number[] }

const MATH_ICONS = ['🍎', '⭐', '🎈', '🍪', '🦁', '🍦'];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

function makeOptions(answer: number, op: Op): number[] {
  const offsets = op === '×' ? [-answer, answer, 2, -2, 3, -3] : [-2, -1, 1, 2, 3, -3];
  const wrongs  = new Set<number>();
  for (const d of shuffle(offsets)) {
    const w = answer + d;
    if (w !== answer && w >= 0 && w <= 99) wrongs.add(w);
    if (wrongs.size === 3) break;
  }
  let pad = 1;
  while (wrongs.size < 3) { wrongs.add(answer + pad * 5); pad++; }
  return shuffle([answer, ...[...wrongs].slice(0, 3)]);
}

function makeQ(a: number, b: number, op: Op): Question {
  const answer = op === '+' ? a + b : op === '−' ? a - b : a * b;
  return { a, b, op, answer, options: makeOptions(answer, op) };
}

const BASE_POOL: Question[] = [
  makeQ(3,2,'+'), makeQ(5,1,'+'), makeQ(4,3,'+'), makeQ(2,2,'+'), makeQ(6,2,'+'),
  makeQ(5,2,'−'), makeQ(6,3,'−'), makeQ(4,1,'−'), makeQ(7,2,'−'), makeQ(3,3,'−'),
  makeQ(2,2,'×'), makeQ(3,1,'×'), makeQ(2,3,'×'), makeQ(4,2,'×'), makeQ(5,2,'×'),
];

function buildPool(): Question[] {
  const result: Question[] = [];
  while (result.length < TOTAL) result.push(...shuffle(BASE_POOL));
  return result.slice(0, TOTAL);
}

const POOL = buildPool();

const OP_BG:   Record<Op,string> = { '+': '#E8F5E9', '−': '#FFEBEE', '×': '#F3E5F5' };
const OP_DARK: Record<Op,string> = { '+': '#4CAF50', '−': '#FF5252', '×': '#9C27B0' };
const OP_WORD: Record<Op,string> = { '+': 'plus', '−': 'minus', '×': 'times' };

export default function NumberQuizScreen({ navigation }: ScreenProps<'NumberQuiz'>) {
  const { playSound } = useAudio();
  const [idx,    setIdx]    = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score,  setScore]  = useState(0);
  const [streak, setStreak] = useState(0);
  const [icon]   = useState(() => MATH_ICONS[Math.floor(Math.random() * MATH_ICONS.length)]);

  const q           = POOL[idx];
  const shake       = useRef(new Animated.Value(0)).current;
  const slideIn     = useRef(new Animated.Value(SW)).current;
  const cardBounce  = useRef(new Animated.Value(1)).current;
  const mascotAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    slideIn.setValue(SW);
    Animated.spring(slideIn, { toValue: 0, damping: 12, stiffness: 90, useNativeDriver: true }).start();
    
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
    if (n === q.answer) {
      const ns = score + 1;
      setScore(ns);
      setStreak(s => s + 1);
      playSound(require('../../assets/sounds/lion.mp3'));
      Speech.speak(`Correct! ${q.answer}`, { rate: 1.1 });
      
      Animated.sequence([
        Animated.spring(cardBounce, { toValue: 1.1, tension: 200, friction: 5, useNativeDriver: true }),
        Animated.spring(cardBounce, { toValue: 1,    tension: 200, friction: 8, useNativeDriver: true }),
      ]).start();
      
      Animated.sequence([
        Animated.timing(mascotAnim, { toValue: -20, duration: 150, useNativeDriver: true }),
        Animated.timing(mascotAnim, { toValue: 0,   duration: 150, useNativeDriver: true }),
      ]).start();

      setTimeout(() => advance(ns), 1500);
    } else {
      setStreak(0);
      playSound(require('../../assets/sounds/dog.mp3')); // Using dog for wrong sound placeholder
      Speech.speak(`Oops! It was ${q.answer}`, { rate: 1.0 });
      Animated.sequence([
        Animated.timing(shake, { toValue: 15,  duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -15, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 10,   duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0,   duration: 60, useNativeDriver: true }),
      ]).start();
      setTimeout(() => advance(score), 2000);
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
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}><Text style={s.backT}>←</Text></Pressable>
        <Text style={s.title}>Math Challenge! 🧮</Text>
        <View style={[s.scorePill, { backgroundColor: opDark }]}><Text style={s.scoreT}>⭐ {score}</Text></View>
      </View>

      <View style={s.progressBar}>
        <View style={[s.progressFill, { width: `${(idx / TOTAL) * 100}%`, backgroundColor: opDark }]}/>
      </View>

      <View style={s.mascotArea}>
        <Animated.Text style={[s.mascot, { transform: [{ translateY: mascotAnim }] }]}>
          {picked === null ? '🤔' : isCorrect ? '🎉' : '😢'}
        </Animated.Text>
        <Text style={s.streakText}>{streak > 1 ? `Streak: ${streak} 🔥` : ''}</Text>
      </View>

      <Animated.View style={[s.card, { transform: [{ translateX: slideIn }, { translateX: shake }, { scale: cardBounce }] }]}>
        <View style={s.mathRow}>
          <View style={s.numBox}>
            <Text style={s.cardNum}>{q.a}</Text>
            {renderVisual(q.a)}
          </View>
          <Text style={[s.opChar, { color: opDark }]}>{q.op === '−' ? '−' : q.op === '×' ? '×' : '+'}</Text>
          <View style={s.numBox}>
            <Text style={s.cardNum}>{q.b}</Text>
            {renderVisual(q.b)}
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
  header:       { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 8 },
  back:         { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', elevation: 4, alignItems: 'center', justifyContent: 'center' },
  backT:        { fontSize: 22, fontWeight: '900', color: C.ink },
  title:        { flex: 1, textAlign: 'center', fontWeight: '900', fontSize: 22, color: C.ink },
  scorePill:    { borderRadius: 20, paddingHorizontal: 15, paddingVertical: 6, elevation: 4 },
  scoreT:       { fontWeight: '900', fontSize: 16, color: '#fff' },
  progressBar:  { height: 14, marginHorizontal: 30, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 10, overflow: 'hidden', marginBottom: 10 },
  progressFill: { height: '100%', borderRadius: 10 },
  mascotArea:   { alignItems: 'center', height: 80, justifyContent: 'center' },
  mascot:       { fontSize: 50 },
  streakText:   { fontSize: 14, fontWeight: '900', color: '#FF5722', marginTop: 4 },
  card:         { marginHorizontal: 20, backgroundColor: '#fff', borderRadius: 40, padding: 25, elevation: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 15 },
  mathRow:      { flexDirection: 'row', alignItems: 'center', gap: 15 },
  numBox:       { alignItems: 'center' },
  cardNum:      { fontSize: 60, fontWeight: '900', color: C.ink },
  opChar:       { fontSize: 40, fontWeight: '900' },
  visualRow:    { flexDirection: 'row', flexWrap: 'wrap', width: 60, justifyContent: 'center' },
  visualIcon:   { fontSize: 14 },
  eqLine:       { width: '80%', height: 4, backgroundColor: '#eee', marginVertical: 20, borderRadius: 2 },
  answerCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#F8F9FA', alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#eee' },
  answerT:      { fontSize: 44, fontWeight: '900' },
  grid:         { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 15, marginTop: 30, paddingHorizontal: 20 },
  opt:          { width: '45%', height: 80, borderRadius: 25, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6 },
  optT:         { fontSize: 36, fontWeight: '900' },
});

