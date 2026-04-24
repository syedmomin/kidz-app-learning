// src/screens/WordMatchScreen.tsx — picture → word
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import PhoneSafe from '../components/PhoneSafe';
import { C } from '../theme';
import { Star } from '../components/Icons';
import { useProgress } from '../store/ProgressStore';
import type { ScreenProps } from '../navigation/types';

const ROUNDS = [
  { target: 'CAT', options: ['CAT', 'DOG', 'COW'] },
  { target: 'SUN', options: ['FUN', 'SUN', 'RUN'] },
  { target: 'BUS', options: ['BUS', 'BAT', 'BIG'] },
];

function CatSvg() {
  return (
    <Svg width="150" height="150" viewBox="0 0 160 160">
      <Ellipse cx="80" cy="110" rx="50" ry="40" fill={C.cream} stroke={C.ink} strokeWidth="4"/>
      <Circle cx="80" cy="70" r="38" fill={C.cream} stroke={C.ink} strokeWidth="4"/>
      <Path d="M 50 50 L 44 22 L 70 38 Z" fill={C.cream} stroke={C.ink} strokeWidth="4"/>
      <Path d="M 110 50 L 116 22 L 90 38 Z" fill={C.cream} stroke={C.ink} strokeWidth="4"/>
      <Ellipse cx="66" cy="68" rx="5" ry="7" fill={C.ink}/>
      <Ellipse cx="94" cy="68" rx="5" ry="7" fill={C.ink}/>
      <Path d="M 76 82 L 84 82 L 80 88 Z" fill={C.coral} stroke={C.ink} strokeWidth="2"/>
    </Svg>
  );
}

export default function WordMatchScreen({ navigation }: ScreenProps<'WordMatch'>) {
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const { completeWord } = useProgress();
  const r = ROUNDS[round];

  const pick = async (w: string) => {
    setPicked(w);
    if (w === r.target) {
      await completeWord(w);
      setTimeout(() => {
        if (round < ROUNDS.length - 1) {
          setRound(round + 1);
          setPicked(null);
        } else {
          navigation.navigate('Reward', { from: 'Words', stars: 2 });
        }
      }, 700);
    }
  };

  return (
    <PhoneSafe bg="#E8DCFF">
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}><Text style={s.backT}>←</Text></Pressable>
        <Text style={s.title}>Word Match · {round + 1}/{ROUNDS.length}</Text>
        <View style={{ width: 44 }}/>
      </View>

      <Text style={s.q}>Which word matches?</Text>

      <View style={s.picture}><CatSvg/></View>

      <View style={s.options}>
        {r.options.map(w => {
          const isPicked = picked === w;
          const isRight = isPicked && w === r.target;
          const isWrong = isPicked && w !== r.target;
          return (
            <Pressable key={w} onPress={() => pick(w)}
              style={[s.opt, { backgroundColor: isRight ? C.mint : isWrong ? C.coral : '#fff' }]}>
              <Text style={[s.optT, { color: isPicked ? C.cream : C.ink }]}>{w}</Text>
              {isRight && <Star size={24}/>}
            </Pressable>
          );
        })}
      </View>
    </PhoneSafe>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  back: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', borderWidth: 3, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  backT: { fontSize: 20, fontWeight: '900', color: C.ink },
  title: { flex: 1, textAlign: 'center', fontWeight: '900', fontSize: 18, color: C.ink },
  q: { textAlign: 'center', fontWeight: '800', fontSize: 18, color: C.ink, marginVertical: 10 },
  picture: { margin: 24, height: 200, backgroundColor: C.yellow, borderWidth: 4, borderColor: C.ink, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  options: { paddingHorizontal: 20, gap: 10 },
  opt: { borderWidth: 4, borderColor: C.ink, borderRadius: 20, paddingVertical: 14, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  optT: { fontSize: 28, fontWeight: '900', letterSpacing: 4 },
});
