// src/screens/MemoryFlipScreen.tsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, Pressable,
  Animated, Dimensions, Easing
} from 'react-native';
import * as Speech from 'expo-speech';
import PhoneSafe from '../components/PhoneSafe';
import { C } from '../theme';
import { useAudio } from '../hooks/useAudio';
import type { ScreenProps } from '../navigation/types';

const { width: SW } = Dimensions.get('window');
const COLS   = 4;
const PAD    = 16;
const GAP    = 12;
const CARD_W = (SW - PAD * 2 - GAP * (COLS - 1)) / COLS;
const CARD_H = CARD_W * 1.3;

const PAIRS = [
  { emoji: '🐱', sound: require('../../assets/sounds/cat.mp3'), name: 'Cat' },
  { emoji: '🐶', sound: require('../../assets/sounds/dog.mp3'), name: 'Dog' },
  { emoji: '🐸', sound: require('../../assets/sounds/frog.mp3'), name: 'Frog' },
  { emoji: '🦁', sound: require('../../assets/sounds/lion.mp3'), name: 'Lion' },
  { emoji: '🐼', sound: require('../../assets/sounds/panda.mp3'), name: 'Panda' },
  { emoji: '🦊', sound: require('../../assets/sounds/fox.mp3'), name: 'Fox' },
  { emoji: '🐧', sound: require('../../assets/sounds/penguin.mp3'), name: 'Penguin' },
  { emoji: '🐘', sound: require('../../assets/sounds/elephant.mp3'), name: 'Elephant' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

interface Card { id: number; pairIdx: number; emoji: string; sound: any; name: string }

function buildDeck(): Card[] {
  const deck = [...PAIRS, ...PAIRS].map((p, i) => ({
    id: i,
    pairIdx: PAIRS.indexOf(p),
    emoji: p.emoji,
    sound: p.sound,
    name: p.name,
  }));
  return shuffle(deck);
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ─── Single card ─────────────────────────────────────────────────────────────

type CardStatus = 'hidden' | 'revealed' | 'matched';

function MemCard({ card, status, onPress }: {
  card:    Card;
  status:  CardStatus;
  onPress: () => void;
}) {
  const rot     = useRef(new Animated.Value(0)).current;
  const matchSc = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(rot, {
      toValue: status === 'hidden' ? 0 : 1,
      tension: 120,
      friction: 12,
      useNativeDriver: true
    }).start();
  }, [status]);

  useEffect(() => {
    if (status === 'matched') {
      Animated.sequence([
        Animated.spring(matchSc, { toValue: 1.2, tension: 200, friction: 5, useNativeDriver: true }),
        Animated.spring(matchSc, { toValue: 1,    tension: 200, friction: 8, useNativeDriver: true }),
      ]).start();
    }
  }, [status]);

  const frontRot = rot.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
  const backRot  = rot.interpolate({ inputRange: [0, 1], outputRange: ['0deg',   '180deg'] });
  const frontOp  = rot.interpolate({ inputRange: [0.45, 0.5], outputRange: [0, 1] });
  const backOp   = rot.interpolate({ inputRange: [0.45, 0.5], outputRange: [1, 0] });

  return (
    <Pressable
      onPress={status === 'hidden' ? onPress : undefined}
      style={{ width: CARD_W, height: CARD_H, marginBottom: GAP }}
    >
      <Animated.View style={{ flex: 1, transform: [{ scale: matchSc }] }}>
        {/* Back (hidden) */}
        <Animated.View style={[
          mc.side,
          { backgroundColor: '#5E8BFF', opacity: backOp, transform: [{ rotateY: backRot }] }
        ]}>
          <View style={mc.innerBack}>
            <Text style={mc.backQ}>🐾</Text>
          </View>
        </Animated.View>

        {/* Front (emoji) */}
        <Animated.View style={[
          mc.side,
          { backgroundColor: status === 'matched' ? '#5EE39F' : '#fff', opacity: frontOp, transform: [{ rotateY: frontRot }] }
        ]}>
          <View style={mc.innerFront}>
            <Text style={mc.emoji}>{card.emoji}</Text>
            {status === 'matched' && <Text style={mc.tick}>✅</Text>}
          </View>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function MemoryFlipScreen({ navigation }: ScreenProps<'MemoryFlip'>) {
  const { playSound } = useAudio();
  const [deck,     setDeck]     = useState<Card[]>(buildDeck);
  const [statuses, setStatuses] = useState<CardStatus[]>(() => new Array(16).fill('hidden'));
  const [moves,    setMoves]    = useState(0);
  const [matched,  setMatched]  = useState(0);
  const busy    = useRef(false);
  const first   = useRef<number | null>(null);

  const total = PAIRS.length;
  const done  = matched === total;

  const restart = () => {
    setDeck(buildDeck());
    setStatuses(new Array(16).fill('hidden'));
    setMoves(0);
    setMatched(0);
    busy.current  = false;
    first.current = null;
  };

  const tap = useCallback((idx: number) => {
    if (busy.current || statuses[idx] !== 'hidden') return;

    if (first.current === null) {
      first.current = idx;
      setStatuses(prev => prev.map((s, i) => i === idx ? 'revealed' : s) as CardStatus[]);
    } else {
      const firstIdx = first.current;
      first.current  = null;
      busy.current   = true;

      setStatuses(prev => prev.map((s, i) => i === idx ? 'revealed' : s) as CardStatus[]);
      setMoves(m => m + 1);

      const isMatch = deck[firstIdx].pairIdx === deck[idx].pairIdx;

      if (isMatch) {
        setTimeout(() => {
          playSound(deck[idx].sound);
          Speech.speak(deck[idx].name, { rate: 1.1 });
          setStatuses(prev => prev.map((s, i) =>
            i === firstIdx || i === idx ? 'matched' : s
          ) as CardStatus[]);
          setMatched(m => m + 1);
          busy.current = false;
        }, 500);
      } else {
        setTimeout(() => {
          setStatuses(prev => prev.map((s, i) =>
            (i === firstIdx || i === idx) && s === 'revealed' ? 'hidden' : s
          ) as CardStatus[]);
          busy.current = false;
        }, 1000);
      }
    }
  }, [statuses, deck, playSound]);

  return (
    <PhoneSafe bg="#E3F2FD">
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}>
          <Text style={s.backT}>←</Text>
        </Pressable>
        <Text style={s.title}>Memory Match! 🐶</Text>
        <View style={s.movePill}>
          <Text style={s.moveT}>Moves: {moves}</Text>
        </View>
      </View>

      <View style={s.progressContainer}>
        <View style={s.progressBar}>
          <Animated.View style={[s.progressFill, { width: `${(matched / total) * 100}%` }]}/>
        </View>
        <Text style={s.progressText}>{matched} / {total} Pairs Matched</Text>
      </View>

      {done ? (
        <View style={s.winBox}>
          <Text style={s.winEmoji}>🏆</Text>
          <Text style={s.winTitle}>Amazing Job!</Text>
          <Text style={s.winSub}>You found all pairs in {moves} moves!</Text>
          <Pressable style={s.primaryBtn} onPress={() => navigation.navigate('Reward', { from: 'MemoryFlip', stars: 3 })}>
            <Text style={s.btnT}>Claim Reward! ✨</Text>
          </Pressable>
          <Pressable style={s.secondaryBtn} onPress={restart}>
            <Text style={s.secondaryBtnT}>Play Again 🔄</Text>
          </Pressable>
        </View>
      ) : (
        <View style={s.grid}>
          {deck.map((card, idx) => (
            <MemCard
              key={card.id}
              card={card}
              status={statuses[idx]}
              onPress={() => tap(idx)}
            />
          ))}
        </View>
      )}
    </PhoneSafe>
  );
}

const mc = StyleSheet.create({
  side:   { position: 'absolute', width: '100%', height: '100%', borderRadius: 16, borderWidth: 0, overflow: 'hidden', backfaceVisibility: 'hidden', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 5 },
  innerBack: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#5E8BFF', borderContent: 'none' },
  innerFront: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  backQ:  { fontSize: 32 },
  emoji:  { fontSize: CARD_W * 0.6 },
  tick:   { position: 'absolute', top: 4, right: 6, fontSize: 16 },
});

const s = StyleSheet.create({
  header:      { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 10 },
  back:        { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', elevation: 4, alignItems: 'center', justifyContent: 'center' },
  backT:       { fontSize: 22, fontWeight: '900', color: C.ink },
  title:       { flex: 1, textAlign: 'center', fontWeight: '900', fontSize: 22, color: C.ink },
  movePill:    { backgroundColor: '#FFE566', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, elevation: 4 },
  moveT:       { fontWeight: '900', fontSize: 14, color: C.ink },
  progressContainer: { paddingHorizontal: 24, marginBottom: 20, alignItems: 'center' },
  progressBar: { height: 14, width: '100%', backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden', elevation: 2 },
  progressFill:{ height: '100%', backgroundColor: '#5EE39F', borderRadius: 10 },
  progressText: { marginTop: 6, fontSize: 13, fontWeight: '800', color: '#666' },
  grid:        { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: GAP, paddingHorizontal: PAD },
  winBox:      { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  winEmoji:    { fontSize: 80, marginBottom: 10 },
  winTitle:    { fontSize: 32, fontWeight: '900', color: C.ink },
  winSub:      { fontSize: 18, color: '#666', marginTop: 8, textAlign: 'center', marginBottom: 30 },
  primaryBtn:  { backgroundColor: '#FF5E5E', paddingHorizontal: 40, paddingVertical: 18, borderRadius: 30, elevation: 6 },
  secondaryBtn: { marginTop: 20 },
  secondaryBtnT: { fontSize: 16, fontWeight: '800', color: '#5E8BFF' },
  btnT:        { fontSize: 20, fontWeight: '900', color: '#fff' },
});

