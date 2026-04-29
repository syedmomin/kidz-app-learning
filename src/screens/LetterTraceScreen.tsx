// src/screens/LetterTraceScreen.tsx — finger-tracing handwriting practice
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable, Animated, Dimensions, Easing, PanResponder,
} from 'react-native';
import Svg, { Path, Circle, Polyline } from 'react-native-svg';
import * as Speech from 'expo-speech';
import PhoneSafe from '../components/PhoneSafe';
import GameHeader from '../components/GameHeader';
import { C } from '../theme';
import { useProgress } from '../store/ProgressStore';
import type { ScreenProps } from '../navigation/types';

const { width: SW, height: SH } = Dimensions.get('window');
const CANVAS = Math.min(SW - 36, 320);
const VB = 300; // SVG viewBox is 0..VB

type Lesson = {
  letter: string;
  word: string;
  emoji: string;
  bg: string;
  ink: string;
  // SVG path strings — multiple "M" commands let one path describe multi-stroke letters
  guide: string;
  // Sample dots along the stroke. Tracing covers a dot when the finger comes within DOT_HIT.
  dots: [number, number][];
};

const DOT_HIT = 28; // px in SVG coords
const MAX_STRAY = 42; // Max distance allowed from any dot to draw

const LESSONS: Lesson[] = [
  {
    letter: 'A', word: 'Apple', emoji: '🍎', bg: '#FFE6E6', ink: '#FF5252',
    guide: 'M 70 260 L 150 50 L 230 260 M 100 190 L 200 190',
    dots: [
      [70, 260], [85, 220], [100, 180], [115, 140], [130, 100], [150, 50], // Left leg
      [165, 100], [180, 140], [195, 180], [210, 220], [230, 260], // Right leg
      [110, 190], [135, 190], [165, 190], [190, 190] // Crossbar
    ],
  },
  {
    letter: 'B', word: 'Bear', emoji: '🐻', bg: '#FFE9D6', ink: '#FF8A4C',
    guide: 'M 90 50 L 90 260 M 90 50 Q 200 50 200 110 Q 200 155 90 155 Q 220 155 220 210 Q 220 260 90 260',
    dots: [
      [90, 50], [90, 90], [90, 130], [90, 170], [90, 210], [90, 260], // Vertical line
      [130, 50], [170, 60], [200, 90], [200, 120], [170, 145], [130, 155], // Top bump
      [130, 155], [180, 165], [220, 190], [220, 230], [180, 255], [130, 260] // Bottom bump
    ],
  },
  {
    letter: 'C', word: 'Cat', emoji: '🐱', bg: '#FFEED6', ink: '#FFB347',
    guide: 'M 230 90 Q 150 30 80 90 Q 30 155 80 220 Q 150 280 230 220',
    dots: [
      [230, 90], [200, 60], [150, 45], [100, 60], [70, 100], [50, 155], [70, 210], [100, 250], [150, 265], [200, 250], [230, 220]
    ],
  },
  {
    letter: 'D', word: 'Dog', emoji: '🐶', bg: '#FFF6CC', ink: '#D69E00',
    guide: 'M 90 50 L 90 260 M 90 50 Q 230 50 230 155 Q 230 260 90 260',
    dots: [
      [90, 50], [90, 100], [90, 155], [90, 210], [90, 260], // Vertical
      [130, 50], [180, 70], [220, 110], [230, 155], [220, 200], [180, 240], [130, 260] // Curve
    ],
  },
  {
    letter: 'E', word: 'Elephant', emoji: '🐘', bg: '#E5F0FF', ink: '#3FB5FF',
    guide: 'M 220 50 L 80 50 L 80 260 L 220 260 M 80 155 L 200 155',
    dots: [
      [220, 50], [150, 50], [80, 50], [80, 100], [80, 155], [80, 210], [80, 260], [150, 260], [220, 260], // Outer frame
      [120, 155], [160, 155], [200, 155] // Middle bar
    ],
  },
  {
    letter: 'H', word: 'House', emoji: '🏠', bg: '#E0F7E5', ink: '#3CB57F',
    guide: 'M 80 50 L 80 260 M 220 50 L 220 260 M 80 155 L 220 155',
    dots: [
      [80, 50], [80, 100], [80, 155], [80, 210], [80, 260], // Left leg
      [220, 50], [220, 100], [220, 155], [220, 210], [220, 260], // Right leg
      [120, 155], [150, 155], [180, 155] // Bridge
    ],
  },
  {
    letter: 'I', word: 'Ice cream', emoji: '🍦', bg: '#E5F0FF', ink: '#5E8BFF',
    guide: 'M 80 50 L 220 50 M 150 50 L 150 260 M 80 260 L 220 260',
    dots: [
      [80, 50], [120, 50], [150, 50], [180, 50], [220, 50], // Top
      [150, 100], [150, 155], [150, 210], // Stem
      [80, 260], [120, 260], [150, 260], [180, 260], [220, 260] // Bottom
    ],
  },
  {
    letter: 'L', word: 'Lion', emoji: '🦁', bg: '#FFF6CC', ink: '#FFCD2E',
    guide: 'M 90 50 L 90 260 L 230 260',
    dots: [
      [90, 50], [90, 100], [90, 155], [90, 210], [90, 260], // Vertical
      [140, 260], [190, 260], [230, 260] // Horizontal
    ],
  },
  {
    letter: 'O', word: 'Owl', emoji: '🦉', bg: '#F0E5FF', ink: '#8857E0',
    guide: 'M 150 50 Q 240 50 240 155 Q 240 260 150 260 Q 60 260 60 155 Q 60 50 150 50',
    dots: [
      [150, 50], [200, 60], [240, 110], [240, 155], [240, 200], [200, 250], [150, 265], [100, 250], [60, 200], [60, 155], [60, 110], [100, 60]
    ],
  },
  {
    letter: 'T', word: 'Train', emoji: '🚂', bg: '#FFE5F0', ink: '#FF6B6B',
    guide: 'M 70 50 L 230 50 M 150 50 L 150 260',
    dots: [
      [70, 50], [110, 50], [150, 50], [190, 50], [230, 50], // Top
      [150, 100], [150, 155], [150, 210], [150, 260] // Stem
    ],
  },
];

