// src/screens/OddOneOutScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Pressable, Animated,
} from 'react-native';
import PhoneSafe from '../components/PhoneSafe';
import { C } from '../theme';
import type { ScreenProps } from '../navigation/types';

// ─── Question bank ────────────────────────────────────────────────────────────

interface Round {
  items:    string[];   // exactly 4 items
  odd:      string;     // the one that doesn't belong
  category: string;     // label for the 3 that match
  oddLabel: string;     // label for the odd one
}

const ALL_ROUNDS: Round[] = [
  { items: ['🐱','🐶','🦁','🍎'],  odd: '🍎',  category: 'Animals',    oddLabel: 'Fruit'       },
  { items: ['🍎','🍌','🍇','🚗'],  odd: '🚗',  category: 'Fruits',     oddLabel: 'Vehicle'     },
  { items: ['🚗','🚌','✈️','🎸'],  odd: '🎸',  category: 'Vehicles',   oddLabel: 'Instrument'  },
  { items: ['🎵','🎹','🥁','🍕'],  odd: '🍕',  category: 'Music',      oddLabel: 'Food'        },
  { items: ['🌧️','☀️','⛄','🎒'], odd: '🎒',  category: 'Weather',    oddLabel: 'School item' },
  { items: ['📚','✏️','📐','🐦'], odd: '🐦',  category: 'School',     oddLabel: 'Animal'      },
  { items: ['🍕','🍔','🌮','🎈'], odd: '🎈',  category: 'Foods',      oddLabel: 'Toy'         },
  { items: ['🏀','⚽','🎾','🍓'], odd: '🍓',  category: 'Sports',     oddLabel: 'Fruit'       },
  { items: ['🌹','🌸','🌻','🐢'], odd: '🐢',  category: 'Flowers',    oddLabel: 'Animal'      },
  { items: ['🔴','🔵','🟢','🐸'], odd: '🐸',  category: 'Colors',     oddLabel: 'Animal'      },
  { items: ['1️⃣','2️⃣','3️⃣','🌸'],odd: '🌸', category: 'Numbers',    oddLabel: 'Flower'      },
  { items: ['🍦','🎂','🍩','🔑'], odd: '🔑',  category: 'Sweets',     oddLabel: 'Object'      },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const ROUNDS = shuffle(ALL_ROUNDS).slice(0, 10);
const TOTAL  = ROUNDS.length;

// ─── Screen ───────────────────────────────────────────────────────────────────

type TileState = 'idle' | 'correct' | 'wrong' | 'reveal';

export default function OddOneOutScreen({ navigation }: ScreenProps<'OddOneOut'>) {
  const [idx,     setIdx]     = useState(0);
  const [picked,  setPicked]  = useState<string | null>(null);
  const [score,   setScore]   = useState(0);

  const round     = ROUNDS[idx];
  const itemOrder = useRef(shuffle(round.items)).current;
  const shake     = useRef(new Animated.Value(0)).current;
  const slideIn   = useRef(new Animated.Value(300)).current;

  // Slide in on each new round
  useEffect(() => {
    slideIn.setValue(300);
    Animated.spring(slideIn, { toValue: 0, tension: 55, friction: 11, useNativeDriver: true }).start();
    // reset item order for new round
    const shuffled = shuffle(round.items);
    itemOrder.length = 0;
    shuffled.forEach(i => itemOrder.push(i));
  }, [idx]);

  const doShake = () => {
    Animated.sequence([
      Animated.timing(shake, { toValue: 14,  duration: 55, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -14, duration: 55, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 10,  duration: 55, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 55, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0,   duration: 55, useNativeDriver: true }),
    ]).start();
  };

  const pick = (item: string) => {
    if (picked !== null) return;
    setPicked(item);

    if (item === round.odd) {
      setScore(s => s + 1);
      setTimeout(advance, 1200);
    } else {
      doShake();
      // reveal correct after wrong — kid sees both, then Next button appears
    }
  };

  const advance = () => {
    if (idx + 1 >= TOTAL) {
      navigation.navigate('Reward', {
        from:  'OddOneOut',
        stars: score >= 9 ? 3 : score >= 6 ? 2 : 1,
      });
      return;
    }
    setIdx(i => i + 1);
    setPicked(null);
  };

  const isCorrect = picked === round.odd;

  const tileState = (item: string): TileState => {
    if (picked === null) return 'idle';
    if (item === picked && item === round.odd) return 'correct';
    if (item === picked && item !== round.odd) return 'wrong';
    if (item === round.odd && picked !== null)  return 'reveal';
    return 'idle';
  };

  const tileBg = (st: TileState) => {
    if (st === 'correct') return C.mint;
    if (st === 'wrong')   return C.coral;
    if (st === 'reveal')  return C.mint;
    return '#fff';
  };

  return (
    <PhoneSafe bg="#FFFBE6">
      {/* Header */}
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}>
          <Text style={s.backT}>←</Text>
        </Pressable>
        <Text style={s.title}>Odd One Out 🤔</Text>
        <View style={s.scorePill}>
          <Text style={s.scoreT}>⭐ {score}</Text>
        </View>
      </View>

      {/* Progress */}
      <View style={s.progressBar}>
        <View style={[s.progressFill, { width: `${(idx / TOTAL) * 100}%` }]}/>
      </View>
      <Text style={s.progressLbl}>{idx + 1} / {TOTAL}</Text>

      <Text style={s.prompt}>Which one does NOT belong?</Text>

      {/* 4 tiles */}
      <Animated.View style={[s.grid, {
        transform: [{ translateX: slideIn }, { translateX: shake }],
      }]}>
        {itemOrder.map((item) => {
          const st = tileState(item);
          return (
            <Pressable
              key={item}
              onPress={() => pick(item)}
              disabled={picked !== null}
              style={({ pressed }) => [
                s.tile,
                { backgroundColor: tileBg(st), transform: [{ scale: pressed && picked === null ? 0.92 : 1 }] },
              ]}
            >
              <Text style={s.tileEmoji}>{item}</Text>
              {st === 'correct' && <Text style={s.mark}>✓</Text>}
              {st === 'wrong'   && <Text style={s.mark}>✗</Text>}
              {st === 'reveal'  && <Text style={s.mark}>✓</Text>}
            </Pressable>
          );
        })}
      </Animated.View>

      {/* Hint box — always shown after picking */}
      {picked !== null && (
        <View style={[s.hintBox, { borderColor: isCorrect ? C.mintDeep : C.coralDeep }]}>
          <Text style={s.hintTitle}>{isCorrect ? '🎉 Correct!' : '❌ Wrong!'}</Text>
          <Text style={s.hintText}>
            {`${round.odd} is a ${round.oddLabel}.\nThe others are all ${round.category}.`}
          </Text>
        </View>
      )}

      {/* Next button — only on wrong (correct auto-advances) */}
      {picked !== null && !isCorrect && (
        <Pressable onPress={advance} style={s.nextBtn}>
          <Text style={s.nextT}>{idx + 1 >= TOTAL ? '🏆 Finish' : 'Next →'}</Text>
        </Pressable>
      )}

      {picked !== null && isCorrect && (
        <Text style={s.autoMsg}>Next question coming… 🚀</Text>
      )}
    </PhoneSafe>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  header:       { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  back:         { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', borderWidth: 3, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  backT:        { fontSize: 20, fontWeight: '900', color: C.ink },
  title:        { flex: 1, textAlign: 'center', fontWeight: '900', fontSize: 19, color: C.ink },
  scorePill:    { backgroundColor: C.yellow, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 3, borderColor: C.ink },
  scoreT:       { fontWeight: '900', fontSize: 13, color: C.ink },
  progressBar:  { height: 12, marginHorizontal: 20, backgroundColor: '#fff', borderRadius: 7, borderWidth: 3, borderColor: C.ink, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: C.yellow, borderRadius: 5 },
  progressLbl:  { textAlign: 'center', fontSize: 12, fontWeight: '800', color: C.inkSoft, marginTop: 3 },
  prompt:       { textAlign: 'center', fontWeight: '900', fontSize: 20, color: C.ink, marginTop: 18, marginBottom: 16 },
  grid:         { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 14, paddingHorizontal: 20 },
  tile:         {
    width: 138, height: 138,
    borderRadius: 26, borderWidth: 4, borderColor: C.ink,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10, shadowRadius: 6, elevation: 4,
  },
  tileEmoji:    { fontSize: 60 },
  mark:         { position: 'absolute', top: 8, right: 10, fontSize: 20, fontWeight: '900' },
  hintBox:      { margin: 16, backgroundColor: '#fff', borderRadius: 20, borderWidth: 3.5, padding: 16, alignItems: 'center', gap: 4 },
  hintTitle:    { fontSize: 18, fontWeight: '900', color: C.ink },
  hintText:     { fontSize: 14, fontWeight: '700', color: C.inkSoft, textAlign: 'center', lineHeight: 22 },
  nextBtn:      { marginHorizontal: 20, height: 56, backgroundColor: C.blue, borderRadius: 20, borderWidth: 3.5, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  nextT:        { fontSize: 20, fontWeight: '900', color: '#fff' },
  autoMsg:      { textAlign: 'center', fontWeight: '800', fontSize: 14, color: C.mintDeep },
});
