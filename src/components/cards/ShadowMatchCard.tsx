import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { SvgCat } from '../Illustrations';
import { C } from '../../theme';

export default function ShadowMatchCard({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.card, { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }]}>
      <View style={s.imgBox}>
        <View style={s.stage}>
          <View style={{ transform: [{ scale: 0.5 }] }}>
             <SvgCat isShadow={true} />
          </View>
        </View>
      </View>
      <View style={[s.footer, { backgroundColor: '#1A237E' }]}>
        <Text style={s.name}>Shadow Match</Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card:    { borderRadius: 22, overflow: 'hidden', backgroundColor: '#fff', borderWidth: 3.5, borderColor: C.ink, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 10, elevation: 5 },
  imgBox:  { height: 120, backgroundColor: '#E8EAF6', alignItems: 'center', justifyContent: 'center' },
  stage:   { width: 80, height: 80, borderRadius: 40, backgroundColor: '#C5CAE9', borderWidth: 3, borderColor: '#5C6BC0', alignItems: 'center', justifyContent: 'center' },
  footer:  { paddingHorizontal: 10, paddingVertical: 10, alignItems: 'center' },
  name:    { fontWeight: '900', fontSize: 14, color: '#FFF' },
});
