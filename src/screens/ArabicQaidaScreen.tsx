// src/screens/ArabicQaidaScreen.tsx — Arabic Qaida (Letters only)
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView,
  Animated, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '../theme';
import { useProgress } from '../store/ProgressStore';
import { ARABIC_LETTERS, type ArabicLetter } from '../data/ArabicData';
import { ArabicSpeech } from '../utils/AudioUtils';
import type { ScreenProps } from '../navigation/types';

function speak(text: string) {
  ArabicSpeech.speak(text);
}

export default function ArabicQaidaScreen({ navigation }: ScreenProps<'ArabicQaida'>) {
  const { addStars } = useProgress();
  const [heard, setHeard] = useState<Set<number>>(new Set());
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
      if (next.size === ARABIC_LETTERS.length) addStars(3);
    }
    
    setSelected({ letter, idx });
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, bounciness: 14 }).start();
  }

  function closeModal() {
    Animated.timing(scaleAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => setSelected(null));
  }

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <Pressable style={s.back} onPress={() => navigation.goBack()}>
          <Text style={s.backText}>←</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>القاعدة</Text>
          <Text style={s.subtitle}>Arabic Qaida · Letters</Text>
        </View>
      </View>

      <View style={s.progressBar}>
        <View style={[s.progressFill, { width: `${progress}%` as any, backgroundColor: '#FF8E53' }]} />
      </View>
      <Text style={s.tapHint}>Tap a letter to hear it! 🔊 ({heard.size}/{ARABIC_LETTERS.length})</Text>

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
                    onPress={() => speak(letter.arabicName)}>
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
  progressBar:      { height: 7, backgroundColor: '#EEE', marginHorizontal: 16, borderRadius: 8, marginBottom: 4, overflow: 'hidden' },
  progressFill:     { height: 7, borderRadius: 8 },
  tapHint:          { textAlign: 'center', color: C.inkSoft, fontWeight: '700', fontSize: 12, marginBottom: 10 },
  letterGrid:       { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10, gap: 8, justifyContent: 'center' },
  letterCard:       { width: 78, height: 86, borderRadius: 16, borderWidth: 3, alignItems: 'center', justifyContent: 'center', gap: 3, elevation: 2 },
  checkmark:        { position: 'absolute', top: 4, right: 7, fontSize: 10, color: '#3CB57F', fontWeight: '900' },
  letterText:       { fontSize: 30, fontWeight: '900' },
  letterName:       { fontSize: 9,  fontWeight: '700', color: C.inkSoft },
  overlay:          { flex: 1, backgroundColor: '#00000055', justifyContent: 'center', alignItems: 'center' },
  modal:            { backgroundColor: '#FFF', borderRadius: 28, padding: 26, width: '85%', alignItems: 'center', elevation: 20 },
  modalLetterBox:   { width: 110, height: 110, borderRadius: 28, borderWidth: 4, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  modalLetter:      { fontSize: 62, fontWeight: '900' },
  modalName:        { fontSize: 24, fontWeight: '900', color: C.ink },
  modalTrans:       { fontSize: 15, color: C.inkSoft, fontWeight: '700', marginTop: 2 },
  divider:          { height: 1.5, backgroundColor: '#EEE', width: '100%', marginVertical: 12 },
  exampleLabel:     { fontSize: 12, fontWeight: '700', color: C.inkSoft, marginBottom: 4 },
  exampleArabic:    { fontSize: 30, fontWeight: '900', marginBottom: 2 },
  exampleMeaning:   { fontSize: 14, color: C.inkSoft, fontWeight: '700', marginBottom: 14 },
  speakBtn:         { borderRadius: 13, paddingHorizontal: 20, paddingVertical: 11, width: '100%', alignItems: 'center' },
  speakBtnText:     { color: '#FFF', fontSize: 14, fontWeight: '800' },
  closeBtn:         { marginTop: 12 },
  closeBtnText:     { fontSize: 13, color: C.inkSoft, fontWeight: '700' },
});
