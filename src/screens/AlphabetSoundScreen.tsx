import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import * as Speech from 'expo-speech';
import Svg, { Circle, Ellipse, Path, Rect, Polygon } from 'react-native-svg';
import PhoneSafe from '../components/PhoneSafe';
import GameHeader from '../components/GameHeader';
import { C } from '../theme';
import { shuffle } from '../utils';
import { useGameScreen } from '../hooks/useGameScreen';
import type { ScreenProps } from '../navigation/types';

// ─── SVG Illustrations ────────────────────────────────────────────────────────

const SvgApple = () => (
  <Svg width="140" height="140" viewBox="0 0 160 160">
    <Path d="M 28 72 Q 28 30 80 30 Q 132 30 132 72 Q 132 138 80 148 Q 28 138 28 72 Z" fill="#FF5252" stroke="#333" strokeWidth="4" />
    <Path d="M 80 30 Q 76 14 66 10" stroke="#333" strokeWidth="4" fill="none" />
    <Ellipse cx="90" cy="20" rx="12" ry="6" fill="#4CAF50" stroke="#333" strokeWidth="2" />
  </Svg>
);

const SvgBall = () => (
  <Svg width="140" height="140" viewBox="0 0 160 160">
    <Circle cx="80" cy="80" r="60" fill="#42A5F5" stroke="#333" strokeWidth="4" />
    <Path d="M 80,20 Q 110,80 80,140" stroke="#333" strokeWidth="3" fill="none" />
    <Path d="M 20,80 Q 80,110 140,80" stroke="#333" strokeWidth="3" fill="none" />
  </Svg>
);

const SvgCar = () => (
  <Svg width="140" height="140" viewBox="0 0 160 160">
    <Path d="M 20 100 L 20 70 L 50 40 L 110 40 L 140 70 L 140 100 Z" fill="#F44336" stroke="#333" strokeWidth="4" />
    <Circle cx="40" cy="100" r="15" fill="#333" />
    <Circle cx="120" cy="100" r="15" fill="#333" />
    <Rect x="55" y="45" width="25" height="20" fill="#E3F2FD" stroke="#333" strokeWidth="3" />
    <Rect x="85" y="45" width="25" height="20" fill="#E3F2FD" stroke="#333" strokeWidth="3" />
  </Svg>
);

const SvgDog = () => (
  <Svg width="140" height="140" viewBox="0 0 160 160">
    <Ellipse cx="80" cy="105" rx="45" ry="32" fill="#D2691E" stroke="#333" strokeWidth="4" />
    <Circle cx="80" cy="68" r="32" fill="#D2691E" stroke="#333" strokeWidth="4" />
    <Path d="M 52 48 L 40 22 L 62 42 Z" fill="#D2691E" stroke="#333" strokeWidth="3" />
    <Path d="M 108 48 L 120 22 L 98 42 Z" fill="#D2691E" stroke="#333" strokeWidth="3" />
    <Circle cx="68" cy="65" r="5" fill="#333" />
    <Circle cx="92" cy="65" r="5" fill="#333" />
    <Ellipse cx="80" cy="80" rx="10" ry="7" fill="#FF8A65" stroke="#333" strokeWidth="2" />
  </Svg>
);

const SvgEgg = () => (
  <Svg width="140" height="140" viewBox="0 0 160 160">
    <Path d="M 80 20 Q 130 20 130 90 Q 130 148 80 148 Q 30 148 30 90 Q 30 20 80 20 Z" fill="#FFF9C4" stroke="#333" strokeWidth="4" />
    <Ellipse cx="80" cy="95" rx="25" ry="18" fill="#FFC107" stroke="#333" strokeWidth="3" />
  </Svg>
);

const SvgFish = () => (
  <Svg width="140" height="140" viewBox="0 0 160 160">
    <Ellipse cx="85" cy="80" rx="45" ry="28" fill="#FF9800" stroke="#333" strokeWidth="4" />
    <Path d="M 40 80 L 10 55 L 10 105 Z" fill="#FF9800" stroke="#333" strokeWidth="4" />
    <Circle cx="110" cy="70" r="5" fill="#333" />
  </Svg>
);

