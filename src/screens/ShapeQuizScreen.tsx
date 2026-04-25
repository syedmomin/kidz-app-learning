// src/screens/ShapeQuizScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import Svg, { Circle, Rect, Polygon, Ellipse, Path } from 'react-native-svg';
import PhoneSafe from '../components/PhoneSafe';
import { C } from '../theme';
import type { ScreenProps } from '../navigation/types';

const TOTAL = 30;

// ─── All shapes ───────────────────────────────────────────────────────────────

interface ShapeDef { name: string; color: string; render: (f: string) => React.ReactNode }

const SHAPES: ShapeDef[] = [
  { name: 'Circle',    color: C.coral,
    render: f => <Svg width="130" height="130"><Circle cx="65" cy="65" r="55" fill={f} stroke={C.ink} strokeWidth="5"/></Svg> },
  { name: 'Square',    color: C.blue,
    render: f => <Svg width="130" height="130"><Rect x="12" y="12" width="106" height="106" fill={f} stroke={C.ink} strokeWidth="5" rx="4"/></Svg> },
  { name: 'Triangle',  color: C.mint,
    render: f => <Svg width="130" height="130"><Polygon points="65,8 122,122 8,122" fill={f} stroke={C.ink} strokeWidth="5"/></Svg> },
  { name: 'Star',      color: C.yellow,
    render: f => <Svg width="130" height="130"><Polygon points="65,8 78,45 118,48 88,74 98,112 65,90 32,112 42,74 12,48 52,45" fill={f} stroke={C.ink} strokeWidth="4"/></Svg> },
  { name: 'Oval',      color: C.purple,
    render: f => <Svg width="130" height="130"><Ellipse cx="65" cy="65" rx="60" ry="36" fill={f} stroke={C.ink} strokeWidth="5"/></Svg> },
  { name: 'Diamond',   color: C.coral,
    render: f => <Svg width="130" height="130"><Polygon points="65,6 120,65 65,124 10,65" fill={f} stroke={C.ink} strokeWidth="5"/></Svg> },
  { name: 'Rectangle', color: C.blue,
    render: f => <Svg width="130" height="130"><Rect x="6" y="28" width="118" height="74" fill={f} stroke={C.ink} strokeWidth="5" rx="4"/></Svg> },
  { name: 'Heart',     color: C.coral,
    render: f => <Svg width="130" height="130"><Path d="M65,108 C65,108 10,70 10,38 C10,20 24,9 42,16 C52,20 65,32 65,32 C65,32 78,20 88,16 C106,9 120,20 120,38 C120,70 65,108 65,108Z" fill={f} stroke={C.ink} strokeWidth="4"/></Svg> },
  { name: 'Pentagon',  color: C.mint,
    render: f => <Svg width="130" height="130"><Polygon points="65,8 118,46 98,108 32,108 12,46" fill={f} stroke={C.ink} strokeWidth="5"/></Svg> },
  { name: 'Hexagon',   color: C.purple,
    render: f => <Svg width="130" height="130"><Polygon points="65,8 112,35 112,92 65,120 18,92 18,35" fill={f} stroke={C.ink} strokeWidth="5"/></Svg> },
  { name: 'Arrow',     color: C.yellow,
    render: f => <Svg width="130" height="130"><Polygon points="130,65 80,20 80,48 10,48 10,82 80,82 80,110" fill={f} stroke={C.ink} strokeWidth="4"/></Svg> },
  { name: 'Cross',     color: C.coral,
    render: f => <Svg width="130" height="130"><Path d="M48,10 h34 v38 h38 v34 h-38 v38 h-34 v-38 h-38 v-34 h38 z" fill={f} stroke={C.ink} strokeWidth="4"/></Svg> },
  { name: 'Cloud',     color: C.blue,
    render: f => <Svg width="130" height="130"><Path d="M24,90 a22,22 0 0 1 0,-44 a18,18 0 0 1 34,-16 a24,24 0 0 1 44,10 a20,20 0 0 1 0,50 Z" fill={f} stroke={C.ink} strokeWidth="4"/></Svg> },
  { name: 'Crescent',  color: C.purple,
    render: f => <Svg width="130" height="130"><Path d="M65,10 A55,55 0 1 0 65,120 A35,35 0 1 1 65,10 Z" fill={f} stroke={C.ink} strokeWidth="4"/></Svg> },
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

// Build 30 rounds cycling through shapes (no same shape twice in a row)
function buildRounds() {
  const result: { shape: ShapeDef; options: string[] }[] = [];
  const pool = [...SHAPES];
  let lastIdx = -1;

  while (result.length < TOTAL) {
    if (result.length % pool.length === 0) shuffle(pool);
    // pick next shape, avoid consecutive repeat
    let idx = result.length % pool.length;
    if (idx === lastIdx) idx = (idx + 1) % pool.length;
    lastIdx = idx;
    const shape = pool[idx];
    const wrongs = shuffle(SHAPES.filter(s => s.name !== shape.name)).slice(0, 3).map(s => s.name);
    result.push({ shape, options: shuffle([shape.name, ...wrongs]) });
  }
  return result;
}

const ROUNDS = buildRounds();

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ShapeQuizScreen({ navigation }: ScreenProps<'ShapeQuiz'>) {
  const [idx,    setIdx]    = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score,  setScore]  = useState(0);

  const { shape, options } = ROUNDS[idx];
  const shake      = useRef(new Animated.Value(0)).current;
  const slideIn    = useRef(new Animated.Value(0)).current;
  const shapeSc    = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    slideIn.setValue(300);
    Animated.spring(slideIn, { toValue: 0, tension: 55, friction: 11, useNativeDriver: true }).start();
  }, [idx]);

  const doShake = () => Animated.sequence([
    Animated.timing(shake, { toValue: 14,  duration: 55, useNativeDriver: true }),
    Animated.timing(shake, { toValue: -14, duration: 55, useNativeDriver: true }),
    Animated.timing(shake, { toValue: 8,   duration: 55, useNativeDriver: true }),
    Animated.timing(shake, { toValue: 0,   duration: 55, useNativeDriver: true }),
  ]).start();

  const doBounce = () => Animated.sequence([
    Animated.spring(shapeSc, { toValue: 1.18, tension: 200, friction: 5, useNativeDriver: true }),
    Animated.spring(shapeSc, { toValue: 1,    tension: 200, friction: 8, useNativeDriver: true }),
  ]).start();

  const advance = (sc: number) => {
    if (idx + 1 >= TOTAL) {
      navigation.navigate('Reward', { from: 'ShapeQuiz', stars: sc >= 25 ? 3 : sc >= 18 ? 2 : 1 });
      return;
    }
    setIdx(i => i + 1);
    setPicked(null);
    shapeSc.setValue(1);
  };

  const pick = (name: string) => {
    if (picked !== null) return;
    setPicked(name);
    if (name === shape.name) {
      const ns = score + 1;
      setScore(ns);
      doBounce();
      setTimeout(() => advance(ns), 1200);
    } else {
      doShake();
      setTimeout(() => advance(score), 1500);
    }
  };

  const isCorrect = picked === shape.name;
  const optBg = (n: string) => {
    if (!picked) return '#fff';
    if (n === shape.name) return C.mint;
    if (n === picked)     return C.coral;
    return '#fff';
  };
  const optClr = (n: string) => (!picked || (n !== shape.name && n !== picked)) ? C.ink : '#fff';

  return (
    <PhoneSafe bg="#FFF0F8">
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}><Text style={s.backT}>←</Text></Pressable>
        <Text style={s.title}>Shape Quiz 🔷</Text>
        <View style={s.scorePill}><Text style={s.scoreT}>⭐ {score}</Text></View>
      </View>

      {/* Progress bar only — no text counter */}
      <View style={s.progressBar}>
        <View style={[s.progressFill, { width: `${(idx / TOTAL) * 100}%` }]}/>
      </View>

      <Text style={s.prompt}>What shape is this?</Text>

      <Animated.View style={[s.shapeCard, { transform: [{ translateX: slideIn }, { translateX: shake }, { scale: shapeSc }] }]}>
        {shape.render(shape.color)}
      </Animated.View>

      <View style={s.optGrid}>
        {options.map(n => (
          <Pressable key={n} onPress={() => pick(n)} disabled={picked !== null}
            style={({ pressed }) => [s.opt, { backgroundColor: optBg(n), transform: [{ scale: pressed && !picked ? 0.93 : 1 }] }]}>
            <Text style={[s.optT, { color: optClr(n) }]}>{n}</Text>
            {picked && n === shape.name && <Text style={s.mark}>✓</Text>}
            {picked === n && n !== shape.name && <Text style={s.mark}>✗</Text>}
          </Pressable>
        ))}
      </View>

      {picked && (
        <Text style={[s.feedback, { color: isCorrect ? C.mintDeep : C.coralDeep }]}>
          {isCorrect ? '🎉 Correct!' : `❌ It's a ${shape.name}!`}
        </Text>
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
  progressBar:  { height: 12, marginHorizontal: 20, backgroundColor: '#fff', borderRadius: 7, borderWidth: 3, borderColor: C.ink, overflow: 'hidden', marginBottom: 4 },
  progressFill: { height: '100%', backgroundColor: C.purple, borderRadius: 5 },
  prompt:       { textAlign: 'center', fontWeight: '900', fontSize: 22, color: C.ink, marginTop: 14, marginBottom: 12 },
  shapeCard:    { alignSelf: 'center', width: 200, height: 200, backgroundColor: '#fff', borderRadius: 30, borderWidth: 4, borderColor: C.ink, alignItems: 'center', justifyContent: 'center', marginBottom: 22, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 6 },
  optGrid:      { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, paddingHorizontal: 20 },
  opt:          { width: '44%', paddingVertical: 16, borderRadius: 18, borderWidth: 3.5, borderColor: C.ink, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  optT:         { fontSize: 17, fontWeight: '900' },
  mark:         { fontSize: 18, fontWeight: '900' },
  feedback:     { textAlign: 'center', fontWeight: '900', fontSize: 17, marginTop: 18 },
});
