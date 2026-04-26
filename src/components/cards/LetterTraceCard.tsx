import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { C } from '../../theme';

export default function LetterTraceCard({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.card, { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }]}>
      <View style={s.imgBox}>
        <Svg width={130} height={100} viewBox="0 0 130 100">
          {/* Letter A guide */}
          <Path d="M 26 86 L 65 18 L 104 86 M 44 60 L 86 60"
            stroke="#FFB6C1" strokeOpacity={0.5} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <Path d="M 26 86 L 65 18 L 104 86 M 44 60 L 86 60"
            stroke="#FF6B6B" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray="4 5" />
          {/* Pencil overlap */}
          <Circle cx={70} cy={32} r={4} fill="#FFD93D" stroke={C.ink} strokeWidth={1.5} />
          {/* Dots */}
          <Circle cx={65} cy={18}  r={3} fill="#fff" stroke={C.ink} strokeWidth={1.5} />
          <Circle cx={26} cy={86}  r={3} fill="#fff" stroke={C.ink} strokeWidth={1.5} />
          <Circle cx={104} cy={86} r={3} fill="#fff" stroke={C.ink} strokeWidth={1.5} />
        </Svg>
        <Text style={s.pencil}>✏️</Text>
      </View>
      <View style={[s.footer, { backgroundColor: '#FFE6E6' }]}>
        <Text style={s.name}>Letter Trace</Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card:    { borderRadius: 22, overflow: 'hidden', backgroundColor: '#fff', borderWidth: 3.5, borderColor: C.ink, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 10, elevation: 5 },
  imgBox:  { height: 120, backgroundColor: '#FFF6F6', alignItems: 'center', justifyContent: 'center' },
  pencil:  { position: 'absolute', bottom: 12, right: 16, fontSize: 26, transform: [{ rotate: '-25deg' }] },
  footer:  { paddingHorizontal: 10, paddingVertical: 10, alignItems: 'center' },
  name:    { fontWeight: '900', fontSize: 15, color: C.ink },
});
