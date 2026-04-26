import React, { useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import Svg, { Path, Circle, Text as SvgT } from 'react-native-svg';
import PhoneSafe from '../components/PhoneSafe';
import { KButton } from '../components/ui';
import { C } from '../theme';
import type { ScreenProps } from '../navigation/types';
import { useProgress } from '../store/ProgressStore';

// ── Letter outlines (guide path + start dot position) ─────────────────────────
const LETTER_DATA: Record<string, { path: string; color: string; startX: number; startY: number }> = {
  A: { color: '#FF4444', startX: 150, startY: 40,
       path: 'M 150 40 L 60 280 M 150 40 L 240 280 M 90 190 L 210 190' },
  B: { color: '#2196F3', startX: 70, startY: 40,
       path: 'M 70 40 L 70 280 M 70 40 L 180 40 Q 220 40 220 100 Q 220 160 70 160 M 70 160 L 185 160 Q 230 160 230 220 Q 230 280 185 280 L 70 280' },
  C: { color: '#4CAF50', startX: 220, startY: 80,
       path: 'M 220 80 Q 150 20 80 80 Q 30 130 30 160 Q 30 230 80 250 Q 150 290 220 240' },
  D: { color: '#9C27B0', startX: 70, startY: 40,
       path: 'M 70 40 L 70 280 M 70 40 L 170 40 Q 240 40 240 160 Q 240 280 170 280 L 70 280' },
  E: { color: '#FF9800', startX: 70, startY: 40,
       path: 'M 220 40 L 70 40 L 70 280 L 220 280 M 70 160 L 190 160' },
  F: { color: '#E91E63', startX: 70, startY: 40,
       path: 'M 220 40 L 70 40 L 70 280 M 70 160 L 190 160' },
  G: { color: '#009688', startX: 220, startY: 80,
       path: 'M 220 80 Q 150 20 80 80 Q 30 130 30 160 Q 30 230 80 260 Q 150 300 220 250 L 220 180 L 160 180' },
  H: { color: '#3F51B5', startX: 70, startY: 40,
       path: 'M 70 40 L 70 280 M 70 160 L 230 160 M 230 40 L 230 280' },
  I: { color: '#F44336', startX: 150, startY: 40,
       path: 'M 100 40 L 200 40 M 150 40 L 150 280 M 100 280 L 200 280' },
  J: { color: '#FF5722', startX: 200, startY: 40,
       path: 'M 120 40 L 200 40 M 200 40 L 200 230 Q 200 290 140 290 Q 80 290 80 240' },
  K: { color: '#795548', startX: 70, startY: 40,
       path: 'M 70 40 L 70 280 M 230 40 L 70 160 M 70 160 L 230 280' },
  L: { color: '#607D8B', startX: 70, startY: 40,
       path: 'M 70 40 L 70 280 L 230 280' },
  M: { color: '#FF4444', startX: 60, startY: 280,
       path: 'M 60 280 L 60 40 L 150 160 L 240 40 L 240 280' },
  N: { color: '#2196F3', startX: 70, startY: 280,
       path: 'M 70 280 L 70 40 L 230 280 L 230 40' },
  O: { color: '#4CAF50', startX: 150, startY: 30,
       path: 'M 150 30 Q 240 30 240 160 Q 240 290 150 290 Q 60 290 60 160 Q 60 30 150 30' },
  P: { color: '#9C27B0', startX: 70, startY: 40,
       path: 'M 70 40 L 70 280 M 70 40 L 180 40 Q 230 40 230 110 Q 230 175 180 175 L 70 175' },
  Q: { color: '#FF9800', startX: 150, startY: 30,
       path: 'M 150 30 Q 240 30 240 160 Q 240 290 150 290 Q 60 290 60 160 Q 60 30 150 30 M 180 220 L 240 290' },
  R: { color: '#E91E63', startX: 70, startY: 40,
       path: 'M 70 40 L 70 280 M 70 40 L 180 40 Q 230 40 230 110 Q 230 175 180 175 L 70 175 M 160 175 L 230 280' },
  S: { color: '#009688', startX: 220, startY: 80,
       path: 'M 220 80 Q 160 20 90 60 Q 50 90 80 150 Q 100 180 150 165 Q 220 150 220 210 Q 210 280 130 290 Q 70 290 60 250' },
  T: { color: '#3F51B5', startX: 60, startY: 40,
       path: 'M 60 40 L 240 40 M 150 40 L 150 280' },
  U: { color: '#F44336', startX: 70, startY: 40,
       path: 'M 70 40 L 70 220 Q 70 290 150 290 Q 230 290 230 220 L 230 40' },
  V: { color: '#FF5722', startX: 60, startY: 40,
       path: 'M 60 40 L 150 280 L 240 40' },
  W: { color: '#795548', startX: 60, startY: 40,
       path: 'M 60 40 L 100 280 L 150 150 L 200 280 L 240 40' },
  X: { color: '#607D8B', startX: 60, startY: 40,
       path: 'M 60 40 L 240 280 M 240 40 L 60 280' },
  Y: { color: '#FF4444', startX: 60, startY: 40,
       path: 'M 60 40 L 150 180 M 240 40 L 150 180 L 150 280' },
  Z: { color: '#2196F3', startX: 60, startY: 40,
       path: 'M 60 40 L 240 40 L 60 280 L 240 280' },
};

// ── Measure coverage: what % of guide path bounding box was covered ────────────
function calcScore(drawnPaths: string[]): number {
  if (drawnPaths.length === 0) return 0;
  // Count total drawn points
  let points = 0;
  drawnPaths.forEach(p => {
    points += (p.match(/L/g) || []).length;
  });
  // Generous scoring — 20 points = 60%, 50 = 100%
  const score = Math.min(100, Math.round((points / 40) * 100));
  return score;
}

function starsFromScore(score: number): number {
  if (score >= 80) return 3;
  if (score >= 50) return 2;
  if (score >= 20) return 1;
  return 0;
}

// ── Score popup ───────────────────────────────────────────────────────────────
function ScorePopup({ score, stars, onContinue, onRetry }: {
  score: number; stars: number; onContinue: () => void; onRetry: () => void;
}) {
  const starEmojis = ['⭐', '⭐⭐', '⭐⭐⭐'];
  const msgs = ['Keep trying! 💪', 'Good job! 👍', 'Well done! 🎉', 'Perfect! 🏆'];
  return (
    <View style={sp.overlay}>
      <View style={sp.card}>
        <Text style={sp.title}>Your Score</Text>

        {/* Circular progress */}
        <View style={sp.circleWrap}>
          <Svg width={140} height={140} viewBox="0 0 140 140">
            {/* bg ring */}
            <Circle cx="70" cy="70" r="58" fill="none" stroke="#eee" strokeWidth="14"/>
            {/* score arc — circumference = 2π×58 ≈ 364 */}
            <Circle cx="70" cy="70" r="58" fill="none"
              stroke={score >= 80 ? '#4CAF50' : score >= 50 ? '#FF9800' : score >= 20 ? '#2196F3' : '#F44336'}
              strokeWidth="14"
              strokeDasharray={`${(score / 100) * 364} 364`}
              strokeLinecap="round"
              transform="rotate(-90 70 70)"
            />
            <SvgT x="70" y="62" textAnchor="middle" fontSize="32" fontWeight="900"
              fill={score >= 80 ? '#4CAF50' : score >= 50 ? '#FF9800' : '#2196F3'}>{score}%</SvgT>
            <SvgT x="70" y="85" textAnchor="middle" fontSize="13" fill="#888">score</SvgT>
          </Svg>
        </View>

        <Text style={sp.stars}>{stars > 0 ? starEmojis[stars - 1] : '😢'}</Text>
        <Text style={sp.msg}>{msgs[stars]}</Text>

        <View style={sp.btns}>
          <Pressable style={sp.retry} onPress={onRetry}>
            <Text style={sp.retryT}>🔁 Try Again</Text>
          </Pressable>
          <KButton color={score >= 20 ? C.mint : '#ccc'} size="md" onPress={onContinue}>
            {score >= 20 ? 'Continue ➜' : 'Skip'}
          </KButton>
        </View>
      </View>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function LessonScreen({ navigation, route }: ScreenProps<'Lesson'>) {
  const letter = route?.params?.letter || 'A';
  const data = LETTER_DATA[letter] || LETTER_DATA['A'];

  const [paths, setPaths] = useState<string[]>([]);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const currentPath = useRef('');
  const isDrawing = useRef(false);
  const { completeLetter, addStars, touchStreak } = useProgress();

  React.useEffect(() => {
    import('expo-speech').then(Speech => {
      Speech.speak(letter, { rate: 0.8, pitch: 1.2 });
    });
  }, [letter]);

  const layoutRef = useRef({ width: 300, height: 340 });

  const mapTouchToSvg = (e: any) => {
    const t = e.nativeEvent.touches?.[0] || e.nativeEvent;
    const rawX = t.locationX ?? t.clientX;
    const rawY = t.locationY ?? t.clientY;
    
    const svgW = 300;
    const svgH = 340;
    const scale = Math.min(layoutRef.current.width / svgW, layoutRef.current.height / svgH);
    const offsetX = (layoutRef.current.width - svgW * scale) / 2;
    const offsetY = (layoutRef.current.height - svgH * scale) / 2;

    return {
      x: (rawX - offsetX) / scale,
      y: (rawY - offsetY) / scale
    };
  };

  // Touch handlers via onStartShouldSetResponder etc on the View
  const onTouchStart = useCallback((e: any) => {
    const { x, y } = mapTouchToSvg(e);
    currentPath.current = `M ${x.toFixed(0)} ${y.toFixed(0)}`;
    setPaths(p => [...p, currentPath.current]);
    isDrawing.current = true;
  }, []);

  const onTouchMove = useCallback((e: any) => {
    if (!isDrawing.current) return;
    const { x, y } = mapTouchToSvg(e);
    currentPath.current += ` L ${x.toFixed(0)} ${y.toFixed(0)}`;
    setPaths(p => { const n = [...p]; n[n.length - 1] = currentPath.current; return n; });
  }, []);

  const onTouchEnd = useCallback(() => { isDrawing.current = false; }, []);

  const clear = () => { setPaths([]); currentPath.current = ''; isDrawing.current = false; };

  const finish = async () => {
    const s = calcScore(paths);
    const st = starsFromScore(s);
    setScore(s);
    setShowScore(true);
    if (s >= 20) {
      await touchStreak();
      await completeLetter(letter);
      await addStars(st);
    }
  };

  const handleContinue = () => {
    navigation.navigate('Reward', { from: 'Lesson', stars: starsFromScore(score) });
  };

  const handleRetry = () => {
    clear();
    setShowScore(false);
    setScore(0);
  };

  return (
    <PhoneSafe bg="#FFF8F0">
      {/* Header */}
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backText}>←</Text>
        </Pressable>
        <Text style={s.title}>Trace Letter  <Text style={[s.letterBig, { color: data.color }]}>{letter}</Text></Text>
        <View style={{ width: 46 }} /> {/* spacer */}
      </View>

      {/* Hint */}
      <View style={s.hint}>
        <Text style={s.hintEmoji}>✏️</Text>
        <Text style={s.hintText}>Follow the <Text style={{ color: data.color, fontWeight: '900' }}>outline</Text> with your finger!</Text>
      </View>

      {/* Canvas */}
      <View
        style={s.canvas}
        onLayout={e => { layoutRef.current = e.nativeEvent.layout; }}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={onTouchStart}
        onResponderMove={onTouchMove}
        onResponderRelease={onTouchEnd}
      >
        <Svg width="100%" height="100%" viewBox="0 0 300 340">
          {/* Guide letter outline */}
          <Path
            d={data.path}
            fill="none"
            stroke={data.color}
            strokeWidth="28"
            strokeOpacity={0.18}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d={data.path}
            fill="none"
            stroke={data.color}
            strokeWidth="5"
            strokeOpacity={0.7}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="12 8"
          />
          {/* Start dot */}
          <Circle cx={data.startX} cy={data.startY} r="16" fill={data.color} opacity={0.9}/>
          <SvgT x={data.startX} y={data.startY + 5} textAnchor="middle" fontSize="14" fontWeight="900" fill="#fff">GO</SvgT>

          {/* Drawn strokes */}
          {paths.map((d, i) => (
            <Path key={i} d={d} stroke={C.coral} strokeWidth="16" fill="none"
              strokeLinecap="round" strokeLinejoin="round" opacity={0.85}/>
          ))}
        </Svg>
      </View>

      {/* Actions */}
      <View style={s.actions}>
        <Pressable onPress={clear} style={s.iconBtn}>
          <Text style={{ fontSize: 24 }}>🔁</Text>
        </Pressable>
        <KButton color={C.mint} shadowColor={C.mintDeep} size="md" fullWidth onPress={finish} style={{ flex: 1, marginHorizontal: 12 }}>
          Check Score ✓
        </KButton>
        <Pressable style={[s.iconBtn, { backgroundColor: C.yellow }]} onPress={() => {
          import('expo-speech').then(Speech => {
            Speech.speak(letter, { rate: 0.8, pitch: 1.2 });
          });
        }}>
          <Text style={{ fontSize: 24 }}>🔊</Text>
        </Pressable>
      </View>

      {/* Score popup */}
      {showScore && (
        <ScorePopup
          score={score}
          stars={starsFromScore(score)}
          onContinue={handleContinue}
          onRetry={handleRetry}
        />
      )}
    </PhoneSafe>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingTop: 8, paddingBottom: 6, gap: 10 },
  backBtn: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#fff', borderWidth: 3, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 22, fontWeight: '900', color: C.ink },
  audioBtn: { width: 46, height: 46, borderRadius: 23, backgroundColor: C.yellow, borderWidth: 3, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontWeight: '900', fontSize: 20, color: C.ink, textAlign: 'center' },
  letterBig: { fontSize: 28, fontWeight: '900' },
  hint: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 3, borderColor: C.ink, borderRadius: 20, marginHorizontal: 14, marginBottom: 8, paddingHorizontal: 14, paddingVertical: 8, gap: 8 },
  hintEmoji: { fontSize: 20 },
  hintText: { flex: 1, fontSize: 14, fontWeight: '700', color: C.ink },
  canvas: { flex: 1, marginHorizontal: 14, marginBottom: 8, backgroundColor: '#FFFDF5', borderWidth: 4, borderColor: C.ink, borderRadius: 28, overflow: 'hidden' },
  actions: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingBottom: 14 },
  iconBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#fff', borderWidth: 3.5, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
});

const sp = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center', zIndex: 99 },
  card: { backgroundColor: '#fff', borderRadius: 32, borderWidth: 4, borderColor: C.ink, padding: 28, alignItems: 'center', width: '85%', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 12 },
  title: { fontSize: 24, fontWeight: '900', color: C.ink, marginBottom: 16 },
  circleWrap: { marginBottom: 12 },
  stars: { fontSize: 36, marginBottom: 6 },
  msg: { fontSize: 18, fontWeight: '800', color: C.ink, marginBottom: 20 },
  btns: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  retry: { backgroundColor: '#F5F5F5', borderWidth: 3, borderColor: C.ink, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 12 },
  retryT: { fontWeight: '800', fontSize: 15, color: C.ink },
});
