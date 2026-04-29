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
  { target: 'LetterTrace',     title: 'Trace Letters', image: require('../../assets/images/card_alphabets.png'),  bg: 'rgba(227, 242, 253, 0.4)', speech: 'Trace the letter' },
  { target: 'Animals',         title: 'Animals',       image: require('../../assets/images/card_animals.png'),    bg: 'rgba(232, 245, 233, 0.4)', sound: 'lion', isNew: true },
  { target: 'Music',           title: 'Music',         image: require('../../assets/images/card_music.png'),      bg: 'rgba(243, 229, 245, 0.4)', sound: 'happy' },
  { target: 'ColorMatch',      title: 'Coloring',      image: require('../../assets/images/card_coloring.png'),   bg: 'rgba(252, 228, 236, 0.4)', speech: 'Coloring' },
  { target: 'NumberQuiz',      title: 'Math Quiz',     image: require('../../assets/images/card_math.png'),       bg: 'rgba(255, 243, 224, 0.4)', speech: 'Math Quiz' },
  { target: 'WordMatch',       title: 'Word Match',    image: require('../../assets/images/card_word_match.png'), bg: 'rgba(241, 248, 233, 0.4)', speech: 'Word Match' },
  { target: 'Numbers',         title: 'Numbers',       image: require('../../assets/images/card_numbers.png'),    bg: 'rgba(255, 253, 231, 0.4)', speech: 'Numbers' },
  { target: 'MemoryFlip',      title: 'Memory Flip',   image: require('../../assets/images/card_memory.png'),     bg: 'rgba(225, 245, 254, 0.4)', speech: 'Memory Flip' },
  { target: 'ShapeQuiz',       title: 'Shape Quiz',    image: require('../../assets/images/card_shapes.png'),     bg: 'rgba(255, 249, 196, 0.4)', speech: 'Shape Quiz' },
  { target: 'BalloonPop',      title: 'Balloon Pop',   image: require('../../assets/images/card_balloons.png'),   bg: 'rgba(224, 247, 250, 0.4)', speech: 'Balloon Pop' },
  { target: 'ShadowMatch',     title: 'Shadow Match',  image: require('../../assets/images/card_shadow.png'),    bg: 'rgba(243, 229, 245, 0.4)', speech: 'Shadow Match' },
  { target: 'SoundMatch',      title: 'Sound Match',   image: require('../../assets/images/card_sound.png'),     bg: 'rgba(252, 228, 236, 0.4)', speech: 'Sound Match' },
  { target: 'LetterBalloonPop', title: 'Letter Pop',    image: require('../../assets/images/card_balloons.png'),   bg: 'rgba(232, 234, 246, 0.4)', speech: 'Letter Pop' },
  { target: 'AlphabetSound',   title: 'A for Apple',   image: require('../../assets/images/card_alphabets.png'),  bg: 'rgba(224, 242, 241, 0.4)', speech: 'A for Apple' },
  { target: 'ColorMix',        title: 'Color Mix',     image: require('../../assets/images/card_colormix.png'),   bg: 'rgba(232, 245, 233, 0.4)', speech: 'Color Mix Lab' },
  { target: 'PatternQuest',    title: 'Patterns',      image: require('../../assets/images/card_patterns.png'),   bg: 'rgba(255, 243, 224, 0.4)', speech: 'Pattern Quest' },
  { target: 'ClockRead',       title: 'Clock Reader',  image: require('../../assets/images/card_clock.png'),      bg: 'rgba(225, 245, 254, 0.4)', speech: 'Clock Reader' },
  { target: 'EmotionMatch',    title: 'Emotions',      image: require('../../assets/images/card_emotions.png'),   bg: 'rgba(224, 242, 241, 0.4)', speech: 'Emotion Match' },
  { target: 'ArabicQaida',     title: 'Arabic Qaida',  image: require('../../assets/images/card_arabic_qaida.png'), bg: 'rgba(255, 244, 224, 0.4)', speech: 'Arabic Qaida' },
  { target: 'ArabicSurah',     title: 'Quran Surahs',  image: require('../../assets/images/card_arabic_surah.png'), bg: 'rgba(232, 245, 233, 0.4)', speech: 'Quran Surahs' },
  { target: 'ArabicDua',       title: 'Daily Duas',    image: require('../../assets/images/card_arabic_dua.png'),   bg: 'rgba(238, 232, 255, 0.4)', speech: 'Daily Duas' },
  { target: 'Namaz',           title: 'Namaz Learn',   image: require('../../assets/images/card_namaz.png'),        bg: 'rgba(227, 242, 253, 0.4)', speech: 'Namaz Learning' },
  { target: 'Asma',            title: 'Asma ul Husna', image: require('../../assets/images/card_asma.png'),         bg: 'rgba(225, 245, 254, 0.4)', speech: 'Asma ul Husna' },
  { target: 'BrainStorm',      title: 'Brain Storm',   image: require('../../assets/images/card_math.png'),       bg: 'rgba(255, 243, 224, 0.4)', speech: 'Brain Storming Game', isNew: true },
];

