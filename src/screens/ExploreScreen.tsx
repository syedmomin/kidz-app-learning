import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import { Star } from '../components/Icons';
import { C } from '../theme';
import { useProgress } from '../store/ProgressStore';
import { useAudio } from '../hooks/useAudio';
import type { ScreenProps } from '../navigation/types';

import AnimalsCard    from '../components/cards/AnimalsCard';
import MusicCard      from '../components/cards/MusicCard';
import ColoringCard   from '../components/cards/ColoringCard';
import NumbersCard    from '../components/cards/NumbersCard';
import MathQuizCard   from '../components/cards/MathQuizCard';
import WordMatchCard  from '../components/cards/WordMatchCard';
import MemoryFlipCard from '../components/cards/MemoryFlipCard';
import ShapeQuizCard  from '../components/cards/ShapeQuizCard';
import BalloonPopCard from '../components/cards/BalloonPopCard';
import ShadowMatchCard  from '../components/cards/ShadowMatchCard';
import SoundMatchCard  from '../components/cards/SoundMatchCard';
import LetterBalloonPopCard  from '../components/cards/LetterBalloonPopCard';
import AlphabetSoundCard   from '../components/cards/AlphabetSoundCard';
import LetterTraceCard   from '../components/cards/LetterTraceCard';
import ColorMixCard      from '../components/cards/ColorMixCard';
import PatternQuestCard  from '../components/cards/PatternQuestCard';
import ClockReadCard     from '../components/cards/ClockReadCard';
import EmotionMatchCard  from '../components/cards/EmotionMatchCard';
import ArabicQaidaCard   from '../components/cards/ArabicQaidaCard';
import ArabicSurahCard   from '../components/cards/ArabicSurahCard';
import ArabicDuaCard     from '../components/cards/ArabicDuaCard';
import NamazCard         from '../components/cards/NamazCard';
import AsmaCard          from '../components/cards/AsmaCard';

import { ANIMAL_SOUNDS, MUSIC_FILES } from '../data/GameAssets';

const SOUNDS = {
  abc: MUSIC_FILES.abc,
  lion: ANIMAL_SOUNDS.lion,
  happy: MUSIC_FILES.happy,
  twinkle: MUSIC_FILES.twinkle,
};

export default function ExploreScreen({ navigation }: ScreenProps<'Explore'>) {
  const { p, touchStreak } = useProgress();
  const { playSound } = useAudio();
  
  const fadeAnims = useRef([...Array(23)].map(() => new Animated.Value(0))).current;
  const slideAnims = useRef([...Array(23)].map(() => new Animated.Value(30))).current;

  useEffect(() => { 
    touchStreak(); 
    // Staggered entrance animation
    Animated.stagger(100, fadeAnims.map((anim, i) => 
      Animated.parallel([
        Animated.timing(anim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(slideAnims[i], { toValue: 0, duration: 500, useNativeDriver: true })
      ])
    )).start();
  }, []);

  const handlePress = (target: keyof any, soundKey?: keyof typeof SOUNDS, speechText?: string) => {
    if (soundKey) {
      playSound(SOUNDS[soundKey]);
    } else if (speechText) {
      Speech.stop();
      Speech.speak(speechText, { rate: 0.9, pitch: 1.1 });
    }
    
    // Navigate after a small delay to let the sound start
    setTimeout(() => {
      navigation.navigate(target as any);
    }, 150);
  };

  const renderCard = (index: number, Component: React.ElementType, target: string, soundKey?: keyof typeof SOUNDS, speechText?: string) => (
    <Animated.View style={[s.col, { opacity: fadeAnims[index], transform: [{ translateY: slideAnims[index] }] }]}>
      <Component onPress={() => handlePress(target, soundKey, speechText)} />
    </Animated.View>
  );

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
          {renderCard(0, LetterTraceCard, 'LetterTrace', undefined, 'Trace the letter')}
          {renderCard(1, AnimalsCard, 'Animals', 'lion')}
          {renderCard(2, MusicCard, 'Music', 'happy')}
          {renderCard(3, ColoringCard, 'ColorMatch', undefined, 'Coloring')}
          {renderCard(4, MathQuizCard, 'NumberQuiz', undefined, 'Math Quiz')}
          {renderCard(5, WordMatchCard, 'WordMatch', undefined, 'Word Match')}
          {renderCard(6, NumbersCard, 'Numbers', undefined, 'Numbers')}
          {renderCard(7, MemoryFlipCard, 'MemoryFlip', undefined, 'Memory Flip')}
          {renderCard(8, ShapeQuizCard, 'ShapeQuiz', undefined, 'Shape Quiz')}
          {renderCard(9, BalloonPopCard, 'BalloonPop', undefined, 'Balloon Pop')}
          {renderCard(10, ShadowMatchCard, 'ShadowMatch', undefined, 'Shadow Match')}
          {renderCard(11, SoundMatchCard, 'SoundMatch', undefined, 'Sound Match')}
          {renderCard(12, LetterBalloonPopCard, 'LetterBalloonPop', undefined, 'Letter Pop')}
          {renderCard(13, AlphabetSoundCard, 'AlphabetSound', undefined, 'A for Apple')}
          {renderCard(14, ColorMixCard, 'ColorMix', undefined, 'Color Mix Lab')}
          {renderCard(15, PatternQuestCard, 'PatternQuest', undefined, 'Pattern Quest')}
          {renderCard(16, ClockReadCard, 'ClockRead', undefined, 'Clock Reader')}
          {renderCard(17, EmotionMatchCard, 'EmotionMatch', undefined, 'Emotion Match')}
          {renderCard(18, ArabicQaidaCard, 'ArabicQaida', undefined, 'Arabic Qaida')}
          {renderCard(19, ArabicSurahCard, 'ArabicSurah', undefined, 'Quran Surahs')}
          {renderCard(20, ArabicDuaCard, 'ArabicDua', undefined, 'Daily Duas')}
          {renderCard(21, NamazCard, 'Namaz', undefined, 'Namaz Learning')}
          {renderCard(22, AsmaCard, 'Asma', undefined, 'Asma ul Husna')}
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

