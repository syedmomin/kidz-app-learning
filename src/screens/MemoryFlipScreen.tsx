// src/screens/MemoryFlipScreen.tsx — flip cards to find matching pairs
import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions } from 'react-native';
import PhoneSafe from '../components/PhoneSafe';
import { C } from '../theme';
import type { ScreenProps } from '../navigation/types';

const { width: SW } = Dimensions.get('window');
const COLS = 4;
const GAP  = 10;
const CARD_W = (SW - 28 - GAP * (COLS - 1)) / COLS;
const CARD_H = CARD_W * 1.15;

const EMOJIS = ['🐱','🐶','🐸','🦁','🐼','🦊','🐧','🦋'];
function makeCards() {
  return [...EMOJIS, ...EMOJIS]
    .map((e, i) => ({ id: i, emoji: e, matched: false }))
    .sort(() => Math.random() - 0.5);
}

function FlipCard({ emoji, faceUp, matched, onPress }: { emoji: string; faceUp: boolean; matched: boolean; onPress: () => void }) {
  const anim = useRef(new Animated.Value(faceUp ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.spring(anim, { toValue: faceUp || matched ? 1 : 0, tension: 120, friction: 10, useNativeDriver: true }).start();
  }, [faceUp, matched]);

  const frontRot = anim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
  const backRot  = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg',   '180deg'] });
  const frontOp  = anim.interpolate({ inputRange: [0.5, 1], outputRange: [0, 1] });
  const backOp   = anim.interpolate({ inputRange: [0, 0.5], outputRange: [1, 0] });

  return (
    <Pressable onPress={onPress} disabled={faceUp || matched} style={{ width: CARD_W, height: CARD_H }}>
      {/* back */}
      <Animated.View style={[fc.side, fc.back, { opacity: backOp, transform: [{ rotateY: backRot }] }]}>
        <Text style={{ fontSize: 22 }}>❓</Text>
      </Animated.View>
      {/* front */}
      <Animated.View style={[fc.side, fc.front, matched && fc.matchedCard, { opacity: frontOp, transform: [{ rotateY: frontRot }] }]}>
        <Text style={{ fontSize: 28 }}>{emoji}</Text>
      </Animated.View>
    </Pressable>
  );
}

export default function MemoryFlipScreen({ navigation }: ScreenProps<'MemoryFlip'>) {
  const [cards, setCards]     = useState(makeCards);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves]     = useState(0);
  const [matched, setMatched] = useState<number[]>([]);
  const busy = useRef(false);

  const matchedCount = matched.length / 2;
  const total        = EMOJIS.length;
  const done         = matchedCount === total;

  const flip = useCallback((id: number) => {
    if (busy.current) return;
    if (flipped.includes(id) || matched.includes(id)) return;

    const next = [...flipped, id];
    setFlipped(next);

    if (next.length === 2) {
      busy.current = true;
      setMoves(m => m + 1);
      const [a, b] = next;
      if (cards[a].emoji === cards[b].emoji) {
        setMatched(m => [...m, a, b]);
        setFlipped([]);
        busy.current = false;
      } else {
        setTimeout(() => { setFlipped([]); busy.current = false; }, 900);
      }
    }
  }, [flipped, matched, cards]);

  const restart = () => {
    setCards(makeCards());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  return (
    <PhoneSafe bg="#D9F0FF">
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}><Text style={s.backT}>←</Text></Pressable>
        <Text style={s.title}>Memory Flip 🃏</Text>
        <View style={s.movePill}><Text style={s.moveT}>🔄 {moves}</Text></View>
      </View>

      <View style={s.progress}>
        <Text style={s.progressT}>Matched: {matchedCount} / {total}</Text>
        <View style={s.progressBar}>
          <View style={[s.progressFill, { width: `${(matchedCount / total) * 100}%` }]}/>
        </View>
      </View>

      {done ? (
        <View style={s.winBox}>
          <Text style={s.winEmoji}>🎉</Text>
          <Text style={s.winTitle}>You won!</Text>
          <Text style={s.winSub}>Completed in {moves} moves</Text>
          <Pressable style={s.btn} onPress={restart}><Text style={s.btnT}>Play Again</Text></Pressable>
          <Pressable style={[s.btn, { backgroundColor: C.mint, marginTop: 10 }]} onPress={() => navigation.navigate('Reward', { from: 'MemoryFlip', stars: moves <= 12 ? 3 : moves <= 18 ? 2 : 1 })}>
            <Text style={s.btnT}>Collect Stars ⭐</Text>
          </Pressable>
        </View>
      ) : (
        <View style={s.grid}>
          {cards.map((c, i) => (
            <FlipCard
              key={c.id}
              emoji={c.emoji}
              faceUp={flipped.includes(i)}
              matched={matched.includes(i)}
              onPress={() => flip(i)}
            />
          ))}
        </View>
      )}
    </PhoneSafe>
  );
}

const fc = StyleSheet.create({
  side:        { position: 'absolute', width: '100%', height: '100%', borderRadius: 14, borderWidth: 3, borderColor: C.ink, alignItems: 'center', justifyContent: 'center', backfaceVisibility: 'hidden' },
  back:        { backgroundColor: C.blue },
  front:       { backgroundColor: C.cream },
  matchedCard: { backgroundColor: C.mint },
});

const s = StyleSheet.create({
  header:       { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  back:         { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', borderWidth: 3, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  backT:        { fontSize: 20, fontWeight: '900', color: C.ink },
  title:        { flex: 1, textAlign: 'center', fontWeight: '900', fontSize: 20, color: C.ink },
  movePill:     { backgroundColor: C.yellow, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 3, borderColor: C.ink },
  moveT:        { fontWeight: '900', fontSize: 13, color: C.ink },
  progress:     { paddingHorizontal: 16, marginBottom: 12 },
  progressT:    { fontWeight: '800', fontSize: 13, color: C.ink, marginBottom: 4 },
  progressBar:  { height: 10, backgroundColor: '#fff', borderRadius: 6, borderWidth: 2.5, borderColor: C.ink, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: C.mint, borderRadius: 4 },
  grid:         { flexDirection: 'row', flexWrap: 'wrap', gap: GAP, paddingHorizontal: 14 },
  winBox:       { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  winEmoji:     { fontSize: 80 },
  winTitle:     { fontSize: 36, fontWeight: '900', color: C.ink, marginTop: 12 },
  winSub:       { fontSize: 16, fontWeight: '700', color: C.inkSoft, marginTop: 6, marginBottom: 28 },
  btn:          { backgroundColor: C.coral, borderRadius: 20, borderWidth: 3.5, borderColor: C.ink, paddingHorizontal: 32, paddingVertical: 14 },
  btnT:         { fontSize: 18, fontWeight: '900', color: '#fff' },
});
