// src/screens/ShapeQuizScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Pressable, Animated,
} from 'react-native';
import Svg, { Circle, Rect, Polygon, Ellipse, Path } from 'react-native-svg';
import PhoneSafe from '../components/PhoneSafe';
import { C } from '../theme';
import type { ScreenProps } from '../navigation/types';

// ─── Shape definitions ────────────────────────────────────────────────────────

interface ShapeDef {
  name:   string;
  color:  string;
  render: (fill: string) => React.ReactNode;
}

const SHAPES: ShapeDef[] = [
  {
    name: 'Circle', color: C.coral,
    render: f => <Svg width="130" height="130"><Circle cx="65" cy="65" r="55" fill={f} stroke={C.ink} strokeWidth="5"/></Svg>,
  },
  {
    name: 'Square', color: C.blue,
    render: f => <Svg width="130" height="130"><Rect x="15" y="15" width="100" height="100" fill={f} stroke={C.ink} strokeWidth="5" rx="4"/></Svg>,
  },
  {
    name: 'Triangle', color: C.mint,
    render: f => <Svg width="130" height="130"><Polygon points="65,8 122,122 8,122" fill={f} stroke={C.ink} strokeWidth="5"/></Svg>,
  },
  {
    name: 'Star', color: C.yellow,
    render: f => <Svg width="130" height="130"><Polygon points="65,8 78,45 118,48 88,74 98,112 65,90 32,112 42,74 12,48 52,45" fill={f} stroke={C.ink} strokeWidth="4"/></Svg>,
  },
  {
    name: 'Oval', color: C.purple,
    render: f => <Svg width="130" height="130"><Ellipse cx="65" cy="65" rx="60" ry="38" fill={f} stroke={C.ink} strokeWidth="5"/></Svg>,
  },
  {
    name: 'Diamond', color: C.coral,
    render: f => <Svg width="130" height="130"><Polygon points="65,6 120,65 65,124 10,65" fill={f} stroke={C.ink} strokeWidth="5"/></Svg>,
  },
  {
    name: 'Rectangle', color: C.blue,
    render: f => <Svg width="130" height="130"><Rect x="6" y="28" width="118" height="74" fill={f} stroke={C.ink} strokeWidth="5" rx="4"/></Svg>,
  },
  {
    name: 'Heart', color: C.coral,
    render: f => <Svg width="130" height="130"><Path d="M65,108 C65,108 10,70 10,38 C10,20 24,9 42,16 C52,20 65,32 65,32 C65,32 78,20 88,16 C106,9 120,20 120,38 C120,70 65,108 65,108Z" fill={f} stroke={C.ink} strokeWidth="4"/></Svg>,
  },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ─── Build rounds — no repeats ────────────────────────────────────────────────

function buildRounds(): { shape: ShapeDef; options: string[] }[] {
  const shuffled = shuffle(SHAPES);
  return shuffled.map(shape => {
    const wrongs = shuffle(SHAPES.filter(s => s.name !== shape.name))
      .slice(0, 3)
      .map(s => s.name);
    return { shape, options: shuffle([shape.name, ...wrongs]) };
  });
}

const ROUNDS = buildRounds();
const TOTAL  = ROUNDS.length;

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ShapeQuizScreen({ navigation }: ScreenProps<'ShapeQuiz'>) {
  const [idx,    setIdx]    = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score,  setScore]  = useState(0);

  const { shape, options } = ROUNDS[idx];
  const shake   = useRef(new Animated.Value(0)).current;
  const slideIn = useRef(new Animated.Value(0)).current;
  const shapeSc = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    slideIn.setValue(300);
    Animated.spring(slideIn, { toValue: 0, tension: 55, friction: 11, useNativeDriver: true }).start();
  }, [idx]);

  const doShake = () => {
    Animated.sequence([
      Animated.timing(shake, { toValue: 14,  duration: 55, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -14, duration: 55, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 10,  duration: 55, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 55, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0,   duration: 55, useNativeDriver: true }),
    ]).start();
  };

  const doBounce = () => {
    Animated.sequence([
      Animated.spring(shapeSc, { toValue: 1.2, tension: 200, friction: 5, useNativeDriver: true }),
      Animated.spring(shapeSc, { toValue: 1,   tension: 200, friction: 8, useNativeDriver: true }),
    ]).start();
  };

  const pick = (name: string) => {
    if (picked !== null) return;   // already answered
    setPicked(name);

    if (name === shape.name) {
      setScore(s => s + 1);
      doBounce();
      setTimeout(advance, 1200);
    } else {
      doShake();
    }
  };

  const advance = () => {
    if (idx + 1 >= TOTAL) {
      navigation.navigate('Reward', {
        from:  'ShapeQuiz',
        stars: score >= 7 ? 3 : score >= 5 ? 2 : 1,
      });
      return;
    }
    setIdx(i => i + 1);
    setPicked(null);
    shapeSc.setValue(1);
  };

  const isCorrect = picked === shape.name;

  const optBg = (name: string) => {
    if (picked === null) return '#fff';
    if (name === shape.name) return C.mint;       // always highlight correct
    if (name === picked)     return C.coral;       // highlight wrong pick
    return '#fff';
  };
  const optColor = (name: string) => {
    if (picked === null) return C.ink;
    if (name === shape.name || name === picked) return '#fff';
    return C.ink;
  };

  return (
    <PhoneSafe bg="#FFF0F8">
      {/* Header */}
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}>
          <Text style={s.backT}>←</Text>
        </Pressable>
        <Text style={s.title}>Shape Quiz 🔷</Text>
        <View style={s.scorePill}>
          <Text style={s.scoreT}>⭐ {score}</Text>
        </View>
      </View>

      {/* Progress */}
      <View style={s.progressBar}>
        <View style={[s.progressFill, { width: `${(idx / TOTAL) * 100}%` }]}/>
      </View>
      <Text style={s.progressLbl}>{idx + 1} / {TOTAL}</Text>

      <Text style={s.prompt}>What shape is this?</Text>

      {/* Shape card */}
      <Animated.View style={[s.shapeCard, {
        transform: [{ translateX: slideIn }, { translateX: shake }, { scale: shapeSc }],
      }]}>
        {shape.render(shape.color)}
      </Animated.View>

      {/* Answer buttons */}
      <View style={s.optGrid}>
        {options.map(name => (
          <Pressable
            key={name}
            onPress={() => pick(name)}
            disabled={picked !== null}
            style={({ pressed }) => [
              s.opt,
              {
                backgroundColor: optBg(name),
                transform: [{ scale: pressed && picked === null ? 0.93 : 1 }],
              },
            ]}
          >
            <Text style={[s.optT, { color: optColor(name) }]}>{name}</Text>
            {picked !== null && name === shape.name && <Text style={s.optMark}>✓</Text>}
            {picked === name && name !== shape.name && <Text style={s.optMark}>✗</Text>}
          </Pressable>
        ))}
      </View>

      {/* Feedback */}
      {picked !== null && isCorrect && (
        <Text style={s.autoMsg}>🎉 Correct! Next shape coming…</Text>
      )}
      {picked !== null && !isCorrect && (
        <Pressable onPress={advance} style={s.nextBtn}>
          <Text style={s.nextT}>{idx + 1 >= TOTAL ? '🏆 Finish' : 'Next →'}</Text>
        </Pressable>
      )}
    </PhoneSafe>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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
  prompt:       { textAlign: 'center', fontWeight: '900', fontSize: 22, color: C.ink, marginTop: 16, marginBottom: 12 },
  shapeCard:    {
    alignSelf: 'center', width: 200, height: 200,
    backgroundColor: '#fff', borderRadius: 30, borderWidth: 4, borderColor: C.ink,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12, shadowRadius: 8, elevation: 6,
    marginBottom: 24,
  },
  optGrid:      { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, paddingHorizontal: 20 },
  opt:          {
    width: '44%', paddingVertical: 16, borderRadius: 18,
    borderWidth: 3.5, borderColor: C.ink,
    alignItems: 'center', flexDirection: 'row',
    justifyContent: 'center', gap: 8,
  },
  optT:         { fontSize: 17, fontWeight: '900' },
  optMark:      { fontSize: 18, fontWeight: '900' },
  nextBtn:      { margin: 20, height: 56, backgroundColor: C.blue, borderRadius: 20, borderWidth: 3.5, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  nextT:        { fontSize: 20, fontWeight: '900', color: '#fff' },
  autoMsg:      { textAlign: 'center', fontWeight: '800', fontSize: 15, color: C.mintDeep, marginTop: 14 },
});
