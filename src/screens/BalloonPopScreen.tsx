// src/screens/BalloonPopScreen.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable,
  Animated, Dimensions,
} from 'react-native';
import PhoneSafe from '../components/PhoneSafe';
import { C } from '../theme';
import type { ScreenProps } from '../navigation/types';

const { width: SW } = Dimensions.get('window');
const TOTAL_ROUNDS    = 8;
const BALLOON_COLORS  = [C.coral, C.blue, C.mint, '#FF9F43', C.purple, '#F368E0'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Guarantee target is always in the list, all numbers are unique 1-15
function buildRound(prevTarget?: number): { target: number; numbers: number[] } {
  const pool    = Array.from({ length: 15 }, (_, i) => i + 1).filter(n => n !== prevTarget);
  const target  = pool[Math.floor(Math.random() * pool.length)];
  const wrongs  = shuffle(pool.filter(n => n !== target)).slice(0, 5);
  return { target, numbers: shuffle([target, ...wrongs]) };
}

// ─── One Balloon ──────────────────────────────────────────────────────────────

type BalloonState = 'idle' | 'wrong' | 'popped';

interface BalloonProps {
  number:    number;
  color:     string;
  phase:     number;   // 0-1 float phase offset
  state:     BalloonState;
  onPress:   () => void;
}

function Balloon({ number, color, phase, state, onPress }: BalloonProps) {
  const floatY  = useRef(new Animated.Value(0)).current;
  const shake   = useRef(new Animated.Value(0)).current;
  const popSc   = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  // Individual float loop with phase offset
  useEffect(() => {
    const delay = phase * 1400;
    const timer = setTimeout(() => {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(floatY, { toValue: -14, duration: 1400, useNativeDriver: true }),
          Animated.timing(floatY, { toValue: 0,   duration: 1400, useNativeDriver: true }),
        ])
      );
      loopRef.current = loop;
      loop.start();
    }, delay);
    return () => {
      clearTimeout(timer);
      loopRef.current?.stop();
    };
  }, []);

  // React to state changes
  useEffect(() => {
    if (state === 'wrong') {
      loopRef.current?.stop();
      Animated.sequence([
        Animated.timing(shake, { toValue: 10,  duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -10, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 8,   duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -8,  duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0,   duration: 60, useNativeDriver: true }),
      ]).start(() => {
        // resume float after shake
        const loop = Animated.loop(
          Animated.sequence([
            Animated.timing(floatY, { toValue: -14, duration: 1400, useNativeDriver: true }),
            Animated.timing(floatY, { toValue: 0,   duration: 1400, useNativeDriver: true }),
          ])
        );
        loopRef.current = loop;
        loop.start();
      });
    }
    if (state === 'popped') {
      loopRef.current?.stop();
      Animated.sequence([
        Animated.spring(popSc,   { toValue: 1.5, tension: 200, friction: 4, useNativeDriver: true }),
        Animated.parallel([
          Animated.timing(popSc,   { toValue: 0,   duration: 180, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0,   duration: 180, useNativeDriver: true }),
        ]),
      ]).start();
    }
  }, [state]);

  const wrongBorder = state === 'wrong' ? C.coralDeep : C.ink;
  const bg          = state === 'wrong' ? '#FFB8B8'   : color;

  return (
    <Animated.View style={{
      transform: [{ translateY: floatY }, { translateX: shake }, { scale: popSc }],
      opacity,
      alignItems: 'center',
    }}>
      <Pressable
        onPress={state === 'popped' ? undefined : onPress}
        style={[b.balloon, { backgroundColor: bg, borderColor: wrongBorder }]}
      >
        <Text style={b.numT}>{number}</Text>
        {state === 'wrong' && <Text style={b.wrongMark}>✗</Text>}
      </Pressable>
      <View style={[b.knot, { backgroundColor: wrongBorder }]}/>
      <View style={[b.string, { backgroundColor: wrongBorder }]}/>
    </Animated.View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function BalloonPopScreen({ navigation }: ScreenProps<'BalloonPop'>) {
  const firstRound                      = buildRound();
  const [roundIdx, setRoundIdx]         = useState(0);
  const [round,    setRound]            = useState(firstRound);
  const [states,   setStates]           = useState<BalloonState[]>(firstRound.numbers.map(() => 'idle'));
  const [score,    setScore]            = useState(0);
  const [message,  setMessage]          = useState('');
  const [locked,   setLocked]           = useState(false);
  const phases = useRef(firstRound.numbers.map(() => Math.random())).current;

  const targetPulse = useRef(new Animated.Value(1)).current;

  // Pulse the target number badge
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.spring(targetPulse, { toValue: 1.12, tension: 180, friction: 6, useNativeDriver: true }),
        Animated.spring(targetPulse, { toValue: 1,    tension: 180, friction: 6, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [roundIdx]);

  const nextRound = useCallback((newScore: number) => {
    if (roundIdx + 1 >= TOTAL_ROUNDS) {
      navigation.navigate('Reward', {
        from:  'BalloonPop',
        stars: newScore >= 7 ? 3 : newScore >= 5 ? 2 : 1,
      });
      return;
    }
    const next   = buildRound(round.target);
    const newPhases = next.numbers.map(() => Math.random());
    phases.length = 0;
    newPhases.forEach(p => phases.push(p));
    setRoundIdx(i => i + 1);
    setRound(next);
    setStates(next.numbers.map(() => 'idle'));
    setMessage('');
    setLocked(false);
  }, [roundIdx, round.target, navigation]);

  const tap = useCallback((idx: number) => {
    if (locked) return;
    if (states[idx] === 'wrong' || states[idx] === 'popped') return;

    const num = round.numbers[idx];

    if (num === round.target) {
      // Correct!
      setLocked(true);
      const next = states.map((s, i) => i === idx ? 'popped' : s) as BalloonState[];
      setStates(next);
      setScore(s => {
        const ns = s + 1;
        setMessage('🎉 Pop! Great job!');
        setTimeout(() => nextRound(ns), 1200);
        return ns;
      });
    } else {
      // Wrong — shake this balloon, keep others tappable
      setStates(prev => prev.map((s, i) => i === idx ? 'wrong' : s) as BalloonState[]);
      setMessage('❌ Wrong! Keep looking…');
      // Reset wrong state after shake so balloon returns to idle (still tappable)
      setTimeout(() => {
        setStates(prev => prev.map((s, i) => i === idx && s === 'wrong' ? 'idle' : s) as BalloonState[]);
        setMessage('');
      }, 1000);
    }
  }, [locked, states, round, nextRound]);

  const rows = [
    round.numbers.slice(0, 3),
    round.numbers.slice(3, 6),
  ];
  const stateRows = [states.slice(0, 3), states.slice(3, 6)];
  const phaseRows = [phases.slice(0, 3), phases.slice(3, 6)];

  return (
    <PhoneSafe bg="#E0EEFF">
      {/* Header */}
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}>
          <Text style={s.backT}>←</Text>
        </Pressable>
        <Text style={s.title}>Balloon Pop 🎈</Text>
        <View style={s.scorePill}>
          <Text style={s.scoreT}>⭐ {score}</Text>
        </View>
      </View>

      {/* Progress */}
      <View style={s.progressBar}>
        <View style={[s.progressFill, { width: `${(roundIdx / TOTAL_ROUNDS) * 100}%` }]}/>
      </View>
      <Text style={s.progressLbl}>{roundIdx + 1} / {TOTAL_ROUNDS}</Text>

      {/* Target */}
      <View style={s.targetArea}>
        <Text style={s.targetLbl}>Find and pop the number</Text>
        <Animated.View style={[s.targetBadge, { transform: [{ scale: targetPulse }] }]}>
          <Text style={s.targetNum}>{round.target}</Text>
        </Animated.View>
      </View>

      {/* Feedback */}
      <Text style={[s.message, {
        color: message.startsWith('🎉') ? C.mintDeep : C.coralDeep,
        opacity: message ? 1 : 0,
      }]}>{message || ' '}</Text>

      {/* Balloons */}
      <View style={s.arena}>
        {rows.map((row, ri) => (
          <View key={ri} style={s.row}>
            {row.map((num, ci) => {
              const flatIdx = ri * 3 + ci;
              return (
                <Balloon
                  key={`${roundIdx}-${flatIdx}`}
                  number={num}
                  color={BALLOON_COLORS[flatIdx % BALLOON_COLORS.length]}
                  phase={phaseRows[ri][ci]}
                  state={stateRows[ri][ci]}
                  onPress={() => tap(flatIdx)}
                />
              );
            })}
          </View>
        ))}
      </View>
    </PhoneSafe>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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
  progressBar:  { height: 12, marginHorizontal: 20, backgroundColor: '#fff', borderRadius: 7, borderWidth: 3, borderColor: C.ink, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: C.coral, borderRadius: 5 },
  progressLbl:  { textAlign: 'center', fontSize: 12, fontWeight: '800', color: C.inkSoft, marginTop: 3 },
  targetArea:   { alignItems: 'center', marginTop: 14, gap: 8 },
  targetLbl:    { fontSize: 17, fontWeight: '800', color: C.ink },
  targetBadge:  { width: 88, height: 88, borderRadius: 44, backgroundColor: C.yellow, borderWidth: 4, borderColor: C.ink, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 5 },
  targetNum:    { fontSize: 44, fontWeight: '900', color: C.ink },
  message:      { textAlign: 'center', fontSize: 17, fontWeight: '900', marginTop: 8, minHeight: 26 },
  arena:        { flex: 1, justifyContent: 'space-evenly', paddingHorizontal: 10, paddingVertical: 16 },
  row:          { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' },
});