const SvgGrape = () => (
  <Svg width="140" height="140" viewBox="0 0 160 160">
    <Circle cx="65" cy="100" r="18" fill="#9C27B0" stroke="#333" strokeWidth="3" />
    <Circle cx="95" cy="100" r="18" fill="#9C27B0" stroke="#333" strokeWidth="3" />
    <Circle cx="80" cy="75" r="18" fill="#9C27B0" stroke="#333" strokeWidth="3" />
    <Circle cx="50" cy="75" r="18" fill="#9C27B0" stroke="#333" strokeWidth="3" />
    <Circle cx="110" cy="75" r="18" fill="#9C27B0" stroke="#333" strokeWidth="3" />
    <Circle cx="80" cy="50" r="18" fill="#9C27B0" stroke="#333" strokeWidth="3" />
    <Path d="M 80 32 Q 76 18 90 14" stroke="#333" strokeWidth="4" fill="none" />
  </Svg>
);

const SvgHouse = () => (
  <Svg width="140" height="140" viewBox="0 0 160 160">
    <Rect x="40" y="70" width="80" height="70" fill="#FFF59D" stroke="#333" strokeWidth="4" />
    <Polygon points="30,70 80,30 130,70" fill="#F44336" stroke="#333" strokeWidth="4" />
    <Rect x="65" y="100" width="30" height="40" fill="#795548" stroke="#333" strokeWidth="4" />
    <Rect x="50" y="80" width="15" height="15" fill="#E3F2FD" stroke="#333" strokeWidth="3" />
    <Rect x="95" y="80" width="15" height="15" fill="#E3F2FD" stroke="#333" strokeWidth="3" />
  </Svg>
);

const SvgIce = () => (
  <Svg width="140" height="140" viewBox="0 0 160 160">
    <Path d="M 60 70 L 100 70 L 80 130 Z" fill="#FFB74D" stroke="#333" strokeWidth="4" />
    <Circle cx="80" cy="58" r="28" fill="#E91E63" stroke="#333" strokeWidth="4" />
    <Path d="M 62 48 Q 70 38 80 45" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" />
  </Svg>
);

const SvgJar = () => (
  <Svg width="140" height="140" viewBox="0 0 160 160">
    <Rect x="55" y="40" width="50" height="10" rx="4" fill="#78909C" stroke="#333" strokeWidth="3" />
    <Path d="M 45 50 L 45 130 Q 45 140 80 140 Q 115 140 115 130 L 115 50 Z" fill="#B2EBF2" stroke="#333" strokeWidth="4" />
    <Ellipse cx="80" cy="95" rx="28" ry="20" fill="#FFC107" stroke="#333" strokeWidth="2" />
  </Svg>
);

const SvgKite = () => (
  <Svg width="140" height="140" viewBox="0 0 160 160">
    <Polygon points="80,15 130,80 80,130 30,80" fill="#E91E63" stroke="#333" strokeWidth="4" />
    <Path d="M 80 130 Q 95 145 80 155 Q 65 145 80 130" stroke="#333" strokeWidth="3" fill="#FFC107" />
    <Path d="M 80,15 L 80,130" stroke="#333" strokeWidth="2" />
    <Path d="M 30,80 L 130,80" stroke="#333" strokeWidth="2" />
  </Svg>
);

const SvgLeaf = () => (
  <Svg width="140" height="140" viewBox="0 0 160 160">
    <Path d="M 80 120 C 20 120 20 40 80 40 C 140 40 140 120 80 120 Z" fill="#8BC34A" stroke="#333" strokeWidth="4" />
    <Path d="M 80 40 L 80 130" stroke="#333" strokeWidth="3" />
    <Path d="M 80 80 L 55 60" stroke="#333" strokeWidth="2" />
    <Path d="M 80 95 L 105 75" stroke="#333" strokeWidth="2" />
  </Svg>
);

const SvgMoon = () => (
  <Svg width="140" height="140" viewBox="0 0 160 160">
    <Path d="M 120 40 A 60 60 0 1 0 120 120 A 45 45 0 1 1 120 40 Z" fill="#FFD54F" stroke="#333" strokeWidth="4" />
  </Svg>
);

