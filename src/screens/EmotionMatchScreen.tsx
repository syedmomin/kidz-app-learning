import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions } from 'react-native';
import * as Speech from 'expo-speech';
import PhoneSafe from '../components/PhoneSafe';
import GameHeader from '../components/GameHeader';
import { C } from '../theme';
import { shuffle, calcStars } from '../utils';
import type { ScreenProps } from '../navigation/types';

const { width: SW } = Dimensions.get('window');

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Emotion {
  name: string;
  emoji: string;
  color: string;
  speech: string;
}

const EMOTIONS: Emotion[] = [
  { name: 'Happy',     emoji: '😊', color: '#FFE566', speech: 'Happy! When you feel joyful and glad.' },
  { name: 'Sad',       emoji: '😢', color: '#AED6F1', speech: 'Sad. When something makes you feel down.' },
  { name: 'Angry',     emoji: '😠', color: '#FFAB91', speech: 'Angry! When something bothers you a lot.' },
  { name: 'Surprised', emoji: '😲', color: '#C8E6C9', speech: 'Surprised! Something unexpected happened!' },
  { name: 'Scared',    emoji: '😨', color: '#CE93D8', speech: 'Scared. When something feels frightening.' },
  { name: 'Silly',     emoji: '🤪', color: '#FFCC80', speech: 'Silly! Being funny and goofy!' },
  { name: 'Sleepy',    emoji: '😴', color: '#B0BEC5', speech: 'Sleepy. Time to rest and dream!' },
  { name: 'Excited',   emoji: '🤩', color: '#F8BBD0', speech: 'Excited! Something amazing is happening!' },
  { name: 'Confused',  emoji: '😕', color: '#DCEDC8', speech: 'Confused. Not sure what is going on.' },
  { name: 'Proud',     emoji: '😤', color: '#FFF9C4', speech: 'Proud! You did something great!' },
  { name: 'Bored',     emoji: '😑', color: '#E0E0E0', speech: 'Bored. Nothing feels interesting right now.' },
  { name: 'Loved',     emoji: '🥰', color: '#FFCDD2', speech: 'Loved! Feeling warm hugs and care!' },
];

interface Round {
  emotion: Emotion;
  options: string[];
}

function buildRounds(): Round[] {
  const rounds: Round[] = [];
  const pool = [...EMOTIONS].sort(() => Math.random() - 0.5);
  for (let i = 0; i < 30; i++) {
    const emotion = pool[i % pool.length];
    const wrong = EMOTIONS
      .filter(e => e.name !== emotion.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(e => e.name);
    rounds.push({ emotion, options: shuffle([emotion.name, ...wrong]) });
  }
  return rounds;
}

const ROUNDS = buildRounds();
const TOTAL = ROUNDS.length;

// ─── Floating face bubbles ────────────────────────────────────────────────────

function FloatingBubble({ emoji, style }: { emoji: string; style: object }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 2200 + Math.random() * 800, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 2200 + Math.random() * 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const ty = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });
  return (
    <Animated.Text style={[{ fontSize: 26, opacity: 0.35 }, style, { transform: [{ translateY: ty }] }]}>
      {emoji}
    </Animated.Text>
  );
}

// ─── Confetti ─────────────────────────────────────────────────────────────────

