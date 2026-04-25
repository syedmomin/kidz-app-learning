// src/screens/ShapeQuizScreen.tsx — identify shapes quiz
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import Svg, { Circle, Rect, Polygon, Ellipse, Path } from 'react-native-svg';
import PhoneSafe from '../components/PhoneSafe';
import { C } from '../theme';
import type { ScreenProps } from '../navigation/types';

type Shape = { name: string; color: string; render: () => React.ReactNode };

const SHAPES: Shape[] = [
  { name: 'Circle',    color: C.coral,   render: () => <Svg width="140" height="140"><Circle cx="70" cy="70" r="60" fill={C.coral} stroke={C.ink} strokeWidth="5"/></Svg> },
  { name: 'Square',    color: C.blue,    render: () => <Svg width="140" height="140"><Rect x="15" y="15" width="110" height="110" fill={C.blue} stroke={C.ink} strokeWidth="5" rx="6"/></Svg> },
  { name: 'Triangle',  color: C.mint,    render: () => <Svg width="140" height="140"><Polygon points="70,10 130,130 10,130" fill={C.mint} stroke={C.ink} strokeWidth="5"/></Svg> },
  { name: 'Star',      color: C.yellow,  render: () => <Svg width="140" height="140"><Polygon points="70,8 86,50 130,52 96,80 108,124 70,98 32,124 44,80 10,52 54,50" fill={C.yellow} stroke={C.ink} strokeWidth="4"/></Svg> },
  { name: 'Oval',      color: C.purple,  render: () => <Svg width="140" height="140"><Ellipse cx="70" cy="70" rx="65" ry="42" fill={C.purple} stroke={C.ink} strokeWidth="5"/></Svg> },
  { name: 'Diamond',   color: C.coral,   render: () => <Svg width="140" height="140"><Polygon points="70,8 128,70 70,132 12,70" fill={C.coral} stroke={C.ink} strokeWidth="5"/></Svg> },
  { name: 'Rectangle', color: C.blue,    render: () => <Svg width="140" height="140"><Rect x="8" y="30" width="124" height="80" fill={C.blue} stroke={C.ink} strokeWidth="5" rx="6"/></Svg> },
  { name: 'Heart',     color: C.coral,   render: () => <Svg width="140" height="140"><Path d="M70,115 C70,115 15,78 15,45 C15,25 30,12 50,18 C60,22 70,32 70,32 C70,32 80,22 90,18 C110,12 125,25 125,45 C125,78 70,115 70,115Z" fill={C.coral} stroke={C.ink} strokeWidth="4"/></Svg> },
];

function shuffle<T>(a: T[]): T[] { return [...a].sort(() => Math.random() - 0.5); }

function makeRound(shapes: Shape[], used: Set<string>) {
  const available = shapes.filter(s => !used.has(s.name));
  const pool = available.length >= 4 ? available : shapes;
  const correct = pool[Math.floor(Math.random() * pool.length)];
  const wrongs = shuffle(shapes.filter(s => s.name !== correct.name)).slice(0, 3);
  return { correct, options: shuffle([correct, ...wrongs]).map(s => s.name) };
}

const TOTAL = 8;

