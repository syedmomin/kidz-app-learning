// src/screens/WordMatchScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions, Easing } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect, Polygon } from 'react-native-svg';
import * as Speech from 'expo-speech';
import PhoneSafe from '../components/PhoneSafe';
import { C } from '../theme';
import { useProgress } from '../store/ProgressStore';
import { useAudio } from '../hooks/useAudio';
import type { ScreenProps } from '../navigation/types';

const { width: SW } = Dimensions.get('window');
const TOTAL = 15;

// ─── SVG illustrations (Simplified & Clean) ───────────────────────────────────

const SvgCat = () => <Svg width="140" height="140" viewBox="0 0 160 160"><Ellipse cx="80" cy="115" rx="52" ry="38" fill={C.cream} stroke={C.ink} strokeWidth="4" /><Circle cx="80" cy="72" r="40" fill={C.cream} stroke={C.ink} strokeWidth="4" /><Path d="M 48 52 L 40 22 L 68 40 Z" fill={C.cream} stroke={C.ink} strokeWidth="4" /><Path d="M 112 52 L 120 22 L 92 40 Z" fill={C.cream} stroke={C.ink} strokeWidth="4" /><Ellipse cx="66" cy="70" rx="5" ry="7" fill={C.ink} /><Ellipse cx="94" cy="70" rx="5" ry="7" fill={C.ink} /><Path d="M 76 84 L 84 84 L 80 90 Z" fill={C.coral} stroke={C.ink} strokeWidth="2" /></Svg>;
const SvgSun = () => <Svg width="140" height="140" viewBox="0 0 160 160"><Circle cx="80" cy="80" r="34" fill={C.yellow} stroke={C.ink} strokeWidth="4" />{[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => { const r = a * Math.PI / 180, x1 = 80 + 40 * Math.cos(r), y1 = 80 + 40 * Math.sin(r), x2 = 80 + 58 * Math.cos(r), y2 = 80 + 58 * Math.sin(r); return <Path key={i} d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke={C.ink} strokeWidth="5" strokeLinecap="round" />; })}</Svg>;
const SvgApple = () => <Svg width="140" height="140" viewBox="0 0 160 160"><Path d="M 28 72 Q 28 30 80 30 Q 132 30 132 72 Q 132 138 80 148 Q 28 138 28 72 Z" fill={C.coral} stroke={C.ink} strokeWidth="4" /><Path d="M 80 30 Q 76 14 66 10" stroke={C.ink} strokeWidth="4" fill="none" strokeLinecap="round" /><Ellipse cx="90" cy="20" rx="12" ry="6" fill={C.mint} stroke={C.ink} strokeWidth="3" /></Svg>;
const SvgBall = () => <Svg width="140" height="140" viewBox="0 0 160 160"><Circle cx="80" cy="80" r="65" fill={C.coral} stroke={C.ink} strokeWidth="4" /><Path d="M 80,15 Q 110,80 80,145" stroke={C.ink} strokeWidth="3" fill="none" /><Path d="M 15,80 Q 80,110 145,80" stroke={C.ink} strokeWidth="3" fill="none" /></Svg>;
const SvgStar = () => <Svg width="140" height="140" viewBox="0 0 160 160"><Polygon points="80,10 96,55 145,58 108,88 120,135 80,108 40,135 52,88 15,58 64,55" fill={C.yellow} stroke={C.ink} strokeWidth="4" /></Svg>;

// ─── Round bank ───────────────────────────────────────────────────────────────

interface Round { word: string; options: string[]; Illus: () => React.ReactNode; bg: string }

