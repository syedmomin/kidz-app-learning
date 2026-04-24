// src/screens/NumbersScreen.tsx — tap to count
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path, Ellipse } from 'react-native-svg';
import PhoneSafe from '../components/PhoneSafe';
import BounceButton from '../components/BounceButton';
import { C } from '../theme';
import { useProgress } from '../store/ProgressStore';
import type { ScreenProps } from '../navigation/types';

export default function NumbersScreen({ navigation }: ScreenProps<'Numbers'>) {
  const [picked, setPicked] = useState<Set<number>>(new Set());
  const [choice, setChoice] = useState<number | null>(null);
  const { completeNumber } = useProgress();
  const target = 5;
  const correct = choice === target;

  const toggle = (i: number) => {
    const s = new Set(picked);
    if (s.has(i)) s.delete(i); else s.add(i);
    setPicked(s);
  };

  const check = async () => {
    if (correct) {
      await completeNumber(target);
      navigation.navigate('Reward', { from: 'Numbers', stars: 2 });
    }
  };

  return (
    <PhoneSafe bg="#D9F0FF">
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}><Text style={s.backT}>←</Text></Pressable>
        <Text style={s.title}>Count the apples!</Text>
        <View style={{ width: 44 }}/>
      </View>

      <View style={s.numBox}><Text style={s.num}>{picked.size}</Text></View>

      <View style={s.apples}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Pressable key={i} onPress={() => toggle(i)}>
            <Svg width="60" height="64" viewBox="0 0 60 64">
              <Path d="M 8 26 Q 8 8 30 8 Q 52 8 52 26 Q 52 56 30 62 Q 8 56 8 26 Z" fill={picked.has(i) ? C.coral : '#E8DDC7'} stroke={C.ink} strokeWidth="3"/>
              <Path d="M 30 8 Q 28 2 24 1" stroke={C.ink} strokeWidth="3" fill="none" strokeLinecap="round"/>
              <Ellipse cx="34" cy="6" rx="6" ry="3" fill={C.mint} stroke={C.ink} strokeWidth="2"/>
            </Svg>
          </Pressable>
        ))}
      </View>

      <Text style={s.q}>How many did you pick?</Text>
      <View style={s.choices}>
        {[3, 4, 5, 6].map((n) => (
          <Pressable key={n} onPress={() => setChoice(n)}
            style={[s.chip, { backgroundColor: choice === n ? (n === target ? C.mint : C.coral) : '#fff' }]}>
            <Text style={[s.chipT, { color: choice === n ? C.cream : C.ink }]}>{n}</Text>
          </Pressable>
        ))}
      </View>

      <View style={{ padding: 16 }}>
        <BounceButton color={correct ? C.mint : C.blue} shadow={correct ? C.mintDeep : C.blueDeep} big onPress={check} style={{ alignSelf: 'stretch' }}>
          {correct ? '✓ Correct!' : 'Check'}
        </BounceButton>
      </View>
    </PhoneSafe>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  back: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', borderWidth: 3, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  backT: { fontSize: 20, fontWeight: '900', color: C.ink },
  title: { flex: 1, textAlign: 'center', fontWeight: '900', fontSize: 20, color: C.ink },
  numBox: { margin: 16, height: 130, backgroundColor: C.yellow, borderWidth: 4, borderColor: C.ink, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  num: { fontSize: 110, fontWeight: '900', color: C.ink },
  apples: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', padding: 16, backgroundColor: C.cream, marginHorizontal: 16, borderWidth: 4, borderColor: C.ink, borderRadius: 28 },
  q: { textAlign: 'center', fontWeight: '800', fontSize: 16, color: C.ink, marginTop: 18 },
  choices: { flexDirection: 'row', justifyContent: 'center', gap: 10, padding: 14 },
  chip: { width: 64, height: 64, borderRadius: 32, borderWidth: 4, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  chipT: { fontSize: 28, fontWeight: '900' },
});
