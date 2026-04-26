import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { C } from '../../theme';

export default function EmotionMatchCard({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.card, { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }]}>
      <View style={s.imgBox}>
        <Text style={s.faces}>😊</Text>
        <View style={s.faceCol}>
          <Text style={s.faceSm}>😢</Text>
          <Text style={s.faceSm}>😠</Text>
        </View>
        <View style={s.faceCol}>
          <Text style={s.faceSm}>🤩</Text>
          <Text style={s.faceSm}>😨</Text>
        </View>
      </View>
      <View style={[s.footer, { backgroundColor: '#FFCDD2' }]}>
        <Text style={s.name}>Emotion Match</Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card:    { borderRadius: 22, overflow: 'hidden', backgroundColor: '#fff', borderWidth: 3.5, borderColor: C.ink, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 10, elevation: 5 },
  imgBox:  { height: 120, backgroundColor: '#FFF5F8', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  faces:   { fontSize: 56 },
  faceCol: { gap: 4 },
  faceSm:  { fontSize: 26 },
  footer:  { paddingHorizontal: 10, paddingVertical: 10, alignItems: 'center' },
  name:    { fontWeight: '900', fontSize: 15, color: C.ink },
});
