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
const TOTAL = 15;

// ─── All shapes ───────────────────────────────────────────────────────────────

interface ShapeDef { name: string; color: string; render: (f: string) => React.ReactNode }

const SHAPES: ShapeDef[] = [
  { name: 'Circle',    color: '#FF5E5E',
    render: f => <Svg width="130" height="130"><Circle cx="65" cy="65" r="55" fill={f} stroke="#00000011" strokeWidth="0"/></Svg> },
  { name: 'Square',    color: '#5E8BFF',
    render: f => <Svg width="130" height="130"><Rect x="12" y="12" width="106" height="106" fill={f} rx="10"/></Svg> },
  { name: 'Triangle',  color: '#5EE39F',
    render: f => <Svg width="130" height="130"><Polygon points="65,8 122,122 8,122" fill={f}/></Svg> },
  { name: 'Star',      color: '#FFEB3B',
    render: f => <Svg width="130" height="130"><Polygon points="65,8 78,45 118,48 88,74 98,112 65,90 32,112 42,74 12,48 52,45" fill={f}/></Svg> },
  { name: 'Heart',     color: '#FF5EC1',
    render: f => <Svg width="130" height="130"><Path d="M65,108 C65,108 10,70 10,38 C10,20 24,9 42,16 C52,20 65,32 65,32 C65,32 78,20 88,16 C106,9 120,20 120,38 C120,70 65,108 65,108Z" fill={f}/></Svg> },
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
  const { playSound } = useAudio();
  const [idx,    setIdx]    = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score,  setScore]  = useState(0);

  const { shape, options } = ROUNDS[idx];
  const shake      = useRef(new Animated.Value(0)).current;
  const slideIn    = useRef(new Animated.Value(400)).current;
  const shapeSc    = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    slideIn.setValue(400);
    Animated.spring(slideIn, { toValue: 0, damping: 15, stiffness: 100, useNativeDriver: true }).start();
    Speech.stop();
    Speech.speak(`Can you find the ${shape.name}?`, { rate: 1.0 });
  }, [idx]);

  const doShake = () => Animated.sequence([
    Animated.timing(shake, { toValue: 12,  duration: 60, useNativeDriver: true }),
    Animated.timing(shake, { toValue: -12, duration: 60, useNativeDriver: true }),
    Animated.timing(shake, { toValue: 8,   duration: 60, useNativeDriver: true }),
    Animated.timing(shake, { toValue: 0,   duration: 60, useNativeDriver: true }),
  ]).start();

  const doBounce = () => Animated.sequence([
    Animated.spring(shapeSc, { toValue: 1.25, tension: 200, friction: 5, useNativeDriver: true }),
    Animated.spring(shapeSc, { toValue: 1,    tension: 200, friction: 8, useNativeDriver: true }),
  ]).start();

  const advance = (sc: number) => {
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
      const ns = score + 1;
      setScore(ns);
      doBounce();
      playSound(require('../../assets/sounds/lion.mp3'));
      Speech.speak(`Yes! That is a ${name}`, { rate: 1.0 });
      setTimeout(() => advance(ns), 1500);
    } else {
      doShake();
      Speech.speak(`No, this is ${shape.name}`, { rate: 1.1 });
      setTimeout(() => advance(score), 1800);
    }
  };

  const isCorrect = picked === shape.name;

  return (
    <PhoneSafe bg="#FFE0F0">
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}><Text style={s.backT}>←</Text></Pressable>
        <Text style={s.title}>Shape Quiz! 💎</Text>
        <View style={s.scorePill}><Text style={s.scoreT}>⭐ {score}</Text></View>
      </View>

      <View style={s.progressBar}>
        <View style={[s.progressFill, { width: `${(idx / TOTAL) * 100}%` }]}/>
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
            const isTarget = n === shape.name;
            const bg = !picked ? '#fff' : (isTarget ? '#5EE39F' : (isSelected ? '#FF5E5E' : '#fff'));
            const borderColor = !picked ? '#00000011' : (isTarget ? '#00C853' : (isSelected ? '#D32F2F' : '#00000011'));

            return (
              <Pressable key={n} onPress={() => pick(n)} disabled={picked !== null}
                style={[s.opt, { backgroundColor: bg, borderColor, elevation: isSelected ? 0 : 4 }]}>
                <Text style={[s.optT, { color: picked && (isSelected || isTarget) ? '#fff' : C.ink }]}>{n}</Text>
                {picked && isTarget && <Text style={s.mark}>✨</Text>}
              </Pressable>
            );
          })}
        </View>
      </View>

      {picked && (
        <View style={s.feedbackBox}>
          <Text style={[s.feedback, { color: isCorrect ? '#00C853' : '#D32F2F' }]}>
            {isCorrect ? 'WELL DONE!' : 'TRY AGAIN!'}
          </Text>
        </View>
      )}
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

