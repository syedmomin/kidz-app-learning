import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { C } from '../../theme';

interface Props {
  onPress: () => void;
}

export default function SoundMatchCard({ onPress }: Props) {
  return (
    <Pressable style={({ pressed }) => [s.card, pressed && s.pressed]} onPress={onPress}>
      <View style={s.iconContainer}>
        <Text style={s.emoji}>🔊</Text>
      </View>
      <Text style={s.title}>Sound Match</Text>
      <Text style={s.subtitle}>Hear the animal!</Text>
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
    backgroundColor: C.blue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  emoji: {
    fontSize: 32,
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