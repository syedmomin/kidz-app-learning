// src/screens/ArabicQaidaScreen.tsx — Arabic Qaida with 4 learning modes
import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView,
  Animated, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import { C } from '../theme';
import { useProgress } from '../store/ProgressStore';
import { ARABIC_LETTERS, type ArabicLetter } from '../data/ArabicData';
import type { ScreenProps } from '../navigation/types';

// ─── Arabic Tatweel (U+0640) used to show connecting forms ───
const TAT = 'ـ';

// ─── Harakat (vowel marks) ─────────────────────────────────
const HARAKAT = [
  { mark: 'َ',        name: 'Fatha',       arabicName: 'فَتْحَة',    sound: 'a',    color: '#FF6B6B', label: 'َ' },
  { mark: 'ِ',        name: 'Kasra',       arabicName: 'كَسْرَة',    sound: 'i',    color: '#3FB5FF', label: 'ِ' },
  { mark: 'ُ',        name: 'Damma',       arabicName: 'ضَمَّة',    sound: 'u',    color: '#FFB347', label: 'ُ' },
  { mark: 'ْ',        name: 'Sukoon',      arabicName: 'سُكُون',    sound: '(silent)', color: '#77DD77', label: 'ْ' },
  { mark: 'َّ',  name: 'Shadda+Fatha',arabicName: 'شَدَّة فَتْحَة',sound: 'bb-a', color: '#B68CFF', label: 'َّ' },
  { mark: 'ً',        name: 'Tanwin Fath', arabicName: 'تَنْوِين فَتْح', sound: 'an',   color: '#FF8CCC', label: 'ً' },
  { mark: 'ٌ',        name: 'Tanwin Damm', arabicName: 'تَنْوِين ضَمّ', sound: 'un',   color: '#D898FF', label: 'ٌ' },
  { mark: 'ٍ',        name: 'Tanwin Kasr', arabicName: 'تَنْوِين كَسْر', sound: 'in',   color: '#4BC8A0', label: 'ٍ' },
];

type Tab = 'letters' | 'harakat' | 'forms' | 'quiz';

const TABS: { key: Tab; ar: string; en: string }[] = [
  { key: 'letters', ar: 'حروف',  en: 'Letters'  },
  { key: 'harakat', ar: 'حركات', en: 'Harakat'  },
  { key: 'forms',   ar: 'أشكال', en: 'Forms'    },
  { key: 'quiz',    ar: 'اختبار', en: 'Quiz'    },
];

