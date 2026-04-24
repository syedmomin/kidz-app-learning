// src/screens/RewardScreen.tsx — celebration with persisted stats
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import PhoneSafe from '../components/PhoneSafe';
import BounceButton from '../components/BounceButton';
import { Star, Coin } from '../components/Icons';
import { C } from '../theme';
import { useProgress } from '../store/ProgressStore';
import type { ScreenProps } from '../navigation/types';

const { width } = Dimensions.get('window');

function Confetti() {
  const anims = useRef(Array.from({ length: 20 }, () => new Animated.Value(0))).current;
  useEffect(() => {
    anims.forEach((a, i) => {
      Animated.loop(
        Animated.timing(a, { toValue: 1, duration: 3000 + i * 150, useNativeDriver: true, delay: i * 60 })
      ).start();
    });
  }, []);
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {anims.map((a, i) => {
        const x = (i * 37) % width;
        const ty = a.interpolate({ inputRange: [0, 1], outputRange: [-20, 800] });
        const rot = a.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '720deg'] });
        const cols = [C.coral, C.yellow, C.mint, C.blue, C.purple];
        const col = cols[i % 5];
        return (
          <Animated.View key={i} style={{ position: 'absolute', left: x, transform: [{ translateY: ty }, { rotate: rot }] }}>
            <View style={{ width: 10, height: 14, backgroundColor: col, borderRadius: 2 }}/>
          </Animated.View>
        );
      })}
    </View>
  );
}

export default function RewardScreen({ navigation, route }: ScreenProps<'Reward'>) {
  const from = route?.params?.from || 'activity';
  const earned = route?.params?.stars ?? 3;
  const { p, awardBadge } = useProgress();
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4 }).start();
    awardBadge(`${from}-${Date.now()}`);
  }, []);

  return (
    <PhoneSafe bg="#FFEDC7">
      <Confetti/>
      <View style={s.wrap}>
        <Text style={s.wow}>Hooray! 🎉</Text>
        <Text style={s.msg}>You finished {from}!</Text>

        <Animated.View style={{ transform: [{ scale }] }}>
          <Svg width="180" height="200" viewBox="0 0 180 200">
            <Path d="M 45 40 L 135 40 L 126 120 Q 126 145 90 145 Q 54 145 54 120 Z" fill={C.yellow} stroke={C.ink} strokeWidth="4"/>
            <Path d="M 45 50 Q 20 50 20 80 Q 20 100 48 100" fill="none" stroke={C.ink} strokeWidth="4" strokeLinecap="round"/>
            <Path d="M 135 50 Q 160 50 160 80 Q 160 100 132 100" fill="none" stroke={C.ink} strokeWidth="4" strokeLinecap="round"/>
            <G transform="translate(90,88)">
              <Path d="M0,-24 L7,-7 L25,-5 L11,6 L15,24 L0,14 L-15,24 L-11,6 L-25,-5 L-7,-7 Z" fill={C.cream} stroke={C.ink} strokeWidth="3"/>
            </G>
          </Svg>
        </Animated.View>

        <View style={s.stats}>
          <View style={s.stat}><Star size={32}/><Text style={s.statT}>+{earned}</Text><Text style={s.statL}>Stars</Text></View>
          <View style={s.stat}><Coin size={32}/><Text style={s.statT}>+{Math.ceil(earned/2)}</Text><Text style={s.statL}>Coins</Text></View>
          <View style={s.stat}><Text style={{ fontSize: 32 }}>🏆</Text><Text style={s.statT}>{p.badges.length}</Text><Text style={s.statL}>Badges</Text></View>
        </View>

        <View style={s.totals}>
          <Text style={s.totalT}>Total: ⭐ {p.stars} • 🪙 {p.coins} • 🔥 {p.streak}d</Text>
        </View>

        <View style={s.actions}>
          <BounceButton color={C.cream} shadow={C.ink} onPress={() => navigation.navigate('Explore')}>🏠 Home</BounceButton>
          <BounceButton color={C.mint} shadow={C.mintDeep} big onPress={() => navigation.goBack()}>Again ▶</BounceButton>
        </View>
      </View>
    </PhoneSafe>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  wow: { fontSize: 42, fontWeight: '900', color: C.coral },
  msg: { fontSize: 18, fontWeight: '800', color: C.ink, marginBottom: 16 },
  stats: { flexDirection: 'row', gap: 18, marginTop: 18 },
  stat: { alignItems: 'center', backgroundColor: '#fff', borderWidth: 4, borderColor: C.ink, borderRadius: 20, padding: 12, minWidth: 80 },
  statT: { fontSize: 22, fontWeight: '900', color: C.ink, marginTop: 4 },
  statL: { fontSize: 12, fontWeight: '700', color: C.inkSoft },
  totals: { marginTop: 14, backgroundColor: C.cream, borderWidth: 3, borderColor: C.ink, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 6 },
  totalT: { fontWeight: '800', fontSize: 13, color: C.ink },
  actions: { flexDirection: 'row', gap: 12, marginTop: 22 },
});
