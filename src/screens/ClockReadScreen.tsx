import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions } from 'react-native';
import Svg, { Circle, Line, G } from 'react-native-svg';
import * as Speech from 'expo-speech';
import PhoneSafe from '../components/PhoneSafe';
import GameHeader from '../components/GameHeader';
import { C } from '../theme';
import { shuffle, calcStars } from '../utils';
import type { ScreenProps } from '../navigation/types';

const { width: SW } = Dimensions.get('window');
const CLOCK_R = 110;

// ─── Data ─────────────────────────────────────────────────────────────────────

interface TimeEntry {
  hour: number;
  minute: number;
  label: string;
}

const TOTAL = 200;

function buildRounds(): { time: TimeEntry; options: string[] }[] {
  const times: TimeEntry[] = [];
  for (let h = 1; h <= 12; h++) {
    times.push({ hour: h, minute: 0,  label: `${h}:00`  });
    times.push({ hour: h, minute: 30, label: `${h}:30` });
  }
  const result: { time: TimeEntry; options: string[] }[] = [];
  while (result.length < TOTAL) {
    const shuffled = [...times].sort(() => Math.random() - 0.5);
    shuffled.forEach(t => {
      const wrong = times
        .filter(x => x.label !== t.label)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(x => x.label);
      result.push({ time: t, options: shuffle([t.label, ...wrong]) });
    });
  }
  return result.slice(0, TOTAL);
}

const ROUNDS = buildRounds();

// ─── Clock face SVG ──────────────────────────────────────────────────────────

function angleFor(hour: number, minute: number) {
  const hourAngle  = ((hour % 12) + minute / 60) * 30 - 90; // degrees from top
  const minAngle   = minute * 6 - 90;
  return { hourAngle, minAngle };
}

function polarX(cx: number, cy: number, r: number, deg: number) {
  return cx + r * Math.cos((deg * Math.PI) / 180);
}
function polarY(cx: number, cy: number, r: number, deg: number) {
  return cy + r * Math.sin((deg * Math.PI) / 180);
}

