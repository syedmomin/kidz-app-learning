// src/screens/LessonScreen.tsx
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native';
import Svg, { Path, Circle, Text as SvgText } from 'react-native-svg';
import PhoneSafe from '../components/PhoneSafe';
import Mango from '../components/Mango';
import BounceButton from '../components/BounceButton';
import { C } from '../theme';
import type { ScreenProps } from '../navigation/types';
import { useProgress } from '../store/ProgressStore';

export default function LessonScreen({ navigation, route }: ScreenProps<'Lesson'>) {
  const letter = route?.params?.letter || 'B';
  const [paths, setPaths] = useState<string[]>([]);
  const current = useRef<string>('');
  const [strokeCount, setStrokeCount] = useState<number>(0);
  const { completeLetter, touchStreak } = useProgress();

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e: GestureResponderEvent) => {
        const { locationX, locationY } = e.nativeEvent;
        current.current = `M ${locationX} ${locationY}`;
        setPaths((p) => [...p, current.current]);
      },
      onPanResponderMove: (e: GestureResponderEvent, _g: PanResponderGestureState) => {
        const { locationX, locationY } = e.nativeEvent;
        current.current += ` L ${locationX} ${locationY}`;
        setPaths((p) => {
          const n = [...p];
          n[n.length - 1] = current.current;
          return n;
        });
      },
      onPanResponderRelease: () => {
        setStrokeCount((c) => c + 1);
      },
    })
  ).current;

  const clear = () => { setPaths([]); setStrokeCount(0); current.current = ''; };
  const finish = async () => {
    await touchStreak();
    await completeLetter(letter);
    navigation.navigate('Reward', { from: 'Lesson', stars: 3 });
  };

  return (
    <PhoneSafe bg="#FFF3D6">
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.backBtn}><Text style={s.backText}>←</Text></Pressable>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={s.title}>Trace the Letter {letter}</Text>
          <Text style={s.sub}>Strokes: {strokeCount}</Text>
        </View>
        <View style={s.audioBtn}><Text style={{ fontSize: 22 }}>🔊</Text></View>
      </View>

      <View style={s.bubble}>
        <Mango size={56}/>
        <Text style={s.bubbleText}>Use your finger to trace!</Text>
      </View>

      <View style={s.canvas} {...responder.panHandlers}>
        <Svg width="100%" height="100%" viewBox="0 0 300 380">
          <Path d="M 60 40 L 60 280 L 150 280 Q 200 280 200 220 Q 200 175 165 165 Q 195 155 195 110 Q 195 40 145 40 Z M 100 80 L 140 80 Q 160 80 160 110 Q 160 140 140 140 L 100 140 Z M 100 180 L 145 180 Q 170 180 170 215 Q 170 245 145 245 L 100 245 Z"
            fill={C.yellow} fillOpacity="0.3" stroke={C.ink} strokeWidth="4"/>
          <Circle cx="60" cy="40" r="10" fill={C.mint} stroke={C.ink} strokeWidth="3"/>
          <SvgText x="60" y="45" textAnchor="middle" fontSize="12" fontWeight="900" fill={C.ink}>1</SvgText>
        </Svg>
        <Svg style={StyleSheet.absoluteFillObject} pointerEvents="none">
          {paths.map((d, i) => (
            <Path key={i} d={d} stroke={C.coral} strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          ))}
        </Svg>
      </View>

      <View style={s.actions}>
        <Pressable onPress={clear} style={s.smallBtn}><Text style={{ fontSize: 22 }}>🔁</Text></Pressable>
        <BounceButton color={C.mint} shadow={C.mintDeep} big onPress={finish} style={{ flex: 1, marginHorizontal: 10 }}>
          Done ➜
        </BounceButton>
        <View style={s.smallBtn}><Text style={{ fontSize: 22 }}>💡</Text></View>
      </View>
    </PhoneSafe>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  backBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#fff', borderWidth: 3.5, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 22, fontWeight: '900', color: C.ink },
  audioBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: C.yellow, borderWidth: 3.5, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  title: { fontWeight: '900', fontSize: 20, color: C.ink },
  sub: { fontWeight: '700', fontSize: 12, color: C.inkSoft },
  bubble: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 4, borderColor: C.ink, borderRadius: 24, marginHorizontal: 16, padding: 10 },
  bubbleText: { flex: 1, fontWeight: '800', fontSize: 16, color: C.ink, marginLeft: 10 },
  canvas: { flex: 1, margin: 16, backgroundColor: C.cream, borderWidth: 4, borderColor: C.ink, borderRadius: 32, overflow: 'hidden' },
  actions: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  smallBtn: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff', borderWidth: 4, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
});
