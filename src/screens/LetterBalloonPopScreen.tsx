// src/screens/LetterBalloonPopScreen.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions, Easing } from 'react-native';
import * as Speech from 'expo-speech';
import PhoneSafe from '../components/PhoneSafe';
import { C } from '../theme';
import { useAudio } from '../hooks/useAudio';
import type { ScreenProps } from '../navigation/types';
import { useProgress } from '../store/ProgressStore';

const { width: SW, height: SH } = Dimensions.get('window');
const TOTAL = 10;
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
    Animated.timing(anim, { toValue: 1, duration: 800, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, []);

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [0, (Math.random() - 0.5) * 200] });
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, (Math.random() - 0.5) * 200] });
  const rotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${Math.random() * 360}deg`] });
  const opacity = anim.interpolate({ inputRange: [0, 0.8, 1], outputRange: [1, 1, 0] });
  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.2] });

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

function Balloon({ letter, color, phase, state, onPress }: {
  letter: string; color: string; phase: number; state: BState; onPress: () => void;
}) {
  const floatY = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;
  const popSc = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (state === 'popped') {
      Animated.parallel([
        Animated.timing(popSc, { toValue: 1.3, duration: 100, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true }),
      ]).start();
    } else if (state === 'wrong') {
      Animated.sequence([
        Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    } else {
      // Floating animation
      loopRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(floatY, { toValue: -15, duration: 1500 + phase * 200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(floatY, { toValue: 0, duration: 1500 + phase * 200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])
      );
      loopRef.current.start();
    }
    return () => { loopRef.current?.stop(); };
  }, [state]);

  const scale = state === 'popped' ? popSc : 1;
  const translateY = state === 'idle' ? floatY : 0;
  const translateX = state === 'wrong' ? shake : 0;

  return (
    <Animated.View style={[s.balloon, { backgroundColor: color, transform: [{ scale }, { translateY }, { translateX }], opacity }]}>
      <Pressable style={s.balloonPress} onPress={onPress} disabled={state !== 'idle'}>
        <Text style={s.balloonText}>{letter}</Text>
      </Pressable>
      <View style={s.balloonString} />
    </Animated.View>
  );
}

// ─── Main Screen ────────────────────────────────────────────────────────────

export default function LetterBalloonPopScreen({ navigation }: ScreenProps<'LetterBalloonPop'>) {
  const { playSuccess, playError } = useAudio();
  const { addStars, playGame } = useProgress();
  const [round, setRound] = useState(1);
  const [target, setTarget] = useState<string>('');
  const [balloons, setBalloons] = useState<{ letter: string; color: string; state: BState }[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const startRound = useCallback(() => {
    const { target: t, letters } = buildRound(target);
    setTarget(t);
    setBalloons(letters.map((letter, i) => ({
      letter,
      color: BALLOON_COLORS[i % BALLOON_COLORS.length],
      state: 'idle' as BState,
    })));
    // Speak the target letter
    Speech.stop();
    Speech.speak(t, { rate: 0.9, pitch: 1.3 });
  }, [target]);

  useEffect(() => { startRound(); }, []);

  const handlePop = (letter: string, index: number) => {
    if (balloons[index].state !== 'idle') return;

    if (letter === target) {
      // Correct!
      playSuccess?.();
      setScore(s => s + 10);
      setBalloons(prev => prev.map((b, i) => i === index ? { ...b, state: 'popped' } : b));
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        if (round >= TOTAL) {
          setGameOver(true);
        } else {
          setRound(r => r + 1);
          startRound();
        }
      }, 800);
    } else {
      playError?.();
      setBalloons(prev => prev.map((b, i) => i === index ? { ...b, state: 'wrong' } : b));
    }
  };

  const handleFinish = () => {
    const stars = score >= 80 ? 3 : score >= 50 ? 2 : 1;
    addStars(stars);
    playGame();
    navigation.replace('Reward', { from: 'LetterBalloonPop', stars });
  };

  if (gameOver) {
    return (
      <PhoneSafe bg={C.blue}>
        <View style={s.center}>
          <Text style={s.gameOverTitle}>🎉 Great Job!</Text>
          <Text style={s.gameOverScore}>Score: {score}</Text>
          <Pressable style={s.finishBtn} onPress={handleFinish}>
            <Text style={s.finishBtnText}>Continue</Text>
          </Pressable>
        </View>
      </PhoneSafe>
    );
  }

  return (
    <PhoneSafe bg={C.blue}>
      {/* Clouds */}
      <Cloud top={10} delay={0} />
      <Cloud top={60} delay={3000} />
      <Cloud top={30} delay={6000} />

      {/* Header */}
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backText}>← Back</Text>
        </Pressable>
        <View style={s.progressBox}>
          <Text style={s.progressText}>{round}/{TOTAL}</Text>
        </View>
        <View style={s.scoreBox}>
          <Text style={s.scoreText}>⭐ {score}</Text>
        </View>
      </View>

      {/* Target */}
      <View style={s.targetBox}>
        <Text style={s.targetLabel}>Find the letter:</Text>
        <Text style={s.targetLetter}>{target}</Text>
      </View>

      {/* Balloons */}
      <View style={s.balloonArea}>
        {balloons.map((b, i) => (
          <Balloon
            key={`${b.letter}-${i}`}
            letter={b.letter}
            color={b.color}
            phase={i}
            state={b.state}
            onPress={() => handlePop(b.letter, i)}
          />
        ))}
      </View>

      {/* Confetti */}
      {showConfetti && (
        <View style={s.confettiContainer}>
          {Array.from({ length: 20 }).map((_, i) => (
            <Particle
              key={i}
              color={BALLOON_COLORS[i % BALLOON_COLORS.length]}
              x={Math.random() * SW}
              y={SH / 2}
            />
          ))}
        </View>
      )}
    </PhoneSafe>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  gameOverTitle: { fontSize: 36, fontWeight: '900', color: '#FFF', marginBottom: 10 },
  gameOverScore: { fontSize: 24, color: '#FFF', marginBottom: 30 },
  finishBtn: { backgroundColor: C.mint, paddingHorizontal: 40, paddingVertical: 16, borderRadius: 30, borderWidth: 3, borderColor: C.ink },
  finishBtnText: { fontSize: 20, fontWeight: 'bold', color: C.ink },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 10 },
  backBtn: { backgroundColor: C.paper, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 2, borderColor: C.ink },
  backText: { fontSize: 16, fontWeight: 'bold', color: C.ink },
  progressBox: { backgroundColor: C.paper, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, borderWidth: 2, borderColor: C.ink },
  progressText: { fontSize: 18, fontWeight: 'bold', color: C.ink },
  scoreBox: { backgroundColor: C.yellow, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 2, borderColor: C.ink },
  scoreText: { fontSize: 16, fontWeight: 'bold', color: C.ink },
  targetBox: { alignItems: 'center', marginTop: 10 },
  targetLabel: { fontSize: 18, color: '#FFF', fontWeight: '600' },
  targetLetter: { fontSize: 48, fontWeight: '900', color: '#FFF', textShadowColor: C.ink, textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 0 },
  balloonArea: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', paddingTop: 20 },
  balloon: { width: 80, height: 100, borderRadius: 40, margin: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(0,0,0,0.1)' },
  balloonPress: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  balloonText: { fontSize: 32, fontWeight: '900', color: '#FFF', textShadowColor: C.ink, textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 0 },
  balloonString: { width: 2, height: 20, backgroundColor: 'rgba(0,0,0,0.3)', marginTop: -5 },
  cloud: { position: 'absolute', fontSize: 50, zIndex: -1 },
  confettiContainer: { ...StyleSheet.absoluteFillObject, zIndex: 100 },
  particle: { position: 'absolute', width: 12, height: 12, borderRadius: 6 },
});