function speak(text: string, lang = 'ar') {
  Speech.stop();
  Speech.speak(text, { language: lang, rate: 0.7, pitch: 1.0 });
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

// ─── Sub-screens ───────────────────────────────────────────

function LettersTab({ heard, setHeard, addStars }: {
  heard: Set<number>;
  setHeard: (s: Set<number>) => void;
  addStars: (n: number) => void;
}) {
  const [selected, setSelected] = useState<{ letter: ArabicLetter; idx: number } | null>(null);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const bounceAnims = useRef(ARABIC_LETTERS.map(() => new Animated.Value(1))).current;

  const progress = Math.round((heard.size / ARABIC_LETTERS.length) * 100);

  function openLetter(letter: ArabicLetter, idx: number) {
    speak(letter.arabicName);
    Animated.sequence([
      Animated.timing(bounceAnims[idx], { toValue: 0.85, duration: 80, useNativeDriver: true }),
      Animated.spring(bounceAnims[idx], { toValue: 1, useNativeDriver: true }),
    ]).start();
    if (!heard.has(idx)) {
      const next = new Set(heard);
      next.add(idx);
      setHeard(next);
      addStars(next.size === ARABIC_LETTERS.length ? 3 : 0);
    }
    setSelected({ letter, idx });
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, bounciness: 14 }).start();
  }

  function closeModal() {
    Animated.timing(scaleAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => setSelected(null));
  }

  return (
    <>
      <View style={s.progressBar}>
        <View style={[s.progressFill, { width: `${progress}%` as any, backgroundColor: '#FF8E53' }]} />
      </View>
      <Text style={s.tapHint}>Tap a letter to hear it! 🔊  ({heard.size}/{ARABIC_LETTERS.length})</Text>

      <ScrollView contentContainerStyle={s.letterGrid} showsVerticalScrollIndicator={false}>
        {ARABIC_LETTERS.map((item, idx) => (
          <Animated.View key={idx} style={{ transform: [{ scale: bounceAnims[idx] }] }}>
            <Pressable
              style={[
                s.letterCard,
                { borderColor: item.color, backgroundColor: item.color + '22' },
                heard.has(idx) && { opacity: 0.65 },
              ]}
              onPress={() => openLetter(item, idx)}
            >
              {heard.has(idx) && <Text style={s.checkmark}>✓</Text>}
              <Text style={[s.letterText, { color: item.color }]}>{item.letter}</Text>
              <Text style={s.letterName}>{item.name}</Text>
            </Pressable>
          </Animated.View>
        ))}
        <View style={{ height: 24 }} />
      </ScrollView>

      <Modal visible={!!selected} transparent animationType="none" onRequestClose={closeModal}>
        <Pressable style={s.overlay} onPress={closeModal}>
          <Animated.View style={[s.modal, { transform: [{ scale: scaleAnim }] }]}>
            {selected && (() => {
              const { letter } = selected;
              return (
                <>
                  <View style={[s.modalLetterBox, { backgroundColor: letter.color + '33', borderColor: letter.color }]}>
                    <Text style={[s.modalLetter, { color: letter.color }]}>{letter.letter}</Text>
                  </View>
                  <Text style={s.modalName}>{letter.name}</Text>
                  <Text style={s.modalTrans}>/{letter.transliteration}/</Text>
                  <View style={s.divider} />
                  <Text style={s.exampleLabel}>Example Word</Text>
                  <Text style={[s.exampleArabic, { color: letter.color }]}>{letter.example}</Text>
                  <Text style={s.exampleMeaning}>{letter.exampleMeaning}</Text>
                  <Pressable style={[s.speakBtn, { backgroundColor: letter.color }]}
                    onPress={() => speak(letter.letter + ' ' + letter.arabicName)}>
                    <Text style={s.speakBtnText}>🔊 Hear letter</Text>
                  </Pressable>
                  <Pressable style={[s.speakBtn, { backgroundColor: '#EEE', marginTop: 8 }]}
                    onPress={() => speak(letter.example)}>
                    <Text style={[s.speakBtnText, { color: C.ink }]}>🔊 Hear word</Text>
                  </Pressable>
                  <Pressable style={s.closeBtn} onPress={closeModal}>
                    <Text style={s.closeBtnText}>Close</Text>
                  </Pressable>
                </>
              );
            })()}
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
}