export default function ExploreScreen({ navigation }: ScreenProps<'Explore'>) {
  const { p, touchStreak } = useProgress();
  const { playSound } = useAudio();
  
  const fadeAnims = useRef(EXPLORE_DATA.map(() => new Animated.Value(0))).current;
  const slideAnims = useRef(EXPLORE_DATA.map(() => new Animated.Value(30))).current;

  useEffect(() => { 
    touchStreak(); 
    Animated.stagger(60, fadeAnims.map((anim, i) => 
      Animated.parallel([
        Animated.timing(anim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(slideAnims[i], { toValue: 0, duration: 500, useNativeDriver: true })
      ])
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
    <ImageBackground 
      source={require('../../assets/images/splash_screen.png')} 
      style={s.root}
      blurRadius={10}
    >
      <SafeAreaView style={s.safe} edges={['top']}>
        <BlurView intensity={80} tint="light" style={s.headerContainer}>
          <View style={s.header}>
            <View>
              <Text style={s.appName}>KidzNKidz ✨</Text>
              <Text style={s.greeting}>What do you want to learn today?</Text>
            </View>
            <View style={s.headerRight}>
              <Pressable style={s.chip} onPress={() => navigation.navigate('Streak')}>
                <Star size={16}/><Text style={s.chipText}>{p.stars}</Text>
              </Pressable>
              <Pressable style={[s.chip, { backgroundColor: 'rgba(255, 214, 240, 0.8)' }]} onPress={() => navigation.navigate('Settings')}>
                <Text style={{ fontSize: 15 }}>⚙️</Text>
              </Pressable>
            </View>
          </View>
        </BlurView>

        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          <View style={s.grid}>
            {EXPLORE_DATA.map((item, i) => (
              <Animated.View 
                key={item.target} 
                style={[s.col, { opacity: fadeAnims[i], transform: [{ translateY: slideAnims[i] }] }]}
              >
                <ExploreCard 
                  title={item.title}
                  image={item.image}
                  backgroundColor={item.bg}
                  isNew={item.isNew}
                  onPress={() => handlePress(item.target, item.sound, item.speech)}
                />
              </Animated.View>
            ))}
          </View>
          <View style={{ height: 40 }}/>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  root:        { flex: 1 },
  safe:        { flex: 1, backgroundColor: 'rgba(244, 248, 255, 0.6)' },
  headerContainer: {
    paddingBottom: 12,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 10,
  },
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10 },
  appName:     { fontSize: 26, fontWeight: '900', color: C.ink, letterSpacing: -0.5 },
  greeting:    { fontSize: 13, fontWeight: '700', color: '#555', marginTop: 2 },
  headerRight: { flexDirection: 'row', gap: 10 },
  chip:        { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    backgroundColor: 'rgba(255, 229, 102, 0.9)', 
    borderRadius: 999, 
    paddingHorizontal: 14, 
    paddingVertical: 8, 
    borderWidth: 2, 
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chipText:    { fontWeight: '900', fontSize: 15, color: C.ink },
  scroll:      { paddingHorizontal: 16, paddingTop: 10 },
  grid:        { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  col:         { width: '47.5%' },
});


