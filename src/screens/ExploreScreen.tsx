import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import { Star } from '../components/Icons';
import { C } from '../theme';
import { useProgress } from '../store/ProgressStore';
import { useAudio } from '../hooks/useAudio';
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
import ShadowMatchCard  from '../components/cards/ShadowMatchCard';
import SoundMatchCard  from '../components/cards/SoundMatchCard';
import LetterBalloonPopCard  from '../components/cards/LetterBalloonPopCard';
import AlphabetSoundCard   from '../components/cards/AlphabetSoundCard';

const SOUNDS = {
  abc: require('../../assets/music/abc_tts.mp3'),
  lion: require('../../assets/sounds/lion.mp3'),
  happy: require('../../assets/music/happy.mp3'),
  twinkle: require('../../assets/music/twinkle_tts.mp3'),
};

export default function ExploreScreen({ navigation }: ScreenProps<'Explore'>) {
  const { p, touchStreak } = useProgress();
  const { playSound } = useAudio();
  
  const fadeAnims = useRef([...Array(15)].map(() => new Animated.Value(0))).current;
  const slideAnims = useRef([...Array(15)].map(() => new Animated.Value(30))).current;

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
          {renderCard(0, AlphabetsCard, 'Category', undefined, 'Letters')}
          {renderCard(1, AnimalsCard, 'Animals', 'lion')}
          {renderCard(2, MusicCard, 'Music', 'happy')}
          {renderCard(3, StoriesCard, 'Story', 'twinkle')}
          {renderCard(4, MathQuizCard, 'NumberQuiz', undefined, 'Math Quiz')}
          {renderCard(5, WordMatchCard, 'WordMatch', undefined, 'Word Match')}
          {renderCard(6, ColoringCard, 'ColorMatch', undefined, 'Coloring')}
          {renderCard(7, NumbersCard, 'Numbers', undefined, 'Numbers')}
          {renderCard(8, MemoryFlipCard, 'MemoryFlip', undefined, 'Memory Flip')}
          {renderCard(9, ShapeQuizCard, 'ShapeQuiz', undefined, 'Shape Quiz')}
          {renderCard(10, BalloonPopCard, 'BalloonPop', undefined, 'Balloon Pop')}
          {renderCard(11, ShadowMatchCard, 'ShadowMatch', undefined, 'Shadow Match')}
          {renderCard(12, SoundMatchCard, 'SoundMatch', undefined, 'Sound Match')}
          {renderCard(13, LetterBalloonPopCard, 'LetterBalloonPop', undefined, 'Letter Pop')}
          {renderCard(14, AlphabetSoundCard, 'AlphabetSound', undefined, 'A for Apple')}
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

