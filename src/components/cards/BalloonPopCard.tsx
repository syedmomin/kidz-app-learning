import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { C } from '../../theme';

export default function BalloonPopCard({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.card, { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }]}>
      <View style={s.imgBox}>
        <View style={s.row}>
          {[{ n: '3', c: C.coral }, { n: '7', c: C.blue }, { n: '5', c: C.mint }].map((b, i) => (
            <View key={i} style={[s.balloon, { backgroundColor: b.c }]}>
              <Text style={s.bNum}>{b.n}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={[s.footer, { backgroundColor: '#E8F4FF' }]}>
        <Text style={s.name}>Balloon Pop</Text>

      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card:    { borderRadius: 22, overflow: 'hidden', backgroundColor: '#fff', borderWidth: 3.5, borderColor: C.ink, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 10, elevation: 5 },
  imgBox:  { height: 120, backgroundColor: '#EDF7FF', alignItems: 'center', justifyContent: 'center' },
  row:     { flexDirection: 'row', gap: 12, alignItems: 'flex-end' },
  balloon: { width: 52, height: 62, borderRadius: 26, borderWidth: 2.5, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  bNum:    { fontSize: 22, fontWeight: '900', color: '#fff' },
  footer:  { paddingHorizontal: 10, paddingVertical: 10, alignItems: 'center' },
  name:    { fontWeight: '900', fontSize: 15, color: C.ink },
});
