import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  { target: 'LetterTrace',     title: 'Trace Letters', image: require('../../../assets/images/card_alphabets.png'),  bg: '#E3F2FD', speech: 'Trace the letter' },
  { target: 'Animals',         title: 'Animals',       image: require('../../../assets/images/card_animals.png'),    bg: '#E8F5E9', sound: 'lion', isNew: true },
  { target: 'Music',           title: 'Music',         image: require('../../../assets/images/card_music.png'),      bg: '#F3E5F5', sound: 'happy' },
  { target: 'ColorMatch',      title: 'Coloring',      image: require('../../../assets/images/card_coloring.png'),   bg: '#FCE4EC', speech: 'Coloring' },
  { target: 'NumberQuiz',      title: 'Math Quiz',     image: require('../../../assets/images/card_math.png'),       bg: '#FFF3E0', speech: 'Math Quiz' },
  { target: 'WordMatch',       title: 'Word Match',    image: require('../../../assets/images/card_word_match.png'), bg: '#F1F8E9', speech: 'Word Match' },
  { target: 'Numbers',         title: 'Numbers',       image: require('../../../assets/images/card_numbers.png'),    bg: '#FFFDE7', speech: 'Numbers' },
  { target: 'MemoryFlip',      title: 'Memory Flip',   image: require('../../../assets/images/card_memory.png'),     bg: '#E1F5FE', speech: 'Memory Flip' },
  { target: 'ShapeQuiz',       title: 'Shape Quiz',    image: require('../../../assets/images/card_shapes.png'),     bg: '#FFF9C4', speech: 'Shape Quiz' },
  { target: 'BalloonPop',      title: 'Balloon Pop',   image: require('../../../assets/images/card_balloons.png'),   bg: '#E0F7FA', speech: 'Balloon Pop' },
  { target: 'ShadowMatch',     title: 'Shadow Match',  image: require('../../../assets/images/card_shadow.png'),    bg: '#F3E5F5', speech: 'Shadow Match' },
  { target: 'SoundMatch',      title: 'Sound Match',   image: require('../../../assets/images/card_sound.png'),     bg: '#FCE4EC', speech: 'Sound Match' },
  { target: 'LetterBalloonPop', title: 'Letter Pop',    image: require('../../../assets/images/card_balloons.png'),   bg: '#E8EAF6', speech: 'Letter Pop' },
  { target: 'AlphabetSound',   title: 'A for Apple',   image: require('../../../assets/images/card_alphabets.png'),  bg: '#E0F2F1', speech: 'A for Apple' },
  { target: 'ColorMix',        title: 'Color Mix',     image: require('../../../assets/images/card_colormix.png'),   bg: '#E8F5E9', speech: 'Color Mix Lab' },
  { target: 'PatternQuest',    title: 'Patterns',      image: require('../../../assets/images/card_patterns.png'),   bg: '#FFF3E0', speech: 'Pattern Quest' },
  { target: 'ClockRead',       title: 'Clock Reader',  image: require('../../../assets/images/card_clock.png'),      bg: '#E1F5FE', speech: 'Clock Reader' },
  { target: 'EmotionMatch',    title: 'Emotions',      image: require('../../../assets/images/card_emotions.png'),   bg: '#E0F2F1', speech: 'Emotion Match' },
  { target: 'ArabicQaida',     title: 'Arabic Qaida',  image: require('../../../assets/images/card_arabic_qaida.png'), bg: '#FFF4E0', speech: 'Arabic Qaida' },
  { target: 'ArabicSurah',     title: 'Quran Surahs',  image: require('../../../assets/images/card_arabic_surah.png'), bg: '#E8F5E9', speech: 'Quran Surahs' },
  { target: 'ArabicDua',       title: 'Daily Duas',    image: require('../../../assets/images/card_arabic_dua.png'),   bg: '#EEE8FF', speech: 'Daily Duas' },
  { target: 'Namaz',           title: 'Namaz Learn',   image: require('../../../assets/images/card_namaz.png'),        bg: '#E3F2FD', speech: 'Namaz Learning' },
  { target: 'Asma',            title: 'Asma ul Husna', image: require('../../../assets/images/card_asma.png'),         bg: '#E1F5FE', speech: 'Asma ul Husna' },
];

export default function ExploreScreen({ navigation }: ScreenProps<'Explore'>) {
  const { p, touchStreak } = useProgress();
  const { playSound } = useAudio();
  
  const fadeAnims = useRef(EXPLORE_DATA.map(() => new Animated.Value(0))).current;
  const slideAnims = useRef(EXPLORE_DATA.map(() => new Animated.Value(30))).current;

  useEffect(() => { 
    touchStreak(); 
    Animated.stagger(80, fadeAnims.map((anim, i) => 
      Animated.parallel([
        Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(slideAnims[i], { toValue: 0, duration: 400, useNativeDriver: true })
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
    <SafeAreaView style={s.root} edges={['top']}>
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

