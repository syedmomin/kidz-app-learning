import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '../theme';
import { useProgress } from '../store/ProgressStore';
import { ARABIC_LETTERS, type ArabicLetter } from '../data/ArabicData';
import { ArabicSpeech } from '../utils/AudioUtils';
import type { ScreenProps } from '../navigation/types';

function speak(text: string) {
  ArabicSpeech.speak(text);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomChoices(correct: ArabicLetter): ArabicLetter[] {
  const pool = ARABIC_LETTERS.filter(l => l.letter !== correct.letter);
  const wrong = shuffle(pool).slice(0, 3);
  return shuffle([correct, ...wrong]);
}

export default function ArabicQuizScreen({ navigation }: ScreenProps<'ArabicQuiz'>) {
  const { addStars } = useProgress();
  const [currentIdx, setCurrentIdx] = useState(() => Math.floor(Math.random() * ARABIC_LETTERS.length));
  const [choices, setChoices] = useState(() => randomChoices(ARABIC_LETTERS[currentIdx]));
  const [answered, setAnswered] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const correctLetter = ARABIC_LETTERS[currentIdx];

  function shake() {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,  duration: 60, useNativeDriver: true }),
    ]).start();
  }

  function bounce() {
    Animated.sequence([
      Animated.spring(bounceAnim, { toValue: 1.18, useNativeDriver: true }),
      Animated.spring(bounceAnim, { toValue: 1,    useNativeDriver: true }),
    ]).start();
  }

  function answer(choice: ArabicLetter) {
    if (answered) return;
    setAnswered(choice.name);
    setTotal(t => t + 1);
    speak(correctLetter.arabicName);
    if (choice.letter === correctLetter.letter) {
      setScore(s => s + 1);
      addStars(1);
      bounce();
    } else {
      shake();
    }
  }

  function nextQuestion() {
    const idx = Math.floor(Math.random() * ARABIC_LETTERS.length);
    setCurrentIdx(idx);
    setChoices(randomChoices(ARABIC_LETTERS[idx]));
    setAnswered(null);
  }

  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.header}>
        <Pressable style={s.back} onPress={() => navigation.goBack()}>
          <Text style={s.backText}>←</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>اختبار</Text>
          <Text style={s.subtitle}>Arabic Quiz · Letters</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.quizContainer}>
        {/* Score bar */}
        <View style={s.scoreRow}>
          <Text style={s.scoreText}>⭐ {score} / {total}</Text>
          <View style={s.scoreBarBg}>
            <View style={[s.scoreBarFill, { width: `${pct}%` as any }]} />
          </View>
          <Text style={s.scoreText}>{pct}%</Text>
        </View>

        <Text style={s.quizQuestion}>What letter is this?</Text>

        {/* Big letter display */}
        <Animated.View style={{ transform: [{ translateX: shakeAnim }, { scale: bounceAnim }] }}>
          <Pressable
            style={[s.quizLetterBox, { borderColor: correctLetter.color, backgroundColor: correctLetter.color + '22' }]}
            onPress={() => speak(correctLetter.letter)}
          >
            <Text style={[s.quizLetter, { color: correctLetter.color }]}>{correctLetter.letter}</Text>
            <Text style={s.quizHearHint}>tap to hear 🔊</Text>
          </Pressable>
        </Animated.View>

        {/* Choices */}
        <View style={s.choicesGrid}>
          {choices.map((choice, i) => {
            const isCorrect = choice.letter === correctLetter.letter;
            const isSelected = answered === choice.name;
            let bg = '#FFF';
            let border = '#DDD';
            if (answered) {
              if (isCorrect) { bg = '#E8FFE8'; border = '#3CB57F'; }
              else if (isSelected) { bg = '#FFE8E8'; border = '#FF6B6B'; }
            }
            return (
              <Pressable
                key={i}
                style={[s.choiceBtn, { backgroundColor: bg, borderColor: border }]}
                onPress={() => answer(choice)}
              >
                <Text style={[s.choiceText, answered && isCorrect && { color: '#3CB57F', fontWeight: '900' }]}>
                  {choice.name}
                </Text>
                <Text style={s.choiceTranslit}>/{choice.transliteration}/</Text>
                {answered && isCorrect && <Text style={s.choiceTick}>✓</Text>}
                {answered && isSelected && !isCorrect && <Text style={s.choiceCross}>✗</Text>}
              </Pressable>
            );
          })}
        </View>

        {answered && (
          <View style={s.feedbackRow}>
            <Text style={[s.feedbackText, { color: answered === correctLetter.name ? '#3CB57F' : '#FF6B6B' }]}>
              {answered === correctLetter.name
                ? '🎉 Correct! Great job!'
                : `❌ It was  ${correctLetter.name}  (${correctLetter.letter})`}
            </Text>
            <Pressable style={s.nextBtn} onPress={nextQuestion}>
              <Text style={s.nextBtnText}>Next →</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root:             { flex: 1, backgroundColor: '#FFFAF2' },
  header:           { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12, gap: 12 },
  back:             { width: 40, height: 40, borderRadius: 20, backgroundColor: C.ink + '15', justifyContent: 'center', alignItems: 'center' },
  backText:         { fontSize: 22, color: C.ink, fontWeight: '700' },
  title:            { fontSize: 22, fontWeight: '900', color: C.ink, textAlign: 'right' },
  subtitle:         { fontSize: 13, fontWeight: '700', color: C.inkSoft },
  quizContainer:    { paddingHorizontal: 16, paddingBottom: 32, alignItems: 'center' },
  scoreRow:         { flexDirection: 'row', alignItems: 'center', gap: 10, width: '100%', marginBottom: 8, marginTop: 6 },
  scoreText:        { fontSize: 13, fontWeight: '800', color: C.ink, width: 54 },
  scoreBarBg:       { flex: 1, height: 8, backgroundColor: '#EEE', borderRadius: 8, overflow: 'hidden' },
  scoreBarFill:     { height: 8, backgroundColor: '#77DD77', borderRadius: 8 },
  quizQuestion:     { fontSize: 18, fontWeight: '800', color: C.ink, marginBottom: 14, textAlign: 'center' },
  quizLetterBox:    { width: 170, height: 170, borderRadius: 36, borderWidth: 4, justifyContent: 'center', alignItems: 'center', marginBottom: 24, elevation: 4 },
  quizLetter:       { fontSize: 90, fontWeight: '900' },
  quizHearHint:     { fontSize: 11, color: C.inkSoft, fontWeight: '700', marginTop: 2 },
  choicesGrid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center', width: '100%' },
  choiceBtn:        { width: '46%', borderRadius: 16, borderWidth: 3, paddingVertical: 14, alignItems: 'center', elevation: 2 },
  choiceText:       { fontSize: 17, fontWeight: '800', color: C.ink },
  choiceTranslit:   { fontSize: 11, color: C.inkSoft, fontWeight: '600', marginTop: 2 },
  choiceTick:       { fontSize: 18, color: '#3CB57F', fontWeight: '900', marginTop: 4 },
  choiceCross:      { fontSize: 18, color: '#FF6B6B', fontWeight: '900', marginTop: 4 },
  feedbackRow:      { marginTop: 20, alignItems: 'center', gap: 12 },
  feedbackText:     { fontSize: 18, fontWeight: '800', textAlign: 'center' },
  nextBtn:          { backgroundColor: C.ink, borderRadius: 14, paddingHorizontal: 36, paddingVertical: 13 },
  nextBtnText:      { color: '#FFF', fontWeight: '900', fontSize: 16 },
});
