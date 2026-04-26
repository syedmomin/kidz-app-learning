// src/screens/MemoryFlipScreen.tsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, Pressable,
  Animated, Dimensions, Easing, ScrollView
} from 'react-native';
import PhoneSafe from '../components/PhoneSafe';
import { C } from '../theme';
import GameHeader from '../components/GameHeader';
import { shuffle } from '../utils';
import { useAudio } from '../hooks/useAudio';
import type { ScreenProps } from '../navigation/types';

const { width: SW } = Dimensions.get('window');
const PAD = 10;
const GAP = 8;

const PAIRS_DATA = [
  { emoji: '🐱', sound: require('../../assets/sounds/cat.mp3'), name: 'Cat' },
  { emoji: '🐶', sound: require('../../assets/sounds/dog.mp3'), name: 'Dog' },
  { emoji: '🐸', sound: require('../../assets/sounds/frog.mp3'), name: 'Frog' },
  { emoji: '🦁', sound: require('../../assets/sounds/lion.mp3'), name: 'Lion' },
  { emoji: '🐼', sound: require('../../assets/sounds/panda.mp3'), name: 'Panda' },
  { emoji: '🦊', sound: require('../../assets/sounds/fox.mp3'), name: 'Fox' },
  { emoji: '🐧', sound: require('../../assets/sounds/penguin.mp3'), name: 'Penguin' },
  { emoji: '🐘', sound: require('../../assets/sounds/elephant.mp3'), name: 'Elephant' },
  { emoji: '🐵', sound: require('../../assets/sounds/monkey.mp3'), name: 'Monkey' },
  { emoji: '🦓', sound: require('../../assets/sounds/zebra.mp3'), name: 'Zebra' },
  { emoji: '🦒', sound: require('../../assets/sounds/giraffe.mp3'), name: 'Giraffe' },
  { emoji: '🐯', sound: require('../../assets/sounds/tiger.mp3'), name: 'Tiger' },
  { emoji: '🦉', sound: require('../../assets/sounds/owl.mp3'), name: 'Owl' },
  { emoji: '🐻', sound: require('../../assets/sounds/bear.mp3'), name: 'Bear' },
  { emoji: '🐺', sound: require('../../assets/sounds/wolf.mp3'), name: 'Wolf' },
];

interface Card { id: number; pairIdx: number; emoji: string; sound: any; name: string }


function buildDeck(pairCount: number): Card[] {
  const selectedPairs = shuffle(PAIRS_DATA).slice(0, pairCount);
  const deck = [...selectedPairs, ...selectedPairs].map((p, i) => ({
    id: i,
    pairIdx: PAIRS_DATA.indexOf(p),
    emoji: p.emoji,
    sound: p.sound,
    name: p.name,
  }));
  return shuffle(deck);
}

// ─── Single card ─────────────────────────────────────────────────────────────

type CardStatus = 'hidden' | 'revealed' | 'matched';