const SvgNest = () => (
  <Svg width="140" height="140" viewBox="0 0 160 160">
    <Path d="M 30 100 Q 80 60 130 100 Q 130 140 80 140 Q 30 140 30 100 Z" fill="#795548" stroke="#333" strokeWidth="4" />
    <Circle cx="65" cy="95" r="16" fill="#FFF9C4" stroke="#333" strokeWidth="3" />
    <Circle cx="95" cy="95" r="16" fill="#FFF9C4" stroke="#333" strokeWidth="3" />
    <Circle cx="80" cy="80" r="16" fill="#FFF9C4" stroke="#333" strokeWidth="3" />
  </Svg>
);

const SvgOwl = () => (
  <Svg width="140" height="140" viewBox="0 0 160 160">
    <Ellipse cx="80" cy="95" rx="42" ry="48" fill="#8D6E63" stroke="#333" strokeWidth="4" />
    <Circle cx="63" cy="72" r="20" fill="#fff" stroke="#333" strokeWidth="3" />
    <Circle cx="97" cy="72" r="20" fill="#fff" stroke="#333" strokeWidth="3" />
    <Circle cx="63" cy="72" r="10" fill="#333" />
    <Circle cx="97" cy="72" r="10" fill="#333" />
    <Polygon points="80,88 74,100 86,100" fill="#FFC107" stroke="#333" strokeWidth="2" />
    <Path d="M 45 48 L 35 30 L 55 40 Z" fill="#8D6E63" stroke="#333" strokeWidth="3" />
    <Path d="M 115 48 L 125 30 L 105 40 Z" fill="#8D6E63" stroke="#333" strokeWidth="3" />
  </Svg>
);

const SvgPig = () => (
  <Svg width="140" height="140" viewBox="0 0 160 160">
    <Ellipse cx="80" cy="100" rx="50" ry="38" fill="#FFB3C1" stroke="#333" strokeWidth="4" />
    <Circle cx="80" cy="68" r="35" fill="#FFB3C1" stroke="#333" strokeWidth="4" />
    <Ellipse cx="80" cy="80" rx="15" ry="10" fill="#FF8A9A" stroke="#333" strokeWidth="2" />
    <Circle cx="75" cy="78" r="4" fill="#333" />
    <Circle cx="85" cy="78" r="4" fill="#333" />
    <Circle cx="65" cy="60" r="5" fill="#333" />
    <Circle cx="95" cy="60" r="5" fill="#333" />
    <Path d="M 108 55 Q 118 42 115 35" stroke="#FFB3C1" strokeWidth="6" strokeLinecap="round" fill="none" />
  </Svg>
);

const SvgQuilt = () => (
  <Svg width="140" height="140" viewBox="0 0 160 160">
    <Rect x="30" y="30" width="100" height="100" fill="#fff" stroke="#333" strokeWidth="4" />
    <Rect x="30" y="30" width="50" height="50" fill="#FF8A65" stroke="#333" strokeWidth="2" />
    <Rect x="80" y="30" width="50" height="50" fill="#42A5F5" stroke="#333" strokeWidth="2" />
    <Rect x="30" y="80" width="50" height="50" fill="#66BB6A" stroke="#333" strokeWidth="2" />
    <Rect x="80" y="80" width="50" height="50" fill="#FFA726" stroke="#333" strokeWidth="2" />
  </Svg>
);

const SvgRocket = () => (
  <Svg width="140" height="140" viewBox="0 0 160 160">
    <Path d="M 80 15 Q 55 50 55 90 L 105 90 Q 105 50 80 15 Z" fill="#EF5350" stroke="#333" strokeWidth="4" />
    <Rect x="55" y="90" width="50" height="30" fill="#BDBDBD" stroke="#333" strokeWidth="4" />
    <Path d="M 55 90 L 30 120 L 55 120 Z" fill="#FF9800" stroke="#333" strokeWidth="3" />
    <Path d="M 105 90 L 130 120 L 105 120 Z" fill="#FF9800" stroke="#333" strokeWidth="3" />
    <Circle cx="80" cy="65" r="14" fill="#E3F2FD" stroke="#333" strokeWidth="3" />
    <Path d="M 60 120 L 55 145 L 80 135 L 105 145 L 100 120" fill="#FF6D00" stroke="#333" strokeWidth="3" />
  </Svg>
);

