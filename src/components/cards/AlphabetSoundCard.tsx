import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { C } from '../../theme';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

// Mini apple SVG for the card illustration
const MiniApple = () => (
  <Svg width="48" height="48" viewBox="0 0 160 160">
    <Path d="M 28 72 Q 28 30 80 30 Q 132 30 132 72 Q 132 138 80 148 Q 28 138 28 72 Z" fill="#FF5252" stroke="#333" strokeWidth="4" />
    <Path d="M 80 30 Q 76 14 66 10" stroke="#333" strokeWidth="4" fill="none" />
    <Ellipse cx="90" cy="20" rx="12" ry="6" fill="#4CAF50" stroke="#333" strokeWidth="2" />
  </Svg>
);

interface Props {
  onPress: () => void;
}

export default function AlphabetSoundCard({ onPress }: Props) {
  return (
    <Pressable style={({ pressed }) => [s.card, pressed && s.pressed]} onPress={onPress}>
      <View style={s.iconContainer}>
        <MiniApple />
      </View>
      <Text style={s.title}>A for Apple</Text>
      <Text style={s.subtitle}>Letters & sounds!</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: C.paper,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: C.ink,
    padding: 16,
    alignItems: 'center',
    shadowColor: C.ink,
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 0,
    elevation: 3,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#FFE8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: C.ink,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 11,
    color: C.inkSoft,
    marginTop: 2,
    textAlign: 'center',
  },
});
