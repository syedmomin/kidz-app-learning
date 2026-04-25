// src/screens/BalloonPopScreen.tsx — pop the balloon with the correct number
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions } from 'react-native';
import PhoneSafe from '../components/PhoneSafe';
import { C } from '../theme';
import type { ScreenProps } from '../navigation/types';

const { width: SW, height: SH } = Dimensions.get('window');

const BALLOON_COLORS = [C.coral, C.blue, C.mint, C.yellow, C.purple, '#FF9F43'];
const TOTAL_ROUNDS   = 8;

function shuffle<T>(a: T[]): T[] { return [...a].sort(() => Math.random() - 0.5); }

function makeRound(roundIdx: number) {
  const target  = Math.floor(Math.random() * 9) + 1;
  const wrongs  = shuffle(Array.from({ length: 20 }, (_, i) => i + 1).filter(n => n !== target)).slice(0, 5);
  const numbers = shuffle([target, ...wrongs]);
  return { target, numbers };
}

type Balloon = { id: number; number: number; color: string; x: number; popped: boolean };

function makeBalloons(numbers: number[]): Balloon[] {
  return numbers.map((n, i) => ({
    id: i, number: n,
    color: BALLOON_COLORS[i % BALLOON_COLORS.length],
    x: (i % 3) * ((SW - 60) / 2) + 30,
    popped: false,
  }));
}

function BalloonItem({ balloon, onPop, floatAnim }: { balloon: Balloon; onPop: () => void; floatAnim: Animated.Value }) {
  const popScale = useRef(new Animated.Value(1)).current;

  const handlePop = () => {
    Animated.sequence([
      Animated.spring(popScale, { toValue: 1.4, tension: 200, friction: 5, useNativeDriver: true }),
      Animated.timing(popScale, { toValue: 0,   duration: 150, useNativeDriver: true }),
    ]).start(onPop);
  };

  const floatY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  return (
    <Animated.View style={{ transform: [{ translateY: floatY }, { scale: popScale }] }}>
      <Pressable onPress={balloon.popped ? undefined : handlePop} style={[b.balloon, { backgroundColor: balloon.color }]}>
        <View style={b.knot}/>
        <Text style={b.numT}>{balloon.number}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function BalloonPopScreen({ navigation }: ScreenProps<'BalloonPop'>) {
  const [roundIdx, setRoundIdx] = useState(0);
  const [round,    setRound]    = useState(() => makeRound(0));
  const [balloons, setBalloons] = useState<Balloon[]>(() => makeBalloons(makeRound(0).numbers));
  const [score,    setScore]    = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [roundIdx]);

  const pop = (balloon: Balloon) => {
    if (balloon.popped) return;
    if (balloon.number === round.target) {
      setFeedback('correct');
      setScore(s => s + 1);
      setTimeout(() => {
        if (roundIdx + 1 >= TOTAL_ROUNDS) {
          navigation.navigate('Reward', { from: 'BalloonPop', stars: score + 1 >= 7 ? 3 : score + 1 >= 5 ? 2 : 1 });
        } else {
          const next = makeRound(roundIdx + 1);
          setRoundIdx(i => i + 1);
          setRound(next);
          setBalloons(makeBalloons(next.numbers));
          setFeedback(null);
        }
      }, 1000);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 700);
    }
  };

  const rows = [balloons.slice(0, 3), balloons.slice(3, 6)];

  return (
    <PhoneSafe bg="#E8F4FF">
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}><Text style={s.backT}>←</Text></Pressable>
        <Text style={s.title}>Balloon Pop 🎈</Text>
        <View style={s.scorePill}><Text style={s.scoreT}>⭐ {score}</Text></View>
      </View>

      <View style={s.progressBar}>
        <View style={[s.progressFill, { width: `${(roundIdx / TOTAL_ROUNDS) * 100}%` }]}/>
      </View>
      <Text style={s.progressLbl}>{roundIdx + 1} / {TOTAL_ROUNDS}</Text>

      <View style={s.targetBox}>
        <Text style={s.targetLbl}>Pop the balloon with</Text>
        <View style={s.targetNum}>
          <Text style={s.targetNumT}>{round.target}</Text>
        </View>
      </View>

      {feedback && (
        <Text style={[s.feedback, { color: feedback === 'correct' ? C.mintDeep : C.coralDeep }]}>
          {feedback === 'correct' ? '🎉 Pop! Correct!' : '❌ Wrong balloon!'}
        </Text>
      )}

      <View style={s.balloonArea}>
        {rows.map((row, ri) => (
          <View key={ri} style={s.row}>
            {row.map(bal => (
              <BalloonItem key={bal.id} balloon={bal} floatAnim={floatAnim} onPop={() => pop(bal)}/>
            ))}
          </View>
        ))}
      </View>
    </PhoneSafe>
  );
}

const b = StyleSheet.create({
  balloon: { width: 88, height: 100, borderRadius: 44, borderWidth: 3, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  knot:    { position: 'absolute', bottom: -8, width: 10, height: 10, backgroundColor: C.ink, borderRadius: 5 },
  numT:    { fontSize: 30, fontWeight: '900', color: '#fff' },
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
  targetBox:    { alignItems: 'center', marginTop: 18, gap: 8 },
  targetLbl:    { fontSize: 18, fontWeight: '800', color: C.ink },
  targetNum:    { width: 90, height: 90, borderRadius: 45, backgroundColor: C.yellow, borderWidth: 4, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  targetNumT:   { fontSize: 46, fontWeight: '900', color: C.ink },
  feedback:     { textAlign: 'center', fontSize: 18, fontWeight: '900', marginTop: 10 },
  balloonArea:  { flex: 1, justifyContent: 'center', paddingHorizontal: 20, gap: 24 },
  row:          { flexDirection: 'row', justifyContent: 'space-around' },
});