const BANK: Round[] = [
  { word: 'CAT', options: ['CAT', 'BAT', 'COT', 'CUT'], Illus: SvgCat, bg: '#FFF8EC' },
  { word: 'SUN', options: ['SUN', 'BUN', 'SIN', 'GUN'], Illus: SvgSun, bg: '#FFF9C4' },
  { word: 'APPLE', options: ['APPLE', 'AMPLE', 'ABLE', 'ANKLE'], Illus: SvgApple, bg: '#FFEBEE' },
  { word: 'BALL', options: ['BALL', 'TALL', 'FALL', 'BELL'], Illus: SvgBall, bg: '#FFE0E0' },
  { word: 'STAR', options: ['STAR', 'SCAR', 'STIR', 'STAY'], Illus: SvgStar, bg: '#FFFDE7' },
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

function buildRounds(): Round[] {
  const result: Round[] = [];
  while (result.length < TOTAL) result.push(...shuffle(BANK));
  return result.slice(0, TOTAL);
}

const ROUNDS = buildRounds();

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function WordMatchScreen({ navigation }: ScreenProps<'WordMatch'>) {
  const { playSound } = useAudio();
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const { completeWord } = useProgress();

  const round = ROUNDS[idx];
  const optionsRef = useRef<string[]>(shuffle(round.options));
  const shake = useRef(new Animated.Value(0)).current;
  const slideIn = useRef(new Animated.Value(400)).current;
  const illusBounce = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    slideIn.setValue(400);
    Animated.spring(slideIn, { toValue: 0, damping: 15, stiffness: 100, useNativeDriver: true }).start();
    optionsRef.current = shuffle(round.options);
    Speech.stop();
    Speech.speak(`Which word is for this picture?`, { rate: 1.0 });
  }, [idx]);

  const doShake = () => Animated.sequence([
    Animated.timing(shake, { toValue: 12, duration: 60, useNativeDriver: true }),
    Animated.timing(shake, { toValue: -12, duration: 60, useNativeDriver: true }),
    Animated.timing(shake, { toValue: 8, duration: 60, useNativeDriver: true }),
    Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
  ]).start();

  const doBounce = () => Animated.sequence([
    Animated.spring(illusBounce, { toValue: 1.2, tension: 200, friction: 5, useNativeDriver: true }),
    Animated.spring(illusBounce, { toValue: 1, tension: 200, friction: 8, useNativeDriver: true }),
  ]).start();

  const advance = (sc: number) => {
    if (idx + 1 >= TOTAL) {
      navigation.navigate('Reward', { from: 'WordMatch', stars: 3 });
      return;
    }
    setIdx(i => i + 1);
    setPicked(null);
  };

  const pick = async (w: string) => {
    if (picked !== null) return;
    setPicked(w);
    if (w === round.word) {
      const ns = score + 1;
      setScore(ns);
      doBounce();
      playSound(require('../../assets/sounds/lion.mp3')); // Placeholder success sound
      Speech.speak(`Yes! ${w}`, { rate: 1.0 });
      await completeWord(w);
      setTimeout(() => advance(ns), 1500);
    } else {
      doShake();
      Speech.speak(`No, that is not ${round.word}`, { rate: 1.1 });
      setTimeout(() => advance(score), 1800);
    }
  };

  const isCorrect = picked === round.word;

  return (
    <PhoneSafe bg="#E8DCFF">
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}><Text style={s.backT}>←</Text></Pressable>
        <Text style={s.title}>Word Match! ✍️</Text>
        <View style={s.scorePill}><Text style={s.scoreT}>⭐ {score}</Text></View>
      </View>

      <View style={s.progressBar}>
        <View style={[s.progressFill, { width: `${(idx / TOTAL) * 100}%` }]} />
      </View>

      <View style={s.content}>
        <Animated.View style={[s.illusBox, {
          backgroundColor: round.bg,
          transform: [{ translateX: slideIn }, { translateX: shake }, { scale: illusBounce }]
        }]}>
          <View style={s.illusInner}>
            {round.Illus()}
          </View>
        </Animated.View>

        <View style={s.optGrid}>
          {optionsRef.current.map(w => {
            const isSelected = picked === w;
            const isTarget = w === round.word;
            const bg = !picked ? '#fff' : (isTarget ? '#5EE39F' : (isSelected ? '#FF5E5E' : '#fff'));
            const borderColor = !picked ? '#00000022' : (isTarget ? '#00C853' : (isSelected ? '#D32F2F' : '#00000022'));

            return (
              <Pressable key={w} onPress={() => pick(w)} disabled={picked !== null}
                style={[s.opt, { backgroundColor: bg, borderColor, elevation: isSelected ? 0 : 5 }]}>
                <Text style={[s.optT, { color: picked && (isSelected || isTarget) ? '#fff' : C.ink }]}>{w}</Text>
                {picked && isTarget && <Text style={s.mark}>✨</Text>}
              </Pressable>
            );
          })}
        </View>
      </View>

      {picked && (
        <Animated.View style={s.feedbackContainer}>
          <Text style={[s.feedback, { color: isCorrect ? '#00C853' : '#D32F2F' }]}>
            {isCorrect ? 'FANTASTIC!' : 'TRY NEXT ONE!'}
          </Text>
        </Animated.View>
      )}
    </PhoneSafe>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  back: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', elevation: 4, alignItems: 'center', justifyContent: 'center' },
  backT: { fontSize: 22, fontWeight: '900', color: C.ink },
  title: { flex: 1, textAlign: 'center', fontWeight: '900', fontSize: 22, color: C.ink },
  scorePill: { backgroundColor: '#FFE566', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 6, elevation: 4 },
  scoreT: { fontWeight: '900', fontSize: 16, color: C.ink },
  progressBar: { height: 14, marginHorizontal: 30, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 10, overflow: 'hidden', marginBottom: 10 },
  progressFill: { height: '100%', backgroundColor: C.purple, borderRadius: 10 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 40 },
  illusBox: { width: 220, height: 220, borderRadius: 40, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 30, elevation: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 15 },
  illusInner: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  optGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 15, paddingHorizontal: 20 },
  opt: { width: '45%', paddingVertical: 18, borderRadius: 24, borderWidth: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6 },
  optT: { fontSize: 20, fontWeight: '900', letterSpacing: 1 },
  mark: { position: 'absolute', right: 10, fontSize: 20 },
  feedbackContainer: { position: 'absolute', bottom: 40, width: '100%', alignItems: 'center' },
  feedback: { fontWeight: '900', fontSize: 28, letterSpacing: 2, textShadowColor: 'rgba(0,0,0,0.1)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
});
