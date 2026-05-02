import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Dimensions } from 'react-native';
import * as Speech from 'expo-speech';
import Svg, { Line, Circle as SvgCircle } from 'react-native-svg';
import PhoneSafe from '../components/PhoneSafe';
import GameHeader from '../components/GameHeader';
import { useProgress } from '../store/ProgressStore';
import { useAudio } from '../hooks/useAudio';
import { useGameScreen } from '../hooks/useGameScreen';
import { shuffle } from '../utils';
import type { ScreenProps } from '../navigation/types';

const { width } = Dimensions.get('window');
const WHEEL_SIZE = width * 0.7;
const LETTER_RADIUS = 35;

// ─── Word Data ────────────────────────────────────────────────────────────────

const BASE_WORDS = [
  'CAT', 'DOG', 'SUN', 'HAT', 'CUP', 'BUS', 'BAT', 'RED', 'SKY', 'BOX',
  'FISH', 'BALL', 'STAR', 'TREE', 'MOON', 'BOOK', 'MILK', 'CAKE', 'FROG', 'DUCK',
  'APPLE', 'HOUSE', 'PLANE', 'TRAIN', 'CLOUD', 'BIRD', 'PIZZA', 'GREEN', 'SMILE', 'WATER',
  'BUNNY', 'GRAPE', 'TIGER', 'LION', 'MOUSE', 'SHEEP', 'HORSE', 'CHICK', 'FLOWER', 'CANDY',
  'BREAD', 'JUICE', 'CHAIR', 'TABLE', 'CLOCK', 'SHIRT', 'PANTS', 'SHOES', 'TRUCK', 'SHARK',
  'BANANA', 'ORANGE', 'TURTLE', 'POCKET', 'ROCKET', 'WINTER', 'SUMMER', 'SPRING', 'YELLOW', 'PURPLE',
  'DRAGON', 'MONKEY', 'SPIDER', 'RABBIT', 'KETCHUP', 'COOKIE', 'GARDEN', 'SCHOOL', 'FRIEND', 'FAMILY'
];

const TOTAL_ROUNDS = 300;

function buildRounds(): string[] {
  const result: string[] = [];
  while (result.length < TOTAL_ROUNDS) {
    result.push(...shuffle([...BASE_WORDS]));
  }
  return result.slice(0, TOTAL_ROUNDS);
}

const ROUNDS = buildRounds();

// ─── Component ────────────────────────────────────────────────────────────────

