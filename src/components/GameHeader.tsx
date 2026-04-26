import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { C } from '../theme';

interface Props {
  onBack: () => void;
  title: string;
  subtitle?: string;
  score?: number;
  scoreBg?: string;
  scoreTextColor?: string;
  titleColor?: string;
  right?: React.ReactNode;
}

export default function GameHeader({ onBack, title, subtitle, score, scoreBg = '#FFE566', scoreTextColor = C.ink, titleColor = C.ink, right }: Props) {
  const rightEl = right ?? (
    score !== undefined
      ? <View style={[s.pill, { backgroundColor: scoreBg }]}>
          <Text style={[s.pillT, { color: scoreTextColor }]}>⭐ {score}</Text>
        </View>
      : <View style={s.spacer} />
  );

  return (
    <View style={s.header}>
      <Pressable onPress={onBack} style={s.back}>
        <Text style={s.backT}>←</Text>
      </Pressable>
      <View style={s.center}>
        <Text style={[s.title, { color: titleColor }]} numberOfLines={1}>{title}</Text>
        {subtitle ? <Text style={s.sub} numberOfLines={1}>{subtitle}</Text> : null}
      </View>
      {rightEl}
    </View>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  back:   { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', elevation: 4, alignItems: 'center', justifyContent: 'center' },
  backT:  { fontSize: 22, fontWeight: '900', color: C.ink },
  center: { flex: 1, alignItems: 'center' },
  title:  { fontWeight: '900', fontSize: 22, textAlign: 'center' },
  sub:    { fontSize: 11, fontWeight: '600', color: '#888', marginTop: 1 },
  pill:   { borderRadius: 20, paddingHorizontal: 15, paddingVertical: 6, elevation: 4 },
  pillT:  { fontWeight: '900', fontSize: 16 },
  spacer: { width: 44 },
});