const SvgSun = () => (
  <Svg width="140" height="140" viewBox="0 0 160 160">
    <Circle cx="80" cy="80" r="34" fill="#FFD54F" stroke="#333" strokeWidth="4" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
      const r = a * Math.PI / 180;
      const x1 = 80 + 40 * Math.cos(r), y1 = 80 + 40 * Math.sin(r);
      const x2 = 80 + 58 * Math.cos(r), y2 = 80 + 58 * Math.sin(r);
      return <Path key={i} d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke="#333" strokeWidth="5" strokeLinecap="round" />;
    })}
  </Svg>
);

const SvgTrain = () => (
  <Svg width="140" height="140" viewBox="0 0 160 160">
    <Rect x="25" y="50" width="110" height="65" rx="12" fill="#1E88E5" stroke="#333" strokeWidth="4" />
    <Rect x="35" y="60" width="30" height="25" rx="4" fill="#E3F2FD" stroke="#333" strokeWidth="3" />
    <Rect x="95" y="60" width="30" height="25" rx="4" fill="#E3F2FD" stroke="#333" strokeWidth="3" />
    <Circle cx="45" cy="120" r="14" fill="#333" />
    <Circle cx="115" cy="120" r="14" fill="#333" />
    <Rect x="72" y="35" width="16" height="20" fill="#333" />
    <Circle cx="80" cy="30" r="8" fill="#FF5722" stroke="#333" strokeWidth="2" />
  </Svg>
);

const SvgUmbrella = () => (
  <Svg width="140" height="140" viewBox="0 0 160 160">
    <Path d="M 20 80 A 60 60 0 0 1 140 80 Z" fill="#7C4DFF" stroke="#333" strokeWidth="4" />
    <Path d="M 80 80 L 80 135 Q 80 148 65 148" stroke="#333" strokeWidth="5" strokeLinecap="round" fill="none" />
    <Path d="M 40 80 Q 60 60 80 80" stroke="#fff" strokeWidth="3" fill="none" />
    <Path d="M 80 80 Q 100 60 120 80" stroke="#fff" strokeWidth="3" fill="none" />
  </Svg>
);

const SvgVase = () => (
  <Svg width="140" height="140" viewBox="0 0 160 160">
    <Path d="M 60 40 Q 30 70 35 110 Q 35 140 80 140 Q 125 140 125 110 Q 130 70 100 40 Z" fill="#42A5F5" stroke="#333" strokeWidth="4" />
    <Ellipse cx="80" cy="40" rx="22" ry="10" fill="#42A5F5" stroke="#333" strokeWidth="3" />
    <Path d="M 70 40 L 65 15" stroke="#4CAF50" strokeWidth="4" strokeLinecap="round" />
    <Circle cx="60" cy="12" r="10" fill="#F44336" stroke="#333" strokeWidth="2" />
    <Path d="M 85 40 L 92 12" stroke="#4CAF50" strokeWidth="4" strokeLinecap="round" />
    <Circle cx="96" cy="8" r="10" fill="#FFEB3B" stroke="#333" strokeWidth="2" />
  </Svg>
);

const SvgWatch = () => (
  <Svg width="140" height="140" viewBox="0 0 160 160">
    <Rect x="65" y="25" width="30" height="20" rx="4" fill="#555" stroke="#333" strokeWidth="2" />
    <Rect x="65" y="115" width="30" height="20" rx="4" fill="#555" stroke="#333" strokeWidth="2" />
    <Circle cx="80" cy="80" r="38" fill="#fff" stroke="#333" strokeWidth="5" />
    <Circle cx="80" cy="80" r="30" fill="#E8EAF6" />
    <Path d="M 80 56 L 80 80 L 98 80" stroke="#333" strokeWidth="4" strokeLinecap="round" />
  </Svg>
);

