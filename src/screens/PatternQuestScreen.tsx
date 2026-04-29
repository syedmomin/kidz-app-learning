import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions, Easing } from 'react-native';
import * as Speech from 'expo-speech';
import PhoneSafe from '../components/PhoneSafe';
import GameHeader from '../components/GameHeader';
import { C } from '../theme';
import { shuffle, calcStars } from '../utils';
import type { ScreenProps } from '../navigation/types';

const { width: SW, height: SH } = Dimensions.get('window');

// ─── Pattern Data Expansion ───────────────────────────────────────────────────

const SETS = [
  ['🍎', '🍌', '🍇', '🍊', '🍓'], // Fruit
  ['🐶', '🐱', '🐸', '🐔', '🐷'], // Farm
  ['🚗', '✈️', '🚀', '🚂', '🚁'], // Transport
  ['⚽', '🏀', '🎾', '🏐', '🎱'], // Sports
  ['🦋', '🐝', '🐞', '🕷️', '🦗'], // Bugs
  ['🪐', '⭐', '🌙', '☀️', '☄️'], // Space
  ['🍦', '🍩', '🍰', '🧁', '🍭'], // Sweets
  ['🦁', '🐘', '🦒', '🦓', '🐵'], // Safari
  ['🧸', '🪀', '🪁', '🧩', '🎨'], // Toys
  ['🐋', '🐙', '🐢', '🐡', '🦀'], // Ocean
  ['🔺', '🔷', '⭐', '🟢', '🟨'], // Shapes
  ['🔴', '🔵', '🟢', '🟡', '🟣'], // Colors
];

type PatType = 'ABAB' | 'AABB' | 'ABC' | 'AAB' | 'ABB' | 'ABCA' | 'ABCD' | 'ABBA';

interface Round {
  seq: string[];   
  answer: string;
  options: string[];
  hint: string;
}

function makeRound(idx: number): Round {
  const level = Math.floor(idx / 5); // Increase complexity every 5 rounds
  const setIdx = idx % SETS.length;
  const set = SETS[setIdx];
  const [A, B, C, D] = set;
  
  let type: PatType;
  if (level === 0) type = 'ABAB';
  else if (level === 1) type = 'AABB';
  else if (level === 2) type = Math.random() > 0.5 ? 'AAB' : 'ABB';
  else if (level === 3) type = 'ABC';
  else if (level === 4) type = 'ABCA';
  else if (level === 5) type = 'ABBA';
  else type = ['ABC', 'ABCD', 'ABCA', 'AAB', 'ABB'][Math.floor(Math.random() * 5)] as PatType;

  let seq: string[];
  let answer: string;
  let hint: string;

  switch (type) {
    case 'ABAB':  
      seq = [A, B, A, B]; answer = A; 
      hint = 'Tap-Tap! One then the other!'; break;
    case 'AABB':  
      seq = [A, A, B, B]; answer = A; 
      hint = 'Double trouble! Two by two!'; break;
    case 'AAB':   
      seq = [A, A, B, A, A]; answer = B; 
      hint = 'Two same, one different!'; break;
    case 'ABB':   
      seq = [A, B, B, A, B]; answer = B; 
      hint = 'One same, two different!'; break;
    case 'ABC':   
      seq = [A, B, C, A, B]; answer = C; 
      hint = 'One, two, three... repeat!'; break;
    case 'ABCA':  
      seq = [A, B, C, A, B, C]; answer = A; 
      hint = 'A big long loop!'; break;
    case 'ABCD':  
      seq = [A, B, C, D, A, B, C]; answer = D; 
      hint = 'Four in a row! Can you guess?'; break;
    case 'ABBA':  
      seq = [A, B, B, A, A, B]; answer = B; 
      hint = 'Look at the mirror pattern!'; break;
    default:      
      seq = [A, B, A, B]; answer = A; hint = 'What comes next?';
  }

  const distractors = shuffle(set.filter(x => x !== answer)).slice(0, 3);
  const options = shuffle([answer, ...distractors]);
  
  return { seq, answer, options, hint };
}

