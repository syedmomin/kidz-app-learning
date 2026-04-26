import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions } from 'react-native';
import * as Speech from 'expo-speech';
import PhoneSafe from '../components/PhoneSafe';
import GameHeader from '../components/GameHeader';
import { C } from '../theme';
import { shuffle, calcStars } from '../utils';
import type { ScreenProps } from '../navigation/types';

const { width: SW } = Dimensions.get('window');

// ─── Pattern data ─────────────────────────────────────────────────────────────

const SETS = [
  ['🍎', '🍌', '🍇', '🍊'],
  ['⭐', '🌙', '☀️', '🌈'],
  ['🐶', '🐱', '🐸', '🐔'],
  ['🔴', '🔵', '🟡', '🟢'],
  ['🚗', '✈️', '🚀', '🚂'],
  ['🎈', '⚽', '🎸', '🎁'],
  ['🌸', '🌻', '🌺', '🍀'],
  ['🦁', '🐘', '🦊', '🐼'],
  ['🍰', '🍦', '🍩', '🧁'],
  ['🔺', '🔷', '⭐', '🔶'],
];

type PatType = 'ABAB' | 'AABB' | 'ABCAB' | 'ABBA';

interface Round {
  seq: string[];   // 4 items shown
  answer: string;
  options: string[];
  hint: string;
}

function makeRound(setIdx: number, type: PatType): Round {
  const set = SETS[setIdx % SETS.length];
  const [A, B, C, D] = set;
  let seq: string[];
  let answer: string;

  switch (type) {
    case 'ABAB':  seq = [A, B, A, B]; answer = A; break;
    case 'AABB':  seq = [A, A, B, B]; answer = A; break;
    case 'ABCAB': seq = [A, B, C, A]; answer = B; break;
    case 'ABBA':  seq = [A, B, B, A]; answer = A; break;
    default:      seq = [A, B, A, B]; answer = A;
  }

  const distractors = set.filter(x => x !== answer).slice(0, 3);
  const options = shuffle([answer, ...distractors]);
  const hints: Record<PatType, string> = {
    ABAB: 'It goes: first, second, first, second…',
    AABB: 'Two same, then two same…',
    ABCAB: 'Three in a row then repeat!',
    ABBA: 'Mirror pattern!',
  };
  return { seq, answer, options, hint: hints[type] };
}

function buildRounds(): Round[] {
  const types: PatType[] = ['ABAB', 'AABB', 'ABCAB', 'ABBA'];
  const rounds: Round[] = [];
  for (let i = 0; i < 30; i++) {
    const setIdx = i % SETS.length;
    const type = types[Math.floor(i / SETS.length) % types.length];
    rounds.push(makeRound(setIdx, type));
  }
  return rounds;
}

const ROUNDS = buildRounds();
const TOTAL = ROUNDS.length;

// ─── Particle confetti ─────────────────────────────────────────────────────────

