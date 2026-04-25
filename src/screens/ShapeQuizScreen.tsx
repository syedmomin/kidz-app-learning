// src/screens/ShapeQuizScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions, Easing } from 'react-native';
import Svg, { Circle, Rect, Polygon, Ellipse, Path } from 'react-native-svg';
import * as Speech from 'expo-speech';
import PhoneSafe from '../components/PhoneSafe';
import { C } from '../theme';
import { useAudio } from '../hooks/useAudio';
import type { ScreenProps } from '../navigation/types';

const { width: SW } = Dimensions.get('window');
const TOTAL = 200;

import { 
  SvgCircleShape, SvgSquareShape, SvgTriangleShape, SvgStarShape, SvgHeartShape,
  SvgOvalShape, SvgDiamondShape, SvgHexagonShape, SvgPentagonShape, SvgCrossShape,
  SvgCrescentShape, SvgArrowShape, SvgTrapezoidShape, SvgParallelogramShape, SvgOctagonShape,
  SvgHeptagonShape, SvgKiteShape, SvgSemiCircleShape, SvgDropShape, SvgPieShape
} from '../components/Illustrations';

// ─── All shapes ───────────────────────────────────────────────────────────────

interface ShapeDef { name: string; color: string; render: (f: string) => React.ReactNode }

