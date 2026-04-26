// src/screens/WordMatchScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import * as Speech from 'expo-speech';
import PhoneSafe from '../components/PhoneSafe';
import AnswerGrid from '../components/AnswerGrid';
import GameHeader from '../components/GameHeader';
import { useProgress } from '../store/ProgressStore';
import { useAudio } from '../hooks/useAudio';
import { useGameScreen } from '../hooks/useGameScreen';
import { shuffle } from '../utils';
import type { ScreenProps } from '../navigation/types';

import { WORD_BANK, type WordRound } from '../data/GameAssets';

type Round = WordRound;

const BANK = WORD_BANK;

const TOTAL = 100;

function buildRounds(): Round[] {
  const result: Round[] = [];
  while (result.length < TOTAL) result.push(...shuffle(BANK));
  return result.slice(0, TOTAL);
}

const ROUNDS = buildRounds();

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function WordMatchScreen({ navigation }: ScreenProps<'WordMatch'>) {
  const { playSound } = useAudio();
  const { completeWord } = useProgress();
  const { idx, picked, setPicked, score, addScore, shake, slideIn, bounceAnim, triggerSlideIn, doShake, doBounce, advance } =
    useGameScreen({ total: TOTAL, from: 'WordMatch', navigation });

  const round = ROUNDS[idx];
  const [options, setOptions] = useState<string[]>(() => shuffle(round.options));

  useEffect(() => {
    triggerSlideIn();
    setOptions(shuffle(round.options));
    Speech.stop();
    Speech.speak(`Which word is for this picture?`, { rate: 1.0 });
  }, [idx]);

  const pick = async (w: string) => {
    if (picked !== null) return;
    setPicked(w);

    if (w === round.word) {
      addScore();
      doBounce();
      Speech.stop();
      Speech.speak(`Excellent! That is an ${w}!`, { rate: 1.0, pitch: 1.1 });
      await completeWord(w);
      setTimeout(() => advance(), 2000);
    } else {
      doShake();
      Speech.stop();
      Speech.speak(`Oops! That is not ${round.word}. Try again!`, { rate: 1.1 });
      setTimeout(() => setPicked(null), 1500);
    }
  };

  return (
    <PhoneSafe bg="#F0F4FF">
      <GameHeader onBack={() => navigation.goBack()} title="Word Match! ✍️" score={score} scoreBg="#FFD54F" />

      <View style={s.content}>
        <Animated.View style={[s.stage, { transform: [{ translateX: slideIn }, { translateX: shake }, { scale: bounceAnim }] }]}>
          <View style={[s.illusBox, { backgroundColor: round.bg }]}>
            {round.Illus()}
          </View>
          <View style={s.wordSlot}>
            <Text style={s.wordSlotT}>{picked && picked === round.word ? picked : '?'}</Text>
          </View>
        </Animated.View>

        <AnswerGrid options={options} picked={picked} correct={round.word} onPick={pick} />
      </View>
    </PhoneSafe>
  );
}

const s = StyleSheet.create({
  content:   { flex: 1, alignItems: 'center', justifyContent: 'space-around', paddingBottom: 40 },
  stage:     { alignItems: 'center', width: '100%' },
  illusBox:  { width: 200, height: 200, borderRadius: 100, alignItems: 'center', justifyContent: 'center', elevation: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 10, borderWidth: 6, borderColor: '#fff' },
  wordSlot:  { marginTop: 30, width: 220, height: 70, borderRadius: 35, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', borderWidth: 3, borderColor: '#ccc' },
  wordSlotT: { fontSize: 32, fontWeight: '900', color: '#333', letterSpacing: 2 },
});
