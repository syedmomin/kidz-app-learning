import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Circle, Text as SvgText } from 'react-native-svg';
import { C } from '../../theme';

export default function PatternQuestCard({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.card, { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }]}>
      <View style={s.imgBox}>
        <Svg width={130} height={90} viewBox="0 0 130 90">
          {/* Pattern: ⬤ □ ⬤ □ ? */}
          <Circle cx={18} cy={45} r={14} fill="#FF3B3B" stroke={C.ink} strokeWidth={2} />
          <Rect x={38} y={31} width={28} height={28} rx={5} fill="#2196F3" stroke={C.ink} strokeWidth={2} />
          <Circle cx={82} cy={45} r={14} fill="#FF3B3B" stroke={C.ink} strokeWidth={2} />
          <Rect x={100} y={31} width={28} height={28} rx={5} fill="#2196F3" stroke={C.ink} strokeWidth={2} />
          {/* Question dot */}
          <Circle cx={65} cy={78} r={8} fill="#FFD93D" stroke={C.ink} strokeWidth={2} />
          <SvgText x={65} y={83} textAnchor="middle" fontSize={11} fontWeight="900" fill={C.ink}>?</SvgText>
        </Svg>
      </View>
      <View style={[s.footer, { backgroundColor: '#E8D5FF' }]}>
        <Text style={s.name}>Pattern Quest</Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card:    { borderRadius: 22, overflow: 'hidden', backgroundColor: '#fff', borderWidth: 3.5, borderColor: C.ink, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 10, elevation: 5 },
  imgBox:  { height: 120, backgroundColor: '#F3E8FF', alignItems: 'center', justifyContent: 'center' },
  footer:  { paddingHorizontal: 10, paddingVertical: 10, alignItems: 'center' },
  name:    { fontWeight: '900', fontSize: 15, color: C.ink },
});
