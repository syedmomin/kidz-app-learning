import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Polygon, Rect } from 'react-native-svg';
import { C } from '../../theme';

export default function ShapeQuizCard({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.card, { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }]}>
      <View style={s.imgBox}>
        <View style={s.shapeRow}>
          <Svg width="36" height="36"><Circle cx="18" cy="18" r="14" fill={C.coral} stroke={C.ink} strokeWidth="3"/></Svg>
          <Svg width="36" height="36"><Polygon points="18,4 32,32 4,32" fill={C.mint} stroke={C.ink} strokeWidth="3"/></Svg>
          <Svg width="36" height="36"><Rect x="4" y="4" width="28" height="28" fill={C.blue} stroke={C.ink} strokeWidth="3" rx="3"/></Svg>
          <Svg width="36" height="36"><Polygon points="18,2 32,18 18,34 4,18" fill={C.yellow} stroke={C.ink} strokeWidth="3"/></Svg>
        </View>
      </View>
      <View style={[s.footer, { backgroundColor: '#FFF0F8' }]}>
        <Text style={s.name}>Shape Quiz</Text>

      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card:      { borderRadius: 22, overflow: 'hidden', backgroundColor: '#fff', borderWidth: 3.5, borderColor: C.ink, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 10, elevation: 5 },
  imgBox:    { height: 120, backgroundColor: '#FFF5FA', alignItems: 'center', justifyContent: 'center' },
  shapeRow:  { flexDirection: 'row', gap: 10, alignItems: 'center' },
  footer:    { paddingHorizontal: 10, paddingVertical: 10, alignItems: 'center' },
  name:      { fontWeight: '900', fontSize: 15, color: C.ink },
});
