// src/screens/ColorMixScreen.tsx — discover color mixing in a magical lab
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions, Easing } from 'react-native';
import Svg, { Path, Rect, Defs, ClipPath, Ellipse } from 'react-native-svg';
import * as Speech from 'expo-speech';
import PhoneSafe from '../components/PhoneSafe';
import GameHeader from '../components/GameHeader';
import { C } from '../theme';
import { useProgress } from '../store/ProgressStore';
import type { ScreenProps } from '../navigation/types';

const { width: SW, height: SH } = Dimensions.get('window');

type Hue = {
  id: string;
  name: string;
  emoji: string;
  color: string;
};

const PRIMARY: Hue[] = [
  { id: 'red',    name: 'Red',    emoji: '🍎', color: '#FF3B3B' },
  { id: 'yellow', name: 'Yellow', emoji: '🍌', color: '#FFD93D' },
  { id: 'blue',   name: 'Blue',   emoji: '🐳', color: '#2196F3' },
  { id: 'white',  name: 'White',  emoji: '☁️', color: '#FFFFFF' },
  { id: 'black',  name: 'Black',  emoji: '🌑', color: '#1A1A2E' },
  { id: 'orange', name: 'Orange', emoji: '🍊', color: '#FF8C00' },
  { id: 'green',  name: 'Green',  emoji: '🌿', color: '#4CAF50' },
  { id: 'purple', name: 'Purple', emoji: '🍇', color: '#9C27B0' },
];

const ORDER = ['red', 'yellow', 'blue', 'white', 'black', 'orange', 'green', 'purple'];

type Mix = { name: string; emoji: string; color: string };

// Order-independent mix lookup. Keys MUST follow ORDER above.
const MIX_TABLE: Record<string, Mix> = {
  // Primary + Primary
  'red+yellow':    { name: 'Orange',   emoji: '🍊', color: '#FF8C00' },
  'red+blue':      { name: 'Purple',   emoji: '🍇', color: '#9C27B0' },
  'yellow+blue':   { name: 'Green',    emoji: '🌿', color: '#4CAF50' },

  // Primary + White (lighter / pastel)
  'red+white':     { name: 'Pink',     emoji: '🌸', color: '#FFB6C1' },
  'yellow+white':  { name: 'Cream',    emoji: '🥛', color: '#FFF1A8' },
  'blue+white':    { name: 'Sky Blue', emoji: '💧', color: '#88C5F2' },

  // Primary + Black (deeper / darker)
  'red+black':     { name: 'Maroon',   emoji: '🍷', color: '#7A1F1F' },
  'yellow+black':  { name: 'Olive',    emoji: '🫒', color: '#7A6A1F' },
  'blue+black':    { name: 'Navy',     emoji: '🌌', color: '#0D1B4A' },

  // White + Black
  'white+black':   { name: 'Gray',     emoji: '🐭', color: '#9E9E9E' },

  // Primary + Secondary droplet
  'red+orange':    { name: 'Crimson',  emoji: '🌹', color: '#DC143C' },
  'red+green':     { name: 'Brown',    emoji: '🪵', color: '#8B5A2B' },
  'red+purple':    { name: 'Magenta',  emoji: '💗', color: '#FF2EAA' },
  'yellow+orange': { name: 'Gold',     emoji: '🪙', color: '#FFB700' },
  'yellow+green':  { name: 'Lime',     emoji: '🍋', color: '#9ACD32' },
  'yellow+purple': { name: 'Bronze',   emoji: '🥉', color: '#A07A20' },
  'blue+orange':   { name: 'Cocoa',    emoji: '🌰', color: '#7A4A1F' },
  'blue+green':    { name: 'Teal',     emoji: '🐢', color: '#008B8B' },
  'blue+purple':   { name: 'Indigo',   emoji: '🫐', color: '#4B0082' },

  // Secondary + White (pastel)
  'white+orange':  { name: 'Peach',    emoji: '🍑', color: '#FFCBA4' },
  'white+green':   { name: 'Mint',     emoji: '🌱', color: '#A8E6B0' },
  'white+purple':  { name: 'Lavender', emoji: '💜', color: '#C8A2D8' },

  // Secondary + Black (deep)
  'black+orange':  { name: 'Sienna',   emoji: '🍂', color: '#A0522D' },
  'black+green':   { name: 'Forest',   emoji: '🌲', color: '#1F4F1F' },
  'black+purple':  { name: 'Plum',     emoji: '🍆', color: '#5A2A5A' },

  // Secondary + Secondary
  'orange+green':  { name: 'Khaki',    emoji: '🥖', color: '#A0945A' },
  'orange+purple': { name: 'Russet',   emoji: '🍁', color: '#80461B' },
  'green+purple':  { name: 'Slate',    emoji: '🪨', color: '#5F6F6F' },
};

