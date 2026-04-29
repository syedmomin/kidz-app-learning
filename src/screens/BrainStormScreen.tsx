import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions, Easing } from 'react-native';
import * as Speech from 'expo-speech';
import PhoneSafe from '../components/PhoneSafe';
import GameHeader from '../components/GameHeader';
import { C } from '../theme';
import { shuffle } from '../utils';
import type { ScreenProps } from '../navigation/types';

const { width: SW } = Dimensions.get('window');

type PuzzleType = 'MATH' | 'ODD_ONE' | 'RIDDLE';

interface Puzzle {
  type: PuzzleType;
  question: string;
  options: string[];
  answer: string;
  hint: string;
  subText?: string;
}

const PUZZLES: Puzzle[] = [
  // Math Logic
  {
    type: 'MATH',
    question: '🍎 + 🍎 = 4\n🍎 = ?',
    options: ['1', '2', '3', '4'],
    answer: '2',
    hint: 'Two apples make four! What is one?',
  },
  {
    type: 'MATH',
    question: '🍌 + 🍌 = 6\n🍌 = ?',
    options: ['2', '3', '4', '5'],
    answer: '3',
    hint: 'If two bananas are 6, one is half!',
  },
  {
    type: 'MATH',
    question: '⭐ + ⭐ = 10\n⭐ = ?',
    options: ['4', '5', '6', '10'],
    answer: '5',
    hint: 'Half of ten is...',
  },
  // Odd One Out
  {
    type: 'ODD_ONE',
    question: 'Find the odd one out! 🧐',
    options: ['🍎', '🍌', '🥦', '🍇'],
    answer: '🥦',
    hint: 'Three are fruits, one is a vegetable!',
  },
  {
    type: 'ODD_ONE',
    question: 'Which one doesn\'t belong?',
    options: ['🐶', '🐱', '🦁', '🐹'],
    answer: '🦁',
    hint: 'Three are pets, one is a wild king!',
  },
  {
    type: 'ODD_ONE',
    question: 'Find the difference!',
    options: ['🚗', '🚲', '🚀', '🛵'],
    answer: '🚀',
    hint: 'Three go on roads, one goes to space!',
  },
  // Riddles / Thinking
  {
    type: 'RIDDLE',
    question: 'I have a long trunk and big ears. Who am I?',
    options: ['🦁', '🐘', '🦒', '🐵'],
    answer: '🐘',
    hint: 'I am the biggest land animal!',
  },
  {
    type: 'RIDDLE',
    question: 'I am round and you can kick me. What am I?',
    options: ['🍎', '⚽', '🚗', '🧸'],
    answer: '⚽',
    hint: 'I am used in sports!',
  },
  {
    type: 'RIDDLE',
    question: 'I shine at night but I am not the sun. Who am I?',
    options: ['🌙', '☁️', '🌈', '☀️'],
    answer: '🌙',
    hint: 'I change shapes every night!',
  },
  {
    type: 'MATH',
    question: '🍎 + 🍌 = 5\n🍎 = 2\n🍌 = ?',
    options: ['1', '2', '3', '4'],
    answer: '3',
    hint: 'Subtract the apple from the total!',
  },
  {
    type: 'ODD_ONE',
    question: 'Which one is NOT cold? ❄️',
    options: ['🍦', '🧊', '☀️', '⛄'],
    answer: '☀️',
    hint: 'The sun is very, very hot!',
  },
  {
    type: 'RIDDLE',
    question: 'I have many teeth but cannot bite. What am I?',
    options: ['🦷', '✂️', '🪮', '🍴'],
    answer: '🪮',
    hint: 'I help keep your hair neat!',
  },
  {
    type: 'MATH',
    question: 'Complete the pattern:\n2, 4, 6, ?',
    options: ['7', '8', '9', '10'],
    answer: '8',
    hint: 'Skip count by 2!',
  },
  {
    type: 'ODD_ONE',
    question: 'Which one doesn\'t fly?',
    options: ['🦅', '🦋', '🐧', '🐝'],
    answer: '🐧',
    hint: 'I am a bird, but I love to swim!',
  },
];

