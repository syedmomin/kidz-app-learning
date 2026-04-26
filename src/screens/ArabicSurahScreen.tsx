// src/screens/ArabicSurahScreen.tsx — Quran surahs for kids
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import { C } from '../theme';
import { useProgress } from '../store/ProgressStore';
import { SURAHS, type Surah } from '../data/ArabicData';
import type { ScreenProps } from '../navigation/types';

const SURAH_COLORS = ['#FFB347', '#77DD77', '#3FB5FF', '#B68CFF', '#FF6B6B', '#FF8CCC'];

function speakSurah(surah: Surah) {
  Speech.stop();
  const fullText = surah.verses.map(v => v.arabic).join(' ');
  Speech.speak(fullText, { language: 'ar', rate: 0.65, pitch: 1.0 });
}

function speakVerse(arabic: string) {
  Speech.stop();
  Speech.speak(arabic, { language: 'ar', rate: 0.65, pitch: 1.0 });
}

export default function ArabicSurahScreen({ navigation }: ScreenProps<'ArabicSurah'>) {
  const { addStars } = useProgress();
  const [selected, setSelected] = useState<Surah | null>(null);
  const [learnedIds, setLearnedIds] = useState<Set<number>>(new Set());
  const [showTranslit, setShowTranslit] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const slideAnim = useRef(new Animated.Value(0)).current;

  function openSurah(surah: Surah) {
    setSelected(surah);
    if (!learnedIds.has(surah.id)) {
      const next = new Set(learnedIds);
      next.add(surah.id);
      setLearnedIds(next);
      addStars(2);
    }
    Animated.spring(slideAnim, { toValue: 1, useNativeDriver: true, bounciness: 10 }).start();
  }

  function closeSurah() {
    Speech.stop();
    Animated.timing(slideAnim, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => setSelected(null));
  }

  if (selected) {
    const colorIdx = SURAHS.findIndex(s => s.id === selected.id) % SURAH_COLORS.length;
    const color = SURAH_COLORS[colorIdx];

    return (
      <SafeAreaView style={s.root} edges={['top']}>
        <View style={[s.surahHeader, { borderBottomColor: color }]}>
          <Pressable style={s.back} onPress={closeSurah}>
            <Text style={s.backText}>←</Text>
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={[s.surahArabicName, { color }]}>{selected.arabicName}</Text>
            <Text style={s.surahEnglishName}>{selected.name} · {selected.meaning}</Text>
          </View>
          <Pressable style={[s.playBtn, { backgroundColor: color }]} onPress={() => speakSurah(selected)}>
            <Text style={s.playBtnText}>▶ Play</Text>
          </Pressable>
        </View>

        {/* Toggle buttons */}
        <View style={s.toggleRow}>
          <Pressable
            style={[s.toggle, showTranslit && { backgroundColor: '#3FB5FF30', borderColor: '#3FB5FF' }]}
            onPress={() => setShowTranslit(v => !v)}
          >
            <Text style={s.toggleText}>Transliteration</Text>
          </Pressable>
          <Pressable
            style={[s.toggle, showTranslation && { backgroundColor: '#77DD7730', borderColor: '#77DD77' }]}
            onPress={() => setShowTranslation(v => !v)}
          >
            <Text style={s.toggleText}>Translation</Text>
          </Pressable>
          <Pressable style={s.toggle} onPress={() => Speech.stop()}>
            <Text style={s.toggleText}>⏹ Stop</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={s.verseList} showsVerticalScrollIndicator={false}>
          {selected.verses.map((verse, i) => (
            <Pressable key={i} style={s.verseCard} onPress={() => speakVerse(verse.arabic)}>
              <View style={[s.verseNum, { backgroundColor: color + '30', borderColor: color }]}>
                <Text style={[s.verseNumText, { color }]}>{i + 1}</Text>
              </View>
              <View style={s.verseContent}>
                <Text style={s.verseArabic}>{verse.arabic}</Text>
                {showTranslit && <Text style={s.verseTranslit}>{verse.transliteration}</Text>}
                {showTranslation && <Text style={s.verseTrans}>{verse.translation}</Text>}
              </View>
              <Text style={[s.tapHear, { color }]}>🔊</Text>
            </Pressable>
          ))}
          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.header}>
        <Pressable style={s.back} onPress={() => navigation.goBack()}>
          <Text style={s.backText}>←</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>السُّوَر</Text>
          <Text style={s.subtitle}>Short Surahs · Quran</Text>
        </View>
        <View style={s.progressChip}>
          <Text style={s.progressText}>{learnedIds.size}/{SURAHS.length} ⭐</Text>
        </View>
      </View>

      <Text style={s.hint}>Tap a surah to read and listen 📖</Text>

      <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
        {SURAHS.map((surah, i) => {
          const color = SURAH_COLORS[i % SURAH_COLORS.length];
          return (
            <Pressable
              key={surah.id}
              style={({ pressed }) => [
                s.card,
                { borderColor: color, backgroundColor: color + '18' },
                pressed && s.cardPressed,
              ]}
              onPress={() => openSurah(surah)}
            >
              <View style={[s.surahNumBadge, { backgroundColor: color }]}>
                <Text style={s.surahNumText}>{surah.id}</Text>
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[s.cardArabic, { color }]}>{surah.arabicName}</Text>
                <Text style={s.cardName}>{surah.name}</Text>
                <Text style={s.cardMeaning}>{surah.meaning} · {surah.verses.length} verses</Text>
              </View>
              {learnedIds.has(surah.id) && <Text style={s.learned}>✓</Text>}
              <Text style={[s.arrow, { color }]}>›</Text>
            </Pressable>
          );
        })}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root:            { flex: 1, backgroundColor: '#F0FFF4' },
  header:          { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8, gap: 12 },
  back:            { width: 40, height: 40, borderRadius: 20, backgroundColor: C.ink + '15', justifyContent: 'center', alignItems: 'center' },
  backText:        { fontSize: 22, color: C.ink, fontWeight: '700' },
  title:           { fontSize: 22, fontWeight: '900', color: C.ink, textAlign: 'right' },
  subtitle:        { fontSize: 12, fontWeight: '700', color: C.inkSoft },
  progressChip:    { backgroundColor: '#77DD77', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 2.5, borderColor: C.ink },
  progressText:    { fontWeight: '900', fontSize: 12, color: C.ink },
  hint:            { textAlign: 'center', color: C.inkSoft, fontWeight: '700', fontSize: 13, marginBottom: 10 },
  list:            { paddingHorizontal: 16, gap: 12 },
  card:            { flexDirection: 'row', alignItems: 'center', borderRadius: 20, borderWidth: 3, padding: 16, gap: 12, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4 },
  cardPressed:     { transform: [{ scale: 0.97 }] },
  surahNumBadge:   { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  surahNumText:    { color: '#FFF', fontWeight: '900', fontSize: 14 },
  cardArabic:      { fontSize: 20, fontWeight: '900', textAlign: 'right' },
  cardName:        { fontSize: 14, fontWeight: '800', color: C.ink },
  cardMeaning:     { fontSize: 11, color: C.inkSoft, fontWeight: '600' },
  learned:         { fontSize: 18, color: '#3CB57F', fontWeight: '900' },
  arrow:           { fontSize: 28, fontWeight: '900' },
  // Surah detail
  surahHeader:     { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 12, gap: 12, borderBottomWidth: 3 },
  surahArabicName: { fontSize: 22, fontWeight: '900', textAlign: 'right' },
  surahEnglishName:{ fontSize: 12, fontWeight: '700', color: C.inkSoft },
  playBtn:         { borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8 },
  playBtnText:     { color: '#FFF', fontWeight: '800', fontSize: 14 },
  toggleRow:       { flexDirection: 'row', gap: 8, paddingHorizontal: 14, paddingVertical: 8 },
  toggle:          { flex: 1, borderRadius: 10, borderWidth: 2, borderColor: '#CCC', paddingVertical: 6, alignItems: 'center' },
  toggleText:      { fontSize: 11, fontWeight: '700', color: C.ink },
  verseList:       { paddingHorizontal: 14, paddingTop: 8, gap: 12 },
  verseCard:       { flexDirection: 'row', gap: 10, backgroundColor: '#FFF', borderRadius: 16, padding: 14, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 3 },
  verseNum:        { width: 32, height: 32, borderRadius: 10, borderWidth: 2.5, justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  verseNumText:    { fontSize: 12, fontWeight: '900' },
  verseContent:    { flex: 1, gap: 4 },
  verseArabic:     { fontSize: 22, fontWeight: '700', textAlign: 'right', color: C.ink, lineHeight: 36 },
  verseTranslit:   { fontSize: 13, color: '#3FB5FF', fontWeight: '600', fontStyle: 'italic' },
  verseTrans:      { fontSize: 13, color: C.inkSoft, fontWeight: '600', lineHeight: 20 },
  tapHear:         { fontSize: 18, marginTop: 6 },
});