const SHAPES: ShapeDef[] = [
  { name: 'Circle',    color: '#FF5E5E', render: f => <SvgCircleShape fill={f} /> },
  { name: 'Square',    color: '#5E8BFF', render: f => <SvgSquareShape fill={f} /> },
  { name: 'Triangle',  color: '#5EE39F', render: f => <SvgTriangleShape fill={f} /> },
  { name: 'Star',      color: '#FFEB3B', render: f => <SvgStarShape fill={f} /> },
  { name: 'Heart',     color: '#FF5EC1', render: f => <SvgHeartShape fill={f} /> },
  { name: 'Oval',      color: '#FF9800', render: f => <SvgOvalShape fill={f} /> },
  { name: 'Diamond',   color: '#9C27B0', render: f => <SvgDiamondShape fill={f} /> },
  { name: 'Hexagon',   color: '#00BCD4', render: f => <SvgHexagonShape fill={f} /> },
  { name: 'Pentagon',  color: '#4CAF50', render: f => <SvgPentagonShape fill={f} /> },
  { name: 'Cross',     color: '#FF5722', render: f => <SvgCrossShape fill={f} /> },
  { name: 'Crescent',  color: '#FFD54F', render: f => <SvgCrescentShape fill={f} /> },
  { name: 'Arrow',     color: '#FF5252', render: f => <SvgArrowShape fill={f} /> },
  { name: 'Trapezoid', color: '#4CAF50', render: f => <SvgTrapezoidShape fill={f} /> },
  { name: 'Parallelogram', color: '#2196F3', render: f => <SvgParallelogramShape fill={f} /> },
  { name: 'Octagon',   color: '#9C27B0', render: f => <SvgOctagonShape fill={f} /> },
  { name: 'Heptagon',  color: '#00BCD4', render: f => <SvgHeptagonShape fill={f} /> },
  { name: 'Kite',      color: '#E91E63', render: f => <SvgKiteShape fill={f} /> },
  { name: 'Semi-Circle', color: '#8BC34A', render: f => <SvgSemiCircleShape fill={f} /> },
  { name: 'Drop',      color: '#03A9F4', render: f => <SvgDropShape fill={f} /> },
  { name: 'Pie',       color: '#FFC107', render: f => <SvgPieShape fill={f} /> },
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

function buildRounds() {
  const result: { shape: ShapeDef; options: string[] }[] = [];
  const pool = [...SHAPES];
  while (result.length < TOTAL) {
    shuffle(pool);
    pool.forEach(shape => {
      const wrongs = shuffle(SHAPES.filter(s => s.name !== shape.name)).slice(0, 3).map(s => s.name);
      result.push({ shape, options: shuffle([shape.name, ...wrongs]) });
    });
  }
  return result.slice(0, TOTAL);
}

const ROUNDS = buildRounds();

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ShapeQuizScreen({ navigation }: ScreenProps<'ShapeQuiz'>) {
  const [idx,    setIdx]    = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score,  setScore]  = useState(0);

  const { shape, options } = ROUNDS[idx];
  const shake      = useRef(new Animated.Value(0)).current;
  const slideIn    = useRef(new Animated.Value(SW)).current;
  const shapeSc    = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    slideIn.setValue(SW);
    Animated.spring(slideIn, { toValue: 0, damping: 15, stiffness: 90, useNativeDriver: true }).start();
    Speech.stop();
    Speech.speak(`Can you find the ${shape.name}?`, { rate: 1.0 });
  }, [idx]);

  const doShake = () => Animated.sequence([
    Animated.timing(shake, { toValue: 15,  duration: 60, useNativeDriver: true }),
    Animated.timing(shake, { toValue: -15, duration: 60, useNativeDriver: true }),
    Animated.timing(shake, { toValue: 10,   duration: 60, useNativeDriver: true }),
    Animated.timing(shake, { toValue: 0,   duration: 60, useNativeDriver: true }),
  ]).start();

  const doBounce = () => Animated.sequence([
    Animated.spring(shapeSc, { toValue: 1.25, tension: 200, friction: 5, useNativeDriver: true }),
    Animated.spring(shapeSc, { toValue: 1,    tension: 200, friction: 8, useNativeDriver: true }),
  ]).start();

  const advance = () => {
    if (idx + 1 >= TOTAL) {
      navigation.navigate('Reward', { from: 'ShapeQuiz', stars: 3 });
      return;
    }
    setIdx(i => i + 1);
    setPicked(null);
  };

  const pick = (name: string) => {
    if (picked !== null) return;
    setPicked(name);
    
    if (name === shape.name) {
      setScore(s => s + 1);
      doBounce();
      Speech.stop();
      Speech.speak(`Yes! That is a ${name}`, { rate: 1.0, pitch: 1.1 });
      setTimeout(() => advance(), 1800);
    } else {
      doShake();
      Speech.stop();
      Speech.speak(`Oops! Try again!`, { rate: 1.1 });
      // Reset picked after delay so they can try again
      setTimeout(() => setPicked(null), 1500);
    }
  };

  return (
    <PhoneSafe bg="#FFE0F0">
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}><Text style={s.backT}>←</Text></Pressable>
        <Text style={s.title}>Shape Quiz! 💎</Text>
        <View style={s.scorePill}><Text style={s.scoreT}>⭐ {score}</Text></View>
      </View>

      <View style={s.content}>
        <Text style={s.prompt}>Find the {shape.name}!</Text>

        <Animated.View style={[s.shapeCard, { 
          transform: [{ translateX: slideIn }, { translateX: shake }, { scale: shapeSc }],
          shadowColor: shape.color
        }]}>
          <View style={s.innerCard}>
            {shape.render(shape.color)}
          </View>
        </Animated.View>

        <View style={s.optGrid}>
          {options.map(n => {
            const isSelected = picked === n;
            const isCorrectPick = isSelected && n === shape.name;
            const isWrongPick = isSelected && n !== shape.name;
            
            const bg = isCorrectPick ? '#5EE39F' : (isWrongPick ? '#FF5E5E' : '#fff');

            return (
              <Pressable key={n} onPress={() => pick(n)} disabled={picked !== null}
                style={[s.opt, { backgroundColor: bg, elevation: isSelected ? 0 : 4 }]}>
                <Text style={[s.optT, { color: isSelected ? '#fff' : '#333' }]}>{n}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </PhoneSafe>
  );
}

const s = StyleSheet.create({
  header:       { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  back:         { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', elevation: 4, alignItems: 'center', justifyContent: 'center' },
  backT:        { fontSize: 22, fontWeight: '900', color: C.ink },
  title:        { flex: 1, textAlign: 'center', fontWeight: '900', fontSize: 22, color: C.ink },
  scorePill:    { backgroundColor: '#FFE566', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 6, elevation: 4 },
  scoreT:       { fontWeight: '900', fontSize: 16, color: C.ink },
  progressBar:  { height: 14, marginHorizontal: 30, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 10, overflow: 'hidden', marginBottom: 10 },
  progressFill: { height: '100%', backgroundColor: '#FF4081', borderRadius: 10 },
  content:      { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 40 },
  prompt:       { textAlign: 'center', fontWeight: '900', fontSize: 26, color: C.ink, marginBottom: 25, textShadowColor: 'rgba(0,0,0,0.05)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 2 },
  shapeCard:    { width: 220, height: 220, backgroundColor: '#fff', borderRadius: 45, alignItems: 'center', justifyContent: 'center', marginBottom: 40, elevation: 20, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.3, shadowRadius: 15 },
  innerCard:    { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  optGrid:      { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 15, paddingHorizontal: 20 },
  opt:          { width: '45%', paddingVertical: 18, borderRadius: 25, borderWidth: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 5 },
  optT:         { fontSize: 19, fontWeight: '900', letterSpacing: 1 },
  mark:         { position: 'absolute', right: 10, fontSize: 18 },
  feedbackBox:  { position: 'absolute', bottom: 40, width: '100%', alignItems: 'center' },
  feedback:     { fontWeight: '900', fontSize: 26, letterSpacing: 2 },
});

