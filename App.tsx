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
import StoryScreen from './src/screens/StoryScreen';
import MiniGamesScreen from './src/screens/MiniGamesScreen';
import RewardScreen from './src/screens/RewardScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import StreakScreen from './src/screens/StreakScreen';
import AnimalScreen from './src/screens/AnimalScreen';
import MusicScreen from './src/screens/MusicScreen';

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
            <StatusBar style="dark"/>
            <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
              <Stack.Screen name="Splash" component={SplashScreen}/>
              <Stack.Screen name="Explore" component={ExploreScreen}/>
              <Stack.Screen name="Category" component={CategoryScreen}/>
              <Stack.Screen name="Lesson" component={LessonScreen}/>
              <Stack.Screen name="Numbers" component={NumbersScreen}/>
              <Stack.Screen name="ColorMatch" component={ColorMatchScreen}/>
              <Stack.Screen name="WordMatch" component={WordMatchScreen}/>
              <Stack.Screen name="Story" component={StoryScreen}/>
              <Stack.Screen name="Games" component={MiniGamesScreen}/>
              <Stack.Screen name="Reward" component={RewardScreen}/>
              <Stack.Screen name="Profile" component={ProfileScreen}/>
              <Stack.Screen name="Settings" component={SettingsScreen}/>
              <Stack.Screen name="Streak" component={StreakScreen}/>
              <Stack.Screen name="Animals" component={AnimalScreen}/>
              <Stack.Screen name="Music" component={MusicScreen}/>
            </Stack.Navigator>
          </NavigationContainer>
        </ProgressProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
