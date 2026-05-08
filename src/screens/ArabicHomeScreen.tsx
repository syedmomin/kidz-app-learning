// src/screens/ArabicHomeScreen.tsx
import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect, Polygon } from 'react-native-svg';
import { C } from '../theme';
import { useProgress } from '../store/ProgressStore';
import type { ScreenProps } from '../navigation/types';

const SECTIONS = [
  {
    key: 'ArabicQaida',
    title: 'القاعدة',
    subtitle: 'Qaida',
    desc: 'Learn Arabic Letters A to Z',
    emoji: '🔤',
    bg: '#FFF0E0',
    border: '#FFB347',
    accent: '#FF8E53',
  },
  {
    key: 'ArabicSurah',
    title: 'السُّوَر',
    subtitle: 'Surahs',
    desc: 'Memorize short Quran surahs',
    emoji: '📖',
    bg: '#E8F5E9',
    border: '#77DD77',
    accent: '#3CB57F',
  },
  {
    key: 'ArabicDua',
    title: 'الدُّعَاء',
    subtitle: 'Duas',
    desc: 'Daily supplications & prayers',
    emoji: '🤲',
    bg: '#EEE8FF',
    border: '#B68CFF',
    accent: '#8857E0',
  },
  {
    key: 'Namaz',
    title: 'نَمَاز',
    subtitle: 'Learn Salah',
    desc: 'Wuzu steps & Salah guide for kids',
    emoji: '🕌',
    bg: '#E8FFF4',
    border: '#3CB57F',
    accent: '#1F9E5F',
  },
  {
    key: 'Asma',
    title: 'أَسْمَاءُ اللَّهِ',
    subtitle: '99 Asma ul Husna',
    desc: 'Beautiful names of Allah with audio',
    emoji: '✨',
    bg: '#FFFBE8',
    border: '#FFD700',
    accent: '#C8A000',
  },
] as const;

export default function ArabicHomeScreen({ navigation }: ScreenProps<'ArabicHome'>) {
  const { playGame } = useProgress();
  const anims = useRef([...SECTIONS].map(() => new Animated.Value(0))).current;
  const slides = useRef([...SECTIONS].map(() => new Animated.Value(40))).current;

  useEffect(() => {
    playGame('arabic');
    Animated.stagger(120, anims.map((a, i) =>
      Animated.parallel([
        Animated.timing(a, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(slides[i], { toValue: 0, duration: 500, useNativeDriver: true }),
      ])
    )).start();
  }, []);

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <Pressable style={s.back} onPress={() => navigation.goBack()}>
          <Text style={s.backText}>←</Text>
        </Pressable>
        <View style={s.titleBox}>
          <Text style={s.arabicTitle}>تَعَلَّمِ الْعَرَبِيَّة</Text>
          <Text style={s.englishTitle}>Arabic Learning</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.sectionLabel}>Choose what to learn 🌟</Text>

        {SECTIONS.map((sec, i) => (
          <Animated.View
            key={sec.key}
            style={{ opacity: anims[i], transform: [{ translateY: slides[i] }] }}
          >
            <Pressable
              style={({ pressed }) => [
                s.card,
                { backgroundColor: sec.bg, borderColor: sec.border },
                pressed && s.cardPressed,
              ]}
              onPress={() => navigation.navigate(sec.key as any)}
            >
              <View style={[s.emojiBox, { backgroundColor: sec.border + '60' }]}>
                <Text style={s.emoji}>{sec.emoji}</Text>
              </View>
              <View style={s.cardText}>
                <Text style={[s.arabicCardTitle, { color: sec.accent }]}>{sec.title}</Text>
                <Text style={s.cardSubtitle}>{sec.subtitle}</Text>
                <Text style={s.cardDesc}>{sec.desc}</Text>
              </View>
              <Text style={[s.arrow, { color: sec.accent }]}>›</Text>
            </Pressable>
          </Animated.View>
        ))}

        <View style={s.tipBox}>
          <Text style={s.tipTitle}>🌙 Did you know?</Text>
          <Text style={s.tipText}>
            Arabic is read from right to left. It has 28 beautiful letters — each one makes a special sound!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root:           { flex: 1, backgroundColor: '#FDF6FF' },
  header:         { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12, gap: 12 },
  back:           { width: 40, height: 40, borderRadius: 20, backgroundColor: C.ink + '15', justifyContent: 'center', alignItems: 'center' },
  backText:       { fontSize: 22, color: C.ink, fontWeight: '700' },
  titleBox:       { flex: 1 },
  arabicTitle:    { fontSize: 22, fontWeight: '900', color: C.ink, textAlign: 'right' },
  englishTitle:   { fontSize: 13, fontWeight: '700', color: C.inkSoft, marginTop: 2 },
  scroll:         { paddingHorizontal: 18, paddingTop: 4, paddingBottom: 32 },
  sectionLabel:   { fontSize: 16, fontWeight: '800', color: C.ink, marginBottom: 18, marginTop: 4 },
  card:           { flexDirection: 'row', alignItems: 'center', borderRadius: 22, borderWidth: 3, padding: 18, marginBottom: 16, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 6, gap: 14 },
  cardPressed:    { transform: [{ scale: 0.97 }], opacity: 0.9 },
  emojiBox:       { width: 64, height: 64, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  emoji:          { fontSize: 32 },
  cardText:       { flex: 1, gap: 2 },
  arabicCardTitle:{ fontSize: 24, fontWeight: '900' },
  cardSubtitle:   { fontSize: 15, fontWeight: '800', color: C.ink },
  cardDesc:       { fontSize: 12, color: C.inkSoft, fontWeight: '600' },
  arrow:          { fontSize: 30, fontWeight: '900' },
  tipBox:         { backgroundColor: '#FFFBE8', borderRadius: 18, borderWidth: 2.5, borderColor: '#FFD700', padding: 16, marginTop: 8 },
  tipTitle:       { fontSize: 15, fontWeight: '800', color: C.ink, marginBottom: 6 },
  tipText:        { fontSize: 13, color: C.inkSoft, fontWeight: '600', lineHeight: 20 },
});
