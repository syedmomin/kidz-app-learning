// src/screens/StoryScreen.tsx — page-flipping read-along
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import PhoneSafe from '../components/PhoneSafe';
import {SvgMango} from '../components/Illustrations';
import { C } from '../theme';
import GameHeader from '../components/GameHeader';
import { useProgress } from '../store/ProgressStore';
import type { ScreenProps } from '../navigation/types';

const PAGES = [
  { text: 'Once upon a time, Mango woke up to a sunny morning.', bg: '#FFE9B0' },
  { text: 'Mango skipped through the meadow and waved to the tall tree.', bg: '#C9F0CB' },
  { text: 'A butterfly flew by — pink and purple wings!', bg: '#FFD9E7' },
  { text: 'Mango shared apples with the friendly squirrel.', bg: '#FFE0C0' },
  { text: 'At the end of the day, Mango smiled. The End.', bg: '#D9F0FF' },
];

export default function StoryScreen({ navigation }: ScreenProps<'Story'>) {
  const [page, setPage] = useState(0);
  const { completeStory } = useProgress();
  const p = PAGES[page];

  const next = async () => {
    if (page < PAGES.length - 1) setPage(page + 1);
    else {
      await completeStory();
      navigation.navigate('Reward', { from: 'Story', stars: 4 });
    }
  };

  return (
    <PhoneSafe bg={p.bg}>
      <GameHeader
        onBack={() => navigation.goBack()}
        title="Mango's Big Day"
        right={<View style={s.pg}><Text style={s.pgT}>{page + 1}/{PAGES.length}</Text></View>}
      />

      <View style={[s.scene, { backgroundColor: '#fff' }]}>
        <Svg width="100%" height="100%" viewBox="0 0 300 320">
          <Circle cx="250" cy="50" r="28" fill={C.yellow} stroke={C.ink} strokeWidth="3"/>
          <Path d="M 0 260 Q 80 220 160 250 Q 230 280 300 240 L 300 320 L 0 320 Z" fill={C.mint} stroke={C.ink} strokeWidth="3"/>
          <Rect x="40" y="180" width="14" height="70" fill="#8B5A2B" stroke={C.ink} strokeWidth="3"/>
          <Circle cx="47" cy="170" r="30" fill={C.mintDeep} stroke={C.ink} strokeWidth="3"/>
        </Svg>
        <View style={s.mango}><SvgMango size={90}/></View>
      </View>

      <View style={s.textBox}>
        <Text style={s.pageText}>{p.text}</Text>
      </View>

      <View style={s.nav}>
        <Pressable disabled={page === 0} onPress={() => setPage(Math.max(0, page - 1))} style={[s.navBtn, page === 0 && { opacity: 0.3 }]}><Text style={s.navT}>‹</Text></Pressable>
        <Pressable onPress={next} style={[s.nextBtn, { backgroundColor: C.coral }]}>
          <Text style={s.nextT}>🔊 {page === PAGES.length - 1 ? 'Finish ★' : 'Next ›'}</Text>
        </Pressable>
        <Pressable onPress={next} style={[s.navBtn, { backgroundColor: C.mint }]}><Text style={s.navT}>›</Text></Pressable>
      </View>
    </PhoneSafe>
  );
}

const s = StyleSheet.create({
  pg: { backgroundColor: '#fff', borderWidth: 3, borderColor: C.ink, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  pgT: { fontWeight: '900', fontSize: 13, color: C.ink },
  scene: { margin: 14, height: 260, borderWidth: 4, borderColor: C.ink, borderRadius: 28, overflow: 'hidden', position: 'relative' },
  mango: { position: 'absolute', bottom: 10, right: 20 },
  textBox: { backgroundColor: C.cream, borderWidth: 4, borderColor: C.ink, borderRadius: 24, margin: 14, padding: 16 },
  pageText: { fontSize: 20, fontWeight: '700', color: C.ink, lineHeight: 28 },
  nav: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 },
  navBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#fff', borderWidth: 4, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  navT: { fontSize: 22, fontWeight: '900', color: C.ink },
  nextBtn: { flex: 1, height: 56, borderRadius: 28, borderWidth: 4, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  nextT: { fontSize: 16, fontWeight: '900', color: C.cream },
});
