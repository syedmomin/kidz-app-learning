// src/screens/BalloonPopScreen.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions } from 'react-native';
import PhoneSafe from '../components/PhoneSafe';
import { C } from '../theme';
import type { ScreenProps } from '../navigation/types';

const { width: SW } = Dimensions.get('window');
const TOTAL         = 30;
const BALLOON_COLORS = [C.coral, C.blue, C.mint, '#FF9F43', C.purple, '#F368E0'];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

function buildRound(prevTarget?: number): { target: number; numbers: number[] } {
  const pool   = Array.from({ length: 15 }, (_, i) => i + 1).filter(n => n !== prevTarget);
  const target = pool[Math.floor(Math.random() * pool.length)];
  const wrongs = shuffle(pool.filter(n => n !== target)).slice(0, 5);
  return { target, numbers: shuffle([target, ...wrongs]) };
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
        Animated.timing(floatY, { toValue: -14, duration: 1400, useNativeDriver: true }),
        Animated.timing(floatY, { toValue: 0,   duration: 1400, useNativeDriver: true }),
      ]));
      loopRef.current = loop;
      loop.start();
    }, phase * 1400);
    return () => { clearTimeout(t); loopRef.current?.stop(); };
  }, []);

  useEffect(() => {
    if (state === 'wrong') {
      loopRef.current?.stop();
      Animated.sequence([
        Animated.timing(shake, { toValue: 10,  duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -10, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 8,   duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0,   duration: 60, useNativeDriver: true }),
      ]).start(() => {
        const loop = Animated.loop(Animated.sequence([
          Animated.timing(floatY, { toValue: -14, duration: 1400, useNativeDriver: true }),
          Animated.timing(floatY, { toValue: 0,   duration: 1400, useNativeDriver: true }),
        ]));
        loopRef.current = loop;
        loop.start();
      });
    }
    if (state === 'popped') {
      loopRef.current?.stop();
      Animated.sequence([
        Animated.spring(popSc, { toValue: 1.5, tension: 200, friction: 4, useNativeDriver: true }),
        Animated.parallel([
          Animated.timing(popSc,   { toValue: 0, duration: 180, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }),
        ]),
      ]).start();
    }
  }, [state]);

  return (
    <Animated.View style={{ transform: [{ translateY: floatY }, { translateX: shake }, { scale: popSc }], opacity, alignItems: 'center' }}>
      <Pressable onPress={state === 'popped' ? undefined : onPress}
        style={[b.balloon, { backgroundColor: state === 'wrong' ? '#FFB8B8' : color, borderColor: state === 'wrong' ? C.coralDeep : C.ink }]}>
        <Text style={b.numT}>{number}</Text>
        {state === 'wrong' && <Text style={b.wrongMark}>✗</Text>}
      </Pressable>
      <View style={[b.knot, { backgroundColor: state === 'wrong' ? C.coralDeep : C.ink }]}/>
      <View style={[b.string, { backgroundColor: state === 'wrong' ? C.coralDeep : C.ink }]}/>
    </Animated.View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function BalloonPopScreen({ navigation }: ScreenProps<'BalloonPop'>) {
  const first                           = buildRound();
  const [roundIdx, setRoundIdx]         = useState(0);
  const [round,    setRound]            = useState(first);
  const [states,   setStates]           = useState<BState[]>(first.numbers.map(() => 'idle'));
  const [score,    setScore]            = useState(0);
  const [message,  setMessage]          = useState('');
  const [locked,   setLocked]           = useState(false);
  const phases     = useRef(first.numbers.map(() => Math.random())).current;
  const targetPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.spring(targetPulse, { toValue: 1.12, tension: 180, friction: 6, useNativeDriver: true }),
      Animated.spring(targetPulse, { toValue: 1,    tension: 180, friction: 6, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [roundIdx]);

  const advance = useCallback((ns: number) => {
    if (roundIdx + 1 >= TOTAL) {
      navigation.navigate('Reward', { from: 'BalloonPop', stars: ns >= 25 ? 3 : ns >= 18 ? 2 : 1 });
      return;
    }
    const next = buildRound(round.target);
    phases.length = 0;
    next.numbers.forEach(() => phases.push(Math.random()));
    setRoundIdx(i => i + 1);
    setRound(next);
    setStates(next.numbers.map(() => 'idle'));
    setMessage('');
    setLocked(false);
  }, [roundIdx, round.target, navigation]);

  const tap = useCallback((idx: number) => {
    if (locked) return;
    if (states[idx] !== 'idle') return;
    const num = round.numbers[idx];

    if (num === round.target) {
      setLocked(true);
      setStates(prev => prev.map((s, i) => i === idx ? 'popped' : s) as BState[]);
      setMessage('🎉 Pop! Great job!');
      setScore(s => {
        const ns = s + 1;
        setTimeout(() => advance(ns), 1200);
        return ns;
      });
    } else {
      setStates(prev => prev.map((s, i) => i === idx ? 'wrong' : s) as BState[]);
      setMessage('❌ Wrong! Keep looking…');
      setTimeout(() => {
        setStates(prev => prev.map((s, i) => i === idx && s === 'wrong' ? 'idle' : s) as BState[]);
        setMessage('');
      }, 1000);
    }
  }, [locked, states, round, advance]);

  const rows      = [round.numbers.slice(0, 3), round.numbers.slice(3, 6)];
  const stateRows = [states.slice(0, 3), states.slice(3, 6)];
  const phaseRows = [phases.slice(0, 3), phases.slice(3, 6)];

  return (
    <PhoneSafe bg="#E0EEFF">
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}><Text style={s.backT}>←</Text></Pressable>
        <Text style={s.title}>Balloon Pop 🎈</Text>
        <View style={s.scorePill}><Text style={s.scoreT}>⭐ {score}</Text></View>
      </View>

      <View style={s.progressBar}>
        <View style={[s.progressFill, { width: `${(roundIdx / TOTAL) * 100}%` }]}/>
      </View>

      <View style={s.targetArea}>
        <Text style={s.targetLbl}>Find and pop the number</Text>
        <Animated.View style={[s.targetBadge, { transform: [{ scale: targetPulse }] }]}>
          <Text style={s.targetNum}>{round.target}</Text>
        </Animated.View>
      </View>

      <Text style={[s.message, { color: message.startsWith('🎉') ? C.mintDeep : C.coralDeep, opacity: message ? 1 : 0 }]}>
        {message || ' '}
      </Text>

      <View style={s.arena}>
        {rows.map((row, ri) => (
          <View key={ri} style={s.row}>
            {row.map((num, ci) => {
              const fi = ri * 3 + ci;
              return (
                <Balloon key={`${roundIdx}-${fi}`} number={num}
                  color={BALLOON_COLORS[fi % BALLOON_COLORS.length]}
                  phase={phaseRows[ri][ci]} state={stateRows[ri][ci]}
                  onPress={() => tap(fi)}/>
              );
            })}
          </View>
        ))}
      </View>
    </PhoneSafe>
  );
}

const b = StyleSheet.create({
  balloon:   { width: 90, height: 105, borderRadius: 45, borderWidth: 3.5, alignItems: 'center', justifyContent: 'center' },
  numT:      { fontSize: 34, fontWeight: '900', color: '#fff', textShadowColor: 'rgba(0,0,0,0.25)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  wrongMark: { position: 'absolute', bottom: 8, fontSize: 16, fontWeight: '900', color: C.coralDeep },
  knot:      { width: 10, height: 10, borderRadius: 5, marginTop: 2 },
  string:    { width: 2, height: 20 },
});

const s = StyleSheet.create({
  header:       { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  back:         { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', borderWidth: 3, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  backT:        { fontSize: 20, fontWeight: '900', color: C.ink },
  title:        { flex: 1, textAlign: 'center', fontWeight: '900', fontSize: 20, color: C.ink },
  scorePill:    { backgroundColor: C.yellow, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 3, borderColor: C.ink },
  scoreT:       { fontWeight: '900', fontSize: 13, color: C.ink },
  progressBar:  { height: 12, marginHorizontal: 20, backgroundColor: '#fff', borderRadius: 7, borderWidth: 3, borderColor: C.ink, overflow: 'hidden', marginBottom: 4 },
  progressFill: { height: '100%', backgroundColor: C.coral, borderRadius: 5 },
  targetArea:   { alignItems: 'center', marginTop: 12, gap: 8 },
  targetLbl:    { fontSize: 17, fontWeight: '800', color: C.ink },
  targetBadge:  { width: 86, height: 86, borderRadius: 43, backgroundColor: C.yellow, borderWidth: 4, borderColor: C.ink, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 5 },
  targetNum:    { fontSize: 42, fontWeight: '900', color: C.ink },
  message:      { textAlign: 'center', fontSize: 17, fontWeight: '900', marginTop: 8, minHeight: 26 },
  arena:        { flex: 1, justifyContent: 'space-evenly', paddingHorizontal: 10, paddingVertical: 12 },
  row:          { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' },
});
