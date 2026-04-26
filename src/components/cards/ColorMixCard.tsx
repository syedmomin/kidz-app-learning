import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { C } from '../../theme';

export default function ColorMixCard({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.card, { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }]}>
      <View style={s.imgBox}>
        <Svg width={130} height={100} viewBox="0 0 130 100">
          {/* Three overlapping color circles */}
          <Circle cx={48} cy={50} r={26} fill="#FF3B3B" opacity={0.85} stroke={C.ink} strokeWidth={2} />
          <Circle cx={82} cy={50} r={26} fill="#2196F3" opacity={0.85} stroke={C.ink} strokeWidth={2} />
          <Circle cx={65} cy={26} r={20} fill="#FFD93D" opacity={0.85} stroke={C.ink} strokeWidth={2} />
        </Svg>
        <Text style={s.flask}>🧪</Text>
      </View>
      <View style={[s.footer, { backgroundColor: '#FFF1A8' }]}>
        <Text style={s.name}>Color Mix Lab</Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card:    { borderRadius: 22, overflow: 'hidden', backgroundColor: '#fff', borderWidth: 3.5, borderColor: C.ink, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 10, elevation: 5 },
  imgBox:  { height: 120, backgroundColor: '#FFF8E5', alignItems: 'center', justifyContent: 'center' },
  flask:   { position: 'absolute', bottom: 8, right: 12, fontSize: 28 },
  footer:  { paddingHorizontal: 10, paddingVertical: 10, alignItems: 'center' },
  name:    { fontWeight: '900', fontSize: 15, color: C.ink },
});