function MemCard({ card, status, onPress, width, height }: {
  card: Card;
  status: CardStatus;
  onPress: () => void;
  width: number;
  height: number;
}) {
  const rot = useRef(new Animated.Value(0)).current;
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
        Animated.spring(matchSc, { toValue: 1.15, tension: 200, friction: 5, useNativeDriver: true }),
        Animated.spring(matchSc, { toValue: 1, tension: 200, friction: 8, useNativeDriver: true }),
      ]).start();
    }
  }, [status]);

  const frontRot = rot.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
  const backRot = rot.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const frontOp = rot.interpolate({ inputRange: [0.45, 0.5], outputRange: [0, 1] });
  const backOp = rot.interpolate({ inputRange: [0.45, 0.5], outputRange: [1, 0] });

  return (
    <Pressable onPress={status === 'hidden' ? onPress : undefined} style={{ width, height, marginBottom: GAP }}>
      <Animated.View style={{ flex: 1, transform: [{ scale: matchSc }] }}>
        <Animated.View style={[mc.side, { backgroundColor: '#5E8BFF', opacity: backOp, transform: [{ rotateY: backRot }] }]}>
          <Text style={[mc.backQ, { fontSize: width * 0.4 }]}>🐾</Text>
        </Animated.View>
        <Animated.View style={[mc.side, { backgroundColor: status === 'matched' ? '#5EE39F' : '#fff', opacity: frontOp, transform: [{ rotateY: frontRot }] }]}>
          <Text style={[mc.emoji, { fontSize: width * 0.5 }]}>{card.emoji}</Text>
          {status === 'matched' && <Text style={[mc.tick, { fontSize: width * 0.2 }]}>✅</Text>}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function MemoryFlipScreen({ navigation }: ScreenProps<'MemoryFlip'>) {
  const { playSound } = useAudio();
  const [level, setLevel] = useState(1);
  const [deck, setDeck] = useState(() => buildDeck(2));
  const [statuses, setStatuses] = useState<CardStatus[]>(() => new Array(4).fill('hidden'));
  const [matched, setMatched] = useState(0);
  const busy = useRef(false);
  const first = useRef<number | null>(null);

  // Harder Difficulty Scaling Logic
  const getPairCount = (lv: number) => {
    if (lv === 1) return 2;  // 4 cards (2x2)
    if (lv === 2) return 4;  // 8 cards (4x2)
    if (lv === 3) return 6;  // 12 cards (4x3)
    if (lv === 4) return 8;  // 16 cards (4x4)
    if (lv === 5) return 10; // 20 cards (4x5)
    if (lv === 6) return 12; // 24 cards (4x6)
    return 15; // 30 cards (5x6)
  };

  const getCols = (lv: number) => {
    if (lv === 1) return 2;
    if (lv >= 7) return 5;
    return 4;
  };

  const pairCount = getPairCount(level);
  const cols = getCols(level);
  const cardW = (SW - PAD * 2 - GAP * (cols - 1)) / cols;
  const cardH = cardW * 1.25;
  const isDone = matched === pairCount;

  const nextLevel = () => {
    const nextLv = level + 1;
    const nextPairs = getPairCount(nextLv);
    setLevel(nextLv);
    setDeck(buildDeck(nextPairs));
    setStatuses(new Array(nextPairs * 2).fill('hidden'));
    setMatched(0);
    first.current = null;
    busy.current = false;
  };

  const tap = useCallback((idx: number) => {
    if (busy.current || statuses[idx] !== 'hidden') return;

    if (first.current === null) {
      first.current = idx;
      setStatuses(prev => prev.map((s, i) => i === idx ? 'revealed' : s) as CardStatus[]);
    } else {
      const firstIdx = first.current;
      first.current = null;
      busy.current = true;

      setStatuses(prev => prev.map((s, i) => i === idx ? 'revealed' : s) as CardStatus[]);

      const isMatch = deck[firstIdx].pairIdx === deck[idx].pairIdx;

      if (isMatch) {
        setTimeout(() => {
          playSound(deck[idx].sound);
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
        }, 800);
      }
    }
  }, [statuses, deck, playSound]);

  return (
    <PhoneSafe bg="#E3F2FD">
      <GameHeader
        onBack={() => navigation.goBack()}
        title="Animal Memory! 🐶"
        right={<View style={s.lvPill}><Text style={s.lvT}>Level {level}</Text></View>}
      />

      <View style={s.gridContainer}>
        {isDone ? (
          <View style={s.winBox}>
            <Text style={s.winEmoji}>🌟</Text>
            <Text style={s.winTitle}>Level {level} Clear!</Text>
            <Pressable style={s.nextBtn} onPress={nextLevel}>
              <Text style={s.nextBtnT}>Harder Level! ›</Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView contentContainerStyle={[s.grid, { paddingHorizontal: PAD }]}>
            {deck.map((card, idx) => (
              <MemCard
                key={`${level}-${idx}`}
                card={card}
                status={statuses[idx]}
                onPress={() => tap(idx)}
                width={cardW}
                height={cardH}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </PhoneSafe>
  );
}

const mc = StyleSheet.create({
  side: { position: 'absolute', width: '100%', height: '100%', borderRadius: 12, alignItems: 'center', justifyContent: 'center', backfaceVisibility: 'hidden', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
  backQ: {},
  emoji: {},
  tick: { position: 'absolute', top: 2, right: 4 },
});

const s = StyleSheet.create({
  lvPill: { backgroundColor: '#FF8A65', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 6, elevation: 4 },
  lvT: { fontWeight: '900', fontSize: 14, color: '#fff' },
  gridContainer: { flex: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: GAP, paddingVertical: 10 },
  winBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  winEmoji: { fontSize: 80, marginBottom: 10 },
  winTitle: { fontSize: 32, fontWeight: '900', color: C.ink, marginBottom: 20 },
  nextBtn: { backgroundColor: '#5EE39F', paddingHorizontal: 35, paddingVertical: 18, borderRadius: 25, elevation: 6 },
  nextBtnT: { fontSize: 20, fontWeight: '900', color: '#fff' },
});

