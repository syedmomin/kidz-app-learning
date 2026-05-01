import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import * as Speech from 'expo-speech';
import { Star } from '../components/Icons';
import { C } from '../theme';
import { useProgress } from '../store/ProgressStore';
import { useAudio } from '../hooks/useAudio';
import type { ScreenProps } from '../navigation/types';

import ExploreCard from '../components/cards/ExploreCard';
import { ANIMAL_SOUNDS, MUSIC_FILES } from '../data/GameAssets';

const SOUNDS = {
  abc: MUSIC_FILES.abc,
  lion: ANIMAL_SOUNDS.lion,
  happy: MUSIC_FILES.happy,
  twinkle: MUSIC_FILES.twinkle,
};

const EXPLORE_DATA = [
  { target: 'Animals', title: 'Animals', image: require('../../assets/images/card_animals.png'), color: '#FFADAD' },
  { target: 'MemoryFlip', title: 'Memory Flip', image: require('../../assets/images/card_memory.png'), color: '#FFD6A5' },
  { target: 'ColorMix', title: 'Color Mix', image: require('../../assets/images/card_colormix.png'), color: '#FDFFB6' },
  { target: 'ShapeQuiz', title: 'Shape Quiz', image: require('../../assets/images/card_shapes.png'), color: '#CAFFBF' },
  { target: 'NumberQuiz', title: 'Math Quiz', image: require('../../assets/images/card_math.png'), color: '#9BFBC0' },
  { target: 'WordMatch', title: 'Word Match', image: require('../../assets/images/card_word_match.png'), color: '#8EECFF' },
  { target: 'ShadowMatch', title: 'Shadow Match', image: require('../../assets/images/card_shadow.png'), color: '#A0C4FF' },
  { target: 'BalloonPop', title: 'Balloon Pop', image: require('../../assets/images/card_balloons.png'), color: '#BDB2FF' },
  { target: 'Coloring', title: 'Coloring', image: require('../../assets/images/card_coloring.png'), color: '#FFC6FF' },
  { target: 'Numbers', title: 'Numbers', image: require('../../assets/images/card_numbers.png'), color: '#FFADAD' },
  { target: 'Music', title: 'Music', image: require('../../assets/images/card_music.png'), color: '#FFD6A5' },
  { target: 'LetterTrace', title: 'Trace Letters', image: require('../../assets/images/card_alphabets.png'), color: '#FDFFB6' },
  { target: 'ArabicQaida', title: 'Arabic Qaida', image: require('../../assets/images/card_arabic_qaida.png'), color: '#CAFFBF' },
  { target: 'ArabicSurah', title: 'Quran Surahs', image: require('../../assets/images/card_arabic_surah.png'), color: '#9BFBC0' },
  { target: 'ArabicDua', title: 'Daily Duas', image: require('../../assets/images/card_arabic_dua.png'), color: '#8EECFF' },
  { target: 'Namaz', title: 'Namaz Learn', image: require('../../assets/images/card_namaz.png'), color: '#A0C4FF' },
  { target: 'Asma', title: 'Asma ul Husna', image: require('../../assets/images/card_asma.png'), color: '#BDB2FF' },
];

export default function ExploreScreen({ navigation }: ScreenProps<'Explore'>) {
  const { p, touchStreak } = useProgress();
  const { playSound } = useAudio();
  
  const fadeAnims = useRef(EXPLORE_DATA.map(() => new Animated.Value(0))).current;

  useEffect(() => { 
    touchStreak(); 
    Animated.stagger(50, fadeAnims.map((anim) => 
      Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true })
    )).start();
  }, []);

  const handlePress = (target: string, soundKey?: string, speechText?: string) => {
    if (soundKey && (SOUNDS as any)[soundKey]) {
      playSound((SOUNDS as any)[soundKey]);
    } else if (speechText) {
      Speech.stop();
      Speech.speak(speechText, { rate: 0.9, pitch: 1.1 });
    }
    
    setTimeout(() => {
      navigation.navigate(target as any);
    }, 150);
  };

  return (
    <View style={s.root}>
      {/* Dynamic multi-colored background blobs */}
      <View style={[s.blob, { backgroundColor: '#FFADAD', top: -50, left: -50 }]} />
      <View style={[s.blob, { backgroundColor: '#9BFBC0', bottom: -100, right: -50 }]} />
      <View style={[s.blob, { backgroundColor: '#A0C4FF', top: '40%', right: -80, width: 200, height: 200 }]} />
      
      <SafeAreaView style={s.safe} edges={['top']}>
        <View style={s.header}>
          <View>
            <Text style={s.appName}>KidzNKidz ✨</Text>
            <Text style={s.greeting}>What do you want to learn today?</Text>
          </View>
          <View style={s.headerRight}>
            <Pressable style={s.chip} onPress={() => navigation.navigate('Streak')}>
              <Star size={16}/><Text style={s.chipText}>{p.stars}</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          <View style={s.grid}>
            {EXPLORE_DATA.map((item, i) => (
              <Animated.View 
                key={item.target + i} 
                style={[s.col, { opacity: fadeAnims[i] }]}
              >
                <ExploreCard 
                  title={item.title}
                  image={item.image}
                  glassColor={item.color}
                  onPress={() => handlePress(item.target)}
                />
              </Animated.View>
            ))}
          </View>
          <View style={{ height: 40 }}/>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root:        { flex: 1, backgroundColor: '#F8F9FA' },
  blob: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.3,
  },
  safe:        { flex: 1 },
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15 },
  appName:     { fontSize: 26, fontWeight: '900', color: C.ink },
  greeting:    { fontSize: 13, fontWeight: '600', color: '#666', marginTop: 2 },
  headerRight: { flexDirection: 'row', gap: 10 },
  chip:        { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    backgroundColor: '#FFE566', 
    borderRadius: 999, 
    paddingHorizontal: 15, 
    paddingVertical: 8, 
    borderWidth: 2, 
    borderColor: '#fff',
    elevation: 4,
  },
  chipText:    { fontWeight: '900', fontSize: 15, color: C.ink },
  scroll:      { paddingHorizontal: 16 },
  grid:        { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
  col:         { width: '47.5%' },
});






