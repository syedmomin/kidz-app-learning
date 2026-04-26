// src/screens/ShapeQuizScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import * as Speech from 'expo-speech';
import PhoneSafe from '../components/PhoneSafe';
import AnswerGrid from '../components/AnswerGrid';
import GameHeader from '../components/GameHeader';
import { C } from '../theme';
import { shuffle } from '../utils';
import { useGameScreen } from '../hooks/useGameScreen';
import type { ScreenProps } from '../navigation/types';

import {
  SvgCircleShape, SvgSquareShape, SvgTriangleShape, SvgStarShape, SvgHeartShape,
  SvgOvalShape, SvgDiamondShape, SvgHexagonShape, SvgPentagonShape, SvgCrossShape,
  SvgCrescentShape, SvgArrowShape, SvgTrapezoidShape, SvgParallelogramShape, SvgOctagonShape,
  SvgHeptagonShape, SvgKiteShape, SvgSemiCircleShape, SvgDropShape, SvgPieShape
} from '../components/Illustrations';

// ─── All shapes ───────────────────────────────────────────────────────────────

interface ShapeDef { name: string; color: string; render: (f: string) => React.ReactNode }

const SHAPES: ShapeDef[] = [
  { name: 'Circle',         color: '#FF5E5E', render: f => <SvgCircleShape fill={f} /> },
  { name: 'Square',         color: '#5E8BFF', render: f => <SvgSquareShape fill={f} /> },
  { name: 'Triangle',       color: '#5EE39F', render: f => <SvgTriangleShape fill={f} /> },
  { name: 'Star',           color: '#FFEB3B', render: f => <SvgStarShape fill={f} /> },
  { name: 'Heart',          color: '#FF5EC1', render: f => <SvgHeartShape fill={f} /> },
  { name: 'Oval',           color: '#FF9800', render: f => <SvgOvalShape fill={f} /> },
  { name: 'Diamond',        color: '#9C27B0', render: f => <SvgDiamondShape fill={f} /> },
  { name: 'Hexagon',        color: '#00BCD4', render: f => <SvgHexagonShape fill={f} /> },
  { name: 'Pentagon',       color: '#4CAF50', render: f => <SvgPentagonShape fill={f} /> },
  { name: 'Cross',          color: '#FF5722', render: f => <SvgCrossShape fill={f} /> },
  { name: 'Crescent',       color: '#FFD54F', render: f => <SvgCrescentShape fill={f} /> },
  { name: 'Arrow',          color: '#FF5252', render: f => <SvgArrowShape fill={f} /> },
  { name: 'Trapezoid',      color: '#4CAF50', render: f => <SvgTrapezoidShape fill={f} /> },
  { name: 'Parallelogram',  color: '#2196F3', render: f => <SvgParallelogramShape fill={f} /> },
  { name: 'Octagon',        color: '#9C27B0', render: f => <SvgOctagonShape fill={f} /> },
  { name: 'Heptagon',       color: '#00BCD4', render: f => <SvgHeptagonShape fill={f} /> },
  { name: 'Kite',           color: '#E91E63', render: f => <SvgKiteShape fill={f} /> },
  { name: 'Semi-Circle',    color: '#8BC34A', render: f => <SvgSemiCircleShape fill={f} /> },
  { name: 'Drop',           color: '#03A9F4', render: f => <SvgDropShape fill={f} /> },
  { name: 'Pie',            color: '#FFC107', render: f => <SvgPieShape fill={f} /> },
];

const TOTAL = 200;

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
  const { idx, picked, setPicked, score, addScore, shake, slideIn, bounceAnim, triggerSlideIn, doShake, doBounce, advance } =
    useGameScreen({ total: TOTAL, from: 'ShapeQuiz', navigation });

  const { shape, options } = ROUNDS[idx];

  useEffect(() => {
    triggerSlideIn();
    Speech.stop();
    Speech.speak(`Can you find the ${shape.name}?`, { rate: 1.0 });
  }, [idx]);

  const pick = (name: string) => {
    if (picked !== null) return;
    setPicked(name);

    if (name === shape.name) {
      addScore();
      doBounce();
      Speech.stop();
      Speech.speak(`Yes! That is a ${name}`, { rate: 1.0, pitch: 1.1 });
      setTimeout(() => advance(), 1800);
    } else {
      doShake();
      Speech.stop();
      Speech.speak(`Oops! Try again!`, { rate: 1.1 });
      setTimeout(() => setPicked(null), 1500);
    }
  };

  return (
    <PhoneSafe bg="#FFE0F0">
      <GameHeader onBack={() => navigation.goBack()} title="Shape Quiz! 💎" score={score} />

      <View style={s.content}>
        <Text style={s.prompt}>Find the {shape.name}!</Text>

        <Animated.View style={[s.shapeCard, {
          transform: [{ translateX: slideIn }, { translateX: shake }, { scale: bounceAnim }],
          shadowColor: shape.color,
        }]}>
          <View style={s.innerCard}>
            {shape.render(shape.color)}
          </View>
        </Animated.View>

        <AnswerGrid options={options} picked={picked} correct={shape.name} onPick={pick} />
      </View>
    </PhoneSafe>
  );
}

const s = StyleSheet.create({
  content:   { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 40 },
  prompt:    { textAlign: 'center', fontWeight: '900', fontSize: 26, color: C.ink, marginBottom: 25 },
  shapeCard: { width: 220, height: 220, backgroundColor: '#fff', borderRadius: 45, alignItems: 'center', justifyContent: 'center', marginBottom: 40, elevation: 20, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.3, shadowRadius: 15 },
  innerCard: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
});