const SvgXylophone = () => (
  <Svg width="140" height="140" viewBox="0 0 160 160">
    <Rect x="25" y="55" width="110" height="18" rx="4" fill="#F44336" stroke="#333" strokeWidth="3" />
    <Rect x="30" y="80" width="100" height="16" rx="4" fill="#FF9800" stroke="#333" strokeWidth="3" />
    <Rect x="35" y="103" width="90" height="14" rx="4" fill="#FFEB3B" stroke="#333" strokeWidth="3" />
    <Rect x="40" y="124" width="80" height="12" rx="4" fill="#4CAF50" stroke="#333" strokeWidth="3" />
    <Circle cx="60" cy="46" r="8" fill="#78909C" stroke="#333" strokeWidth="2" />
    <Circle cx="100" cy="46" r="8" fill="#78909C" stroke="#333" strokeWidth="2" />
  </Svg>
);

const SvgYak = () => (
  <Svg width="140" height="140" viewBox="0 0 160 160">
    <Ellipse cx="80" cy="105" rx="52" ry="35" fill="#5D4037" stroke="#333" strokeWidth="4" />
    <Circle cx="80" cy="65" r="33" fill="#5D4037" stroke="#333" strokeWidth="4" />
    <Path d="M 55 48 L 40 28 L 60 40 Z" fill="#5D4037" stroke="#333" strokeWidth="3" />
    <Path d="M 105 48 L 120 28 L 100 40 Z" fill="#5D4037" stroke="#333" strokeWidth="3" />
    <Circle cx="68" cy="62" r="5" fill="#333" />
    <Circle cx="92" cy="62" r="5" fill="#333" />
    <Ellipse cx="80" cy="78" rx="12" ry="8" fill="#795548" stroke="#333" strokeWidth="2" />
    <Path d="M 28 105 Q 15 115 20 125" stroke="#5D4037" strokeWidth="6" strokeLinecap="round" fill="none" />
    <Path d="M 132 105 Q 145 115 140 125" stroke="#5D4037" strokeWidth="6" strokeLinecap="round" fill="none" />
  </Svg>
);

const SvgZebra = () => (
  <Svg width="140" height="140" viewBox="0 0 160 160">
    <Ellipse cx="80" cy="105" rx="48" ry="33" fill="#fff" stroke="#333" strokeWidth="4" />
    <Circle cx="80" cy="65" r="33" fill="#fff" stroke="#333" strokeWidth="4" />
    <Path d="M 52 50 L 42 28 L 62 42 Z" fill="#fff" stroke="#333" strokeWidth="3" />
    <Path d="M 108 50 L 118 28 L 98 42 Z" fill="#fff" stroke="#333" strokeWidth="3" />
    <Path d="M 60 50 Q 65 70 60 90" stroke="#333" strokeWidth="5" />
    <Path d="M 80 48 Q 85 68 80 88" stroke="#333" strokeWidth="5" />
    <Path d="M 100 50 Q 95 70 100 90" stroke="#333" strokeWidth="5" />
    <Circle cx="68" cy="62" r="5" fill="#333" />
    <Circle cx="92" cy="62" r="5" fill="#333" />
  </Svg>
);

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

const ROUNDS = buildRounds();

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function AlphabetSoundScreen({ navigation }: ScreenProps<'AlphabetSound'>) {
  const { idx, picked, setPicked, score, addScore, shake, slideIn, bounceAnim, triggerSlideIn, doShake, doBounce, advance } =
    useGameScreen({ total: TOTAL, from: 'AlphabetSound', navigation });

  const { item, options } = ROUNDS[idx];

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
            let bg = '#fff';
            let border = C.ink;
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
  content:       { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 30 },
  prompt:        { textAlign: 'center', fontWeight: '800', fontSize: 20, color: C.ink, marginBottom: 20, paddingHorizontal: 16 },
  wordHighlight: { fontWeight: '900', fontSize: 22 },
  imageCard:     { width: 220, height: 240, backgroundColor: '#fff', borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 32, elevation: 16, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 12 },
  imageInner:    { width: 200, height: 190, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  wordLabel:     { fontWeight: '900', fontSize: 18, color: C.ink, marginTop: 6 },
  optionsGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'center', paddingHorizontal: 24 },
  option:        { width: 72, height: 72, borderRadius: 20, borderWidth: 3.5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', shadowColor: C.ink, shadowOffset: { width: 2, height: 3 }, shadowOpacity: 0.15, shadowRadius: 0, elevation: 3 },
  optionText:    { fontSize: 32, fontWeight: '900', color: C.ink },
});

