// src/screens/ArabicDuaScreen.tsx — Daily duas for kids
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import { C } from '../theme';
import { useProgress } from '../store/ProgressStore';
import { DUAS, type Dua } from '../data/ArabicData';
import { ArabicSpeech } from '../utils/AudioUtils';
import type { ScreenProps } from '../navigation/types';

const DUA_COLORS = ['#FF6B6B', '#FFB347', '#FFD700', '#77DD77', '#3FB5FF', '#B68CFF', '#FF8CCC', '#4BC8A0', '#FF8E53', '#D898FF'];

function speakDua(dua: Dua) {
  ArabicSpeech.speak(dua.arabic);
}

export default function ArabicDuaScreen({ navigation }: ScreenProps<'ArabicDua'>) {
  const { addStars } = useProgress();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [learnedIds, setLearnedIds] = useState<Set<number>>(new Set());
  const bounceAnims = useRef(DUAS.map(() => new Animated.Value(1))).current;

  function toggle(dua: Dua, idx: number) {
    if (expandedId === dua.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(dua.id);

    Animated.sequence([
      Animated.timing(bounceAnims[idx], { toValue: 0.94, duration: 80, useNativeDriver: true }),
      Animated.spring(bounceAnims[idx], { toValue: 1, useNativeDriver: true }),
    ]).start();

    if (!learnedIds.has(dua.id)) {
      const next = new Set(learnedIds);
      next.add(dua.id);
      setLearnedIds(next);
      addStars(1);
    }
  }

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.header}>
        <Pressable style={s.back} onPress={() => navigation.goBack()}>
          <Text style={s.backText}>←</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>الدُّعَاء</Text>
          <Text style={s.subtitle}>Daily Duas & Supplications</Text>
        </View>
        <View style={s.progressChip}>
          <Text style={s.progressText}>{learnedIds.size}/{DUAS.length} 🤲</Text>
        </View>
      </View>

      <Text style={s.hint}>Tap a dua to expand and listen 🌙</Text>

      {/* Progress bar */}
      <View style={s.progressBar}>
        <View style={[s.progressFill, { width: `${Math.round((learnedIds.size / DUAS.length) * 100)}%` as any }]} />
      </View>

      <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
        {DUAS.map((dua, idx) => {
          const color = DUA_COLORS[idx % DUA_COLORS.length];
          const isOpen = expandedId === dua.id;

          return (
            <Animated.View key={dua.id} style={{ transform: [{ scale: bounceAnims[idx] }] }}>
              <Pressable
                style={[
                  s.card,
                  { borderColor: color, backgroundColor: isOpen ? color + '22' : '#FFF' },
                ]}
                onPress={() => toggle(dua, idx)}
              >
                {/* Card header row */}
                <View style={s.cardHeader}>
                  <View style={[s.emojiBox, { backgroundColor: color + '30' }]}>
                    <Text style={s.emoji}>{dua.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.duaTitle, { color }]}>{dua.title}</Text>
                    <Text style={s.duaOccasion}>{dua.occasion}</Text>
                  </View>
                  {learnedIds.has(dua.id) && <Text style={s.learned}>✓</Text>}
                  <Text style={[s.chevron, { color }]}>{isOpen ? '▲' : '▼'}</Text>
                </View>

                {isOpen && (
                  <View style={s.expanded}>
                    <View style={[s.arabicBox, { backgroundColor: color + '15', borderColor: color + '60' }]}>
                      <Text style={[s.arabicText, { color: C.ink }]}>{dua.arabic}</Text>
                    </View>

                    <Text style={s.translitLabel}>Transliteration</Text>
                    <Text style={s.translitText}>{dua.transliteration}</Text>

                    <Text style={s.transLabel}>Meaning</Text>
                    <Text style={s.transText}>{dua.translation}</Text>

                    <Pressable
                      style={[s.hearBtn, { backgroundColor: color }]}
                      onPress={() => speakDua(dua)}
                    >
                      <Text style={s.hearBtnText}>🔊 Listen in Arabic</Text>
                    </Pressable>

                    <Pressable style={s.stopBtn} onPress={() => Speech.stop()}>
                      <Text style={s.stopBtnText}>⏹ Stop</Text>
                    </Pressable>
                  </View>
                )}
              </Pressable>
            </Animated.View>
          );
        })}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root:         { flex: 1, backgroundColor: '#F5F0FF' },
  header:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8, gap: 12 },
  back:         { width: 40, height: 40, borderRadius: 20, backgroundColor: C.ink + '15', justifyContent: 'center', alignItems: 'center' },
  backText:     { fontSize: 22, color: C.ink, fontWeight: '700' },
  title:        { fontSize: 22, fontWeight: '900', color: C.ink, textAlign: 'right' },
  subtitle:     { fontSize: 12, fontWeight: '700', color: C.inkSoft },
  progressChip: { backgroundColor: '#B68CFF', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 2.5, borderColor: C.ink },
  progressText: { fontWeight: '900', fontSize: 12, color: '#FFF' },
  hint:         { textAlign: 'center', color: C.inkSoft, fontWeight: '700', fontSize: 13, marginBottom: 6 },
  progressBar:  { height: 7, backgroundColor: '#E0D6FF', marginHorizontal: 16, borderRadius: 8, marginBottom: 12, overflow: 'hidden' },
  progressFill: { height: 7, backgroundColor: '#B68CFF', borderRadius: 8 },
  list:         { paddingHorizontal: 14, gap: 10 },
  card:         { borderRadius: 20, borderWidth: 3, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4 },
  cardHeader:   { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  emojiBox:     { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  emoji:        { fontSize: 26 },
  duaTitle:     { fontSize: 16, fontWeight: '900' },
  duaOccasion:  { fontSize: 11, color: C.inkSoft, fontWeight: '600', marginTop: 2 },
  learned:      { fontSize: 16, color: '#3CB57F', fontWeight: '900' },
  chevron:      { fontSize: 14, fontWeight: '900' },
  expanded:     { paddingHorizontal: 14, paddingBottom: 16, gap: 8 },
  arabicBox:    { borderRadius: 14, borderWidth: 2, padding: 14, alignItems: 'flex-end' },
  arabicText:   { fontSize: 22, fontWeight: '700', textAlign: 'right', lineHeight: 38 },
  translitLabel:{ fontSize: 12, fontWeight: '800', color: '#3FB5FF', marginTop: 4 },
  translitText: { fontSize: 14, color: C.ink, fontWeight: '600', fontStyle: 'italic', lineHeight: 22 },
  transLabel:   { fontSize: 12, fontWeight: '800', color: '#77DD77' },
  transText:    { fontSize: 14, color: C.inkSoft, fontWeight: '600', lineHeight: 22 },
  hearBtn:      { borderRadius: 14, paddingVertical: 12, alignItems: 'center', marginTop: 6 },
  hearBtnText:  { color: '#FFF', fontWeight: '800', fontSize: 15 },
  stopBtn:      { alignItems: 'center', paddingVertical: 6 },
  stopBtnText:  { fontSize: 13, color: C.inkSoft, fontWeight: '700' },
});
