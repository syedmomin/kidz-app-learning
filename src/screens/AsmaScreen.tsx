// src/screens/AsmaScreen.tsx — 99 Asma ul Husna flashcard grid for kids
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView,
  Animated, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import { C } from '../theme';
import { useProgress } from '../store/ProgressStore';
import { ASMA_UL_HUSNA, type AsmaName } from '../data/IslamicData';
import type { ScreenProps } from '../navigation/types';

function speakName(name: AsmaName) {
  Speech.stop();
  Speech.speak(name.arabic, { language: 'ar', rate: 0.65, pitch: 1.0 });
}

export default function AsmaScreen({ navigation }: ScreenProps<'Asma'>) {
  const { addStars } = useProgress();
  const [selected, setSelected] = useState<AsmaName | null>(null);
  const [heard, setHeard] = useState<Set<number>>(new Set());
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const bounceAnims = useRef(ASMA_UL_HUSNA.map(() => new Animated.Value(1))).current;
  const headerAnim = useRef(new Animated.Value(0)).current;

  const progress = Math.round((heard.size / ASMA_UL_HUSNA.length) * 100);

  useEffect(() => {
    Animated.timing(headerAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  function openName(name: AsmaName, idx: number) {
    setSelected(name);
    speakName(name);

    Animated.sequence([
      Animated.timing(bounceAnims[idx], { toValue: 0.85, duration: 80, useNativeDriver: true }),
      Animated.spring(bounceAnims[idx], { toValue: 1, useNativeDriver: true }),
    ]).start();

    if (!heard.has(name.number)) {
      const next = new Set(heard);
      next.add(name.number);
      setHeard(next);
      if (next.size === ASMA_UL_HUSNA.length) {
        addStars(5);
      } else if (next.size % 10 === 0) {
        addStars(1);
      }
    }

    scaleAnim.setValue(0);
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, bounciness: 14 }).start();
  }

  function closeModal() {
    Animated.timing(scaleAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => setSelected(null));
  }

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      {/* Header */}
      <Animated.View style={[s.header, { opacity: headerAnim }]}>
        <Pressable style={s.back} onPress={() => navigation.goBack()}>
          <Text style={s.backText}>←</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={s.titleArabic}>أَسْمَاءُ اللَّهِ الْحُسْنَى</Text>
          <Text style={s.titleEng}>99 Beautiful Names of Allah</Text>
        </View>
        <View style={s.progressChip}>
          <Text style={s.progressChipText}>{heard.size}/99</Text>
        </View>
      </Animated.View>

      {/* Progress bar */}
      <View style={s.progressBar}>
        <View style={[s.progressFill, { width: `${progress}%` as any }]} />
      </View>
      <Text style={s.hint}>Tap any name to hear it in Arabic 🔊</Text>

      <ScrollView contentContainerStyle={s.grid} showsVerticalScrollIndicator={false}>
        {ASMA_UL_HUSNA.map((name, idx) => (
          <Animated.View key={name.number} style={{ transform: [{ scale: bounceAnims[idx] }] }}>
            <Pressable
              style={[
                s.card,
                { borderColor: name.color, backgroundColor: name.color + '18' },
                heard.has(name.number) && s.cardHeard,
              ]}
              onPress={() => openName(name, idx)}
            >
              <View style={[s.numberBadge, { backgroundColor: name.color }]}>
                <Text style={s.numberText}>{name.number}</Text>
              </View>
              {heard.has(name.number) && <Text style={s.checkmark}>✓</Text>}
              <Text style={[s.arabicName, { color: name.color }]}>{name.arabic}</Text>
              <Text style={s.translit}>{name.transliteration}</Text>
            </Pressable>
          </Animated.View>
        ))}
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Detail Modal */}
      <Modal visible={!!selected} transparent animationType="none" onRequestClose={closeModal}>
        <Pressable style={s.overlay} onPress={closeModal}>
          <Animated.View
            style={[s.modal, { transform: [{ scale: scaleAnim }] }]}
            // prevent press-through
            onStartShouldSetResponder={() => true}
          >
            {selected && (
              <>
                {/* Number */}
                <View style={[s.modalNumber, { backgroundColor: selected.color }]}>
                  <Text style={s.modalNumberText}>{selected.number}</Text>
                </View>

                {/* Arabic name big */}
                <View style={[s.modalArabicBox, { backgroundColor: selected.color + '20', borderColor: selected.color }]}>
                  <Text style={[s.modalArabic, { color: selected.color }]}>{selected.arabic}</Text>
                </View>

                <Text style={s.modalTranslit}>{selected.transliteration}</Text>

                <View style={s.divider} />

                <Text style={s.meaningLabel}>Meaning</Text>
                <Text style={s.meaningText}>{selected.meaning}</Text>

                {/* Buttons */}
                <Pressable
                  style={[s.hearBtn, { backgroundColor: selected.color }]}
                  onPress={() => speakName(selected)}
                >
                  <Text style={s.hearBtnText}>🔊 Hear in Arabic</Text>
                </Pressable>

                <Pressable style={s.stopBtn} onPress={() => Speech.stop()}>
                  <Text style={s.stopBtnText}>⏹ Stop</Text>
                </Pressable>

                <Pressable style={s.closeBtn} onPress={closeModal}>
                  <Text style={s.closeBtnText}>Close</Text>
                </Pressable>
              </>
            )}
          </Animated.View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root:             { flex: 1, backgroundColor: '#FFFBF0' },
  header:           { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8, gap: 12 },
  back:             { width: 40, height: 40, borderRadius: 20, backgroundColor: C.ink + '15', justifyContent: 'center', alignItems: 'center' },
  backText:         { fontSize: 22, color: C.ink, fontWeight: '700' },
  titleArabic:      { fontSize: 18, fontWeight: '900', color: C.ink, textAlign: 'right' },
  titleEng:         { fontSize: 11, fontWeight: '700', color: C.inkSoft },
  progressChip:     { backgroundColor: '#FFD700', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 2.5, borderColor: C.ink },
  progressChipText: { fontWeight: '900', fontSize: 12, color: C.ink },
  progressBar:      { height: 8, backgroundColor: '#FFF0C0', marginHorizontal: 16, borderRadius: 8, marginBottom: 4, overflow: 'hidden' },
  progressFill:     { height: 8, backgroundColor: '#FFD700', borderRadius: 8 },
  hint:             { textAlign: 'center', color: C.inkSoft, fontWeight: '700', fontSize: 13, marginBottom: 12, marginTop: 4 },
  grid:             { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10, gap: 8, justifyContent: 'center' },
  card:             { width: 96, minHeight: 108, borderRadius: 18, borderWidth: 2.5, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6, paddingVertical: 10, gap: 4, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, position: 'relative' },
  cardHeard:        { opacity: 0.65 },
  numberBadge:      { position: 'absolute', top: 5, left: 6, width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  numberText:       { fontSize: 10, fontWeight: '900', color: '#FFF' },
  checkmark:        { position: 'absolute', top: 5, right: 7, fontSize: 11, color: '#3CB57F', fontWeight: '900' },
  arabicName:       { fontSize: 22, fontWeight: '900', textAlign: 'center' },
  translit:         { fontSize: 9, fontWeight: '700', color: C.inkSoft, textAlign: 'center' },
  overlay:          { flex: 1, backgroundColor: '#00000060', justifyContent: 'center', alignItems: 'center' },
  modal:            { backgroundColor: '#FFF', borderRadius: 28, padding: 28, width: '88%', alignItems: 'center', elevation: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, gap: 10 },
  modalNumber:      { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  modalNumberText:  { color: '#FFF', fontWeight: '900', fontSize: 18 },
  modalArabicBox:   { borderRadius: 20, borderWidth: 3, paddingHorizontal: 28, paddingVertical: 16, width: '100%', alignItems: 'center' },
  modalArabic:      { fontSize: 52, fontWeight: '900' },
  modalTranslit:    { fontSize: 18, fontWeight: '800', color: C.ink },
  divider:          { height: 1.5, backgroundColor: '#EEE', width: '100%' },
  meaningLabel:     { fontSize: 12, fontWeight: '800', color: C.inkSoft },
  meaningText:      { fontSize: 18, fontWeight: '800', color: C.ink, textAlign: 'center' },
  hearBtn:          { borderRadius: 14, paddingHorizontal: 24, paddingVertical: 13, width: '100%', alignItems: 'center' },
  hearBtnText:      { color: '#FFF', fontSize: 15, fontWeight: '800' },
  stopBtn:          { paddingVertical: 4 },
  stopBtnText:      { fontSize: 13, color: C.inkSoft, fontWeight: '700' },
  closeBtn:         { paddingTop: 4 },
  closeBtnText:     { fontSize: 14, color: C.inkSoft, fontWeight: '700' },
});
