import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { C } from '../../theme';

export default function OddOneOutCard({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.card, { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }]}>
      <View style={s.imgBox}>
        <View style={s.grid}>
          {['🐱','🐶','🦁','🍎'].map((e, i) => (
            <View key={i} style={[s.item, i === 3 && s.oddItem]}>
              <Text style={{ fontSize: 26 }}>{e}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={[s.footer, { backgroundColor: '#FFFBE6' }]}>
        <Text style={s.name}>Odd One Out</Text>

      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card:    { borderRadius: 22, overflow: 'hidden', backgroundColor: '#fff', borderWidth: 3.5, borderColor: C.ink, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 10, elevation: 5 },
  imgBox:  { height: 120, backgroundColor: '#FFFDF0', alignItems: 'center', justifyContent: 'center' },
  grid:    { flexDirection: 'row', flexWrap: 'wrap', width: 120, gap: 6 },
  item:    { width: 50, height: 50, borderRadius: 12, backgroundColor: C.cream, borderWidth: 2.5, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  oddItem: { backgroundColor: '#FFE0E0', borderColor: C.coral },
  footer:  { paddingHorizontal: 10, paddingVertical: 10, alignItems: 'center' },
  name:    { fontWeight: '900', fontSize: 15, color: C.ink },
});
