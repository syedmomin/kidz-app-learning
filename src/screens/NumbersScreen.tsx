// src/screens/NumbersScreen.tsx — multi-round tap-to-count game
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions, Easing } from 'react-native';
import * as Speech from 'expo-speech';
import PhoneSafe from '../components/PhoneSafe';
import GameHeader from '../components/GameHeader';
import { C } from '../theme';
import { useProgress } from '../store/ProgressStore';
import type { ScreenProps } from '../navigation/types';

const { width: SW, height: SH } = Dimensions.get('window');
const TOTAL_ROUNDS = 12;

type Theme = { emoji: string; name: string; bg: string; tray: string; accent: string };
const THEMES: Theme[] = [
  { emoji: '🍎', name: 'apples',      bg: '#FFF3E6', tray: '#FFE0C2', accent: C.coral },
  { emoji: '🍌', name: 'bananas',     bg: '#FFF9D6', tray: '#FFEFA8', accent: C.yellowDeep },
  { emoji: '🍓', name: 'strawberries',bg: '#FFE6EC', tray: '#FFC2CE', accent: C.coralDeep },
  { emoji: '⭐', name: 'stars',       bg: '#E5F0FF', tray: '#BFD7FF', accent: C.blueDeep },
  { emoji: '🎈', name: 'balloons',    bg: '#F3E6FF', tray: '#D9C2FF', accent: C.purpleDeep },
  { emoji: '🐟', name: 'fish',        bg: '#DAF4FF', tray: '#A8E0F2', accent: C.blue },
  { emoji: '🦋', name: 'butterflies', bg: '#FCE6FF', tray: '#F0BEFF', accent: C.purple },
  { emoji: '🌸', name: 'flowers',     bg: '#FFE6F4', tray: '#FFC2DD', accent: '#EC4899' },
  { emoji: '🍪', name: 'cookies',     bg: '#FBEBD3', tray: '#E5C18E', accent: '#A0522D' },
  { emoji: '🐝', name: 'bees',        bg: '#FFF6CC', tray: '#FFE066', accent: '#D69E00' },
];

function shuffle<T>(a: T[]): T[] { return [...a].sort(() => Math.random() - 0.5); }

function buildRound(prevTarget?: number): { target: number; theme: Theme; total: number; options: number[] } {
  const target = (() => {
    let n = 0;
    do { n = 1 + Math.floor(Math.random() * 9); } while (n === prevTarget);
    return n;
  })();
  // Show 1–2 extra items so kids must actually count, not pick all
  const total = Math.min(10, target + 1 + Math.floor(Math.random() * 2));
  const theme = THEMES[Math.floor(Math.random() * THEMES.length)];

  // Build distractor options around the target
  const wrongPool = [target - 2, target - 1, target + 1, target + 2].filter(n => n >= 1 && n <= 10 && n !== target);
  const wrongs = shuffle(wrongPool).slice(0, 3);
  return { target, theme, total, options: shuffle([target, ...wrongs]) };
}

// ─── Confetti particle ──────────────────────────────────────────────────────

