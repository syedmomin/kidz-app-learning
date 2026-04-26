// src/screens/CategoryScreen.tsx — Letters A–Z library, real progress-driven
import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import PhoneSafe from '../components/PhoneSafe';
import { C } from '../theme';
import GameHeader from '../components/GameHeader';
import { Star } from '../components/Icons';
import { useProgress } from '../store/ProgressStore';
import type { ScreenProps } from '../navigation/types';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const TILE_COLORS = [C.coral, C.blue, C.yellow, C.mint, C.purple];

export default function CategoryScreen({ navigation }: ScreenProps<'Category'>) {
  const { p } = useProgress();
  const next = LETTERS.find((l) => !p.lettersCompleted.includes(l)) || 'A';

  return (
    <PhoneSafe bg="#FFE9DC">
      <GameHeader
        onBack={() => navigation.goBack()}
        title="Letters"
        subtitle={`${p.lettersCompleted.length} / 26 learned`}
        right={<View style={s.stars}><Star size={18}/><Text style={s.starsT}>{p.stars}</Text></View>}
      />

      <Pressable onPress={() => navigation.navigate('Lesson', { letter: next })} style={s.banner}>
        <View style={{ flex: 1 }}>
          <Text style={s.bSmall}>CONTINUE</Text>
          <Text style={s.bBig}>Letter {next}</Text>
          <Text style={s.bSmall}>Tap to start</Text>
        </View>
        <View style={s.resume}><Text style={s.resumeT}>Play ▶</Text></View>
      </Pressable>

      <ScrollView contentContainerStyle={s.grid}>
        {LETTERS.map((L, i) => {
          const done = p.lettersCompleted.includes(L);
          const locked = !done && L !== next && i > LETTERS.indexOf(next);
          const col = TILE_COLORS[i % TILE_COLORS.length];
          return (
            <Pressable key={L} disabled={locked} onPress={() => navigation.navigate('Lesson', { letter: L })}
              style={[s.tile, { backgroundColor: locked ? '#E8E0D0' : (done ? col : '#fff'), borderColor: locked ? C.inkSoft : C.ink, opacity: locked ? 0.6 : 1 }]}>
              <Text style={[s.tileL, { color: locked ? C.inkSoft : (done ? C.cream : C.ink) }]}>{L}</Text>
              {done && <View style={s.tileStar}><Star size={18}/></View>}
              {locked && <Text style={{ position: 'absolute', bottom: 4, right: 6, fontSize: 11 }}>🔒</Text>}
              {L === next && !done && <View style={s.nowTag}><Text style={s.nowT}>NOW</Text></View>}
            </Pressable>
          );
        })}
      </ScrollView>
    </PhoneSafe>
  );
}

const s = StyleSheet.create({
  stars: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 3, borderColor: C.ink, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  starsT: { fontWeight: '900', fontSize: 14, color: C.ink, marginLeft: 4 },
  banner: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.coral, borderWidth: 4, borderColor: C.ink, borderRadius: 24, margin: 14, padding: 14 },
  bSmall: { color: C.cream, fontWeight: '700', fontSize: 12, opacity: 0.9 },
  bBig: { color: C.cream, fontWeight: '900', fontSize: 22 },
  resume: { backgroundColor: C.cream, borderWidth: 3, borderColor: C.ink, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8 },
  resumeT: { fontWeight: '900', fontSize: 14, color: C.ink },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 14, paddingBottom: 30 },
  tile: { width: '18%', aspectRatio: 1, borderWidth: 3, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 10, position: 'relative' },
  tileL: { fontWeight: '900', fontSize: 26 },
  tileStar: { position: 'absolute', top: -6, right: -6 },
  nowTag: { position: 'absolute', bottom: -6, backgroundColor: C.yellow, borderWidth: 2, borderColor: C.ink, borderRadius: 999, paddingHorizontal: 6, paddingVertical: 1 },
  nowT: { fontSize: 9, fontWeight: '900', color: C.ink },
});