export default function WordSwapScreen({ navigation }: ScreenProps<'WordSwap'>) {
  const { playSound } = useAudio();
  const { completeWord } = useProgress();
  const { idx, score, addScore, bounceAnim, doBounce, advance } =
    useGameScreen({ total: TOTAL_ROUNDS, from: 'WordSwap', navigation });

  const targetWord = ROUNDS[idx];
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [currentWord, setCurrentWord] = useState('');
  const [touchPos, setTouchPos] = useState({ x: 0, y: 0 });
  const [isSwiping, setIsSwiping] = useState(false);
  const [foundWord, setFoundWord] = useState(false);

  const containerRef = useRef<View>(null);
  const [containerPos, setContainerPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setShuffledLetters(shuffle(targetWord.split('')));
    setSelectedIndices([]);
    setCurrentWord('');
    setFoundWord(false);
    Speech.stop();
    Speech.speak(`Swipe the letters to make the word!`, { rate: 1.0 });
  }, [idx]);

  const letterPositions = shuffledLetters.map((_, i) => {
    const angle = (i * 2 * Math.PI) / shuffledLetters.length - Math.PI / 2;
    return {
      x: WHEEL_SIZE / 2 + (WHEEL_SIZE / 2.5) * Math.cos(angle),
      y: WHEEL_SIZE / 2 + (WHEEL_SIZE / 2.5) * Math.sin(angle),
    };
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setIsSwiping(true);
        handleTouch(evt.nativeEvent.pageX, evt.nativeEvent.pageY);
      },
      onPanResponderMove: (evt) => {
        handleTouch(evt.nativeEvent.pageX, evt.nativeEvent.pageY);
      },
      onPanResponderRelease: () => {
        checkWord();
        setIsSwiping(false);
        setSelectedIndices([]);
        setTouchPos({ x: 0, y: 0 });
      },
    })
  ).current;

  const handleTouch = (pageX: number, pageY: number) => {
    const localX = pageX - containerPos.x;
    const localY = pageY - containerPos.y;
    setTouchPos({ x: localX, y: localY });

    letterPositions.forEach((pos, index) => {
      const dist = Math.sqrt(Math.pow(localX - pos.x, 2) + Math.pow(localY - pos.y, 2));
      if (dist < LETTER_RADIUS + 10) {
        if (!selectedIndices.includes(index)) {
          setSelectedIndices((prev) => {
            const next = [...prev, index];
            const word = next.map((i) => shuffledLetters[i]).join('');
            setCurrentWord(word);
            return next;
          });
        }
      }
    });
  };

  const checkWord = async () => {
    const word = currentWord;
    if (word === targetWord) {
      setFoundWord(true);
      addScore();
      doBounce();
      Speech.stop();
      Speech.speak(`Perfect! You made ${word}!`, { rate: 1.0, pitch: 1.1 });
      await completeWord(word);
      setTimeout(() => advance(), 1500);
    } else if (word.length > 0) {
      setCurrentWord('');
    }
  };

  return (
    <PhoneSafe bg="#FFF9E6">
      <GameHeader onBack={() => navigation.goBack()} title="Word Swap! 🔠" score={score} scoreBg="#FFD54F" />

      <View style={s.content}>
        {/* Blank Boxes */}
        <View style={s.boxRow}>
          {targetWord.split('').map((char, i) => (
            <View key={i} style={[s.charBox, foundWord && s.charBoxCorrect]}>
              <Text style={s.charBoxText}>{foundWord ? char : ''}</Text>
            </View>
          ))}
        </View>

        {/* Current Word Display */}
        <View style={s.currentWordBox}>
          <Text style={s.currentWordText}>{currentWord}</Text>
        </View>

        {/* Swipe Wheel */}
        <View
          ref={containerRef}
          onLayout={() => {
            containerRef.current?.measure((x, y, w, h, px, py) => {
              setContainerPos({ x: px, y: py });
            });
          }}
          style={s.wheelContainer}
          {...panResponder.panHandlers}
        >
          <Svg style={StyleSheet.absoluteFill}>
            {/* Draw Lines between selected letters */}
            {selectedIndices.map((index, i) => {
              const start = letterPositions[index];
              const end = selectedIndices[i + 1] !== undefined ? letterPositions[selectedIndices[i + 1]] : touchPos;
              if (!end || (i === selectedIndices.length - 1 && !isSwiping)) return null;
              
              return (
                <Line
                  key={i}
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="#FF6B6B"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              );
            })}
          </Svg>

          {letterPositions.map((pos, i) => (
            <View
              key={i}
              style={[
                s.letterCircle,
                { left: pos.x - LETTER_RADIUS, top: pos.y - LETTER_RADIUS },
                selectedIndices.includes(i) && s.letterCircleSelected,
              ]}
            >
              <Text style={[s.letterText, selectedIndices.includes(i) && s.letterTextSelected]}>
                {shuffledLetters[i]}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </PhoneSafe>
  );
}

const s = StyleSheet.create({
  content: { flex: 1, alignItems: 'center', justifyContent: 'space-around', paddingVertical: 20 },
  boxRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', justifyContent: 'center', paddingHorizontal: 20 },
  charBox: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FFD54F',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  charBoxCorrect: {
    backgroundColor: '#CAFFBF',
    borderColor: '#4CAF50',
  },
  charBoxText: { fontSize: 28, fontWeight: '900', color: '#333' },
  currentWordBox: { height: 40, justifyContent: 'center' },
  currentWordText: { fontSize: 24, fontWeight: '800', color: '#FF6B6B', letterSpacing: 4 },
  wheelContainer: { width: WHEEL_SIZE, height: WHEEL_SIZE, justifyContent: 'center', alignItems: 'center' },
  letterCircle: {
    position: 'absolute',
    width: LETTER_RADIUS * 2,
    height: LETTER_RADIUS * 2,
    borderRadius: LETTER_RADIUS,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  letterCircleSelected: {
    backgroundColor: '#FF6B6B',
    transform: [{ scale: 1.1 }],
  },
  letterText: { fontSize: 28, fontWeight: '900', color: '#333' },
  letterTextSelected: { color: '#fff' },
});