function mixKey(a: string, b: string) {
  const ai = ORDER.indexOf(a), bi = ORDER.indexOf(b);
  return (ai <= bi) ? `${a}+${b}` : `${b}+${a}`;
}

function computeMix(a: Hue | null, b: Hue | null): Mix | null {
  if (!a) return null;
  if (!b) return { name: a.name, emoji: a.emoji, color: a.color };
  if (a.id === b.id) return { name: a.name, emoji: a.emoji, color: a.color };
  return MIX_TABLE[mixKey(a.id, b.id)] ?? { name: a.name, emoji: a.emoji, color: a.color };
}

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

// ─── Falling droplet animation ─────────────────────────────────────────────

function FallingDrop({ color, fromX, onLand }: { color: string; fromX: number; onLand: () => void }) {
  const y = useRef(new Animated.Value(-40)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.timing(y, { toValue: 220, duration: 600, easing: Easing.bezier(0.45, 0, 0.55, 1), useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(y, { toValue: 240, duration: 100, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]),
    ]).start(({ finished }) => { if (finished) onLand(); });
  }, []);
  return (
    <Animated.View style={[fd.drop, { left: fromX - 12, backgroundColor: color, opacity, transform: [{ translateY: y }] }]} />
  );
}
const fd = StyleSheet.create({
  drop: { position: 'absolute', top: 0, width: 24, height: 32, borderRadius: 12, borderWidth: 2, borderColor: 'rgba(0,0,0,0.15)', zIndex: 150 },
});

// ─── Beaker ────────────────────────────────────────────────────────────────

function Beaker({ liquidColor, fillLevel, shake }: {
  liquidColor: string; fillLevel: Animated.Value; shake: Animated.Value;
}) {
  const W = 220, H = 260;
  return (
    <Animated.View style={[bk.outer, { transform: [{ translateX: shake }] }]}>
      <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs>
          <ClipPath id="beakerInside">
            {/* Inner area of beaker, slightly inset */}
            <Path d={`M 36 56 L 36 220 Q 36 244 60 244 L 160 244 Q 184 244 184 220 L 184 56 Z`} />
          </ClipPath>
        </Defs>

        {/* Glass back */}
        <Path d={`M 28 50 L 28 222 Q 28 252 60 252 L 160 252 Q 192 252 192 222 L 192 50`}
          fill="rgba(220,235,250,0.55)" stroke={C.ink} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />

        {/* Liquid */}
        <Rect x={0} y={0} width={W} height={H} fill={liquidColor} clipPath="url(#beakerInside)" opacity={0.95} />

        {/* Beaker mouth + lip */}
        <Path d={`M 18 50 L 202 50`} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
        <Ellipse cx={110} cy={50} rx={86} ry={8} fill="rgba(255,255,255,0.5)" stroke={C.ink} strokeWidth={2} />

        {/* Highlight */}
        <Path d={`M 50 70 L 50 220`} stroke="rgba(255,255,255,0.7)" strokeWidth={6} strokeLinecap="round" />
      </Svg>

      {/* Animated fill bar (overlay above SVG, simulating bubbling level) */}
      <Animated.View
        style={[bk.fillCap, {
          backgroundColor: liquidColor,
          height: fillLevel.interpolate({ inputRange: [0, 1], outputRange: [0, 180] }),
        }]}
      />
    </Animated.View>
  );
}
const bk = StyleSheet.create({
  outer: { width: 220, height: 260, alignItems: 'center', justifyContent: 'center' },
  fillCap: { position: 'absolute', bottom: 12, left: 36, right: 36, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, opacity: 0 }, // unused styling fallback
});

// ─── Color droplet button ──────────────────────────────────────────────────

