// src/components/cards/ArabicCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { C } from '../../theme';

const ArabicIcon = () => (
  <Svg width="52" height="52" viewBox="0 0 100 100">
    <Circle cx="50" cy="50" r="46" fill="#FFF0D6" stroke={C.ink} strokeWidth="4" />
    <Path
      d="M 20 60 Q 30 30 50 35 Q 70 40 75 55 Q 80 70 65 72 Q 50 74 40 65"
      stroke={C.ink}
      strokeWidth="5"
      fill="none"
      strokeLinecap="round"
    />
    <Circle cx="77" cy="40" r="5" fill="#FF8E53" stroke={C.ink} strokeWidth="2.5" />
    <Circle cx="22" cy="62" r="4" fill="#B68CFF" stroke={C.ink} strokeWidth="2.5" />
  </Svg>
);

interface Props {
  onPress: () => void;
}

export default function ArabicCard({ onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [s.card, pressed && s.pressed]}
      onPress={onPress}
    >
      <View style={s.newBadge}>
        <Text style={s.newT}>NEW</Text>
      </View>
      <View style={s.iconContainer}>
        <ArabicIcon />
      </View>
      <Text style={s.title}>Arabic</Text>
      <Text style={s.subtitle}>Qaida · Surahs · Duas</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#FFF8EE',
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
    position: 'relative',
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  newT: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
  },
  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: '#FFE8C8',
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
    fontSize: 10,
    color: C.inkSoft,
    marginTop: 2,
    textAlign: 'center',
    fontWeight: '600',
  },
});
