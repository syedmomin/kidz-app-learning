// src/screens/BalloonPopScreen.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions, Easing } from 'react-native';
import * as Speech from 'expo-speech';
import PhoneSafe from '../components/PhoneSafe';
import { C } from '../theme';
import { useAudio } from '../hooks/useAudio';
import type { ScreenProps } from '../navigation/types';

const { width: SW, height: SH } = Dimensions.get('window');
const TOTAL         = 50; // Increased to 50 levels
const BALLOON_COLORS = ['#FF5E5E', '#5E8BFF', '#5EE39F', '#FFB75E', '#BC5EFF', '#FF5EC1', '#FF9F5E', '#5EEBFF'];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

function buildRound(prevTarget?: number): { target: number; numbers: number[] } {
  const pool   = Array.from({ length: 15 }, (_, i) => i + 1).filter(n => n !== prevTarget);
  const target = pool[Math.floor(Math.random() * pool.length)];
  const wrongs = shuffle(pool.filter(n => n !== target)).slice(0, 5);
  return { target, numbers: shuffle([target, ...wrongs]) };
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
    Animated.timing(anim, { toValue: 1, duration: 800, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, []);

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [0, (Math.random() - 0.5) * 200] });
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, (Math.random() - 0.5) * 200] });
  const rotate     = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${Math.random() * 360}deg`] });
  const opacity    = anim.interpolate({ inputRange: [0, 0.8, 1], outputRange: [1, 1, 0] });
  const scale      = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.2] });

  return (
    <Animated.View style={[s.particle, { 
      backgroundColor: color, 
      left: x, top: y,
      transform: [{ translateX }, { translateY }, { rotate }, { scale }],
      opacity 
    }]} />
  );
}

// ─── Balloon component ────────────────────────────────────────────────────────

type BState = 'idle' | 'wrong' | 'popped';

function Balloon({ number, color, phase, state, onPress }: {
  number: number; color: string; phase: number; state: BState; onPress: () => void;
}) {
  const floatY  = useRef(new Animated.Value(0)).current;
  const shake   = useRef(new Animated.Value(0)).current;
  const popSc   = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      const loop = Animated.loop(Animated.sequence([
        Animated.timing(floatY, { toValue: -20, duration: 1800 + phase * 600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(floatY, { toValue: 0,   duration: 1800 + phase * 600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]));
      loopRef.current = loop;
      loop.start();
    }, phase * 1000);
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
          Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true }),
        ]),
      ]).start();
    }
  }, [state]);

  return (
    <Animated.View style={{ transform: [{ translateY: floatY }, { translateX: shake }, { scale: popSc }], opacity, alignItems: 'center' }}>
      <Pressable onPress={state === 'popped' ? undefined : onPress}
        style={[b.balloon, { backgroundColor: color, borderColor: '#00000022' }]}>
        <View style={b.highlight} />
        <Text style={b.numT}>{number}</Text>
      </Pressable>
      <View style={[b.knot, { backgroundColor: color }]}/>
      <View style={[b.string, { backgroundColor: '#555' }]}/>
    </Animated.View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function BalloonPopScreen({ navigation }: ScreenProps<'BalloonPop'>) {
  const { playSound } = useAudio();
  const [roundIdx, setRoundIdx]         = useState(0);
  const [round,    setRound]            = useState(() => buildRound());
  const [states,   setStates]           = useState<BState[]>(() => round.numbers.map(() => 'idle'));
  const [score,    setScore]            = useState(0);
  const [locked,   setLocked]           = useState(false);
  const [particles, setParticles]       = useState<{id: number, color: string, x: number, y: number}[]>([]);
  const [phases,   setPhases]           = useState(() => round.numbers.map(() => Math.random()));
  
  const targetPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.spring(targetPulse, { toValue: 1.2, tension: 150, friction: 5, useNativeDriver: true }),
      Animated.spring(targetPulse, { toValue: 1,    tension: 150, friction: 5, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [roundIdx]);

  useEffect(() => {
    Speech.stop();
    Speech.speak(`Find number ${round.target}`, { rate: 0.9, pitch: 1.1 });
  }, [round.target]);

  const advance = useCallback((ns: number) => {
    if (roundIdx + 1 >= TOTAL) {
      navigation.navigate('Reward', { from: 'BalloonPop', stars: 3 });
      return;
    }
    const next = buildRound(round.target);
    setPhases(next.numbers.map(() => Math.random()));
    setRoundIdx(i => i + 1);
    setRound(next);
    setStates(next.numbers.map(() => 'idle'));
    setLocked(false);
    setParticles([]);
  }, [roundIdx, round.target, navigation]);

  const tap = useCallback((idx: number) => {
    if (locked) return;
    if (states[idx] !== 'idle') return;
    const num = round.numbers[idx];

    if (num === round.target) {
      setLocked(true);
      setStates(prev => prev.map((s, i) => i === idx ? 'popped' : s) as BState[]);
      
      // Detailed voice feedback as requested
      Speech.stop();
      Speech.speak(`Awesome! That is number ${num}.`, { rate: 1.1, pitch: 1.1 });

      const newParticles = Array.from({ length: 15 }).map((_, i) => ({
        id: Date.now() + i,
        color: BALLOON_COLORS[idx % BALLOON_COLORS.length],
        x: (idx % 3) * (SW / 3.5) + 50,
        y: Math.floor(idx / 3) * (SH / 5) + 200
      }));
      setParticles(newParticles);

      // Removed animal sounds, using voice only as requested
      
      setScore(s => {
        const ns = s + 1;
        setTimeout(() => advance(ns), 2000);
        return ns;
      });
    } else {
      setStates(prev => prev.map((s, i) => i === idx ? 'wrong' : s) as BState[]);
      Speech.stop();
      Speech.speak(`Oops! Not this one. Try again!`, { rate: 1.1 });
      setTimeout(() => {
        setStates(prev => prev.map((s, i) => i === idx && s === 'wrong' ? 'idle' : s) as BState[]);
      }, 800);
    }
  }, [locked, states, round, advance]);

  return (
    <PhoneSafe bg="#87CEEB">
      {/* Background Clouds */}
      <Cloud top={80} delay={0} />
      <Cloud top={220} delay={5000} />
      <Cloud top={380} delay={2000} />

      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}><Text style={s.backT}>←</Text></Pressable>
        <Text style={s.title}>Balloon Pop! 🎈</Text>
        <View style={s.scorePill}><Text style={s.scoreT}>⭐ {score}</Text></View>
      </View>

      {/* Progress Bar Removed as requested */}

      <View style={s.targetArea}>
        <Text style={s.targetLbl}>Pop the number</Text>
        <Animated.View style={[s.targetBadge, { transform: [{ scale: targetPulse }] }]}>
          <Text style={s.targetNum}>{round.target}</Text>
        </Animated.View>
      </View>

      <View style={s.arena}>
        {[0, 1].map((ri) => (
          <View key={ri} style={s.row}>
            {round.numbers.slice(ri * 3, ri * 3 + 3).map((num, ci) => {
              const fi = ri * 3 + ci;
              return (
                <Balloon key={`${roundIdx}-${fi}`} number={num}
                  color={BALLOON_COLORS[fi % BALLOON_COLORS.length]}
                  phase={phases[fi]} state={states[fi]}
                  onPress={() => tap(fi)}/>
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

const b = StyleSheet.create({
  balloon:   { width: 95, height: 115, borderRadius: 50, borderWidth: 0, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6 },
  highlight: { position: 'absolute', top: 10, left: 15, width: 20, height: 30, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.3)' },
  numT:      { fontSize: 38, fontWeight: '900', color: '#fff', textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  knot:      { width: 14, height: 10, borderRadius: 5, marginTop: -2, zIndex: -1 },
  string:    { width: 3, height: 40, opacity: 0.6 },
});

const s = StyleSheet.create({
  header:       { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10, zIndex: 10 },
  back:         { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', elevation: 4, alignItems: 'center', justifyContent: 'center' },
  backT:        { fontSize: 22, fontWeight: '900', color: C.ink },
  title:        { flex: 1, textAlign: 'center', fontWeight: '900', fontSize: 24, color: '#fff', textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  scorePill:    { backgroundColor: '#FFEB3B', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 6, elevation: 4 },
  scoreT:       { fontWeight: '900', fontSize: 16, color: C.ink },
  targetArea:   { alignItems: 'center', marginTop: 10, gap: 8 },
  targetLbl:    { fontSize: 18, fontWeight: '900', color: '#fff' },
  targetBadge:  { width: 100, height: 100, borderRadius: 50, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 8 },
  targetNum:    { fontSize: 50, fontWeight: '900', color: '#FF5252' },
  arena:        { flex: 1, justifyContent: 'center', paddingHorizontal: 10, paddingVertical: 20 },
  row:          { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', marginBottom: 40 },
  cloud:        { position: 'absolute', fontSize: 80, opacity: 0.6, zIndex: -1 },
  particle:     { position: 'absolute', width: 10, height: 10, borderRadius: 5, zIndex: 100 },
});


