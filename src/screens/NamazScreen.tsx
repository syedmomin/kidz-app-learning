// src/screens/NamazScreen.tsx — Namaz Seekho: Wuzu + Namaz steps for kids
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import { C } from '../theme';
import { useProgress } from '../store/ProgressStore';
import { WUZU_STEPS, NAMAZ_STEPS, type WuzuStep, type NamazStep } from '../data/IslamicData';
import type { ScreenProps } from '../navigation/types';

type Mode = 'wuzu' | 'namaz';
type Step = WuzuStep | NamazStep;

function speakArabic(text: string) {
  Speech.stop();
  Speech.speak(text, { language: 'ar', rate: 0.6, pitch: 1.0 });
}

export default function NamazScreen({ navigation }: ScreenProps<'Namaz'>) {
  const { addStars } = useProgress();
  const [mode, setMode] = useState<Mode>('wuzu');
  const [stepIndex, setStepIndex] = useState(0);
  const [doneWuzu, setDoneWuzu] = useState<Set<number>>(new Set());
  const [doneNamaz, setDoneNamaz] = useState<Set<number>>(new Set());

  const steps: Step[] = mode === 'wuzu' ? WUZU_STEPS : NAMAZ_STEPS;
  const done = mode === 'wuzu' ? doneWuzu : doneNamaz;
  const setDone = mode === 'wuzu' ? setDoneWuzu : setDoneNamaz;

  const step = steps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;
  const progress = (stepIndex + 1) / steps.length;

  const cardAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    cardAnim.setValue(0);
    slideAnim.setValue(30);
    Animated.parallel([
      Animated.timing(cardAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 350, useNativeDriver: true }),
    ]).start();

    if (!done.has(step.id)) {
      const next = new Set(done);
      next.add(step.id);
      setDone(next);
      if (next.size % 5 === 0 || next.size === steps.length) addStars(1);
    }
  }, [stepIndex, mode]);

  function goNext() {
    if (!isLast) setStepIndex(i => i + 1);
  }

  function goPrev() {
    if (!isFirst) setStepIndex(i => i - 1);
  }

  function switchMode(m: Mode) {
    setMode(m);
    setStepIndex(0);
  }

  const totalDone = doneWuzu.size + doneNamaz.size;
  const totalAll = WUZU_STEPS.length + NAMAZ_STEPS.length;

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <Pressable style={s.back} onPress={() => navigation.goBack()}>
          <Text style={s.backText}>←</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={s.titleArabic}>تَعَلَّمِ الصَّلَاةَ</Text>
          <Text style={s.titleEng}>Learn Salah</Text>
        </View>
        <View style={s.progressChip}>
          <Text style={s.progressChipText}>{totalDone}/{totalAll} ✓</Text>
        </View>
      </View>

      {/* Mode tabs */}
      <View style={s.tabs}>
        <Pressable
          style={[s.tab, mode === 'wuzu' && s.tabActive]}
          onPress={() => switchMode('wuzu')}
        >
          <Text style={[s.tabText, mode === 'wuzu' && s.tabTextActive]}>💧 Wuzu</Text>
        </Pressable>
        <Pressable
          style={[s.tab, mode === 'namaz' && s.tabActive]}
          onPress={() => switchMode('namaz')}
        >
          <Text style={[s.tabText, mode === 'namaz' && s.tabTextActive]}>🕌 Namaz</Text>
        </Pressable>
      </View>

      {/* Progress bar */}
      <View style={s.progressBar}>
        <Animated.View style={[s.progressFill, { width: `${Math.round(progress * 100)}%` as any, backgroundColor: step.color }]} />
      </View>
      <Text style={s.stepCounter}>Step {stepIndex + 1} of {steps.length}</Text>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={[s.card, { borderColor: step.color, opacity: cardAnim, transform: [{ translateY: slideAnim }] }]}>
          {/* Step number badge */}
          <View style={[s.stepBadge, { backgroundColor: step.color }]}>
            <Text style={s.stepBadgeText}>{stepIndex + 1}</Text>
          </View>

          {/* Emoji */}
          <View style={[s.emojiCircle, { backgroundColor: step.color + '25' }]}>
            <Text style={s.emoji}>{step.emoji}</Text>
          </View>

          {/* Arabic */}
          <View style={[s.arabicBox, { backgroundColor: step.color + '15', borderColor: step.color + '50' }]}>
            <Text style={[s.arabicText, { color: step.color }]}>{step.titleArabic}</Text>
          </View>

          {/* English title */}
          <Text style={s.titleEnglish}>{step.titleEnglish}</Text>

          {/* Description */}
          <Text style={s.description}>{step.description}</Text>

          {/* Hear button */}
          <Pressable
            style={[s.hearBtn, { backgroundColor: step.color }]}
            onPress={() => speakArabic(step.speakArabic)}
          >
            <Text style={s.hearBtnText}>🔊 Hear in Arabic</Text>
          </Pressable>

          <Pressable style={s.stopBtn} onPress={() => Speech.stop()}>
            <Text style={s.stopBtnText}>⏹ Stop</Text>
          </Pressable>
        </Animated.View>

        {/* Navigation */}
        <View style={s.navRow}>
          <Pressable
            style={[s.navBtn, isFirst && s.navBtnDisabled]}
            onPress={goPrev}
            disabled={isFirst}
          >
            <Text style={[s.navBtnText, isFirst && s.navBtnTextDisabled]}>← Back</Text>
          </Pressable>

          {isLast ? (
            <Pressable
              style={[s.navBtn, s.navBtnFinish, { backgroundColor: step.color }]}
              onPress={() => navigation.navigate('Reward', { from: 'Namaz', stars: 3 })}
            >
              <Text style={s.navBtnFinishText}>🌟 Finish!</Text>
            </Pressable>
          ) : (
            <Pressable style={[s.navBtn, s.navBtnNext, { backgroundColor: step.color }]} onPress={goNext}>
              <Text style={s.navBtnNextText}>Next →</Text>
            </Pressable>
          )}
        </View>

        {/* Step dots */}
        <View style={s.dots}>
          {steps.map((_, i) => (
            <Pressable key={i} onPress={() => setStepIndex(i)}>
              <View style={[
                s.dot,
                { backgroundColor: i === stepIndex ? step.color : done.has(steps[i].id) ? step.color + '60' : '#DDD' }
              ]} />
            </Pressable>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root:              { flex: 1, backgroundColor: '#F0FFF8' },
  header:            { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 10, gap: 12 },
  back:              { width: 40, height: 40, borderRadius: 20, backgroundColor: C.ink + '15', justifyContent: 'center', alignItems: 'center' },
  backText:          { fontSize: 22, color: C.ink, fontWeight: '700' },
  titleArabic:       { fontSize: 20, fontWeight: '900', color: C.ink, textAlign: 'right' },
  titleEng:          { fontSize: 12, fontWeight: '700', color: C.inkSoft },
  progressChip:      { backgroundColor: '#3CB57F', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 2.5, borderColor: C.ink },
  progressChipText:  { fontWeight: '900', fontSize: 12, color: '#FFF' },
  tabs:              { flexDirection: 'row', marginHorizontal: 16, marginBottom: 10, borderRadius: 16, backgroundColor: '#E0F7EF', borderWidth: 2, borderColor: '#3CB57F', overflow: 'hidden' },
  tab:               { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tabActive:         { backgroundColor: '#3CB57F' },
  tabText:           { fontSize: 15, fontWeight: '800', color: '#3CB57F' },
  tabTextActive:     { color: '#FFF' },
  progressBar:       { height: 8, backgroundColor: '#C8F0DF', marginHorizontal: 16, borderRadius: 8, marginBottom: 2, overflow: 'hidden' },
  progressFill:      { height: 8, borderRadius: 8 },
  stepCounter:       { textAlign: 'center', fontSize: 12, fontWeight: '700', color: C.inkSoft, marginBottom: 12 },
  scroll:            { paddingHorizontal: 16, paddingTop: 4 },
  card:              { backgroundColor: '#FFF', borderRadius: 28, borderWidth: 3, padding: 24, alignItems: 'center', gap: 14, elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 10 },
  stepBadge:         { position: 'absolute', top: 16, right: 16, width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center' },
  stepBadgeText:     { color: '#FFF', fontWeight: '900', fontSize: 16 },
  emojiCircle:       { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
  emoji:             { fontSize: 52 },
  arabicBox:         { borderRadius: 16, borderWidth: 2, paddingHorizontal: 24, paddingVertical: 12, width: '100%', alignItems: 'center' },
  arabicText:        { fontSize: 32, fontWeight: '900', textAlign: 'center' },
  titleEnglish:      { fontSize: 20, fontWeight: '900', color: C.ink, textAlign: 'center' },
  description:       { fontSize: 15, color: C.inkSoft, fontWeight: '600', textAlign: 'center', lineHeight: 24 },
  hearBtn:           { borderRadius: 16, paddingVertical: 13, paddingHorizontal: 32, width: '100%', alignItems: 'center', marginTop: 4 },
  hearBtnText:       { color: '#FFF', fontWeight: '800', fontSize: 16 },
  stopBtn:           { paddingVertical: 4 },
  stopBtnText:       { fontSize: 13, color: C.inkSoft, fontWeight: '700' },
  navRow:            { flexDirection: 'row', gap: 12, marginTop: 20, marginBottom: 16 },
  navBtn:            { flex: 1, borderRadius: 16, paddingVertical: 14, alignItems: 'center', backgroundColor: '#EEE' },
  navBtnDisabled:    { opacity: 0.3 },
  navBtnText:        { fontSize: 16, fontWeight: '800', color: C.ink },
  navBtnTextDisabled:{ color: C.inkSoft },
  navBtnNext:        {},
  navBtnNextText:    { fontSize: 16, fontWeight: '900', color: '#FFF' },
  navBtnFinish:      {},
  navBtnFinishText:  { fontSize: 16, fontWeight: '900', color: '#FFF' },
  dots:              { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 6, paddingHorizontal: 16 },
  dot:               { width: 10, height: 10, borderRadius: 5 },
});