function Particle({ color, x, y }: { color: string; x: number; y: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 1100, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, []);
  const tx = anim.interpolate({ inputRange: [0, 1], outputRange: [0, (Math.random() - 0.5) * 280] });
  const ty = anim.interpolate({ inputRange: [0, 1], outputRange: [0, (Math.random() - 0.5) * 320] });
  const rot = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${Math.random() * 540}deg`] });
  const op = anim.interpolate({ inputRange: [0, 0.85, 1], outputRange: [1, 1, 0] });
  const sc = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.3] });
  return (
    <Animated.View style={[pp.dot, {
      backgroundColor: color, left: x, top: y,
      transform: [{ translateX: tx }, { translateY: ty }, { rotate: rot }, { scale: sc }],
      opacity: op,
    }]} />
  );
}
const pp = StyleSheet.create({
  dot: { position: 'absolute', width: 12, height: 12, borderRadius: 3, zIndex: 200 },
});

// ─── Tappable item ──────────────────────────────────────────────────────────

function CountItem({ emoji, picked, onPress, phase }: {
  emoji: string; picked: boolean; onPress: () => void; phase: number;
}) {
  const float = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.4)).current;
  const tap   = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: 1, tension: 100, friction: 7, delay: phase * 60, useNativeDriver: true }).start();

    const loop = Animated.loop(Animated.sequence([
      Animated.timing(float, { toValue: -6, duration: 1400 + phase * 80, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(float, { toValue: 0,  duration: 1400 + phase * 80, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, []);

  useEffect(() => {
    if (picked) {
      Animated.sequence([
        Animated.spring(tap, { toValue: 1.25, tension: 220, friction: 5, useNativeDriver: true }),
        Animated.spring(tap, { toValue: 1.05, tension: 220, friction: 7, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.spring(tap, { toValue: 1, tension: 220, friction: 7, useNativeDriver: true }).start();
    }
  }, [picked]);

  return (
    <Pressable onPress={onPress} hitSlop={8}>
      <Animated.View style={[ci.wrap, picked && ci.wrapPicked, {
        transform: [{ translateY: float }, { scale: Animated.multiply(scale, tap) }],
      }]}>
        <Text style={ci.emoji}>{emoji}</Text>
        {picked && (
          <View style={ci.badge}><Text style={ci.badgeT}>✓</Text></View>
        )}
      </Animated.View>
    </Pressable>
  );
}
const ci = StyleSheet.create({
  wrap: {
    width: 64, height: 64, borderRadius: 32,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff', margin: 6,
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 4,
    borderWidth: 3, borderColor: 'rgba(0,0,0,0.08)',
  },
  wrapPicked: { backgroundColor: '#C8F5C2', borderColor: '#2E7D32' },
  emoji: { fontSize: 38 },
  badge: {
    position: 'absolute', top: -6, right: -6,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#2E7D32', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#fff',
  },
  badgeT: { color: '#fff', fontWeight: '900', fontSize: 12 },
});

// ─── Screen ─────────────────────────────────────────────────────────────────

export default function NumbersScreen({ navigation }: ScreenProps<'Numbers'>) {
  const { completeNumber, addStars, playGame } = useProgress();

  const [round, setRound]     = useState(1);
  const [data,  setData]      = useState(() => buildRound());
  const [picked, setPicked]   = useState<Set<number>>(new Set());
  const [choice, setChoice]   = useState<number | null>(null);
  const [score,  setScore]    = useState(0);
  const [particles, setParticles] = useState<{ id: number; color: string; x: number; y: number }[]>([]);
  const [showWin, setShowWin] = useState(false);

  const counterScale = useRef(new Animated.Value(1)).current;
  const promptSlide  = useRef(new Animated.Value(40)).current;
  const promptOp     = useRef(new Animated.Value(0)).current;
  const trayShake    = useRef(new Animated.Value(0)).current;

  const matchesTarget = picked.size === data.target;

  const speakPrompt = useCallback((t: typeof data) => {
    Speech.stop();
    Speech.speak(`Tap ${t.target} ${t.theme.name}!`, { rate: 0.9, pitch: 1.15 });
  }, []);

  useEffect(() => {
    promptSlide.setValue(40);
    promptOp.setValue(0);
    Animated.parallel([
      Animated.spring(promptSlide, { toValue: 0, tension: 80, friction: 9, useNativeDriver: true }),
      Animated.timing(promptOp,    { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
    speakPrompt(data);
  }, [round]);

  useEffect(() => {
    Animated.sequence([
      Animated.spring(counterScale, { toValue: 1.18, tension: 240, friction: 5, useNativeDriver: true }),
      Animated.spring(counterScale, { toValue: 1,    tension: 240, friction: 7, useNativeDriver: true }),
    ]).start();
  }, [picked.size]);

  const toggle = (i: number) => {
    if (showWin || choice !== null) return;
    const s = new Set(picked);
    if (s.has(i)) s.delete(i); else s.add(i);
    setPicked(s);
  };

  const triggerConfetti = (color: string) => {
    setParticles(Array.from({ length: 22 }).map((_, i) => ({
      id: Date.now() + i,
      color: ['#FFD93D', '#FF6B6B', '#4ECDC4', '#A78BFA', '#7BE0AD', color][i % 6],
      x: SW / 2 + (Math.random() - 0.5) * 60,
      y: SH * 0.45,
    })));
  };

  const pickChoice = async (n: number) => {
    if (choice !== null) return;
    setChoice(n);

    if (n === data.target && matchesTarget) {
      setShowWin(true);
      setScore(v => v + 1);
      triggerConfetti(data.theme.accent);
      Speech.stop();
      Speech.speak(`Yes! ${data.target} ${data.theme.name}!`, { rate: 1.0, pitch: 1.15 });
      await completeNumber(data.target);

      setTimeout(() => {
        if (round >= TOTAL_ROUNDS) {
          addStars(3);
          playGame('Numbers');
          navigation.replace('Reward', { from: 'Numbers', stars: 3 });
        } else {
          setRound(r => r + 1);
          setData(buildRound(data.target));
          setPicked(new Set());
          setChoice(null);
          setShowWin(false);
          setParticles([]);
        }
      }, 2200);
    } else {
      // Wrong: shake the tray
      Animated.sequence([
        Animated.timing(trayShake, { toValue: 12,  duration: 60, useNativeDriver: true }),
        Animated.timing(trayShake, { toValue: -12, duration: 60, useNativeDriver: true }),
        Animated.timing(trayShake, { toValue: 8,   duration: 60, useNativeDriver: true }),
        Animated.timing(trayShake, { toValue: 0,   duration: 60, useNativeDriver: true }),
      ]).start();
      Speech.stop();
      const hint = matchesTarget
        ? `Wrong number. You tapped ${picked.size}.`
        : `Count again! You tapped ${picked.size}.`;
      Speech.speak(hint, { rate: 1.0, pitch: 1.05 });

      setTimeout(() => setChoice(null), 1300);
    }
  };

  const replayPrompt = () => speakPrompt(data);

  return (
    <PhoneSafe bg={data.theme.bg}>
      <GameHeader
        onBack={() => navigation.goBack()}
        title="Counting Fun! 🔢"
        score={score}
        scoreBg={data.theme.accent}
        scoreTextColor="#fff"
      />

      {/* Round indicator */}
      <View style={s.roundRow}>
        <View style={s.roundPill}><Text style={s.roundT}>Round {round} / {TOTAL_ROUNDS}</Text></View>
      </View>

      {/* Prompt + counter */}
      <Animated.View style={[s.promptCard, { opacity: promptOp, transform: [{ translateY: promptSlide }] }]}>
        <Pressable onPress={replayPrompt} style={s.promptBubble}>
          <Text style={s.promptT}>Tap </Text>
          <View style={[s.targetBubble, { backgroundColor: data.theme.accent }]}>
            <Text style={s.targetT}>{data.target}</Text>
          </View>
          <Text style={s.promptT}> {data.theme.emoji}</Text>
          <Text style={s.replayT}>  🔊</Text>
        </Pressable>
        <View style={s.counterRow}>
          <Text style={s.counterLabel}>You tapped:</Text>
          <Animated.View style={[
            s.counterDot,
            { backgroundColor: matchesTarget ? '#7BE0AD' : '#fff', borderColor: matchesTarget ? '#2E7D32' : C.ink },
            { transform: [{ scale: counterScale }] },
          ]}>
            <Text style={[s.counterT, matchesTarget && { color: '#2E7D32' }]}>{picked.size}</Text>
          </Animated.View>
        </View>
      </Animated.View>

      {/* Item tray */}
      <Animated.View style={[s.tray, { backgroundColor: data.theme.tray, transform: [{ translateX: trayShake }] }]}>
        {Array.from({ length: data.total }).map((_, i) => (
          <CountItem
            key={`${round}-${i}`}
            emoji={data.theme.emoji}
            picked={picked.has(i)}
            onPress={() => toggle(i)}
            phase={i}
          />
        ))}
      </Animated.View>

      {/* Question */}
      <Text style={s.q}>How many did you tap?</Text>
      <View style={s.choices}>
        {data.options.map(n => {
          const isPicked  = choice === n;
          const isCorrect = isPicked && n === data.target && matchesTarget;
          const isWrong   = isPicked && !isCorrect;
          const bg = isCorrect ? '#7BE0AD' : isWrong ? C.coral : '#fff';
          const fg = isCorrect || isWrong ? '#fff' : C.ink;
          return (
            <Pressable key={n} onPress={() => pickChoice(n)} disabled={choice !== null}
              style={[s.chip, { backgroundColor: bg, borderColor: isCorrect ? '#2E7D32' : isWrong ? C.coralDeep : C.ink }]}>
              <Text style={[s.chipT, { color: fg }]}>{n}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Win banner */}
      {showWin && (
        <View style={s.winBanner} pointerEvents="none">
          <Text style={s.winBannerT}>🎉 {data.target} {data.theme.emoji}!</Text>
        </View>
      )}

      {/* Confetti */}
      {particles.map(p => (
        <Particle key={p.id} color={p.color} x={p.x} y={p.y} />
      ))}
    </PhoneSafe>
  );
}

const s = StyleSheet.create({
  roundRow:   { alignItems: 'center', marginTop: -4, marginBottom: 4 },
  roundPill:  { backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20, elevation: 3 },
  roundT:     { fontWeight: '900', fontSize: 13, color: C.ink },

  promptCard:   { marginHorizontal: 16, marginTop: 8, backgroundColor: '#fff', borderRadius: 26, padding: 16, alignItems: 'center', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6 },
  promptBubble: { flexDirection: 'row', alignItems: 'center' },
  promptT:      { fontSize: 26, fontWeight: '900', color: C.ink },
  targetBubble: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginHorizontal: 6, elevation: 4 },
  targetT:      { color: '#fff', fontSize: 28, fontWeight: '900' },
  replayT:      { fontSize: 18, opacity: 0.7 },

  counterRow:   { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 10 },
  counterLabel: { fontSize: 15, fontWeight: '700', color: C.inkSoft },
  counterDot:   { minWidth: 50, height: 40, borderRadius: 20, paddingHorizontal: 10, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  counterT:     { fontSize: 22, fontWeight: '900', color: C.ink },

  tray:         { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', marginHorizontal: 16, marginTop: 14, padding: 14, borderRadius: 28, borderWidth: 3, borderColor: 'rgba(0,0,0,0.1)', minHeight: 180 },

  q:            { textAlign: 'center', fontWeight: '900', fontSize: 18, color: C.ink, marginTop: 16 },
  choices:      { flexDirection: 'row', justifyContent: 'center', gap: 10, paddingHorizontal: 14, paddingTop: 10, paddingBottom: 16 },
  chip:         { width: 64, height: 64, borderRadius: 22, borderWidth: 3, alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.12, shadowRadius: 4 },
  chipT:        { fontSize: 28, fontWeight: '900' },

  winBanner:    { position: 'absolute', top: '40%', left: 0, right: 0, alignItems: 'center', zIndex: 99 },
  winBannerT:   { fontSize: 36, fontWeight: '900', color: C.ink, backgroundColor: '#FFD93D', paddingHorizontal: 22, paddingVertical: 12, borderRadius: 24, elevation: 8, borderWidth: 4, borderColor: '#fff' },
});
