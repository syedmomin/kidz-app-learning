// src/screens/OddOneOutScreen.tsx — tap the one that doesn't belong
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import PhoneSafe from '../components/PhoneSafe';
import { C } from '../theme';
import type { ScreenProps } from '../navigation/types';

type Round = { items: string[]; odd: string; hint: string };

const ROUNDS: Round[] = [
  { items: ['🐱','🐶','🦁','🍎'],  odd: '🍎',  hint: 'Animals vs Fruit' },
  { items: ['🍎','🍌','🍇','🚗'],  odd: '🚗',  hint: 'Fruits vs Vehicle' },
  { items: ['🚗','🚌','✈️','🎸'],  odd: '🎸',  hint: 'Vehicles vs Instrument' },
  { items: ['🔴','🔵','🟢','🐸'],  odd: '🐸',  hint: 'Colors vs Animal' },
  { items: ['1️⃣','2️⃣','3️⃣','🌸'], odd: '🌸',  hint: 'Numbers vs Flower' },
  { items: ['🎵','🎹','🥁','🍕'],  odd: '🍕',  hint: 'Music vs Food' },
  { items: ['🌧️','☀️','⛄','🎒'], odd: '🎒',  hint: 'Weather vs Object' },
  { items: ['📚','✏️','📐','🐦'], odd: '🐦',  hint: 'School vs Animal' },
  { items: ['🍕','🍔','🌮','🎈'], odd: '🎈',  hint: 'Food vs Toy' },
  { items: ['🏀','⚽','🎾','🍓'], odd: '🍓',  hint: 'Sports vs Fruit' },
];

function shuffle<T>(a: T[]): T[] { return [...a].sort(() => Math.random() - 0.5); }
const SHUFFLED = shuffle(ROUNDS);
const TOTAL = SHUFFLED.length;

export default function OddOneOutScreen({ navigation }: ScreenProps<'OddOneOut'>) {
  const [idx, setIdx]       = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore]   = useState(0);
  const shake    = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  const round = SHUFFLED[idx];
  const items = useRef(shuffle(round.items)).current;

  useEffect(() => {
    cardAnim.setValue(300);
    Animated.spring(cardAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }).start();
  }, [idx]);

  const pick = (item: string) => {
    if (picked) return;
    setPicked(item);
    if (item === round.odd) {
      setScore(s => s + 1);
      setTimeout(next, 1100);
    } else {
      Animated.sequence([
        Animated.timing(shake, { toValue: 14,  duration: 55, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -14, duration: 55, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 8,   duration: 55, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0,   duration: 55, useNativeDriver: true }),
      ]).start();
    }
  };

  const next = () => {
    if (idx + 1 >= TOTAL) {
      navigation.navigate('Reward', { from: 'OddOneOut', stars: score >= 9 ? 3 : score >= 6 ? 2 : 1 });
      return;
    }
    setIdx(i => i + 1);
    setPicked(null);
  };

  const isCorrect = picked === round.odd;

  return (
    <PhoneSafe bg="#FFFBE6">
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}><Text style={s.backT}>←</Text></Pressable>
        <Text style={s.title}>Odd One Out 🤔</Text>
        <View style={s.scorePill}><Text style={s.scoreT}>⭐ {score}</Text></View>
      </View>

      <View style={s.progressBar}>
        <View style={[s.progressFill, { width: `${(idx / TOTAL) * 100}%` }]}/>
      </View>
      <Text style={s.progressLbl}>{idx + 1} / {TOTAL}</Text>

      <Text style={s.prompt}>Which one does NOT belong?</Text>

      <Animated.View style={[s.grid, { transform: [{ translateX: cardAnim }, { translateX: shake }] }]}>
        {items.map((item, i) => {
          const isPicked  = picked === item;
          const isRight   = isPicked && item === round.odd;
          const isWrong   = isPicked && item !== round.odd;
          const isReveal  = picked !== null && item === round.odd && !isPicked;
          const bg = isRight || isReveal ? C.mint : isWrong ? C.coral : '#fff';
          return (
            <Pressable key={i} onPress={() => pick(item)}
              style={({ pressed }) => [s.item, { backgroundColor: bg, transform: [{ scale: pressed && !picked ? 0.93 : 1 }] }]}>
              <Text style={s.itemEmoji}>{item}</Text>
              {(isRight || isReveal) && <Text style={s.itemMark}>✓</Text>}
              {isWrong && <Text style={s.itemMark}>✗</Text>}
            </Pressable>
          );
        })}
      </Animated.View>

      {picked && (
        <View style={s.hintBox}>
          <Text style={s.hintT}>💡 {round.hint}</Text>
        </View>
      )}

      {picked && !isCorrect && (
        <Pressable onPress={next} style={s.nextBtn}><Text style={s.nextT}>Next →</Text></Pressable>
      )}
      {picked && isCorrect && (
        <Text style={s.autoMsg}>🎉 Correct! Next question…</Text>
      )}
    </PhoneSafe>
  );
}

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
  prompt:       { textAlign: 'center', fontWeight: '900', fontSize: 20, color: C.ink, marginTop: 20, marginBottom: 20 },
  grid:         { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16, paddingHorizontal: 20 },
  item:         { width: 140, height: 140, borderRadius: 24, borderWidth: 4, borderColor: C.ink, alignItems: 'center', justifyContent: 'center', position: 'relative', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.10, shadowRadius: 6, elevation: 4 },
  itemEmoji:    { fontSize: 58 },
  itemMark:     { position: 'absolute', top: 8, right: 12, fontSize: 22, fontWeight: '900' },
  hintBox:      { margin: 20, backgroundColor: '#fff', borderRadius: 18, borderWidth: 3, borderColor: C.ink, padding: 14, alignItems: 'center' },
  hintT:        { fontSize: 15, fontWeight: '800', color: C.ink },
  nextBtn:      { marginHorizontal: 20, height: 56, backgroundColor: C.blue, borderRadius: 20, borderWidth: 3.5, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  nextT:        { fontSize: 20, fontWeight: '900', color: '#fff' },
  autoMsg:      { textAlign: 'center', fontWeight: '800', fontSize: 14, color: C.mintDeep, marginTop: 10 },
});
