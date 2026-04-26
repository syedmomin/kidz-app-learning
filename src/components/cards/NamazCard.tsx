import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { C } from '../../theme';

export default function NamazCard({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={({ pressed }) => [s.card, pressed && s.pressed]} onPress={onPress}>
      <View style={s.emojiBox}><Text style={s.emoji}>🕌</Text></View>
      <Text style={s.title}>Namaz</Text>
      <Text style={s.sub}>Learn Namaz</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card:    { backgroundColor: '#E8FFF4', borderRadius: 20, borderWidth: 3, borderColor: '#3CB57F', padding: 14, alignItems: 'center', elevation: 3, shadowColor: C.ink, shadowOffset: { width: 2, height: 3 }, shadowOpacity: 0.13, shadowRadius: 0 },
  pressed: { transform: [{ scale: 0.96 }], opacity: 0.9 },
  emojiBox:{ width: 64, height: 64, borderRadius: 18, backgroundColor: '#C3E6D4', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  emoji:   { fontSize: 36 },
  title:   { fontSize: 14, fontWeight: '800', color: C.ink, textAlign: 'center' },
  sub:     { fontSize: 10, color: '#1F9E5F', fontWeight: '700', marginTop: 2 },
});