import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import * as Speech from 'expo-speech';
import PhoneSafe from '../components/PhoneSafe';
import GameHeader from '../components/GameHeader';
import {
  SvgApple, SvgBall, SvgCar, SvgDog, SvgEgg, SvgFish, SvgGrape, SvgHouse,
  SvgIce, SvgJar, SvgKite, SvgLeaf, SvgMoon, SvgNest, SvgOwl, SvgPig,
  SvgQuilt, SvgRocket, SvgSun, SvgTrain, SvgUmbrella, SvgVase, SvgWatch,
  SvgXylophone, SvgYak, SvgZebra,
} from '../components/Illustrations';
import { C } from '../theme';
import { shuffle } from '../utils';
import { useGameScreen } from '../hooks/useGameScreen';
import type { ScreenProps } from '../navigation/types';

// ─── Game Data ────────────────────────────────────────────────────────────────

interface WordItem {
  word: string;
  letter: string;
  color: string;
  render: () => React.ReactNode;
}

const WORDS: WordItem[] = [
  { word: 'Apple',     letter: 'A', color: '#FF5252', render: () => <SvgApple /> },
  { word: 'Ball',      letter: 'B', color: '#42A5F5', render: () => <SvgBall /> },
  { word: 'Car',       letter: 'C', color: '#EF5350', render: () => <SvgCar /> },
  { word: 'Dog',       letter: 'D', color: '#D2691E', render: () => <SvgDog /> },
  { word: 'Egg',       letter: 'E', color: '#FFF9C4', render: () => <SvgEgg /> },
  { word: 'Fish',      letter: 'F', color: '#FF9800', render: () => <SvgFish /> },
  { word: 'Grapes',    letter: 'G', color: '#9C27B0', render: () => <SvgGrape /> },
  { word: 'House',     letter: 'H', color: '#F44336', render: () => <SvgHouse /> },
  { word: 'Ice Cream', letter: 'I', color: '#E91E63', render: () => <SvgIce /> },
  { word: 'Jar',       letter: 'J', color: '#00BCD4', render: () => <SvgJar /> },
  { word: 'Kite',      letter: 'K', color: '#E91E63', render: () => <SvgKite /> },
  { word: 'Leaf',      letter: 'L', color: '#8BC34A', render: () => <SvgLeaf /> },
  { word: 'Moon',      letter: 'M', color: '#FFD54F', render: () => <SvgMoon /> },
  { word: 'Nest',      letter: 'N', color: '#795548', render: () => <SvgNest /> },
  { word: 'Owl',       letter: 'O', color: '#8D6E63', render: () => <SvgOwl /> },
  { word: 'Pig',       letter: 'P', color: '#FFB3C1', render: () => <SvgPig /> },
  { word: 'Quilt',     letter: 'Q', color: '#FF8A65', render: () => <SvgQuilt /> },
  { word: 'Rocket',    letter: 'R', color: '#EF5350', render: () => <SvgRocket /> },
  { word: 'Sun',       letter: 'S', color: '#FFD54F', render: () => <SvgSun /> },
  { word: 'Train',     letter: 'T', color: '#1E88E5', render: () => <SvgTrain /> },
  { word: 'Umbrella',  letter: 'U', color: '#7C4DFF', render: () => <SvgUmbrella /> },
  { word: 'Vase',      letter: 'V', color: '#42A5F5', render: () => <SvgVase /> },
  { word: 'Watch',     letter: 'W', color: '#E8EAF6', render: () => <SvgWatch /> },
  { word: 'Xylophone', letter: 'X', color: '#F44336', render: () => <SvgXylophone /> },
  { word: 'Yak',       letter: 'Y', color: '#5D4037', render: () => <SvgYak /> },
  { word: 'Zebra',     letter: 'Z', color: '#fff',    render: () => <SvgZebra /> },
];

const ALL_LETTERS = WORDS.map(w => w.letter);

const TOTAL = 26;

function buildRounds() {
  const result: { item: WordItem; options: string[] }[] = [];
  const pool = [...WORDS];
  while (result.length < TOTAL) {
    shuffle(pool);
    pool.forEach(item => {
      const wrongs = shuffle(ALL_LETTERS.filter(l => l !== item.letter)).slice(0, 3);
      result.push({ item, options: shuffle([item.letter, ...wrongs]) });
    });
  }
  return result.slice(0, TOTAL);
}

const NUM_ROUNDS = 2;
const TOTAL_ALL = TOTAL * NUM_ROUNDS;

function buildAllRounds() {
  const all: { item: WordItem; options: string[] }[] = [];
  for (let r = 0; r < NUM_ROUNDS; r++) all.push(...buildRounds());
  return all;
}

