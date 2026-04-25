import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star } from '../components/Icons';
import { C } from '../theme';
import { useProgress } from '../store/ProgressStore';
import type { ScreenProps } from '../navigation/types';

import AlphabetsCard  from '../components/cards/AlphabetsCard';
import AnimalsCard    from '../components/cards/AnimalsCard';
import MusicCard      from '../components/cards/MusicCard';
import StoriesCard    from '../components/cards/StoriesCard';
import ColoringCard   from '../components/cards/ColoringCard';
import NumbersCard    from '../components/cards/NumbersCard';
import MathQuizCard   from '../components/cards/MathQuizCard';
import WordMatchCard  from '../components/cards/WordMatchCard';
import MemoryFlipCard from '../components/cards/MemoryFlipCard';
import ShapeQuizCard  from '../components/cards/ShapeQuizCard';
import BalloonPopCard from '../components/cards/BalloonPopCard';
import OddOneOutCard  from '../components/cards/OddOneOutCard';

export default function ExploreScreen({ navigation }: ScreenProps<'Explore'>) {
  const { p, touchStreak } = useProgress();
  useEffect(() => { touchStreak(); }, []);

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      {/* ── Header ── */}
      <View style={s.header}>
        <View>
          <Text style={s.appName}>KidzNKidz ✨</Text>
          <Text style={s.greeting}>What do you want to learn today?</Text>
        </View>
        <View style={s.headerRight}>
          <Pressable style={s.chip} onPress={() => navigation.navigate('Streak')}>
            <Star size={16}/><Text style={s.chipText}>{p.stars}</Text>
          </Pressable>
          <Pressable style={[s.chip, { backgroundColor: '#FFD6F0' }]} onPress={() => navigation.navigate('Settings')}>
            <Text style={{ fontSize: 15 }}>⚙️</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.grid}>
          <View style={s.col}><AlphabetsCard  onPress={() => navigation.navigate('Category')}/></View>
          <View style={s.col}><AnimalsCard    onPress={() => navigation.navigate('Animals')}/></View>
          <View style={s.col}><MusicCard      onPress={() => navigation.navigate('Music')}/></View>
          <View style={s.col}><StoriesCard    onPress={() => navigation.navigate('Story')}/></View>
          <View style={s.col}><MathQuizCard   onPress={() => navigation.navigate('NumberQuiz')}/></View>
          <View style={s.col}><WordMatchCard  onPress={() => navigation.navigate('WordMatch')}/></View>
          <View style={s.col}><ColoringCard   onPress={() => navigation.navigate('ColorMatch')}/></View>
          <View style={s.col}><NumbersCard    onPress={() => navigation.navigate('Numbers')}/></View>
          <View style={s.col}><MemoryFlipCard onPress={() => navigation.navigate('MemoryFlip')}/></View>
          <View style={s.col}><ShapeQuizCard  onPress={() => navigation.navigate('ShapeQuiz')}/></View>
          <View style={s.col}><BalloonPopCard onPress={() => navigation.navigate('BalloonPop')}/></View>
          <View style={s.col}><OddOneOutCard  onPress={() => navigation.navigate('OddOneOut')}/></View>
        </View>
        <View style={{ height: 24 }}/>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root:        { flex: 1, backgroundColor: '#F4F8FF' },
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 8, paddingBottom: 10 },
  appName:     { fontSize: 22, fontWeight: '900', color: C.ink },
  greeting:    { fontSize: 12, fontWeight: '600', color: '#888', marginTop: 2 },
  headerRight: { flexDirection: 'row', gap: 8 },
  chip:        { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFE566', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 2.5, borderColor: C.ink },
  chipText:    { fontWeight: '900', fontSize: 14, color: C.ink },
  scroll:      { paddingHorizontal: 14, paddingTop: 4 },
  grid:        { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  col:         { width: '47.5%' },
});