function HarakatTab() {
  const [selectedLetterIdx, setSelectedLetterIdx] = useState(1); // Ba by default
  const letter = ARABIC_LETTERS[selectedLetterIdx];
  const bounceAnims = useRef(HARAKAT.map(() => new Animated.Value(1))).current;

  function tapHarakat(idx: number, mark: string, arabicName: string) {
    const syllable = letter.letter + mark;
    speak(syllable + ' ' + arabicName);
    Animated.sequence([
      Animated.timing(bounceAnims[idx], { toValue: 0.8, duration: 70, useNativeDriver: true }),
      Animated.spring(bounceAnims[idx], { toValue: 1, useNativeDriver: true }),
    ]).start();
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Letter picker */}
      <Text style={s.sectionTitle}>Pick a letter</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.letterPickerRow}>
        {ARABIC_LETTERS.map((l, i) => (
          <Pressable
            key={i}
            style={[s.letterChip, { borderColor: l.color, backgroundColor: i === selectedLetterIdx ? l.color : l.color + '22' }]}
            onPress={() => setSelectedLetterIdx(i)}
          >
            <Text style={[s.letterChipText, { color: i === selectedLetterIdx ? '#FFF' : l.color }]}>{l.letter}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Big selected letter */}
      <View style={[s.bigLetterBox, { borderColor: letter.color, backgroundColor: letter.color + '18' }]}>
        <Text style={[s.bigLetter, { color: letter.color }]}>{letter.letter}</Text>
        <Text style={s.bigLetterName}>{letter.name}  /{letter.transliteration}/</Text>
      </View>

      {/* Harakat grid */}
      <Text style={s.sectionTitle}>Tap each vowel to hear it 🎵</Text>
      <View style={s.harakatGrid}>
        {HARAKAT.map((h, i) => {
          const syllable = letter.letter + h.mark;
          return (
            <Animated.View key={i} style={{ transform: [{ scale: bounceAnims[i] }], width: '46%' }}>
              <Pressable
                style={[s.harakatCard, { borderColor: h.color, backgroundColor: h.color + '18' }]}
                onPress={() => tapHarakat(i, h.mark, h.arabicName)}
              >
                <Text style={[s.harakatSyllable, { color: h.color }]}>{syllable}</Text>
                <Text style={s.harakatName}>{h.name}</Text>
                <Text style={s.harakatSound}>"{h.sound}" sound</Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>

      {/* Full row example */}
      <View style={[s.rowExampleBox, { borderColor: letter.color + '60', backgroundColor: letter.color + '10' }]}>
        <Text style={s.rowExampleTitle}>Full vowel row for  {letter.letter}  ({letter.name})</Text>
        <View style={s.rowExampleLetters}>
          {HARAKAT.slice(0, 3).map((h, i) => (
            <Pressable key={i} onPress={() => speak(letter.letter + h.mark)}>
              <Text style={[s.rowExampleChar, { color: letter.color }]}>{letter.letter + h.mark}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={s.rowExampleSubtitle}>
          {letter.transliteration}a · {letter.transliteration}i · {letter.transliteration}u
        </Text>
      </View>
    </ScrollView>
  );
}

function FormsTab() {
  const [selectedLetterIdx, setSelectedLetterIdx] = useState(1);
  const letter = ARABIC_LETTERS[selectedLetterIdx];
  const bounceAnims = useRef([0,1,2,3].map(() => new Animated.Value(1))).current;

  const forms = letter.nonConnecting
    ? [
        { label: 'Isolated / Start', arabic: letter.letter,             hint: 'Stands alone — does not join left' },
        { label: 'After a letter',   arabic: TAT + letter.letter,       hint: 'Joins from the right only' },
      ]
    : [
        { label: 'Isolated',  arabic: letter.letter,                    hint: 'Stands alone' },
        { label: 'Initial',   arabic: letter.letter + TAT,              hint: 'Start of a word — joins left' },
        { label: 'Medial',    arabic: TAT + letter.letter + TAT,        hint: 'Middle of a word — joins both sides' },
        { label: 'Final',     arabic: TAT + letter.letter,              hint: 'End of a word — joins right only' },
      ];

  function tapForm(idx: number, arabic: string, label: string) {
    speak(arabic); // Speak just the letter form in Arabic
    Animated.sequence([
      Animated.timing(bounceAnims[idx], { toValue: 0.8, duration: 70, useNativeDriver: true }),
      Animated.spring(bounceAnims[idx], { toValue: 1, useNativeDriver: true }),
    ]).start();
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={s.sectionTitle}>Pick a letter</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.letterPickerRow}>
        {ARABIC_LETTERS.map((l, i) => (
          <Pressable
            key={i}
            style={[s.letterChip, { borderColor: l.color, backgroundColor: i === selectedLetterIdx ? l.color : l.color + '22' }]}
            onPress={() => setSelectedLetterIdx(i)}
          >
            <Text style={[s.letterChipText, { color: i === selectedLetterIdx ? '#FFF' : l.color }]}>{l.letter}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={[s.bigLetterBox, { borderColor: letter.color, backgroundColor: letter.color + '18' }]}>
        <Text style={[s.bigLetter, { color: letter.color }]}>{letter.letter}</Text>
        <Text style={s.bigLetterName}>{letter.name}</Text>
        {letter.nonConnecting && (
          <View style={s.nonConnectBadge}>
            <Text style={s.nonConnectText}>2-form letter (joins right only)</Text>
          </View>
        )}
      </View>

      <Text style={s.sectionTitle}>
        {letter.nonConnecting ? '2 forms' : '4 forms'} of {letter.name} — tap to hear 🔊
      </Text>

      <View style={s.formsGrid}>
        {forms.map((f, i) => (
          <Animated.View key={i} style={{ transform: [{ scale: bounceAnims[i] }], width: letter.nonConnecting ? '47%' : '47%' }}>
            <Pressable
              style={[s.formCard, { borderColor: letter.color, backgroundColor: letter.color + '18' }]}
              onPress={() => tapForm(i, f.arabic, f.label)}
            >
              <Text style={[s.formArabic, { color: letter.color }]}>{f.arabic}</Text>
              <Text style={s.formLabel}>{f.label}</Text>
              <Text style={s.formHint}>{f.hint}</Text>
            </Pressable>
          </Animated.View>
        ))}
      </View>

      {/* Word example showing the letter in context */}
      <View style={[s.rowExampleBox, { borderColor: letter.color + '60', backgroundColor: letter.color + '10' }]}>
        <Text style={s.rowExampleTitle}>Example word with {letter.name}</Text>
        <Pressable onPress={() => speak(letter.example)}>
          <Text style={[s.rowExampleChar, { color: letter.color, fontSize: 42 }]}>{letter.example}</Text>
        </Pressable>
        <Text style={s.rowExampleSubtitle}>{letter.exampleMeaning} — tap to hear 🔊</Text>
      </View>
    </ScrollView>
  );
}

function QuizTab({ addStars }: { addStars: (n: number) => void }) {
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
    speak(correctLetter.letter + ' ' + correctLetter.arabicName);
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
  );
}

// ─── Main Screen ────────────────────────────────────────────

export default function ArabicQaidaScreen({ navigation }: ScreenProps<'ArabicQaida'>) {
  const { addStars } = useProgress();
  const [tab, setTab] = useState<Tab>('letters');
  const [heard, setHeard] = useState<Set<number>>(new Set());

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <Pressable style={s.back} onPress={() => navigation.goBack()}>
          <Text style={s.backText}>←</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>القاعدة</Text>
          <Text style={s.subtitle}>Arabic Qaida · {ARABIC_LETTERS.length} letters</Text>
        </View>
      </View>

      {/* Tab bar */}
      <View style={s.tabBar}>
        {TABS.map(t => (
          <Pressable
            key={t.key}
            style={[s.tab, tab === t.key && s.tabActive]}
            onPress={() => setTab(t.key)}
          >
            <Text style={[s.tabAr, tab === t.key && s.tabTextActive]}>{t.ar}</Text>
            <Text style={[s.tabEn, tab === t.key && { color: C.ink }]}>{t.en}</Text>
          </Pressable>
        ))}
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        {tab === 'letters' && <LettersTab heard={heard} setHeard={setHeard} addStars={addStars} />}
        {tab === 'harakat' && <HarakatTab />}
        {tab === 'forms'   && <FormsTab />}
        {tab === 'quiz'    && <QuizTab addStars={addStars} />}
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────────

const s = StyleSheet.create({
  root:             { flex: 1, backgroundColor: '#FFFAF2' },
  header:           { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 6, gap: 12 },
  back:             { width: 40, height: 40, borderRadius: 20, backgroundColor: C.ink + '15', justifyContent: 'center', alignItems: 'center' },
  backText:         { fontSize: 22, color: C.ink, fontWeight: '700' },
  title:            { fontSize: 22, fontWeight: '900', color: C.ink, textAlign: 'right' },
  subtitle:         { fontSize: 12, fontWeight: '700', color: C.inkSoft },

  // Tab bar
  tabBar:           { flexDirection: 'row', marginHorizontal: 12, marginBottom: 6, backgroundColor: '#EEE8FF', borderRadius: 16, padding: 4, gap: 2 },
  tab:              { flex: 1, alignItems: 'center', paddingVertical: 7, borderRadius: 12 },
  tabActive:        { backgroundColor: '#FFF', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  tabAr:            { fontSize: 14, fontWeight: '800', color: C.inkSoft },
  tabEn:            { fontSize: 9,  fontWeight: '700', color: C.inkSoft },
  tabTextActive:    { color: C.ink },

  // Shared
  progressBar:      { height: 7, backgroundColor: '#EEE', marginHorizontal: 16, borderRadius: 8, marginBottom: 4, overflow: 'hidden' },
  progressFill:     { height: 7, borderRadius: 8 },
  tapHint:          { textAlign: 'center', color: C.inkSoft, fontWeight: '700', fontSize: 12, marginBottom: 10 },
  sectionTitle:     { fontSize: 14, fontWeight: '800', color: C.ink, marginHorizontal: 16, marginTop: 14, marginBottom: 8 },
  divider:          { height: 1.5, backgroundColor: '#EEE', width: '100%', marginVertical: 12 },

  // Letters tab
  letterGrid:       { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10, gap: 8, justifyContent: 'center' },
  letterCard:       { width: 78, height: 86, borderRadius: 16, borderWidth: 3, alignItems: 'center', justifyContent: 'center', gap: 3, elevation: 2 },
  checkmark:        { position: 'absolute', top: 4, right: 7, fontSize: 10, color: '#3CB57F', fontWeight: '900' },
  letterText:       { fontSize: 30, fontWeight: '900' },
  letterName:       { fontSize: 9,  fontWeight: '700', color: C.inkSoft },

  // Modal
  overlay:          { flex: 1, backgroundColor: '#00000055', justifyContent: 'center', alignItems: 'center' },
  modal:            { backgroundColor: '#FFF', borderRadius: 28, padding: 26, width: '85%', alignItems: 'center', elevation: 20 },
  modalLetterBox:   { width: 110, height: 110, borderRadius: 28, borderWidth: 4, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  modalLetter:      { fontSize: 62, fontWeight: '900' },
  modalName:        { fontSize: 24, fontWeight: '900', color: C.ink },
  modalTrans:       { fontSize: 15, color: C.inkSoft, fontWeight: '700', marginTop: 2 },
  exampleLabel:     { fontSize: 12, fontWeight: '700', color: C.inkSoft, marginBottom: 4 },
  exampleArabic:    { fontSize: 30, fontWeight: '900', marginBottom: 2 },
  exampleMeaning:   { fontSize: 14, color: C.inkSoft, fontWeight: '700', marginBottom: 14 },
  speakBtn:         { borderRadius: 13, paddingHorizontal: 20, paddingVertical: 11, width: '100%', alignItems: 'center' },
  speakBtnText:     { color: '#FFF', fontSize: 14, fontWeight: '800' },
  closeBtn:         { marginTop: 12 },
  closeBtnText:     { fontSize: 13, color: C.inkSoft, fontWeight: '700' },

  // Harakat tab
  letterPickerRow:  { paddingHorizontal: 14, gap: 8, paddingBottom: 4 },
  letterChip:       { width: 44, height: 44, borderRadius: 12, borderWidth: 2.5, justifyContent: 'center', alignItems: 'center' },
  letterChipText:   { fontSize: 20, fontWeight: '900' },
  bigLetterBox:     { alignItems: 'center', marginHorizontal: 16, marginVertical: 10, borderRadius: 22, borderWidth: 3, paddingVertical: 18 },
  bigLetter:        { fontSize: 72, fontWeight: '900' },
  bigLetterName:    { fontSize: 16, fontWeight: '700', color: C.inkSoft, marginTop: 2 },
  harakatGrid:      { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 14, gap: 10, justifyContent: 'center' },
  harakatCard:      { borderRadius: 16, borderWidth: 3, alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8 },
  harakatSyllable:  { fontSize: 40, fontWeight: '900' },
  harakatName:      { fontSize: 12, fontWeight: '800', color: C.ink, marginTop: 4 },
  harakatSound:     { fontSize: 10, color: C.inkSoft, fontWeight: '600' },
  rowExampleBox:    { marginHorizontal: 16, marginTop: 14, borderRadius: 18, borderWidth: 2, padding: 16, alignItems: 'center' },
  rowExampleTitle:  { fontSize: 13, fontWeight: '700', color: C.inkSoft, marginBottom: 8 },
  rowExampleLetters:{ flexDirection: 'row', gap: 18 },
  rowExampleChar:   { fontSize: 36, fontWeight: '900', textAlign: 'center' },
  rowExampleSubtitle:{ fontSize: 13, color: C.inkSoft, fontWeight: '600', marginTop: 6 },

  // Forms tab
  formsGrid:        { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 14, gap: 10, justifyContent: 'center' },
  formCard:         { borderRadius: 18, borderWidth: 3, alignItems: 'center', paddingVertical: 18, paddingHorizontal: 12, minWidth: 130 },
  formArabic:       { fontSize: 44, fontWeight: '900' },
  formLabel:        { fontSize: 12, fontWeight: '800', color: C.ink, marginTop: 6 },
  formHint:         { fontSize: 10, color: C.inkSoft, fontWeight: '600', textAlign: 'center', marginTop: 2 },
  nonConnectBadge:  { marginTop: 6, backgroundColor: '#FFE8C8', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  nonConnectText:   { fontSize: 11, fontWeight: '700', color: '#FF8E53' },

  // Quiz tab
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
