import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { C } from '../../theme';

export default function ClockReadCard({ onPress }: { onPress: () => void }) {
  const cx = 50, cy = 50, r = 40;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.card, { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }]}>
      <View style={s.imgBox}>
        <Svg width={100} height={100} viewBox="0 0 100 100">
          <Circle cx={cx} cy={cy} r={r} fill="#FFFDF0" stroke={C.ink} strokeWidth={3} />
          {/* Hour ticks */}
          {[...Array(12)].map((_, i) => {
            const deg = (i * 30 - 90) * Math.PI / 180;
            const inner = i % 3 === 0 ? r - 10 : r - 6;
            return (
              <Line key={i}
                x1={cx + r * Math.cos(deg)} y1={cy + r * Math.sin(deg)}
                x2={cx + inner * Math.cos(deg)} y2={cy + inner * Math.sin(deg)}
                stroke={C.ink} strokeWidth={i % 3 === 0 ? 2.5 : 1.2} strokeLinecap="round"
              />
            );
          })}
          {/* Hour hand → 3 o'clock */}
          <Line x1={cx} y1={cy} x2={cx + 24} y2={cy} stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
          {/* Minute hand → 12 */}
          <Line x1={cx} y1={cy} x2={cx} y2={cy - 32} stroke="#E74C3C" strokeWidth={3.5} strokeLinecap="round" />
          <Circle cx={cx} cy={cy} r={5} fill={C.ink} />
        </Svg>
        <Text style={s.timeLabel}>3:00</Text>
      </View>
      <View style={[s.footer, { backgroundColor: '#B2EBF2' }]}>
        <Text style={s.name}>Clock Reader</Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card:      { borderRadius: 22, overflow: 'hidden', backgroundColor: '#fff', borderWidth: 3.5, borderColor: C.ink, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 10, elevation: 5 },
  imgBox:    { height: 120, backgroundColor: '#E0F7FA', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 },
  timeLabel: { fontSize: 22, fontWeight: '900', color: C.ink },
  footer:    { paddingHorizontal: 10, paddingVertical: 10, alignItems: 'center' },
  name:      { fontWeight: '900', fontSize: 15, color: C.ink },
});