function DropletButton({ hue, locked, onPress }: { hue: Hue; locked: boolean; onPress: (cx: number) => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const ref = useRef<View>(null);

  const handlePress = () => {
    if (locked) return;
    ref.current?.measure((_x, _y, _w, _h, pageX, pageY) => {
      Animated.sequence([
        Animated.spring(scale, { toValue: 1.15, useNativeDriver: true, speed: 80 }),
        Animated.spring(scale, { toValue: 1,    useNativeDriver: true, speed: 30 }),
      ]).start();
      onPress(pageX + 32); // pass screen X (used by drop animation)
    });
  };

  return (
    <Pressable onPress={handlePress} disabled={locked}>
      <Animated.View ref={ref as any} style={[db.btn, locked && db.btnDim, { transform: [{ scale }] }]}>
        <View style={[db.dropShape, { backgroundColor: hue.color, borderColor: hue.id === 'white' ? '#ccc' : C.ink }]}>
          <Text style={db.emoji}>{hue.emoji}</Text>
        </View>
        <Text style={[db.label, hue.id === 'white' && { color: C.ink }]}>{hue.name}</Text>
      </Animated.View>
    </Pressable>
  );
}
const db = StyleSheet.create({
  btn:       { alignItems: 'center', marginHorizontal: 3, marginVertical: 4, width: 76 },
  btnDim:    { opacity: 0.4 },
  dropShape: { width: 56, height: 70, borderTopLeftRadius: 28, borderTopRightRadius: 28, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, borderWidth: 3, alignItems: 'center', justifyContent: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.18, shadowRadius: 4 },
  emoji:     { fontSize: 22 },
  label:     { marginTop: 3, fontWeight: '900', fontSize: 11, color: C.ink },
});

// ─── Rounds ────────────────────────────────────────────────────────────────
//
// 50 rounds are generated by walking the mix table multiple times.
// Difficulty grows: Tier 1 (primaries) → Tier 2 (with white/black) → Tier 3
// (using the new orange/green/purple droplets). Each tier is shuffled so the
// same combo never appears twice in a row.

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

const TIER_1: string[] = [
  'red+yellow', 'yellow+blue', 'red+blue',
  'red+white', 'yellow+white', 'blue+white',
  'white+black',
];
const TIER_2: string[] = [
  'red+black', 'yellow+black', 'blue+black',
  'white+orange', 'white+green', 'white+purple',
  'red+orange', 'yellow+orange', 'blue+green',
  'red+purple', 'yellow+green', 'blue+purple',
];
const TIER_3: string[] = [
  'red+green', 'blue+orange', 'yellow+purple',  // complementary → browns
  'black+orange', 'black+green', 'black+purple',
  'orange+green', 'orange+purple', 'green+purple',
];

function buildRounds(): string[] {
  const list: string[] = [];
  // Tier 1 twice (~14)
  list.push(...shuffle(TIER_1), ...shuffle(TIER_1));
  // Tier 2 twice (~24) → total 38
  list.push(...shuffle(TIER_2), ...shuffle(TIER_2));
  // Tier 3 once (~9) → total 47
  list.push(...shuffle(TIER_3));
  // Top up with random picks from tier 2/3 to reach 50
  const fill = shuffle([...TIER_2, ...TIER_3]);
  while (list.length < 50) list.push(fill[list.length % fill.length]);
  // De-duplicate consecutive entries by swapping with a later one
  for (let i = 1; i < list.length; i++) {
    if (list[i] === list[i - 1]) {
      for (let j = i + 1; j < list.length; j++) {
        if (list[j] !== list[i - 1] && list[j] !== list[i + 1]) {
          [list[i], list[j]] = [list[j], list[i]];
          break;
        }
      }
    }
  }
  return list.slice(0, 50);
}

const ROUNDS = buildRounds();
const TOTAL = ROUNDS.length;

// ─── Screen ────────────────────────────────────────────────────────────────

export default function ColorMixScreen({ navigation }: ScreenProps<'ColorMix'>) {
  const { addStars, playGame } = useProgress();

  const [round,    setRound]    = useState(0);
  const [first,    setFirst]    = useState<Hue | null>(null);
  const [second,   setSecond]   = useState<Hue | null>(null);
  const [drops,    setDrops]    = useState<{ id: number; color: string; fromX: number }[]>([]);
  const [score,    setScore]    = useState(0);
  const [discovered, setDiscovered] = useState<Set<string>>(new Set());
  const [particles, setParticles] = useState<{ id: number; color: string; x: number; y: number }[]>([]);
  const [showWin,  setShowWin]  = useState(false);
  const [showWrong,setShowWrong]= useState(false);

  const fillLevel = useRef(new Animated.Value(0)).current;
  const shake     = useRef(new Animated.Value(0)).current;
  const promptOp  = useRef(new Animated.Value(0)).current;
  const promptSlide = useRef(new Animated.Value(30)).current;

  const targetKey = ROUNDS[round];
  const targetMix = MIX_TABLE[targetKey];
  const currentMix = computeMix(first, second);

  const hintFor = (key: string) => {
    const m = MIX_TABLE[key];
    return m ? `Mix to make ${m.name}! ${m.emoji}` : 'Mix two colors!';
  };

  useEffect(() => {
    promptOp.setValue(0);
    promptSlide.setValue(30);
    Animated.parallel([
      Animated.timing(promptOp, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.spring(promptSlide, { toValue: 0, tension: 80, friction: 9, useNativeDriver: true }),
    ]).start();

    Speech.stop();
    Speech.speak(hintFor(targetKey), { rate: 0.95, pitch: 1.1 });
  }, [round]);

  const animateFill = (level: number) => {
    Animated.spring(fillLevel, { toValue: level, tension: 70, friction: 9, useNativeDriver: false }).start();
  };

  const dropletPick = (hue: Hue, fromX: number) => {
    if (showWin) return;
    const dropId = Date.now();
    setDrops(prev => [...prev, { id: dropId, color: hue.color, fromX }]);

    if (!first) {
      setFirst(hue);
      animateFill(0.5);
    } else if (!second) {
      setSecond(hue);
      animateFill(1);
      // After both colors picked, evaluate
      setTimeout(() => evaluate(hue), 700);
    }
  };

  const evaluate = (justAdded: Hue) => {
    const mixedKey = first ? mixKey(first.id, justAdded.id) : '';
    const mix = computeMix(first, justAdded);
    if (!mix || !targetMix) return;

    const isCorrect = mix.color === targetMix.color;

    if (isCorrect) {
      setShowWin(true);
      setDiscovered(prev => {
        const n = new Set(prev);
        n.add(mixedKey);
        return n;
      });
      setScore(s => s + 1);

      setParticles(Array.from({ length: 24 }).map((_, i) => ({
        id: Date.now() + i,
        color: ['#FFD93D', '#FF6B6B', '#4ECDC4', '#A78BFA', '#7BE0AD', mix.color][i % 6],
        x: SW / 2 + (Math.random() - 0.5) * 80,
        y: SH * 0.4,
      })));

      Speech.stop();
      Speech.speak(`Yes! You made ${mix.name}!`, { rate: 1.0, pitch: 1.15 });

      setTimeout(() => {
        if (round + 1 >= TOTAL) {
          addStars(3);
          playGame('ColorMix');
          navigation.replace('Reward', { from: 'ColorMix', stars: 3 });
        } else {
          nextRound();
        }
      }, 2400);
    } else {
      setShowWrong(true);
      Animated.sequence([
        Animated.timing(shake, { toValue: 12,  duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -12, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 8,   duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0,   duration: 60, useNativeDriver: true }),
      ]).start();
      Speech.stop();
      Speech.speak(`That's ${mix.name}. Try again!`, { rate: 1.0, pitch: 1.05 });
      setTimeout(() => emptyBeaker(), 1800);
    }
  };

  const emptyBeaker = () => {
    setFirst(null);
    setSecond(null);
    setDrops([]);
    setShowWrong(false);
    animateFill(0);
  };

  const nextRound = () => {
    setRound(r => r + 1);
    setFirst(null);
    setSecond(null);
    setDrops([]);
    setShowWin(false);
    setShowWrong(false);
    setParticles([]);
    fillLevel.setValue(0);
  };

  const pourAgain = () => {
    if (showWin) return;
    Speech.stop();
    Speech.speak(hintFor(targetKey), { rate: 0.95, pitch: 1.1 });
  };

  const liquidColor = currentMix?.color ?? 'rgba(255,255,255,0.05)';
  const isLocked = (id: string) => {
    if (showWin) return true;
    // Disable a primary if it's already been picked twice
    if (first?.id === id && second?.id === id) return true;
    if (first && second) return true;
    return false;
  };

  return (
    <PhoneSafe bg="#FFF8E5">
      <GameHeader
        onBack={() => navigation.goBack()}
        title="Color Mix Lab! 🧪"
        score={score}
        scoreBg="#FF8DC7"
        scoreTextColor="#fff"
      />

      {/* Target prompt */}
      <Animated.View style={[s.target, { opacity: promptOp, transform: [{ translateY: promptSlide }] }]}>
        <Pressable onPress={pourAgain} style={s.targetCard}>
          <Text style={s.targetLabel}>Make this color:</Text>
          <View style={s.targetRow}>
            <View style={[s.targetSwatch, { backgroundColor: targetMix.color, borderColor: C.ink }]} />
            <Text style={s.targetName}>{targetMix.name} {targetMix.emoji}</Text>
            <Text style={s.replay}>🔊</Text>
          </View>
        </Pressable>
        <Text style={s.roundT}>Round {round + 1} / {TOTAL}</Text>
      </Animated.View>

      {/* Beaker stage */}
      <View style={s.beakerStage}>
        <Beaker liquidColor={liquidColor} fillLevel={fillLevel} shake={shake} />
        {/* Currently mixed name */}
        {currentMix && first && second && (
          <View style={s.mixLabel}>
            <Text style={s.mixLabelT}>= {currentMix.name} {currentMix.emoji}</Text>
          </View>
        )}
        {/* Falling drops */}
        {drops.map(d => (
          <FallingDrop key={d.id} color={d.color} fromX={d.fromX - SW / 2 + 110}
            onLand={() => setDrops(prev => prev.filter(x => x.id !== d.id))} />
        ))}
      </View>

      {/* Slot indicator */}
      <View style={s.slotsRow}>
        <View style={[s.slot, first && { backgroundColor: first.color, borderColor: C.ink }]}>
          <Text style={[s.slotT, first && { color: '#fff' }]}>{first?.name ?? '?'}</Text>
        </View>
        <Text style={s.plus}>+</Text>
        <View style={[s.slot, second && { backgroundColor: second.color, borderColor: C.ink }]}>
          <Text style={[s.slotT, second && { color: '#fff' }]}>{second?.name ?? '?'}</Text>
        </View>
      </View>

      {/* Droplets palette */}
      <View style={s.dropletsRow}>
        {PRIMARY.map(h => (
          <DropletButton key={h.id} hue={h} locked={isLocked(h.id)}
            onPress={(x) => dropletPick(h, x)} />
        ))}
      </View>

      {/* Action: empty beaker */}
      <View style={s.actions}>
        <Pressable onPress={emptyBeaker} style={[s.btn, { backgroundColor: '#fff' }]}>
          <Text style={s.btnT}>🚿 Empty</Text>
        </Pressable>
      </View>

      {/* Win banner */}
      {showWin && (
        <View style={s.winBanner} pointerEvents="none">
          <Text style={s.winT}>🎉 {targetMix.name}! {targetMix.emoji}</Text>
        </View>
      )}
      {showWrong && (
        <View style={[s.winBanner, { top: '38%' }]} pointerEvents="none">
          <Text style={[s.winT, { backgroundColor: '#FF8DC7', color: '#fff' }]}>Hmm, try again!</Text>
        </View>
      )}

      {particles.map(p => (
        <Particle key={p.id} color={p.color} x={p.x} y={p.y} />
      ))}
    </PhoneSafe>
  );
}

const s = StyleSheet.create({
  target:       { alignItems: 'center', marginTop: 4 },
  targetCard:   { backgroundColor: '#fff', borderRadius: 22, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 4, borderColor: C.ink, elevation: 4 },
  targetLabel:  { fontSize: 13, fontWeight: '700', color: C.inkSoft, textAlign: 'center' },
  targetRow:    { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 2 },
  targetSwatch: { width: 38, height: 38, borderRadius: 19, borderWidth: 3 },
  targetName:   { fontSize: 22, fontWeight: '900', color: C.ink },
  replay:       { fontSize: 16, opacity: 0.6 },
  roundT:       { marginTop: 6, fontSize: 12, fontWeight: '900', color: C.inkSoft },

  beakerStage:  { alignItems: 'center', marginTop: 8, height: 270 },
  mixLabel:     { position: 'absolute', bottom: -2, backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, borderWidth: 2, borderColor: C.ink, elevation: 4 },
  mixLabelT:    { fontSize: 14, fontWeight: '900', color: C.ink },

  slotsRow:     { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 6 },
  slot:         { width: 92, height: 38, borderRadius: 12, backgroundColor: '#fff', borderWidth: 2, borderColor: C.inkSoft, alignItems: 'center', justifyContent: 'center' },
  slotT:        { fontSize: 14, fontWeight: '900', color: C.inkSoft },
  plus:         { fontSize: 22, fontWeight: '900', color: C.ink },

  dropletsRow:  { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginTop: 12, paddingHorizontal: 8 },

  actions:      { flexDirection: 'row', justifyContent: 'center', marginTop: 10, paddingBottom: 8 },
  btn:          { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 22, borderWidth: 3, borderColor: C.ink, elevation: 4 },
  btnT:         { fontSize: 14, fontWeight: '900', color: C.ink },

  winBanner:    { position: 'absolute', top: '40%', left: 0, right: 0, alignItems: 'center', zIndex: 99 },
  winT:         { fontSize: 26, fontWeight: '900', color: C.ink, backgroundColor: '#FFD93D', paddingHorizontal: 22, paddingVertical: 12, borderRadius: 24, elevation: 8, borderWidth: 4, borderColor: '#fff' },
});