const TOTAL_ROUNDS = 50;

// ─── UI Components ───────────────────────────────────────────────────────────

function FloatingElement({ emoji, size, speed, delay }: { emoji: string, size: number, speed: number, delay: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: speed,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const ty = anim.interpolate({ inputRange: [0, 1], outputRange: [SH + 50, -100] });
  const rot = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const x = useRef(Math.random() * SW).current;

  return (
    <Animated.Text style={[ps.floating, { left: x, fontSize: size, transform: [{ translateY: ty }, { rotate: rot }] }]}>
      {emoji}
    </Animated.Text>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function PatternQuestScreen({ navigation }: ScreenProps<'PatternQuest'>) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Use a stable round based on index
  const [round, setRound] = useState(makeRound(0));

  const slideAnim = useRef(new Animated.Value(SW)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const qScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const newRound = makeRound(idx);
    setRound(newRound);

    // Reset animations for new round
    slideAnim.setValue(SW);
    qScale.setValue(1);
    
    Animated.spring(slideAnim, { toValue: 0, damping: 15, stiffness: 60, useNativeDriver: true }).start();

    // Pulse the question mark
    Animated.loop(
      Animated.sequence([
        Animated.timing(qScale, { toValue: 1.15, duration: 600, useNativeDriver: true }),
        Animated.timing(qScale, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();

    Speech.stop();
    Speech.speak(newRound.hint, { rate: 1.0, pitch: 1.1 });
  }, [idx]);

  const doShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 15, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -15, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const onPick = (opt: string) => {
    if (picked) return;
    setPicked(opt);

    if (opt === round.answer) {
      setScore(s => s + 1);
      setShowConfetti(true);
      Speech.stop();
      Speech.speak('Perfect! You found it!', { rate: 1.0, pitch: 1.2 });
      setTimeout(() => {
        if (idx + 1 >= TOTAL_ROUNDS) {
          navigation.navigate('Reward', { from: 'PatternQuest', stars: 3 });
        } else {
          setIdx(i => i + 1);
          setPicked(null);
          setShowConfetti(false);
        }
      }, 1500);
    } else {
      doShake();
      Speech.stop();
      Speech.speak('Ouch! Try again!', { rate: 1.1 });
      setTimeout(() => setPicked(null), 1200);
    }
  };

  return (
    <PhoneSafe bg="#EEF2FF">
      {/* Background Decor */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <FloatingElement emoji="⭐" size={24} speed={8000} delay={0} />
        <FloatingElement emoji="🎈" size={32} speed={12000} delay={2000} />
        <FloatingElement emoji="✨" size={20} speed={10000} delay={4000} />
      </View>

      <GameHeader
        onBack={() => navigation.goBack()}
        title="Pattern Quest 🧩"
        score={score}
        scoreBg="#C7D2FE"
      />

      <View style={ps.main}>
        {/* Hint Bubble */}
        <View style={ps.hintBubble}>
          <Text style={ps.hintEmoji}>💡</Text>
          <Text style={ps.hintText}>{round.hint}</Text>
        </View>

        {/* Pattern Rail */}
        <Animated.View style={[ps.railCard, { transform: [{ translateX: slideAnim }, { translateX: shakeAnim }] }]}>
          <View style={ps.railTitleRow}>
            <Text style={ps.railTitle}>Fill the Pattern!</Text>
            <View style={ps.progressDotRow}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[ps.dot, idx % 5 > i && ps.dotDone, idx % 5 === i && ps.dotActive]} />
              ))}
            </View>
          </View>

          <View style={ps.seqContainer}>
            {round.seq.map((item, i) => (
              <View key={i} style={ps.itemBox}>
                <Text style={ps.itemEmoji}>{item}</Text>
              </View>
            ))}
            <Animated.View style={[ps.itemBox, ps.itemBoxQ, { transform: [{ scale: qScale }] }]}>
              {picked === round.answer ? (
                <Text style={ps.itemEmoji}>{round.answer}</Text>
              ) : (
                <Text style={ps.qMark}>?</Text>
              )}
            </Animated.View>
          </View>
        </Animated.View>

        {/* Options */}
        <View style={ps.optionsGrid}>
          {round.options.map((opt) => {
            const isCorrect = picked === opt && opt === round.answer;
            const isWrong = picked === opt && opt !== round.answer;
            return (
              <Pressable
                key={opt}
                onPress={() => onPick(opt)}
                style={({ pressed }) => [
                  ps.optBtn,
                  isCorrect && ps.optCorrect,
                  isWrong && ps.optWrong,
                  pressed && ps.optPressed,
                ]}
              >
                <Text style={ps.optEmoji}>{opt}</Text>
                {isCorrect && <View style={ps.badge}><Text style={ps.badgeT}>✓</Text></View>}
                {isWrong && <View style={[ps.badge, ps.badgeW]}><Text style={ps.badgeT}>✗</Text></View>}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Footer Info */}
      <View style={ps.footer}>
        <Text style={ps.footerT}>Level {Math.floor(idx / 5) + 1} 🚀</Text>
      </View>

      {showConfetti && (
        <View style={ps.overlay} pointerEvents="none">
          <Text style={ps.hugeText}>AMAZING! 🌟</Text>
        </View>
      )}
    </PhoneSafe>
  );
}

const ps = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },
  floating: { position: 'absolute', opacity: 0.3, zIndex: -1 },
  
  hintBubble: {
    flexDirection: 'row', backgroundColor: '#fff', padding: 12, borderRadius: 20,
    alignItems: 'center', alignSelf: 'center', marginBottom: 20, gap: 10,
    borderWidth: 2, borderColor: '#C7D2FE', elevation: 3, shadowOpacity: 0.05,
  },
  hintEmoji: { fontSize: 20 },
  hintText: { fontSize: 14, fontWeight: '800', color: '#4F46E5' },

  railCard: {
    backgroundColor: '#fff', borderRadius: 32, padding: 20, borderWidth: 4, borderColor: C.ink,
    elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15, shadowRadius: 10,
  },
  railTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  railTitle: { fontSize: 18, fontWeight: '900', color: C.ink },
  progressDotRow: { flexDirection: 'row', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E0E7FF' },
  dotActive: { backgroundColor: '#4F46E5', width: 20 },
  dotDone: { backgroundColor: '#818CF8' },

  seqContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  itemBox: {
    width: 62, height: 62, borderRadius: 18, backgroundColor: '#F3F4F6',
    borderWidth: 3, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center',
  },
  itemBoxQ: { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' },
  itemEmoji: { fontSize: 32 },
  qMark: { fontSize: 36, fontWeight: '900', color: '#D97706' },

  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginTop: 30 },
  optBtn: {
    width: (SW - 64) / 2, height: 100, borderRadius: 24, backgroundColor: '#fff',
    borderWidth: 4, borderColor: C.ink, alignItems: 'center', justifyContent: 'center',
    elevation: 4, shadowOpacity: 0.1,
  },
  optPressed: { transform: [{ scale: 0.95 }] },
  optCorrect: { backgroundColor: '#DCFCE7', borderColor: '#22C55E' },
  optWrong: { backgroundColor: '#FEE2E2', borderColor: '#EF4444' },
  optEmoji: { fontSize: 44 },

  badge: {
    position: 'absolute', top: -10, right: -10, width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#22C55E', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff',
  },
  badgeW: { backgroundColor: '#EF4444' },
  badgeT: { color: '#fff', fontWeight: '900', fontSize: 18 },

  footer: { paddingBottom: 20, alignItems: 'center' },
  footerT: { fontSize: 16, fontWeight: '900', color: '#6366F1', backgroundColor: '#EEF2FF', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },

  overlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.4)', zIndex: 100 },
  hugeText: { fontSize: 48, fontWeight: '900', color: '#4F46E5', textShadowColor: '#fff', textShadowRadius: 10 },
});
