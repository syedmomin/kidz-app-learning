import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { C } from '../../theme';

export default function MemoryFlipCard({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.card, { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }]}>
      <View style={s.imgBox}>
        <View style={s.cardRow}>
          {['🐱','❓','🐶','❓'].map((e, i) => (
            <View key={i} style={[s.miniCard, { backgroundColor: i % 2 === 0 ? C.cream : C.blue }]}>
              <Text style={{ fontSize: 20 }}>{e}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={[s.footer, { backgroundColor: '#D9F0FF' }]}>
        <Text style={s.name}>Memory Flip</Text>
        <Text style={s.desc}>Match the pairs!</Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card:     { borderRadius: 22, overflow: 'hidden', backgroundColor: '#fff', borderWidth: 3.5, borderColor: C.ink, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 10, elevation: 5 },
  imgBox:   { height: 120, backgroundColor: '#EAF6FF', alignItems: 'center', justifyContent: 'center' },
  cardRow:  { flexDirection: 'row', gap: 8 },
  miniCard: { width: 44, height: 52, borderRadius: 10, borderWidth: 2.5, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  footer:   { paddingHorizontal: 10, paddingVertical: 10, alignItems: 'center' },
  name:     { fontWeight: '900', fontSize: 15, color: C.ink },
  desc:     { fontWeight: '600', fontSize: 11, color: C.inkSoft, marginTop: 2 },
});
