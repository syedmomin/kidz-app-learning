import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import * as Speech from 'expo-speech';
import PhoneSafe from '../components/PhoneSafe';
import GameHeader from '../components/GameHeader';
import { C } from '../theme';
import { shuffle } from '../utils';
import { useGameScreen } from '../hooks/useGameScreen';
import type { ScreenProps } from '../navigation/types';
import { ALPHABET_ITEMS, type AlphabetItem } from '../data/GameAssets';

type WordItem = AlphabetItem;

const WORDS = ALPHABET_ITEMS;

const ALL_LETTERS = WORDS.map(w => w.letter);

const TOTAL_ALL = 200;

function buildAllRounds() {
  const all: { item: WordItem; options: string[] }[] = [];
  while (all.length < TOTAL_ALL) {
    const pool = [...WORDS].sort(() => Math.random() - 0.5);
    pool.forEach(item => {
      const wrongs = shuffle(ALL_LETTERS.filter(l => l !== item.letter)).slice(0, 3);
      all.push({ item, options: shuffle([item.letter, ...wrongs]) });
    });
  }
  return all.slice(0, TOTAL_ALL);
}

const ALL_ROUNDS = buildAllRounds();

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function AlphabetSoundScreen({ navigation }: ScreenProps<'AlphabetSound'>) {
  const { idx, picked, setPicked, score, addScore, shake, slideIn, bounceAnim, triggerSlideIn, doShake, doBounce, advance } =
    useGameScreen({ total: TOTAL_ALL, from: 'AlphabetSound', navigation });

  const { item, options } = ALL_ROUNDS[idx];

  useEffect(() => {
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

      <View style={s.content}>
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
  prompt:           { textAlign: 'center', fontWeight: '800', fontSize: 20, color: C.ink, marginBottom: 20, paddingHorizontal: 16 },
  wordHighlight:    { fontWeight: '900', fontSize: 22 },
  imageCard:        { width: 220, height: 240, backgroundColor: '#fff', borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 32, elevation: 16, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 12 },
  imageInner:       { width: 200, height: 190, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  wordLabel:        { fontWeight: '900', fontSize: 18, color: C.ink, marginTop: 6 },
  optionsGrid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'center', paddingHorizontal: 24 },
  option:           { width: 72, height: 72, borderRadius: 20, borderWidth: 3.5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', shadowColor: C.ink, shadowOffset: { width: 2, height: 3 }, shadowOpacity: 0.15, shadowRadius: 0, elevation: 3 },
  optionText:       { fontSize: 32, fontWeight: '900', color: C.ink },
});

