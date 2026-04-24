// src/screens/MiniGamesScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import PhoneSafe from '../components/PhoneSafe';
import { C } from '../theme';
import { Star } from '../components/Icons';
import { useProgress } from '../store/ProgressStore';
import type { ScreenProps } from '../navigation/types';

const GAMES = [
  { id: 'puzzle', name: 'Shape Puzzle', color: C.coral, shadow: C.coralDeep, icon: '🧩' },
  { id: 'memory', name: 'Memory Match', color: C.blue, shadow: C.blueDeep, icon: '🃏' },
  { id: 'paint', name: 'Free Paint', color: C.purple, shadow: C.purpleDeep, icon: '🎨' },
  { id: 'music', name: 'Music Maker', color: C.mint, shadow: C.mintDeep, icon: '🎵' },
  { id: 'maze', name: 'Mango Maze', color: C.yellow, shadow: C.yellowDeep, icon: '🗺️' },
  { id: 'circus', name: 'Circus Count', color: C.coral, shadow: C.coralDeep, icon: '🎪' },
];

export default function MiniGamesScreen({ navigation }: ScreenProps<'Games'>) {
  const { p, playGame } = useProgress();

  const open = async (id: string) => {
    await playGame(id);
    navigation.navigate('Reward', { from: 'Games', stars: 1 });
  };

  return (
    <PhoneSafe bg="#FFE0E0">
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}><Text style={s.backT}>←</Text></Pressable>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>Mini Games</Text>
          <Text style={s.sub}>Pick a game to play!</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.grid}>
        {GAMES.map(g => (
          <Pressable key={g.id} onPress={() => open(g.id)} style={[s.card, { backgroundColor: g.color }]}>
            <View style={[s.shadow, { backgroundColor: g.shadow }]}/>
            <View style={s.icon}><Text style={{ fontSize: 34 }}>{g.icon}</Text></View>
            <Text style={s.name}>{g.name}</Text>
            <View style={{ flexDirection: 'row', gap: 2 }}>
              {[1,2,3].map(i => <Star key={i} size={14} color={i <= (p.gamesPlayed[g.id] || 0) ? C.cream : 'rgba(255,255,255,0.3)'}/>)}
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </PhoneSafe>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  back: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', borderWidth: 3, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  backT: { fontSize: 20, fontWeight: '900', color: C.ink },
  title: { fontWeight: '900', fontSize: 24, color: C.ink },
  sub: { fontWeight: '700', fontSize: 12, color: C.inkSoft },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: 14 },
  card: { width: '48%', borderWidth: 4, borderColor: C.ink, borderRadius: 22, padding: 14, marginBottom: 14, minHeight: 140, position: 'relative' },
  shadow: { position: 'absolute', left: -4, right: -4, bottom: -10, height: 10, borderRadius: 22, zIndex: -1 },
  icon: { width: 54, height: 54, borderRadius: 16, backgroundColor: C.cream, borderWidth: 3, borderColor: C.ink, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  name: { fontSize: 16, fontWeight: '900', color: C.ink, marginBottom: 6 },
});
