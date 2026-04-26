// src/screens/ProfileScreen.tsx — kid profile + progress overview
import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import PhoneSafe from '../components/PhoneSafe';
import { Star, Coin } from '../components/Icons';
import { C } from '../theme';
import GameHeader from '../components/GameHeader';
import { useProgress } from '../store/ProgressStore';
import type { ScreenProps } from '../navigation/types';

const AVATARS = [
  { skin: '#FFD9B5', hair: '#5A3A1F' },
  { skin: '#F5C299', hair: '#2D2A4A' },
  { skin: '#E8B38A', hair: '#8B5A2B' },
  { skin: '#FFD9B5', hair: '#E04848' },
  { skin: '#C48E66', hair: '#2D2A4A' },
];

function AvatarSvg({ i, size = 70 }: { i: number; size?: number }) {
  const a = AVATARS[i % AVATARS.length];
  return (
    <Svg width={size} height={size} viewBox="0 0 56 56">
      <Circle cx="28" cy="22" r="12" fill={a.skin} stroke={C.ink} strokeWidth="2.5"/>
      <Path d="M10 56 Q 10 38 28 38 Q 46 38 46 56 Z" fill={C.coral} stroke={C.ink} strokeWidth="2.5"/>
      <Circle cx="23" cy="22" r="2" fill={C.ink}/>
      <Circle cx="33" cy="22" r="2" fill={C.ink}/>
      <Path d="M 23 28 Q 28 31 33 28" stroke={C.ink} strokeWidth="2" fill="none" strokeLinecap="round"/>
      <Path d="M 16 18 Q 18 8 28 8 Q 38 8 40 18 Q 38 14 28 14 Q 18 14 16 18 Z" fill={a.hair} stroke={C.ink} strokeWidth="2"/>
    </Svg>
  );
}

export default function ProfileScreen({ navigation }: ScreenProps<'Profile'>) {
  const { p, update } = useProgress();

  return (
    <PhoneSafe bg="#FFF6E0">
      <GameHeader onBack={() => navigation.goBack()} title="My Profile" />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={s.card}>
          <AvatarSvg i={p.avatar} size={90}/>
          <TextInput
            value={p.name}
            onChangeText={(t) => update({ name: t.slice(0, 12) })}
            style={s.name}
            placeholder="Your name"
          />
          <Text style={s.streakT}>🔥 {p.streak} day streak</Text>
        </View>

        <Text style={s.section}>Pick your character</Text>
        <View style={s.avatars}>
          {AVATARS.map((_, i) => (
            <Pressable key={i} onPress={() => update({ avatar: i })}
              style={[s.avatarBtn, p.avatar === i && s.avatarSel]}>
              <AvatarSvg i={i} size={50}/>
            </Pressable>
          ))}
        </View>

        <Text style={s.section}>Progress</Text>
        <View style={s.stats}>
          <Row icon={<Star size={22}/>} label="Stars" val={p.stars}/>
          <Row icon={<Coin size={22}/>} label="Coins" val={p.coins}/>
          <Row icon={<Text style={{ fontSize: 22 }}>🔤</Text>} label="Letters" val={`${p.lettersCompleted.length}/26`}/>
          <Row icon={<Text style={{ fontSize: 22 }}>🔢</Text>} label="Numbers" val={`${p.numbersCompleted.length}/10`}/>
          <Row icon={<Text style={{ fontSize: 22 }}>📖</Text>} label="Stories" val={p.storiesRead}/>
          <Row icon={<Text style={{ fontSize: 22 }}>🎮</Text>} label="Games" val={Object.values(p.gamesPlayed).reduce((a,b)=>a+b,0)}/>
          <Row icon={<Text style={{ fontSize: 22 }}>🏆</Text>} label="Badges" val={p.badges.length}/>
        </View>
      </ScrollView>
    </PhoneSafe>
  );
}

function Row({ icon, label, val }: { icon: React.ReactNode; label: string; val: React.ReactNode }) {
  return (
    <View style={s.row}>
      <View style={{ width: 30 }}>{icon}</View>
      <Text style={s.rowL}>{label}</Text>
      <Text style={s.rowV}>{val}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  card: { alignItems: 'center', backgroundColor: '#fff', borderWidth: 4, borderColor: C.ink, borderRadius: 24, padding: 16 },
  name: { fontSize: 26, fontWeight: '900', color: C.ink, marginTop: 8, textAlign: 'center', borderBottomWidth: 2, borderColor: C.ink, minWidth: 160, paddingVertical: 4 },
  streakT: { fontSize: 14, fontWeight: '800', color: C.coralDeep, marginTop: 6 },
  section: { fontSize: 14, fontWeight: '900', color: C.inkSoft, marginTop: 20, marginBottom: 8, letterSpacing: 1 },
  avatars: { flexDirection: 'row', justifyContent: 'space-between' },
  avatarBtn: { padding: 6, borderRadius: 999, borderWidth: 3, borderColor: 'transparent' },
  avatarSel: { borderColor: C.coral, backgroundColor: C.yellow },
  stats: { backgroundColor: '#fff', borderWidth: 4, borderColor: C.ink, borderRadius: 20, padding: 10 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#f1e5c8' },
  rowL: { flex: 1, fontSize: 15, fontWeight: '800', color: C.ink, marginLeft: 8 },
  rowV: { fontSize: 16, fontWeight: '900', color: C.coralDeep },
});
