// src/screens/LetterBalloonPopScreen.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions, Easing } from 'react-native';
import * as Speech from 'expo-speech';
import PhoneSafe from '../components/PhoneSafe';
import GameHeader from '../components/GameHeader';
import { C } from '../theme';
import type { ScreenProps } from '../navigation/types';
import { useProgress } from '../store/ProgressStore';

const { width: SW, height: SH } = Dimensions.get('window');
const TOTAL = 200;
const BALLOON_COLORS = ['#FF5E5E', '#5E8BFF', '#5EE39F', '#FFB75E', '#BC5EFF', '#FF5EC1', '#FF9F5E', '#5EEBFF'];
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

function buildRound(prevTarget?: string): { target: string; letters: string[] } {
  const pool = LETTERS.filter(l => l !== prevTarget);
  const target = pool[Math.floor(Math.random() * pool.length)];
  const wrongs = shuffle(pool.filter(l => l !== target)).slice(0, 5);
  return { target, letters: shuffle([target, ...wrongs]) };
}

// ─── Cloud component ─────────────────────────────────────────────────────────

function Cloud({ top, delay }: { top: number; delay: number }) {
  const anim = useRef(new Animated.Value(-150)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(anim, {
        toValue: SW + 100,
        duration: 15000 + Math.random() * 5000,
        delay,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);
  return (
    <Animated.Text style={[s.cloud, { top, transform: [{ translateX: anim }] }]}>☁️</Animated.Text>
  );
}

// ─── Confetti component ──────────────────────────────────────────────────────

function Particle({ color, x, y }: { color: string; x: number; y: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, []);
  const tx = anim.interpolate({ inputRange: [0, 1], outputRange: [0, (Math.random() - 0.5) * 240] });
  const ty = anim.interpolate({ inputRange: [0, 1], outputRange: [0, (Math.random() - 0.5) * 260] });
  const rot = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${Math.random() * 540}deg`] });
  const op = anim.interpolate({ inputRange: [0, 0.85, 1], outputRange: [1, 1, 0] });
  const sc = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.3] });
  return (
    <Animated.View style={[s.particle, {
      backgroundColor: color, left: x, top: y,
      transform: [{ translateX: tx }, { translateY: ty }, { rotate: rot }, { scale: sc }],
      opacity: op,
    }]} />
  );
}

// ─── Balloon component ───────────────────────────────────────────────────────

type BState = 'idle' | 'wrong' | 'popped';

function Balloon({ letter, color, phase, state, onPress }: {
  letter: string; color: string; phase: number; state: BState; onPress: () => void;
}) {
  const floatY  = useRef(new Animated.Value(0)).current;
  const shake   = useRef(new Animated.Value(0)).current;
  const popSc   = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      const loop = Animated.loop(Animated.sequence([
        Animated.timing(floatY, { toValue: -18, duration: 1700 + phase * 600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(floatY, { toValue: 0,   duration: 1700 + phase * 600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]));
      loopRef.current = loop;
      loop.start();
    }, phase * 700);
    return () => { clearTimeout(t); loopRef.current?.stop(); };
  }, [phase]);

  useEffect(() => {
    if (state === 'wrong') {
      Animated.sequence([
        Animated.timing(shake, { toValue: 12,  duration: 50, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -12, duration: 50, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 8,   duration: 50, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0,   duration: 50, useNativeDriver: true }),
      ]).start();
    }
    if (state === 'popped') {
      loopRef.current?.stop();
      Animated.sequence([
        Animated.spring(popSc, { toValue: 1.4, friction: 3, useNativeDriver: true }),
        Animated.parallel([
          Animated.timing(popSc,   { toValue: 2.2, duration: 150, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0,   duration: 150, useNativeDriver: true }),
        ]),
      ]).start();
    }
  }, [state]);

  return (
    <Animated.View style={{ transform: [{ translateY: floatY }, { translateX: shake }, { scale: popSc }], opacity, alignItems: 'center' }}>
      <Pressable onPress={state === 'popped' ? undefined : onPress}
        style={[b.balloon, { backgroundColor: color }]}>
        <View style={b.highlight} />
        <Text style={b.letter}>{letter}</Text>
      </Pressable>
      <View style={[b.knot, { backgroundColor: color }]}/>
      <View style={b.string}/>
    </Animated.View>
  );
}
const b = StyleSheet.create({
  balloon:   { width: 92, height: 110, borderRadius: 50, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6 },
  highlight: { position: 'absolute', top: 10, left: 15, width: 20, height: 30, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.35)' },
  letter:    { fontSize: 42, fontWeight: '900', color: '#fff', textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  knot:      { width: 14, height: 10, borderRadius: 5, marginTop: -2, zIndex: -1 },
  string:    { width: 3, height: 36, opacity: 0.6, backgroundColor: '#555' },
});

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function LetterBalloonPopScreen({ navigation }: ScreenProps<'LetterBalloonPop'>) {
  const { addStars, playGame } = useProgress();
  const [roundIdx, setRoundIdx]     = useState(0);
  const [round,    setRound]        = useState(() => buildRound());
  const [states,   setStates]       = useState<BState[]>(() => round.letters.map(() => 'idle'));
  const [score,    setScore]        = useState(0);
  const [locked,   setLocked]       = useState(false);
  const [particles, setParticles]   = useState<{ id: number; color: string; x: number; y: number }[]>([]);
  const [phases,   setPhases]       = useState(() => round.letters.map(() => Math.random()));

  const targetPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.spring(targetPulse, { toValue: 1.15, tension: 150, friction: 5, useNativeDriver: true }),
      Animated.spring(targetPulse, { toValue: 1,    tension: 150, friction: 5, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [roundIdx]);

  useEffect(() => {
    Speech.stop();
    Speech.speak(`Pop the letter ${round.target}`, { rate: 0.9, pitch: 1.15 });
  }, [round.target]);

  const advance = useCallback(() => {
    if (roundIdx + 1 >= TOTAL) {
      addStars(3);
      playGame('LetterBalloonPop');
      navigation.replace('Reward', { from: 'LetterBalloonPop', stars: 3 });
      return;
    }
    const next = buildRound(round.target);
    setPhases(next.letters.map(() => Math.random()));
    setRoundIdx(i => i + 1);
    setRound(next);
    setStates(next.letters.map(() => 'idle'));
    setLocked(false);
    setParticles([]);
  }, [roundIdx, round.target, navigation, addStars, playGame]);

  const tap = useCallback((idx: number) => {
    if (locked || states[idx] !== 'idle') return;
    const letter = round.letters[idx];

    if (letter === round.target) {
      setLocked(true);
      setStates(prev => prev.map((s, i) => i === idx ? 'popped' : s) as BState[]);

      Speech.stop();
      Speech.speak(`Awesome! That is letter ${letter}.`, { rate: 1.0, pitch: 1.15 });

      const popX = (idx % 3) * (SW / 3.2) + 60;
      const popY = Math.floor(idx / 3) * 180 + 280;
      setParticles(Array.from({ length: 18 }).map((_, i) => ({
        id: Date.now() + i,
        color: BALLOON_COLORS[i % BALLOON_COLORS.length],
        x: popX,
        y: popY,
      })));

      setScore(v => v + 1);
      setTimeout(() => advance(), 1700);
    } else {
      setStates(prev => prev.map((s, i) => i === idx ? 'wrong' : s) as BState[]);
      Speech.stop();
      Speech.speak(`Oops! Not this one. Try again!`, { rate: 1.05, pitch: 1.1 });
      setTimeout(() => {
        setStates(prev => prev.map((s, i) => i === idx && s === 'wrong' ? 'idle' : s) as BState[]);
      }, 800);
    }
  }, [locked, states, round, advance]);

  return (
    <PhoneSafe bg="#87CEEB">
      {/* Background Clouds */}
      <Cloud top={80}  delay={0}    />
      <Cloud top={220} delay={5000} />
      <Cloud top={380} delay={2000} />

      <GameHeader
        onBack={() => navigation.goBack()}
        title="Letter Pop! 🎈"
        score={score}
        scoreBg="#FFEB3B"
      />

      <View style={s.targetArea}>
        <Text style={s.targetLbl}>Pop the letter</Text>
        <Animated.View style={[s.targetBadge, { transform: [{ scale: targetPulse }] }]}>
          <Text style={s.targetLetter}>{round.target}</Text>
        </Animated.View>
      </View>

      <View style={s.arena}>
        {[0, 1].map(ri => (
          <View key={ri} style={s.row}>
            {round.letters.slice(ri * 3, ri * 3 + 3).map((letter, ci) => {
              const fi = ri * 3 + ci;
              return (
                <Balloon
                  key={`${roundIdx}-${fi}`}
                  letter={letter}
                  color={BALLOON_COLORS[fi % BALLOON_COLORS.length]}
                  phase={phases[fi]}
                  state={states[fi]}
                  onPress={() => tap(fi)}
                />
              );
            })}
          </View>
        ))}
      </View>

      {/* Pop Particles */}
      {particles.map(p => (
        <Particle key={p.id} color={p.color} x={p.x} y={p.y} />
      ))}
    </PhoneSafe>
  );
}

const s = StyleSheet.create({
  targetArea:   { alignItems: 'center', marginTop: 8, gap: 8 },
  targetLbl:    { fontSize: 18, fontWeight: '900', color: '#fff', textShadowColor: 'rgba(0,0,0,0.25)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  targetBadge:  { width: 100, height: 100, borderRadius: 50, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 8, borderWidth: 5, borderColor: '#FFEB3B' },
  targetLetter: { fontSize: 56, fontWeight: '900', color: '#FF5252' },
  arena:        { flex: 1, justifyContent: 'center', paddingHorizontal: 10, paddingVertical: 20 },
  row:          { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', marginBottom: 40 },
  cloud:        { position: 'absolute', fontSize: 80, opacity: 0.6, zIndex: -1 },
  particle:     { position: 'absolute', width: 12, height: 12, borderRadius: 6, zIndex: 100 },
});