export default function ShapeQuizScreen({ navigation }: ScreenProps<'ShapeQuiz'>) {
  const usedRef = useRef(new Set<string>());
  const [round, setRound]   = useState(() => makeRound(SHAPES, usedRef.current));
  const [idx, setIdx]       = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore]   = useState(0);
  const shake   = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    cardAnim.setValue(300);
    Animated.spring(cardAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }).start();
  }, [idx]);

  const pick = (name: string) => {
    if (picked) return;
    setPicked(name);
    if (name === round.correct.name) {
      setScore(s => s + 1);
      setTimeout(next, 1100);
    } else {
      Animated.sequence([
        Animated.timing(shake, { toValue: 12,  duration: 55, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -12, duration: 55, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 8,   duration: 55, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0,   duration: 55, useNativeDriver: true }),
      ]).start();
    }
  };

  const next = () => {
    if (idx + 1 >= TOTAL) {
      navigation.navigate('Reward', { from: 'ShapeQuiz', stars: score >= 7 ? 3 : score >= 5 ? 2 : 1 });
      return;
    }
    usedRef.current.add(round.correct.name);
    setRound(makeRound(SHAPES, usedRef.current));
    setIdx(i => i + 1);
    setPicked(null);
  };

  const isCorrect = picked === round.correct.name;

  return (
    <PhoneSafe bg="#FFF0F8">
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}><Text style={s.backT}>←</Text></Pressable>
        <Text style={s.title}>Shape Quiz 🔷</Text>
        <View style={s.scorePill}><Text style={s.scoreT}>⭐ {score}</Text></View>
      </View>

      <View style={s.progressBar}>
        <View style={[s.progressFill, { width: `${(idx / TOTAL) * 100}%` }]}/>
      </View>
      <Text style={s.progressLbl}>{idx + 1} / {TOTAL}</Text>

      <Text style={s.prompt}>What shape is this?</Text>

      <Animated.View style={[s.shapeBox, { transform: [{ translateX: cardAnim }, { translateX: shake }] }]}>
        {round.correct.render()}
      </Animated.View>

      <View style={s.grid}>
        {round.options.map(name => {
          const isPicked = picked === name;
          const isRight  = isPicked && name === round.correct.name;
          const isWrong  = isPicked && name !== round.correct.name;
          const isReveal = picked !== null && name === round.correct.name && !isPicked;
          const bg = isRight || isReveal ? C.mint : isWrong ? C.coral : '#fff';
          return (
            <Pressable key={name} onPress={() => pick(name)}
              style={[s.opt, { backgroundColor: bg }]}>
              <Text style={[s.optT, { color: isRight || isReveal || isWrong ? '#fff' : C.ink }]}>{name}</Text>
              {(isRight || isReveal) && <Text>✓</Text>}
              {isWrong && <Text>✗</Text>}
            </Pressable>
          );
        })}
      </View>

      {picked && !isCorrect && (
        <Pressable onPress={next} style={s.nextBtn}><Text style={s.nextT}>Next →</Text></Pressable>
      )}
      {picked && isCorrect && (
        <Text style={s.autoMsg}>🎉 Correct! Next shape coming…</Text>
      )}
    </PhoneSafe>
  );
}

const s = StyleSheet.create({
  header:       { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  back:         { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', borderWidth: 3, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  backT:        { fontSize: 20, fontWeight: '900', color: C.ink },
  title:        { flex: 1, textAlign: 'center', fontWeight: '900', fontSize: 20, color: C.ink },
  scorePill:    { backgroundColor: C.yellow, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 3, borderColor: C.ink },
  scoreT:       { fontWeight: '900', fontSize: 13, color: C.ink },
  progressBar:  { height: 12, marginHorizontal: 20, backgroundColor: '#fff', borderRadius: 7, borderWidth: 3, borderColor: C.ink, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: C.purple, borderRadius: 5 },
  progressLbl:  { textAlign: 'center', fontSize: 12, fontWeight: '800', color: C.inkSoft, marginTop: 3 },
  prompt:       { textAlign: 'center', fontWeight: '900', fontSize: 20, color: C.ink, marginTop: 14, marginBottom: 10 },
  shapeBox:     { alignSelf: 'center', width: 190, height: 190, backgroundColor: '#fff', borderRadius: 28, borderWidth: 4, borderColor: C.ink, alignItems: 'center', justifyContent: 'center', marginBottom: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 5 },
  grid:         { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, paddingHorizontal: 20 },
  opt:          { width: '44%', paddingVertical: 14, borderRadius: 18, borderWidth: 3.5, borderColor: C.ink, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  optT:         { fontSize: 18, fontWeight: '900' },
  nextBtn:      { margin: 20, height: 56, backgroundColor: C.blue, borderRadius: 20, borderWidth: 3.5, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  nextT:        { fontSize: 20, fontWeight: '900', color: '#fff' },
  autoMsg:      { textAlign: 'center', fontWeight: '800', fontSize: 14, color: C.mintDeep, marginTop: 14 },
});
