// App.tsx — Bumbloo root
import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';

import { ProgressProvider } from './src/store/ProgressStore';
import type { RootStackParamList } from './src/navigation/types';

import SplashScreen from './src/screens/SplashScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import LessonScreen from './src/screens/LessonScreen';
import NumbersScreen from './src/screens/NumbersScreen';
import ColorMatchScreen from './src/screens/ColorMatchScreen';
import WordMatchScreen from './src/screens/WordMatchScreen';
import RewardScreen from './src/screens/RewardScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import StreakScreen from './src/screens/StreakScreen';
import AnimalScreen from './src/screens/AnimalScreen';
import MusicScreen from './src/screens/MusicScreen';
import NumberQuizScreen from './src/screens/NumberQuizScreen';
import MemoryFlipScreen from './src/screens/MemoryFlipScreen';
import ShapeQuizScreen from './src/screens/ShapeQuizScreen';
import BalloonPopScreen from './src/screens/BalloonPopScreen';
import ShadowMatchScreen from './src/screens/ShadowMatchScreen';
import SoundMatchScreen from './src/screens/SoundMatchScreen';
import LetterBalloonPopScreen from './src/screens/LetterBalloonPopScreen';
import LetterTraceScreen from './src/screens/LetterTraceScreen';
import ColorMixScreen from './src/screens/ColorMixScreen';
import PatternQuestScreen from './src/screens/PatternQuestScreen';
import ClockReadScreen from './src/screens/ClockReadScreen';
import EmotionMatchScreen from './src/screens/EmotionMatchScreen';
import ArabicHomeScreen from './src/screens/ArabicHomeScreen';
import ArabicQaidaScreen from './src/screens/ArabicQaidaScreen';
import ArabicSurahScreen from './src/screens/ArabicSurahScreen';
import ArabicDuaScreen from './src/screens/ArabicDuaScreen';
import NamazScreen from './src/screens/NamazScreen';
import AsmaScreen from './src/screens/AsmaScreen';
import BrainStormScreen from './src/screens/BrainStormScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ProgressProvider>
          <NavigationContainer>
            <StatusBar style="dark" />
            <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
              <Stack.Screen name="Splash" component={SplashScreen} />
              <Stack.Screen name="Explore" component={ExploreScreen} />
              <Stack.Screen name="Category" component={CategoryScreen} />
              <Stack.Screen name="Lesson" component={LessonScreen} />
              <Stack.Screen name="Numbers" component={NumbersScreen} />
              <Stack.Screen name="ColorMatch" component={ColorMatchScreen} />
              <Stack.Screen name="WordMatch" component={WordMatchScreen} />
              <Stack.Screen name="Reward" component={RewardScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
              <Stack.Screen name="Streak" component={StreakScreen} />
              <Stack.Screen name="Animals" component={AnimalScreen} />
              <Stack.Screen name="Music" component={MusicScreen} />
              <Stack.Screen name="NumberQuiz" component={NumberQuizScreen} />
              <Stack.Screen name="MemoryFlip" component={MemoryFlipScreen} />
              <Stack.Screen name="ShapeQuiz" component={ShapeQuizScreen} />
              <Stack.Screen name="BalloonPop" component={BalloonPopScreen} />
              <Stack.Screen name="ShadowMatch" component={ShadowMatchScreen} />
              <Stack.Screen name="SoundMatch" component={SoundMatchScreen} />
              <Stack.Screen name="LetterBalloonPop" component={LetterBalloonPopScreen} />
              <Stack.Screen name="LetterTrace" component={LetterTraceScreen} />
              <Stack.Screen name="ColorMix" component={ColorMixScreen} />
              <Stack.Screen name="PatternQuest" component={PatternQuestScreen} />
              <Stack.Screen name="ClockRead" component={ClockReadScreen} />
              <Stack.Screen name="EmotionMatch" component={EmotionMatchScreen} />
              <Stack.Screen name="ArabicHome" component={ArabicHomeScreen} />
              <Stack.Screen name="ArabicQaida" component={ArabicQaidaScreen} />
              <Stack.Screen name="ArabicSurah" component={ArabicSurahScreen} />
              <Stack.Screen name="ArabicDua" component={ArabicDuaScreen} />
              <Stack.Screen name="Namaz" component={NamazScreen} />
              <Stack.Screen name="Asma" component={AsmaScreen} />
              <Stack.Screen name="BrainStorm" component={BrainStormScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </ProgressProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
