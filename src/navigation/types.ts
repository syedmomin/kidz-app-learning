// src/navigation/types.ts
export type RootStackParamList = {
  Splash: undefined;
  Explore: undefined;
  Category: undefined;
  Lesson: { letter?: string } | undefined;
  Numbers: undefined;
  ColorMatch: undefined;
  WordMatch: undefined;
  Story: undefined;
  Games: undefined;
  Reward: { from?: string; stars?: number } | undefined;
  Profile: undefined;
  Settings: undefined;
  Streak: undefined;
  Animals: undefined;
  Music: undefined;
  NumberQuiz: undefined;
  MemoryFlip: undefined;
  ShapeQuiz:  undefined;
  BalloonPop: undefined;
  OddOneOut:  undefined;
};

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
export type ScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;
