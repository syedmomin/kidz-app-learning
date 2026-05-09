import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '../theme';
import { ARABIC_LETTERS } from '../data/ArabicData';
import { ArabicSpeech } from '../utils/AudioUtils';
import type { ScreenProps } from '../navigation/types';

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

export default function ArabicHarakatScreen({ navigation }: ScreenProps<'ArabicHarakat'>) {
  const [selectedLetterIdx, setSelectedLetterIdx] = useState(1); // Ba by default
  const letter = ARABIC_LETTERS[selectedLetterIdx];
  const bounceAnims = useRef(HARAKAT.map(() => new Animated.Value(1))).current;

  function speak(text: string) {
    ArabicSpeech.speak(text);
  }

  function tapHarakat(idx: number, mark: string, arabicName: string) {
    const syllable = letter.letter + mark;
    speak(syllable + ' ' + arabicName);
    Animated.sequence([
      Animated.timing(bounceAnims[idx], { toValue: 0.8, duration: 70, useNativeDriver: true }),
      Animated.spring(bounceAnims[idx], { toValue: 1, useNativeDriver: true }),
    ]).start();
  }

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.header}>
        <Pressable style={s.back} onPress={() => navigation.goBack()}>
          <Text style={s.backText}>←</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>حركات</Text>
          <Text style={s.subtitle}>Arabic Harakat · Vowels</Text>
        </View>
      </View>

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
          <Text style={s.bigLetterName}>{letter.name}  /{letter.transliteration}/</Text>
        </View>

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
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root:             { flex: 1, backgroundColor: '#FDF6FF' },
  header:           { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12, gap: 12 },
  back:             { width: 40, height: 40, borderRadius: 20, backgroundColor: C.ink + '15', justifyContent: 'center', alignItems: 'center' },
  backText:         { fontSize: 22, color: C.ink, fontWeight: '700' },
  title:            { fontSize: 22, fontWeight: '900', color: C.ink, textAlign: 'right' },
  subtitle:         { fontSize: 13, fontWeight: '700', color: C.inkSoft },
  sectionTitle:     { fontSize: 14, fontWeight: '800', color: C.ink, marginHorizontal: 16, marginTop: 14, marginBottom: 8 },
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
});