const ALL_ROUNDS = buildAllRounds();

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function AlphabetSoundScreen({ navigation }: ScreenProps<'AlphabetSound'>) {
  const { idx, picked, setPicked, score, addScore, shake, slideIn, bounceAnim, triggerSlideIn, doShake, doBounce, advance } =
    useGameScreen({ total: TOTAL_ALL, from: 'AlphabetSound', navigation });

  const [showRoundBanner, setShowRoundBanner] = React.useState(false);
  const bannerAnim = React.useRef(new Animated.Value(0)).current;

  const currentRound = Math.floor(idx / TOTAL) + 1;
  const { item, options } = ALL_ROUNDS[idx];

  useEffect(() => {
    if (idx === TOTAL) {
      setShowRoundBanner(true);
      Animated.sequence([
        Animated.timing(bannerAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.delay(1200),
        Animated.timing(bannerAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => setShowRoundBanner(false));
    }
    triggerSlideIn();
    Speech.stop();
    Speech.speak(`What letter does ${item.word} start with?`, { rate: 0.9, pitch: 1.1 });
  }, [idx]);

  const pick = (letter: string) => {
    if (picked !== null) return;
    setPicked(letter);

    if (letter === item.letter) {
      addScore();
      doBounce();
      Speech.stop();
      Speech.speak(`${item.letter} for ${item.word}! Great job!`, { rate: 0.9, pitch: 1.1 });
      setTimeout(() => advance(), 1800);
    } else {
      doShake();
      Speech.stop();
      Speech.speak(`Try again!`, { rate: 1.0 });
      setTimeout(() => setPicked(null), 1400);
    }
  };

  return (
    <PhoneSafe bg="#FFF8EC">
      <GameHeader onBack={() => navigation.goBack()} title="A for Apple! 🍎" score={score} />

      {showRoundBanner && (
        <Animated.View style={[s.roundBanner, { opacity: bannerAnim, transform: [{ scale: bannerAnim }] }]}>
          <Text style={s.roundBannerText}>⭐ Round 2! ⭐</Text>
          <Text style={s.roundBannerSub}>Let's go again!</Text>
        </Animated.View>
      )}

      <View style={s.content}>
        <View style={s.roundRow}>
          {Array.from({ length: NUM_ROUNDS }).map((_, i) => (
            <View key={i} style={[s.roundDot, i + 1 <= currentRound && s.roundDotActive]} />
          ))}
          <Text style={s.roundLabel}>Round {currentRound}/{NUM_ROUNDS}</Text>
        </View>

        <Text style={s.prompt}>
          What letter does <Text style={[s.wordHighlight, { color: item.color === '#fff' ? C.coral : item.color }]}>{item.word}</Text> start with?
        </Text>

        <Animated.View style={[s.imageCard, {
          transform: [{ translateX: slideIn }, { translateX: shake }, { scale: bounceAnim }],
          shadowColor: item.color,
        }]}>
          <View style={[s.imageInner, { backgroundColor: item.color === '#fff' ? '#F5F5F5' : item.color + '33' }]}>
            {item.render()}
          </View>
          <Text style={s.wordLabel}>{item.word}</Text>
        </Animated.View>

        <View style={s.optionsGrid}>
          {options.map(letter => {
            const isCorrect = letter === item.letter;
            const isPicked = letter === picked;
            let bg: string = '#fff';
            let border: string = C.ink;
            if (isPicked && isCorrect) { bg = '#C8F5C2'; border = '#2E7D32'; }
            else if (isPicked && !isCorrect) { bg = '#FFD0D0'; border = C.coral; }

            return (
              <Pressable
                key={letter}
                style={[s.option, { backgroundColor: bg, borderColor: border }]}
                onPress={() => pick(letter)}
              >
                <Text style={[s.optionText, isPicked && isCorrect && { color: '#2E7D32' }, isPicked && !isCorrect && { color: C.coral }]}>
                  {letter}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </PhoneSafe>
  );
}

const s = StyleSheet.create({
  content:          { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 30 },
  roundRow:         { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  roundDot:         { width: 10, height: 10, borderRadius: 5, backgroundColor: '#DDD', borderWidth: 1.5, borderColor: C.ink },
  roundDotActive:   { backgroundColor: C.coral },
  roundLabel:       { fontSize: 13, fontWeight: '700', color: C.inkSoft, marginLeft: 4 },
  roundBanner:      { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99, backgroundColor: 'rgba(255,248,236,0.95)', alignItems: 'center', justifyContent: 'center' },
  roundBannerText:  { fontSize: 42, fontWeight: '900', color: C.coral, textAlign: 'center' },
  roundBannerSub:   { fontSize: 20, fontWeight: '700', color: C.ink, marginTop: 8 },
  prompt:           { textAlign: 'center', fontWeight: '800', fontSize: 20, color: C.ink, marginBottom: 20, paddingHorizontal: 16 },
  wordHighlight:    { fontWeight: '900', fontSize: 22 },
  imageCard:        { width: 220, height: 240, backgroundColor: '#fff', borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 32, elevation: 16, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 12 },
  imageInner:       { width: 200, height: 190, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  wordLabel:        { fontWeight: '900', fontSize: 18, color: C.ink, marginTop: 6 },
  optionsGrid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'center', paddingHorizontal: 24 },
  option:           { width: 72, height: 72, borderRadius: 20, borderWidth: 3.5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', shadowColor: C.ink, shadowOffset: { width: 2, height: 3 }, shadowOpacity: 0.15, shadowRadius: 0, elevation: 3 },
  optionText:       { fontSize: 32, fontWeight: '900', color: C.ink },
});

