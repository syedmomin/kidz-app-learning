import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { C } from '../../theme';

export default function ArabicDuaCard({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={({ pressed }) => [s.card, pressed && s.pressed]} onPress={onPress}>
      <View style={s.emojiBox}><Text style={s.emoji}>🤲</Text></View>
      <Text style={s.title}>Duas</Text>
      <Text style={s.sub}>Daily Prayers</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card:    { backgroundColor: '#EEE8FF', borderRadius: 20, borderWidth: 3, borderColor: '#B68CFF', padding: 14, alignItems: 'center', elevation: 3, shadowColor: C.ink, shadowOffset: { width: 2, height: 3 }, shadowOpacity: 0.13, shadowRadius: 0 },
  pressed: { transform: [{ scale: 0.96 }], opacity: 0.9 },
  emojiBox:{ width: 64, height: 64, borderRadius: 18, backgroundColor: '#D4C4FF', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  emoji:   { fontSize: 36 },
  title:   { fontSize: 14, fontWeight: '800', color: C.ink, textAlign: 'center' },
  sub:     { fontSize: 10, color: '#8857E0', fontWeight: '700', marginTop: 2 },
});