const PEN_COLORS = ['#FF3B3B', '#FF8C00', '#FFCD2E', '#4CAF50', '#2196F3', '#9C27B0', '#FF6FB1'];

// ─── Confetti particle ─────────────────────────────────────────────────────

function Particle({ color, x, y }: { color: string; x: number; y: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 1100, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, []);
  const tx = anim.interpolate({ inputRange: [0, 1], outputRange: [0, (Math.random() - 0.5) * 280] });
  const ty = anim.interpolate({ inputRange: [0, 1], outputRange: [0, (Math.random() - 0.5) * 320] });
  const rot = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${Math.random() * 540}deg`] });
  const op = anim.interpolate({ inputRange: [0, 0.85, 1], outputRange: [1, 1, 0] });
  const sc = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.3] });
  return (
    <Animated.View style={[pp.dot, {
      backgroundColor: color, left: x, top: y,
      transform: [{ translateX: tx }, { translateY: ty }, { rotate: rot }, { scale: sc }],
      opacity: op,
    }]} />
  );
}
const pp = StyleSheet.create({
  dot: { position: 'absolute', width: 12, height: 12, borderRadius: 3, zIndex: 200 },
});

// ─── Color swatch ──────────────────────────────────────────────────────────

function ColorSwatch({ color, selected, onPress }: { color: string; selected: boolean; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Pressable onPress={() => {
      Animated.sequence([
        Animated.spring(scale, { toValue: 1.3, useNativeDriver: true, speed: 60 }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30 }),
      ]).start();
      onPress();
    }}>
      <Animated.View style={[cs.dot, { backgroundColor: color, transform: [{ scale }] }, selected && cs.sel]}>
        {selected && <Text style={cs.check}>✓</Text>}
      </Animated.View>
    </Pressable>
  );
}
const cs = StyleSheet.create({
  dot: { width: 38, height: 38, borderRadius: 19, borderWidth: 2.5, borderColor: C.ink, marginHorizontal: 4, alignItems: 'center', justifyContent: 'center' },
  sel: { borderColor: '#fff', borderWidth: 4, elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
  check: { fontSize: 16, color: '#fff', fontWeight: '900', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
});

// ─── Pencil mascot floating overlay ────────────────────────────────────────

function PencilCursor({ x, y, visible }: { x: number; y: number; visible: boolean }) {
  if (!visible) return null;
  return (
    <View pointerEvents="none" style={[pc.wrap, { left: x - 16, top: y - 44 }]}>
      <Text style={pc.emoji}>✏️</Text>
    </View>
  );
}
const pc = StyleSheet.create({
  wrap: { position: 'absolute', zIndex: 50 },
  emoji: { fontSize: 32 },
});

// ─── Screen ────────────────────────────────────────────────────────────────

type Stroke = { color: string; points: [number, number][] };

export default function LetterTraceScreen({ navigation }: ScreenProps<'LetterTrace'>) {
  const { addStars, playGame } = useProgress();
  const [lessonIdx, setLessonIdx] = useState(0);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [activePts, setActivePts] = useState<[number, number][]>([]);
  const [color, setColor] = useState(PEN_COLORS[0]);
  const [coveredDots, setCoveredDots] = useState<Set<number>>(new Set());
  const [done, setDone] = useState(false);
  const [particles, setParticles] = useState<{ id: number; color: string; x: number; y: number }[]>([]);
  const [cursor, setCursor] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });

  const lesson = LESSONS[lessonIdx];
  const total = LESSONS.length;
  const coverage = coveredDots.size / lesson.dots.length;
  const canFinish = coverage >= 0.85;

  // Speak the prompt
  useEffect(() => {
    Speech.stop();
    Speech.speak(`Trace the letter ${lesson.letter}. ${lesson.letter} is for ${lesson.word}.`, { rate: 0.9, pitch: 1.1 });
  }, [lessonIdx]);

  // Auto-finish detection
  useEffect(() => {
    if (canFinish && !done) {
      setDone(true);
      Speech.stop();
      Speech.speak(`Awesome! ${lesson.letter} is for ${lesson.word}!`, { rate: 1.0, pitch: 1.15 });
      setParticles(Array.from({ length: 24 }).map((_, i) => ({
        id: Date.now() + i,
        color: PEN_COLORS[i % PEN_COLORS.length],
        x: SW / 2 + (Math.random() - 0.5) * 80,
        y: SH * 0.35,
      })));
    }
  }, [coveredDots.size]);

  // Reset for next lesson
  const advance = () => {
    if (lessonIdx + 1 >= total) {
      addStars(3);
      playGame('LetterTrace');
      navigation.replace('Reward', { from: 'LetterTrace', stars: 3 });
      return;
    }
    setLessonIdx(i => i + 1);
    setStrokes([]);
    setActivePts([]);
    setCoveredDots(new Set());
    setDone(false);
    setParticles([]);
  };

  const clearCanvas = () => {
    setStrokes([]);
    setActivePts([]);
    setCoveredDots(new Set());
    setDone(false);
  };

  // Convert raw touch px → SVG viewBox coords
  const toSvg = useCallback((px: number, py: number) => {
    const scale = VB / CANVAS;
    return [px * scale, py * scale] as [number, number];
  }, []);

  // Check if a point is near the letter path
  const isNearPath = useCallback((sx: number, sy: number) => {
    for (const dot of lesson.dots) {
      const dx = dot[0] - sx;
      const dy = dot[1] - sy;
      if (Math.hypot(dx, dy) <= MAX_STRAY) return true;
    }
    return false;
  }, [lesson]);

  // Test which dots are now covered
  const checkDots = useCallback((sx: number, sy: number) => {
    setCoveredDots(prev => {
      let changed = false;
      const next = new Set(prev);
      lesson.dots.forEach((d, i) => {
        if (next.has(i)) return;
        const dx = d[0] - sx, dy = d[1] - sy;
        if (Math.hypot(dx, dy) <= DOT_HIT) {
          next.add(i);
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [lesson]);

  // Use refs so PanResponder closure has stable handlers
  const handleStart = useCallback((x: number, y: number) => {
    if (done) return;
    const [sx, sy] = toSvg(x, y);
    if (!isNearPath(sx, sy)) {
      setCursor({ x, y, visible: true }); // Still show cursor but don't draw
      return;
    }
    setActivePts([[sx, sy]]);
    setCursor({ x, y, visible: true });
    checkDots(sx, sy);
  }, [done, toSvg, checkDots, isNearPath]);

  const handleMove = useCallback((x: number, y: number) => {
    if (done) return;
    const [sx, sy] = toSvg(x, y);
    setCursor({ x, y, visible: true });

    if (!isNearPath(sx, sy)) {
      // If we stray off path, end the current stroke
      if (activePts.length > 0) {
        setStrokes(s => [...s, { color, points: activePts }]);
        setActivePts([]);
      }
      return;
    }

    setActivePts(prev => prev.length === 0 ? [[sx, sy]] : [...prev, [sx, sy]]);
    checkDots(sx, sy);
  }, [done, toSvg, checkDots, isNearPath, activePts, color]);

  const handleEnd = useCallback(() => {
    setCursor(c => ({ ...c, visible: false }));
    setActivePts(prev => {
      if (prev.length > 1) {
        setStrokes(s => [...s, { color, points: prev }]);
      }
      return [];
    });
  }, [color]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => handleStart(e.nativeEvent.locationX, e.nativeEvent.locationY),
      onPanResponderMove: (e) => handleMove(e.nativeEvent.locationX, e.nativeEvent.locationY),
      onPanResponderRelease: handleEnd,
      onPanResponderTerminate: handleEnd,
    })
  ).current;

  return (
    <PhoneSafe bg={lesson.bg}>
      <GameHeader
        onBack={() => navigation.goBack()}
        title="Trace the Letter ✏️"
        score={lessonIdx + 1}
        scoreBg={lesson.ink}
        scoreTextColor="#fff"
      />

      {/* Prompt */}
      <View style={s.promptRow}>
        <Pressable onPress={() => Speech.speak(`${lesson.letter} is for ${lesson.word}`, { rate: 0.9, pitch: 1.1 })}
          style={[s.promptCard, { borderColor: lesson.ink }]}>
          <Text style={[s.promptLetter, { color: lesson.ink }]}>{lesson.letter}</Text>
          <Text style={s.promptWord}>is for {lesson.word} {lesson.emoji}</Text>
          <Text style={s.replay}>🔊</Text>
        </Pressable>
      </View>

      {/* Tracing canvas */}
      <View style={s.canvasRow}>
        <View style={[s.canvas, { width: CANVAS, height: CANVAS }]} {...panResponder.panHandlers}>
          <Svg width={CANVAS} height={CANVAS} viewBox={`0 0 ${VB} ${VB}`} pointerEvents="none">
            {/* Letter highway: thick faint outline */}
            <Path d={lesson.guide} stroke={lesson.ink} strokeOpacity={0.18} strokeWidth={36} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Dashed guide */}
            <Path d={lesson.guide} stroke={lesson.ink} strokeOpacity={0.55} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray="6 8" />
            {/* Dots */}
            {lesson.dots.map((d, i) => (
              <Circle key={i} cx={d[0]} cy={d[1]} r={6}
                fill={coveredDots.has(i) ? '#FFD93D' : '#fff'}
                stroke={coveredDots.has(i) ? '#F2A516' : lesson.ink}
                strokeWidth={2.5} />
            ))}
            {/* Completed strokes */}
            {strokes.map((st, i) => (
              <Polyline key={i}
                points={st.points.map(p => p.join(',')).join(' ')}
                stroke={st.color} strokeWidth={14}
                strokeLinecap="round" strokeLinejoin="round" fill="none" />
            ))}
            {/* Active stroke */}
            {activePts.length > 1 && (
              <Polyline
                points={activePts.map(p => p.join(',')).join(' ')}
                stroke={color} strokeWidth={14}
                strokeLinecap="round" strokeLinejoin="round" fill="none" />
            )}
          </Svg>
          <PencilCursor x={cursor.x} y={cursor.y} visible={cursor.visible} />
        </View>
      </View>

      {/* Color palette */}
      <View style={s.paletteRow}>
        {PEN_COLORS.map(c => (
          <ColorSwatch key={c} color={c} selected={c === color} onPress={() => setColor(c)} />
        ))}
      </View>

      {/* Action bar */}
      <View style={s.actions}>
        <Pressable onPress={clearCanvas} style={[s.btn, { backgroundColor: '#fff' }]}>
          <Text style={s.btnT}>🧹 Erase</Text>
        </Pressable>
        <Pressable onPress={advance} disabled={!done}
          style={[s.btn, s.btnNext, { backgroundColor: done ? '#7BE0AD' : '#D9D9D9' }]}>
          <Text style={[s.btnT, { color: done ? '#fff' : '#888' }]}>{done ? 'Next ›' : 'Trace it!'}</Text>
        </Pressable>
      </View>

      {done && (
        <View style={s.winBanner} pointerEvents="none">
          <Text style={s.winT}>🎉 {lesson.letter} for {lesson.word}! {lesson.emoji}</Text>
        </View>
      )}

      {particles.map(p => (
        <Particle key={p.id} color={p.color} x={p.x} y={p.y} />
      ))}
    </PhoneSafe>
  );
}

const s = StyleSheet.create({
  promptRow: { alignItems: 'center', marginTop: -2 },
  promptCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 22, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 4, gap: 8, elevation: 4 },
  promptLetter: { fontSize: 36, fontWeight: '900' },
  promptWord: { fontSize: 16, fontWeight: '800', color: C.ink },
  replay: { fontSize: 18, marginLeft: 4, opacity: 0.6 },


  canvasRow: { alignItems: 'center', marginTop: 12 },
  canvas: { backgroundColor: '#fff', borderRadius: 26, overflow: 'hidden', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 8, borderWidth: 4, borderColor: '#fff' },

  paletteRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 14 },

  actions: { flexDirection: 'row', justifyContent: 'center', gap: 12, paddingHorizontal: 24, marginTop: 12, paddingBottom: 8 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 22, alignItems: 'center', borderWidth: 3, borderColor: C.ink, elevation: 4 },
  btnNext: {},
  btnT: { fontSize: 16, fontWeight: '900', color: C.ink },

  winBanner: { position: 'absolute', top: '40%', left: 0, right: 0, alignItems: 'center', zIndex: 99 },
  winT: { fontSize: 24, fontWeight: '900', color: C.ink, backgroundColor: '#FFD93D', paddingHorizontal: 22, paddingVertical: 12, borderRadius: 24, elevation: 8, borderWidth: 4, borderColor: '#fff' },
})
