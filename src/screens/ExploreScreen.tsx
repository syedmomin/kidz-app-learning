import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated, ImageBackground, Image, useWindowDimensions } from 'react-native';
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

// Map items to positions on the path (x is 0-100% of width, y is fixed pixel from top)
const EXPLORE_DATA = [
  { target: 'Animals', title: 'Animals', image: require('../../assets/images/card_animals.png'), step: 0, x: 25, y: 150 },
  { target: 'MemoryFlip', title: 'Memory Flip', image: require('../../assets/images/card_memory.png'), step: 6, x: 75, y: 350 },
  { target: 'ColorMix', title: 'Color Mix', image: require('../../assets/images/card_colormix.png'), step: 9, x: 70, y: 550 },
  { target: 'ShapeQuiz', title: 'Shape Quiz', image: require('../../assets/images/card_shapes.png'), step: 7, x: 30, y: 700 },
  { target: 'NumberQuiz', title: 'Math Quiz', image: require('../../assets/images/card_math.png'), step: 11, x: 70, y: 900 },
  { target: 'WordMatch', title: 'Word Match', image: require('../../assets/images/card_word_match.png'), step: 10, x: 25, y: 1100 },
  { target: 'ShadowMatch', title: 'Shadow Match', image: require('../../assets/images/card_shadow.png'), step: 13, x: 75, y: 1300 },
  { target: 'BalloonPop', title: 'Balloon Pop', image: require('../../assets/images/card_balloons.png'), step: 12, x: 30, y: 1500 },
  { target: 'Coloring', title: 'Coloring', image: require('../../assets/images/card_coloring.png'), step: 4, x: 70, y: 1700 },
  { target: 'Numbers', title: 'Numbers', image: require('../../assets/images/card_numbers.png'), step: 5, x: 25, y: 1900 },
  { target: 'Music', title: 'Music', image: require('../../assets/images/card_music.png'), step: 3, x: 75, y: 2100 },
  { target: 'LetterTrace', title: 'Trace Letters', image: require('../../assets/images/card_alphabets.png'), step: 1, x: 35, y: 2350 },

  // Arabic items
  { target: 'ArabicQaida', title: 'Arabic Qaida', image: require('../../assets/images/card_arabic_qaida.png'), step: 14, x: 25, y: 2500 },
  { target: 'ArabicSurah', title: 'Quran Surahs', image: require('../../assets/images/card_arabic_surah.png'), step: 15, x: 70, y: 2650 },
];


export default function ExploreScreen({ navigation }: ScreenProps<'Explore'>) {
  const { width } = useWindowDimensions();
  const { p, touchStreak } = useProgress();
  const { playSound } = useAudio();

  const scrollRef = useRef<ScrollView>(null);
  const fadeAnims = useRef(EXPLORE_DATA.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    touchStreak();
    Animated.stagger(100, fadeAnims.map((anim) =>
      Animated.timing(anim, { toValue: 1, duration: 600, useNativeDriver: true })
    )).start();

    // Scroll to bottom initially to start adventure from the bottom
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: false });
    }, 100);
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
      <SafeAreaView style={s.safe} edges={['top']}>
        {/* Premium Header */}
        <View style={s.header}>
          <View style={s.titleContainer}>
            <Text style={s.adventureTitle}>Kid's Learning</Text>
            <Text style={s.adventureSubtitle}>Adventure!</Text>
          </View>

          <View style={s.headerRight}>
            <Pressable style={s.chip} onPress={() => navigation.navigate('Streak')}>
              <Star size={18} /><Text style={s.chipText}>{p.stars}</Text>
            </Pressable>
            <Pressable style={[s.chip, { backgroundColor: '#fff' }]} onPress={() => navigation.navigate('Settings')}>
              <Text style={{ fontSize: 18 }}>⚙️</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <ImageBackground
            source={require('../../assets/images/app_background.png')}
            style={[s.bg, { width, height: (width / 768) * 2673 }]}
            resizeMode="cover"
          >
            {EXPLORE_DATA.map((item, i) => (
              <Animated.View
                key={item.target}
                style={[
                  s.cardContainer,
                  {
                    opacity: fadeAnims[i],
                    left: `${item.x}%`,
                    top: (width / 868) * item.y, // Scale Y based on aspect ratio
                  }
                ]}
              >
                <ExploreCard
                  title={item.title}
                  image={item.image}
                  stepNumber={item.step > 0 ? item.step : undefined}
                  onPress={() => handlePress(item.target, item.sound, item.speech)}
                />
              </Animated.View>
            ))}
          </ImageBackground>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#89D9FF' },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8,
    zIndex: 100,
  },
  titleContainer: {
    alignItems: 'center',
  },
  adventureTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FF6B6B',
    textShadowColor: '#fff',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
  adventureSubtitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#3FB5FF',
    textShadowColor: '#fff',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    marginTop: -5,
  },
  headerRight: { flexDirection: 'row', gap: 10 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFE566',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 4,
  },
  chipText: { fontWeight: '900', fontSize: 16, color: C.ink },
  scrollContent: {
    flexGrow: 1,
  },
  bg: {
    // Height is calculated based on aspect ratio (768:2673)
  },
  cardContainer: {
    position: 'absolute',
    alignItems: 'center',
    width: 130,
    marginLeft: -65, // Center the card relative to x position
  }
});