export default function BrainStormScreen({ navigation }: ScreenProps<'BrainStorm'>) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const currentPuzzle = PUZZLES[idx % PUZZLES.length];

  const slideAnim = useRef(new Animated.Value(SW)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    slideAnim.setValue(SW);
    Animated.spring(slideAnim, {
      toValue: 0,
      damping: 15,
      stiffness: 60,
      useNativeDriver: true,
    }).start();

    Speech.stop();
    Speech.speak(currentPuzzle.hint, { rate: 1.0, pitch: 1.1 });
  }, [idx]);

  const onPick = (opt: string) => {
    if (picked) return;
    setPicked(opt);

    if (opt === currentPuzzle.answer) {
      setScore(s => s + 10);
      setShowConfetti(true);
      Speech.stop();
      Speech.speak('Smart kid! Correct!', { rate: 1.1, pitch: 1.2 });
      
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.2, duration: 200, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();

      setTimeout(() => {
        if (idx + 1 >= PUZZLES.length) {
          navigation.navigate('Reward', { from: 'BrainStorm', stars: 3 });
        } else {
          setIdx(i => i + 1);
          setPicked(null);
          setShowConfetti(false);
        }
      }, 1500);
    } else {
      Speech.stop();
      Speech.speak('Not quite, try again!', { rate: 1.1 });
      setTimeout(() => setPicked(null), 1000);
    }
  };

  return (
    <PhoneSafe bg="#F0F9FF">
      <GameHeader
        onBack={() => navigation.goBack()}
        title="Brain Storm 🧠"
        score={score}
        scoreBg="#BAE6FD"
      />

      <View style={s.container}>
        {/* Progress Bar */}
        <View style={s.progressBarContainer}>
            <View style={[s.progressBar, { width: `${((idx + 1) / PUZZLES.length) * 100}%` }]} />
        </View>

        <Animated.View style={[s.card, { transform: [{ translateX: slideAnim }, { scale: scaleAnim }] }]}>
          <View style={[s.typeBadge, { backgroundColor: currentPuzzle.type === 'MATH' ? '#DBEAFE' : currentPuzzle.type === 'ODD_ONE' ? '#FEF3C7' : '#F3E8FF' }]}>
            <Text style={s.typeText}>{currentPuzzle.type.replace('_', ' ')}</Text>
          </View>
          
          <Text style={s.questionText}>{currentPuzzle.question}</Text>
        </Animated.View>

        <View style={s.optionsContainer}>
          {currentPuzzle.options.map((opt, i) => {
             const isCorrect = picked === opt && opt === currentPuzzle.answer;
             const isWrong = picked === opt && opt !== currentPuzzle.answer;
             
             return (
                <Pressable
                  key={i}
                  onPress={() => onPick(opt)}
                  style={({ pressed }) => [
                    s.optionBtn,
                    pressed && s.optionPressed,
                    isCorrect && s.optionCorrect,
                    isWrong && s.optionWrong,
                  ]}
                >
                  <Text style={s.optionText}>{opt}</Text>
                  {isCorrect && <Text style={s.badge}>✅</Text>}
                  {isWrong && <Text style={s.badge}>❌</Text>}
                </Pressable>
             );
          })}
        </View>

        <View style={s.hintBox}>
            <Text style={s.hintEmoji}>💡</Text>
            <Text style={s.hintText}>{currentPuzzle.hint}</Text>
        </View>
      </View>

      {showConfetti && (
        <View style={s.confettiLayer} pointerEvents="none">
          <Text style={s.congratsText}>BRAVO! 🌟</Text>
        </View>
      )}
    </PhoneSafe>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  progressBarContainer: { width: '100%', height: 10, backgroundColor: '#E0F2FE', borderRadius: 5, marginBottom: 20, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: '#0EA5E9' },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 30,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: C.ink,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 220,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  typeBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginBottom: 15 },
  typeText: { fontSize: 12, fontWeight: '900', color: C.ink, letterSpacing: 1 },
  questionText: { fontSize: 24, fontWeight: '900', textAlign: 'center', color: C.ink, lineHeight: 34 },
  optionsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, marginTop: 30, justifyContent: 'center', width: '100%' },
  optionBtn: {
    backgroundColor: '#fff',
    width: '45%',
    height: 90,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: C.ink,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  optionPressed: { transform: [{ scale: 0.95 }] },
  optionCorrect: { backgroundColor: '#DCFCE7', borderColor: '#22C55E' },
  optionWrong: { backgroundColor: '#FEE2E2', borderColor: '#EF4444' },
  optionText: { fontSize: 32, fontWeight: '900', color: C.ink },
  badge: { position: 'absolute', top: -10, right: -10, fontSize: 20 },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 20,
    marginTop: 'auto',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#BAE6FD',
    width: '100%',
  },
  hintEmoji: { fontSize: 24, marginRight: 10 },
  hintText: { flex: 1, fontSize: 14, fontWeight: '700', color: '#0369A1' },
  confettiLayer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.3)', zIndex: 10 },
  congratsText: { fontSize: 48, fontWeight: '900', color: '#0EA5E9', textShadowColor: '#fff', textShadowRadius: 10 },
});