function ClockFace({ hour, minute, size = 220 }: { hour: number; minute: number; size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const r  = size / 2 - 10;
  const { hourAngle, minAngle } = angleFor(hour, minute);

  const ticks = Array.from({ length: 12 }, (_, i) => {
    const deg = i * 30 - 90;
    const inner = i % 3 === 0 ? r - 16 : r - 10;
    return {
      x1: polarX(cx, cy, r, deg),
      y1: polarY(cx, cy, r, deg),
      x2: polarX(cx, cy, inner, deg),
      y2: polarY(cx, cy, inner, deg),
      major: i % 3 === 0,
    };
  });

  return (
    <Svg width={size} height={size}>
      {/* Face */}
      <Circle cx={cx} cy={cy} r={r} fill="#FFFDF0" stroke={C.ink} strokeWidth={3.5} />
      {/* Shadow ring */}
      <Circle cx={cx} cy={cy} r={r - 6} fill="none" stroke="#F0E8C0" strokeWidth={2} />

      {/* Tick marks */}
      {ticks.map((t, i) => (
        <Line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke={C.ink} strokeWidth={t.major ? 3 : 1.5} strokeLinecap="round" />
      ))}

      {/* Hour hand */}
      <Line
        x1={cx} y1={cy}
        x2={polarX(cx, cy, r * 0.52, hourAngle)}
        y2={polarY(cx, cy, r * 0.52, hourAngle)}
        stroke={C.ink} strokeWidth={6} strokeLinecap="round"
      />
      {/* Minute hand */}
      <Line
        x1={cx} y1={cy}
        x2={polarX(cx, cy, r * 0.75, minAngle)}
        y2={polarY(cx, cy, r * 0.75, minAngle)}
        stroke="#E74C3C" strokeWidth={4} strokeLinecap="round"
      />
      {/* Center dot */}
      <Circle cx={cx} cy={cy} r={7} fill={C.ink} />
      <Circle cx={cx} cy={cy} r={3} fill="#fff" />
    </Svg>
  );
}

// ─── Confetti ─────────────────────────────────────────────────────────────────

const EMOJIS = ['⭐', '✨', '🎉', '🌟', '💫'];
function Particle({ x, delay }: { x: number; delay: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(anim, { toValue: 1, duration: 900, useNativeDriver: true }),
    ]).start();
  }, []);
  const ty = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -200] });
  const op = anim.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] });
  return (
    <Animated.Text style={{ position: 'absolute', bottom: 60, left: x, fontSize: 22, opacity: op, transform: [{ translateY: ty }] }}>
      {EMOJIS[Math.floor(Math.random() * EMOJIS.length)]}
    </Animated.Text>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ClockReadScreen({ navigation }: ScreenProps<'ClockRead'>) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const shake = useRef(new Animated.Value(0)).current;
  const clockScale = useRef(new Animated.Value(1)).current;
  const slideIn = useRef(new Animated.Value(SW)).current;

  const round = ROUNDS[idx];

  useEffect(() => {
    slideIn.setValue(SW);
    Animated.spring(slideIn, { toValue: 0, damping: 14, stiffness: 80, useNativeDriver: true }).start();
    setShowConfetti(false);
    Speech.stop();
    Speech.speak('What time does the clock show?', { rate: 0.95, pitch: 1.1 });
  }, [idx]);

  const doShake = () => Animated.sequence([
    Animated.timing(shake, { toValue: 14, duration: 60, useNativeDriver: true }),
    Animated.timing(shake, { toValue: -14, duration: 60, useNativeDriver: true }),
    Animated.timing(shake, { toValue: 8, duration: 60, useNativeDriver: true }),
    Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
  ]).start();

  const doBounce = () => Animated.sequence([
    Animated.spring(clockScale, { toValue: 1.12, tension: 250, friction: 5, useNativeDriver: true }),
    Animated.spring(clockScale, { toValue: 1, tension: 200, friction: 8, useNativeDriver: true }),
  ]).start();

  const pick = (opt: string) => {
    if (picked !== null) return;
    setPicked(opt);

    if (opt === round.time.label) {
      const next = score + 1;
      setScore(next);
      setShowConfetti(true);
      doBounce();
      Speech.stop();
      Speech.speak(`Great! It is ${round.time.label}!`, { rate: 1.0, pitch: 1.2 });
      setTimeout(() => advance(next), 1700);
    } else {
      doShake();
      Speech.stop();
      Speech.speak('Look at the clock hands!', { rate: 1.1 });
      setTimeout(() => setPicked(null), 1400);
    }
  };

  const advance = (currentScore: number) => {
    if (idx + 1 >= TOTAL) {
      navigation.navigate('Reward', { from: 'ClockRead', stars: calcStars(currentScore, TOTAL) });
      return;
    }
    setIdx(i => i + 1);
    setPicked(null);
    setShowConfetti(false);
  };

  return (
    <PhoneSafe bg="#E0F7FA">
      <GameHeader
        onBack={() => navigation.goBack()}
        title="Clock Reader"
        score={score}
        scoreBg="#B2EBF2"
      />

      {/* Clock card */}
      <Animated.View style={[s.clockCard, { transform: [{ translateX: shake }, { scale: clockScale }] }]}>
        <Text style={s.promptText}>What time is it? 🕐</Text>
        <ClockFace hour={round.time.hour} minute={round.time.minute} size={220} />
        <Text style={s.tipText}>
          {round.time.minute === 0 ? 'Short hand → hour  •  Long hand → 12' : 'Long hand → 6 means :30'}
        </Text>
      </Animated.View>

      {/* Options */}
      <View style={s.optGrid}>
        {round.options.map(opt => {
          const correct = picked === opt && opt === round.time.label;
          const wrong   = picked === opt && opt !== round.time.label;
          return (
            <Pressable
              key={opt}
              onPress={() => pick(opt)}
              style={[s.optBtn, correct && s.optCorrect, wrong && s.optWrong]}
            >
              <Text style={s.optText}>{opt}</Text>
              {correct && <Text style={s.badge}>✓</Text>}
              {wrong && <Text style={s.badgeWrong}>✗</Text>}
            </Pressable>
          );
        })}
      </View>

      {showConfetti && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {[...Array(10)].map((_, i) => (
            <Particle key={i} x={20 + i * (SW / 11)} delay={i * 55} />
          ))}
        </View>
      )}
    </PhoneSafe>
  );
}

const s = StyleSheet.create({
  clockCard: {
    marginHorizontal: 20, backgroundColor: '#fff', borderRadius: 28,
    borderWidth: 3.5, borderColor: C.ink, padding: 18,
    alignItems: 'center', marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 10, elevation: 5,
  },
  promptText: { fontSize: 18, fontWeight: '900', color: C.ink, marginBottom: 14 },
  tipText:    { fontSize: 12, fontWeight: '600', color: '#777', marginTop: 12, textAlign: 'center' },

  optGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, paddingHorizontal: 16 },
  optBtn: {
    width: (SW - 60) / 2, height: 68, borderRadius: 18,
    backgroundColor: '#fff', borderWidth: 3, borderColor: C.ink,
    alignItems: 'center', justifyContent: 'center', position: 'relative',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1, shadowRadius: 6, elevation: 4,
  },
  optCorrect: { backgroundColor: '#D4FFDB', borderColor: '#2ECC71' },
  optWrong:   { backgroundColor: '#FFD6D6', borderColor: '#E74C3C' },
  optText:    { fontSize: 22, fontWeight: '900', color: C.ink },

  badge:      { position: 'absolute', top: 6, right: 10, fontSize: 16, color: '#2ECC71', fontWeight: '900' },
  badgeWrong: { position: 'absolute', top: 6, right: 10, fontSize: 16, color: '#E74C3C', fontWeight: '900' },
});
