import React from 'react';
import { Pressable, View, Text, Image, StyleSheet } from 'react-native';
import { C } from '../../theme';

const img = require('../../../assets/images/card_coloring.png');

export default function ColoringCard({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.card, { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }]}>
      <View style={s.imgBox}><Image source={img} style={s.img}/></View>
      <View style={[s.footer, { backgroundColor: '#E0F7FA' }]}>
        <Text style={s.name}>Coloring</Text>
        <Text style={s.desc}>Paint & color art</Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card:   { borderRadius: 22, overflow: 'hidden', backgroundColor: '#fff', borderWidth: 3.5, borderColor: C.ink, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 10, elevation: 5 },
  imgBox: { height: 120, backgroundColor: '#E0F7FA' },
  img:    { width: '100%', height: '100%', resizeMode: 'cover' },
  footer: { paddingHorizontal: 10, paddingVertical: 10, alignItems: 'center' },
  name:   { fontWeight: '900', fontSize: 15, color: C.ink },
  desc:   { fontWeight: '600', fontSize: 11, color: C.inkSoft, marginTop: 2 },
});
