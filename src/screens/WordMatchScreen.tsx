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

import {
  SvgCat, SvgSun, SvgApple, SvgBall, SvgStar, SvgTree, SvgMoon,
  SvgCar, SvgFish, SvgHouse, SvgBook, SvgHeart, SvgCloud,
  SvgCup, SvgKey, SvgHat, SvgSock, SvgLeaf, SvgIce, SvgBed,
  SvgDoor, SvgRing, SvgBird
} from '../components/Illustrations';

// ─── Round Bank ───────────────────────────────────────────────────────────────

interface Round { word: string; options: string[]; Illus: () => React.ReactNode; bg: string }

const BANK: Round[] = [
  { word: 'CAT',   options: ['CAT','BAT','DOG','RAT'],         Illus: SvgCat,   bg: '#FFF3E0' },
  { word: 'SUN',   options: ['SUN','MOON','SKY','STAR'],       Illus: SvgSun,   bg: '#FFFDE7' },
  { word: 'APPLE', options: ['APPLE','BANANA','GRAPE','PEAR'], Illus: SvgApple, bg: '#FFEBEE' },
  { word: 'BALL',  options: ['BALL','BAT','GAME','TOY'],       Illus: SvgBall,  bg: '#E3F2FD' },
  { word: 'STAR',  options: ['STAR','SUN','MOON','PLANET'],    Illus: SvgStar,  bg: '#FFFDE7' },
  { word: 'TREE',  options: ['TREE','LEAF','FLOWER','PLANT'],  Illus: SvgTree,  bg: '#E8F5E9' },
  { word: 'MOON',  options: ['MOON','SUN','STAR','NIGHT'],     Illus: SvgMoon,  bg: '#F3E5F5' },
  { word: 'CAR',   options: ['CAR','BUS','BIKE','TRAIN'],      Illus: SvgCar,   bg: '#FFEBEE' },
  { word: 'FISH',  options: ['FISH','SHARK','CRAB','FROG'],    Illus: SvgFish,  bg: '#E0F7FA' },
  { word: 'HOUSE', options: ['HOUSE','HOME','TENT','DOOR'],    Illus: SvgHouse, bg: '#FFF9C4' },
  { word: 'BOOK',  options: ['BOOK','PAPER','PEN','READ'],     Illus: SvgBook,  bg: '#E8EAF6' },
  { word: 'HEART', options: ['HEART','LOVE','STAR','RED'],     Illus: SvgHeart, bg: '#FCE4EC' },
  { word: 'CLOUD', options: ['CLOUD','SKY','RAIN','SUN'],      Illus: SvgCloud, bg: '#E3F2FD' },
  { word: 'CUP',   options: ['CUP','MUG','GLASS','BOWL'],      Illus: SvgCup,   bg: '#E1F5FE' },
  { word: 'KEY',   options: ['KEY','DOOR','LOCK','RING'],      Illus: SvgKey,   bg: '#FFFDE7' },
  { word: 'HAT',   options: ['HAT','CAP','HEAD','HAIR'],       Illus: SvgHat,   bg: '#F3E5F5' },
  { word: 'SOCK',  options: ['SOCK','SHOE','FOOT','BOOT'],     Illus: SvgSock,  bg: '#E8F5E9' },
  { word: 'LEAF',  options: ['LEAF','TREE','GREEN','PLANT'],   Illus: SvgLeaf,  bg: '#F1F8E9' },
  { word: 'ICE',   options: ['ICE','COLD','SNOW','CREAM'],     Illus: SvgIce,   bg: '#FFF3E0' },
  { word: 'BED',   options: ['BED','SLEEP','ROOM','NIGHT'],    Illus: SvgBed,   bg: '#E3F2FD' },
  { word: 'DOOR',  options: ['DOOR','HOME','WALL','WOOD'],     Illus: SvgDoor,  bg: '#EFEBE9' },
  { word: 'RING',  options: ['RING','HAND','GOLD','STAR'],     Illus: SvgRing,  bg: '#E0F7FA' },
  { word: 'BIRD',  options: ['BIRD','FLY','SKY','WING'],       Illus: SvgBird,  bg: '#E1F5FE' },
];

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