const CONFETTI = ['🌟', '✨', '🎉', '🎊', '💫', '🌈'];
function Particle({ x, delay }: { x: number; delay: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(anim, { toValue: 1, duration: 900, useNativeDriver: true }),
    ]).start();
  }, []);
  const ty = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -220] });
  const op = anim.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] });
  return (
    <Animated.Text style={{ position: 'absolute', bottom: 0, left: x, fontSize: 24, opacity: op, transform: [{ translateY: ty }] }}>
      {CONFETTI[Math.floor(Math.random() * CONFETTI.length)]}
    </Animated.Text>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function PatternQuestScreen({ navigation }: ScreenProps<'PatternQuest'>) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const shake = useRef(new Animated.Value(0)).current;
  const slideIn = useRef(new Animated.Value(SW)).current;
  const questionScale = useRef(new Animated.Value(1)).current;

  const round = ROUNDS[idx];

  const triggerSlideIn = () => {
    slideIn.setValue(SW);
    Animated.spring(slideIn, { toValue: 0, damping: 14, stiffness: 80, useNativeDriver: true }).start();
  };

  useEffect(() => {
    triggerSlideIn();
    setShowConfetti(false);
    Speech.stop();
    Speech.speak('What comes next?', { rate: 1.0, pitch: 1.1 });
  }, [idx]);

  const doShake = () => Animated.sequence([
    Animated.timing(shake, { toValue: 14, duration: 60, useNativeDriver: true }),
    Animated.timing(shake, { toValue: -14, duration: 60, useNativeDriver: true }),
    Animated.timing(shake, { toValue: 8, duration: 60, useNativeDriver: true }),
    Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
  ]).start();

  const doBounce = () => Animated.sequence([
    Animated.spring(questionScale, { toValue: 1.15, tension: 300, friction: 5, useNativeDriver: true }),
    Animated.spring(questionScale, { toValue: 1, tension: 200, friction: 8, useNativeDriver: true }),
  ]).start();

  const pick = (opt: string) => {
    if (picked !== null) return;
    setPicked(opt);

    if (opt === round.answer) {
      const next = score + 1;
      setScore(next);
      setShowConfetti(true);
      doBounce();
      Speech.stop();
      Speech.speak('Amazing! You got the pattern!', { rate: 1.0, pitch: 1.2 });
      setTimeout(() => advance(next), 1600);
    } else {
      doShake();
      Speech.stop();
      Speech.speak('Look at the pattern again!', { rate: 1.1 });
      setTimeout(() => setPicked(null), 1400);
    }
  };

  const advance = (currentScore: number) => {
    if (idx + 1 >= TOTAL) {
      navigation.navigate('Reward', { from: 'PatternQuest', stars: calcStars(currentScore, TOTAL) });
      return;
    }
    setIdx(i => i + 1);
    setPicked(null);
    setShowConfetti(false);
  };

  const isCorrect = picked === round.answer;
  const isWrong = picked !== null && !isCorrect;

  return (
    <PhoneSafe bg="#F3E8FF">
      <GameHeader
        onBack={() => navigation.goBack()}
        title="Pattern Quest"
        subtitle={`Round ${idx + 1} / ${TOTAL}`}
        score={score}
        scoreBg="#E8D5FF"
      />

      {/* Progress bar */}
      <View style={s.progTrack}>
        <View style={[s.progFill, { width: `${((idx + 1) / TOTAL) * 100}%` }]} />
      </View>

      <Animated.View style={[s.card, { transform: [{ translateX: slideIn }, { scale: questionScale }] }]}>
        {/* Hint */}
        <Text style={s.hintText}>{round.hint}</Text>

        {/* Pattern sequence */}
        <Animated.View style={[s.seqRow, { transform: [{ translateX: shake }] }]}>
          {round.seq.map((item, i) => (
            <View key={i} style={s.seqBox}>
              <Text style={s.seqEmoji}>{item}</Text>
            </View>
          ))}
          <View style={[s.seqBox, s.seqBoxQ]}>
            <Text style={s.qMark}>?</Text>
          </View>
        </Animated.View>

        {/* Prompt */}
        <Text style={s.prompt}>What comes next? 🤔</Text>
      </Animated.View>

      {/* Answer options */}
      <View style={s.optGrid}>
        {round.options.map(opt => {
          const correct = picked === opt && opt === round.answer;
          const wrong = picked === opt && opt !== round.answer;
          return (
            <Pressable
              key={opt}
              onPress={() => pick(opt)}
              style={[
                s.optBtn,
                correct && s.optCorrect,
                wrong && s.optWrong,
              ]}
            >
              <Text style={s.optEmoji}>{opt}</Text>
              {correct && <Text style={s.badge}>✓</Text>}
              {wrong && <Text style={s.badgeWrong}>✗</Text>}
            </Pressable>
          );
        })}
      </View>

      {/* Confetti */}
      {showConfetti && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {[...Array(10)].map((_, i) => (
            <Particle key={i} x={30 + i * (SW / 10)} delay={i * 60} />
          ))}
        </View>
      )}
    </PhoneSafe>
  );
}

const s = StyleSheet.create({
  progTrack: { height: 8, backgroundColor: '#E0C8FF', marginHorizontal: 16, borderRadius: 4, marginBottom: 14 },
  progFill:  { height: 8, backgroundColor: '#9B59D0', borderRadius: 4 },

  card: {
    marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 26,
    borderWidth: 3.5, borderColor: C.ink, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 10, elevation: 5,
    alignItems: 'center', marginBottom: 22,
  },
  hintText: { fontSize: 13, fontWeight: '700', color: '#9B59D0', marginBottom: 14, textAlign: 'center' },

  seqRow: { flexDirection: 'row', gap: 8, marginBottom: 18, flexWrap: 'wrap', justifyContent: 'center' },
  seqBox: {
    width: 58, height: 58, borderRadius: 14, backgroundColor: '#F3E8FF',
    borderWidth: 2.5, borderColor: C.ink, alignItems: 'center', justifyContent: 'center',
  },
  seqBoxQ: { backgroundColor: '#FFE566' },
  seqEmoji: { fontSize: 30 },
  qMark: { fontSize: 34, fontWeight: '900', color: C.ink },

  prompt: { fontSize: 17, fontWeight: '800', color: C.ink },

  optGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 14, paddingHorizontal: 12 },
  optBtn: {
    width: (SW - 60) / 2, height: 80, borderRadius: 20,
    backgroundColor: '#fff', borderWidth: 3, borderColor: C.ink,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1, shadowRadius: 6, elevation: 4, position: 'relative',
  },
  optCorrect: { backgroundColor: '#D4FFDB', borderColor: '#2ECC71' },
  optWrong:   { backgroundColor: '#FFD6D6', borderColor: '#E74C3C' },
  optEmoji:   { fontSize: 38 },

  badge:     { position: 'absolute', top: 6, right: 8, fontSize: 18, color: '#2ECC71', fontWeight: '900' },
  badgeWrong:{ position: 'absolute', top: 6, right: 8, fontSize: 18, color: '#E74C3C', fontWeight: '900' },
});