const CONFETTI = ['❤️', '⭐', '🌈', '✨', '🎉'];
function Particle({ x, delay }: { x: number; delay: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(anim, { toValue: 1, duration: 900, useNativeDriver: true }),
    ]).start();
  }, []);
  const ty = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -220] });
  const op = anim.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] });
  return (
    <Animated.Text style={{ position: 'absolute', bottom: 0, left: x, fontSize: 24, opacity: op, transform: [{ translateY: ty }] }}>
      {CONFETTI[Math.floor(Math.random() * CONFETTI.length)]}
    </Animated.Text>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function EmotionMatchScreen({ navigation }: ScreenProps<'EmotionMatch'>) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFact, setShowFact] = useState(false);

  const shake = useRef(new Animated.Value(0)).current;
  const faceScale = useRef(new Animated.Value(1)).current;
  const slideIn = useRef(new Animated.Value(SW)).current;
  const facePulse = useRef(new Animated.Value(1)).current;

  const round = ROUNDS[idx];
  const { emotion } = round;

  useEffect(() => {
    slideIn.setValue(SW);
    Animated.spring(slideIn, { toValue: 0, damping: 14, stiffness: 80, useNativeDriver: true }).start();
    setShowConfetti(false);
    setShowFact(false);
    // Idle face pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(facePulse, { toValue: 1.08, duration: 900, useNativeDriver: true }),
        Animated.timing(facePulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();
    Speech.stop();
    Speech.speak('How does this face feel?', { rate: 0.95, pitch: 1.1 });
  }, [idx]);

  const doShake = () => Animated.sequence([
    Animated.timing(shake, { toValue: 15, duration: 60, useNativeDriver: true }),
    Animated.timing(shake, { toValue: -15, duration: 60, useNativeDriver: true }),
    Animated.timing(shake, { toValue: 9, duration: 60, useNativeDriver: true }),
    Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
  ]).start();

  const doBounce = () => {
    facePulse.stopAnimation();
    Animated.sequence([
      Animated.spring(faceScale, { toValue: 1.3, tension: 300, friction: 4, useNativeDriver: true }),
      Animated.spring(faceScale, { toValue: 1, tension: 200, friction: 8, useNativeDriver: true }),
    ]).start();
  };

  const pick = (opt: string) => {
    if (picked !== null) return;
    setPicked(opt);

    if (opt === emotion.name) {
      const next = score + 1;
      setScore(next);
      setShowConfetti(true);
      setShowFact(true);
      doBounce();
      Speech.stop();
      Speech.speak(emotion.speech, { rate: 0.95, pitch: 1.1 });
      setTimeout(() => advance(next), 2200);
    } else {
      doShake();
      Speech.stop();
      Speech.speak('Look at the face! How does it feel?', { rate: 1.1 });
      setTimeout(() => setPicked(null), 1400);
    }
  };

  const advance = (currentScore: number) => {
    if (idx + 1 >= TOTAL) {
      navigation.navigate('Reward', { from: 'EmotionMatch', stars: calcStars(currentScore, TOTAL) });
      return;
    }
    setIdx(i => i + 1);
    setPicked(null);
    setShowConfetti(false);
    setShowFact(false);
  };

  return (
    <PhoneSafe bg="#FFF5F8">
      <GameHeader
        onBack={() => navigation.goBack()}
        title="Emotion Match"
        subtitle={`Round ${idx + 1} / ${TOTAL}`}
        score={score}
        scoreBg="#FFCDD2"
      />

      <View style={s.progTrack}>
        <View style={[s.progFill, { width: `${((idx + 1) / TOTAL) * 100}%` }]} />
      </View>

      {/* Background bubbles */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <FloatingBubble emoji="😊" style={{ position: 'absolute', top: 140, left: 18 }} />
        <FloatingBubble emoji="😢" style={{ position: 'absolute', top: 200, right: 22 }} />
        <FloatingBubble emoji="😠" style={{ position: 'absolute', top: 280, left: 40 }} />
        <FloatingBubble emoji="🌈" style={{ position: 'absolute', top: 320, right: 30 }} />
      </View>

      {/* Face card */}
      <Animated.View style={[s.faceCard, { backgroundColor: emotion.color, transform: [{ translateX: shake }] }]}>
        <Text style={s.prompt}>How does this face feel? 🤔</Text>
        <Animated.Text style={[s.faceEmoji, { transform: [{ scale: faceScale }] }]}>
          {emotion.emoji}
        </Animated.Text>
        {showFact && (
          <Animated.View style={s.factBanner}>
            <Text style={s.factText}>{emotion.speech}</Text>
          </Animated.View>
        )}
      </Animated.View>

      {/* Options */}
      <View style={s.optGrid}>
        {round.options.map(opt => {
          const correct = picked === opt && opt === emotion.name;
          const wrong   = picked === opt && opt !== emotion.name;
          const optEmo  = EMOTIONS.find(e => e.name === opt);
          return (
            <Pressable
              key={opt}
              onPress={() => pick(opt)}
              style={[s.optBtn, correct && s.optCorrect, wrong && s.optWrong]}
            >
              <Text style={s.optEmoji}>{optEmo?.emoji}</Text>
              <Text style={s.optLabel}>{opt}</Text>
              {correct && <Text style={s.badge}>✓</Text>}
              {wrong && <Text style={s.badgeWrong}>✗</Text>}
            </Pressable>
          );
        })}
      </View>

      {showConfetti && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {[...Array(10)].map((_, i) => (
            <Particle key={i} x={20 + i * (SW / 11)} delay={i * 55} />
          ))}
        </View>
      )}
    </PhoneSafe>
  );
}

const s = StyleSheet.create({
  progTrack: { height: 8, backgroundColor: '#FFCDD2', marginHorizontal: 16, borderRadius: 4, marginBottom: 14 },
  progFill:  { height: 8, backgroundColor: '#E91E63', borderRadius: 4 },

  faceCard: {
    marginHorizontal: 18, borderRadius: 28, borderWidth: 3.5, borderColor: C.ink,
    padding: 20, alignItems: 'center', marginBottom: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 10, elevation: 5,
  },
  prompt: { fontSize: 16, fontWeight: '800', color: C.ink, marginBottom: 10 },
  faceEmoji: { fontSize: 100 },

  factBanner: {
    marginTop: 12, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 8, borderWidth: 2, borderColor: C.ink,
  },
  factText: { fontSize: 13, fontWeight: '700', color: C.ink, textAlign: 'center' },

  optGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, paddingHorizontal: 14 },
  optBtn: {
    width: (SW - 54) / 2, minHeight: 72, borderRadius: 20,
    backgroundColor: '#fff', borderWidth: 3, borderColor: C.ink,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row',
    gap: 8, paddingHorizontal: 10, position: 'relative',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1, shadowRadius: 6, elevation: 4,
  },
  optCorrect: { backgroundColor: '#D4FFDB', borderColor: '#2ECC71' },
  optWrong:   { backgroundColor: '#FFD6D6', borderColor: '#E74C3C' },
  optEmoji:   { fontSize: 28 },
  optLabel:   { fontSize: 16, fontWeight: '900', color: C.ink },

  badge:      { position: 'absolute', top: 6, right: 10, fontSize: 16, color: '#2ECC71', fontWeight: '900' },
  badgeWrong: { position: 'absolute', top: 6, right: 10, fontSize: 16, color: '#E74C3C', fontWeight: '900' },
});
