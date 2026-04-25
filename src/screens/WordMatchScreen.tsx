// src/screens/WordMatchScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions, Easing } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect, Polygon } from 'react-native-svg';
import * as Speech from 'expo-speech';
import PhoneSafe from '../components/PhoneSafe';
import { useProgress } from '../store/ProgressStore';
import { useAudio } from '../hooks/useAudio';
import type { ScreenProps } from '../navigation/types';

const { width: SW } = Dimensions.get('window');
const TOTAL = 100; // Increased to 100 levels

import { 
  SvgCat, SvgSun, SvgApple, SvgBall, SvgStar, SvgTree, SvgMoon,
  SvgCar, SvgFish, SvgHouse, SvgBook, SvgHeart, SvgCloud,
  SvgCup, SvgKey, SvgHat, SvgSock, SvgLeaf, SvgIce, SvgBed,
  SvgDoor, SvgRing, SvgBird
} from '../components/Illustrations';

// ─── Round Bank ───────────────────────────────────────────────────────────────

interface Round { word: string; options: string[]; Illus: () => React.ReactNode; bg: string }

const BANK: Round[] = [
  { word: 'CAT', options: ['CAT', 'BAT', 'DOG', 'RAT'], Illus: SvgCat, bg: '#FFF3E0' },
  { word: 'SUN', options: ['SUN', 'MOON', 'SKY', 'STAR'], Illus: SvgSun, bg: '#FFFDE7' },
  { word: 'APPLE', options: ['APPLE', 'BANANA', 'GRAPE', 'PEAR'], Illus: SvgApple, bg: '#FFEBEE' },
  { word: 'BALL', options: ['BALL', 'BAT', 'GAME', 'TOY'], Illus: SvgBall, bg: '#E3F2FD' },
  { word: 'STAR', options: ['STAR', 'SUN', 'MOON', 'PLANET'], Illus: SvgStar, bg: '#FFFDE7' },
  { word: 'TREE', options: ['TREE', 'LEAF', 'FLOWER', 'PLANT'], Illus: SvgTree, bg: '#E8F5E9' },
  { word: 'MOON', options: ['MOON', 'SUN', 'STAR', 'NIGHT'], Illus: SvgMoon, bg: '#F3E5F5' },
  { word: 'CAR', options: ['CAR', 'BUS', 'BIKE', 'TRAIN'], Illus: SvgCar, bg: '#FFEBEE' },
  { word: 'FISH', options: ['FISH', 'SHARK', 'CRAB', 'FROG'], Illus: SvgFish, bg: '#E0F7FA' },
  { word: 'HOUSE', options: ['HOUSE', 'HOME', 'TENT', 'DOOR'], Illus: SvgHouse, bg: '#FFF9C4' },
  { word: 'BOOK', options: ['BOOK', 'PAPER', 'PEN', 'READ'], Illus: SvgBook, bg: '#E8EAF6' },
  { word: 'HEART', options: ['HEART', 'LOVE', 'STAR', 'RED'], Illus: SvgHeart, bg: '#FCE4EC' },
  { word: 'CLOUD', options: ['CLOUD', 'SKY', 'RAIN', 'SUN'], Illus: SvgCloud, bg: '#E3F2FD' },
  { word: 'CUP', options: ['CUP', 'MUG', 'GLASS', 'BOWL'], Illus: SvgCup, bg: '#E1F5FE' },
  { word: 'KEY', options: ['KEY', 'DOOR', 'LOCK', 'RING'], Illus: SvgKey, bg: '#FFFDE7' },
  { word: 'HAT', options: ['HAT', 'CAP', 'HEAD', 'HAIR'], Illus: SvgHat, bg: '#F3E5F5' },
  { word: 'SOCK', options: ['SOCK', 'SHOE', 'FOOT', 'BOOT'], Illus: SvgSock, bg: '#E8F5E9' },
  { word: 'LEAF', options: ['LEAF', 'TREE', 'GREEN', 'PLANT'], Illus: SvgLeaf, bg: '#F1F8E9' },
  { word: 'ICE', options: ['ICE', 'COLD', 'SNOW', 'CREAM'], Illus: SvgIce, bg: '#FFF3E0' },
  { word: 'BED', options: ['BED', 'SLEEP', 'ROOM', 'NIGHT'], Illus: SvgBed, bg: '#E3F2FD' },
  { word: 'DOOR', options: ['DOOR', 'HOME', 'WALL', 'WOOD'], Illus: SvgDoor, bg: '#EFEBE9' },
  { word: 'RING', options: ['RING', 'HAND', 'GOLD', 'STAR'], Illus: SvgRing, bg: '#E0F7FA' },
  { word: 'BIRD', options: ['BIRD', 'FLY', 'SKY', 'WING'], Illus: SvgBird, bg: '#E1F5FE' },
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

function buildRounds(): Round[] {
  const result: Round[] = [];
  while (result.length < TOTAL) result.push(...shuffle(BANK));
  return result.slice(0, TOTAL);
}

const ROUNDS = buildRounds();

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function WordMatchScreen({ navigation }: ScreenProps<'WordMatch'>) {
  const { playSound } = useAudio();
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const { completeWord } = useProgress();

  const round = ROUNDS[idx];
  const [options, setOptions] = useState<string[]>(() => shuffle(round.options));
  const shake = useRef(new Animated.Value(0)).current;
  const slideIn = useRef(new Animated.Value(SW)).current;
  const bounce = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    slideIn.setValue(SW);
    Animated.spring(slideIn, { toValue: 0, damping: 15, stiffness: 90, useNativeDriver: true }).start();
    setOptions(shuffle(round.options));
    Speech.stop();
    Speech.speak(`Which word is for this picture?`, { rate: 1.0 });
  }, [idx]);

  const doShake = () => Animated.sequence([
    Animated.timing(shake, { toValue: 15, duration: 60, useNativeDriver: true }),
    Animated.timing(shake, { toValue: -15, duration: 60, useNativeDriver: true }),
    Animated.timing(shake, { toValue: 10, duration: 60, useNativeDriver: true }),
    Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
  ]).start();

  const advance = () => {
    if (idx + 1 >= TOTAL) {
      navigation.navigate('Reward', { from: 'WordMatch', stars: 3 });
      return;
    }
    setIdx(i => i + 1);
    setPicked(null);
  };

  const pick = async (w: string) => {
    if (picked !== null) return;
    setPicked(w);

    if (w === round.word) {
      setScore(s => s + 1);
      Animated.sequence([
        Animated.spring(bounce, { toValue: 1.15, tension: 200, friction: 5, useNativeDriver: true }),
        Animated.spring(bounce, { toValue: 1, tension: 200, friction: 8, useNativeDriver: true }),
      ]).start();

      Speech.stop();
      Speech.speak(`Excellent! That is an ${w}!`, { rate: 1.0, pitch: 1.1 });
      await completeWord(w);
      setTimeout(() => advance(), 2000);
    } else {
      doShake();
      Speech.stop();
      Speech.speak(`Oops! That is not ${round.word}. Try again!`, { rate: 1.1 });
      // Reset picked after a delay so they can try again (Must-Correct Logic)
      setTimeout(() => setPicked(null), 1500);
    }
  };

  return (
    <PhoneSafe bg="#F0F4FF">
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}><Text style={s.backT}>←</Text></Pressable>
        <Text style={s.title}>Word Match! ✍️</Text>
        <View style={s.scorePill}><Text style={s.scoreT}>⭐ {score}</Text></View>
      </View>

      {/* Progress Bar Removed as requested */}

      <View style={s.content}>
        <Animated.View style={[s.stage, { transform: [{ translateX: slideIn }, { translateX: shake }, { scale: bounce }] }]}>
          <View style={[s.illusBox, { backgroundColor: round.bg }]}>
            {round.Illus()}
          </View>
          <View style={s.wordSlot}>
            <Text style={s.wordSlotT}>{picked && picked === round.word ? picked : '?'}</Text>
          </View>
        </Animated.View>

        <View style={s.grid}>
          {options.map(w => {
            const isPicked = picked === w;
            const isCorrectPick = isPicked && w === round.word;
            const isWrongPick = isPicked && w !== round.word;

            const bg = isCorrectPick ? '#5EE39F' : (isWrongPick ? '#FF5E5E' : '#fff');

            return (
              <Pressable key={w} onPress={() => pick(w)} disabled={picked !== null}
                style={[s.opt, { backgroundColor: bg, elevation: isPicked ? 0 : 5 }]}>
                <Text style={[s.optT, { color: isPicked ? '#fff' : '#333' }]}>{w}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </PhoneSafe>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  back: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', elevation: 4, alignItems: 'center', justifyContent: 'center' },
  backT: { fontSize: 22, fontWeight: '900', color: '#333' },
  title: { flex: 1, textAlign: 'center', fontWeight: '900', fontSize: 22, color: '#333' },
  scorePill: { backgroundColor: '#FFD54F', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 6, elevation: 4 },
  scoreT: { fontWeight: '900', fontSize: 16, color: '#333' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'space-around', paddingBottom: 40 },
  stage: { alignItems: 'center', width: '100%' },
  illusBox: { width: 200, height: 200, borderRadius: 100, alignItems: 'center', justifyContent: 'center', elevation: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 10, borderWidth: 6, borderColor: '#fff' },
  wordSlot: { marginTop: 30, width: 220, height: 70, borderRadius: 35, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', borderWidth: 3, borderColor: '#ccc' },
  wordSlotT: { fontSize: 32, fontWeight: '900', color: '#333', letterSpacing: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 15, paddingHorizontal: 20 },
  opt: { width: '45%', height: 75, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6 },
  optT: { fontSize: 22, fontWeight: '900', letterSpacing: 1 },
});
