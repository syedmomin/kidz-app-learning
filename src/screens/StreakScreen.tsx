// src/screens/StreakScreen.tsx — daily streak calendar view
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PhoneSafe from '../components/PhoneSafe';
import { C } from '../theme';
import GameHeader from '../components/GameHeader';
import { useProgress } from '../store/ProgressStore';
import type { ScreenProps } from '../navigation/types';

export default function StreakScreen({ navigation }: ScreenProps<'Streak'>) {
  const { p } = useProgress();
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date().getDay(); // 0=Sun
  const todayIdx = (today + 6) % 7;

  return (
    <PhoneSafe bg="#FFE9B0">
      <GameHeader onBack={() => navigation.goBack()} title="My Streak" />

      <View style={s.hero}>
        <Text style={s.fire}>🔥</Text>
        <Text style={s.big}>{p.streak}</Text>
        <Text style={s.bigL}>day streak</Text>
      </View>

      <Text style={s.section}>This week</Text>
      <View style={s.week}>
        {days.map((d, i) => {
          const done = i <= todayIdx && i >= todayIdx - (p.streak - 1);
          const isToday = i === todayIdx;
          return (
            <View key={d} style={[s.day, done && { backgroundColor: C.coral }, isToday && { borderWidth: 4, borderColor: C.yellow }]}>
              <Text style={[s.dayL, done && { color: C.cream }]}>{d[0]}</Text>
              <Text style={{ fontSize: 18 }}>{done ? '🔥' : '⚪️'}</Text>
            </View>
          );
        })}
      </View>

      <View style={s.info}>
        <Text style={s.infoT}>Play every day to keep your streak alive!{'\n'}Miss a day and it resets.</Text>
      </View>
    </PhoneSafe>
  );
}

const s = StyleSheet.create({
  hero: { alignItems: 'center', padding: 22, backgroundColor: C.coral, margin: 16, borderWidth: 4, borderColor: C.ink, borderRadius: 28 },
  fire: { fontSize: 60 },
  big: { fontSize: 80, fontWeight: '900', color: C.cream, lineHeight: 88 },
  bigL: { fontSize: 18, fontWeight: '800', color: C.cream },
  section: { fontSize: 14, fontWeight: '900', color: C.inkSoft, marginLeft: 20, letterSpacing: 1 },
  week: { flexDirection: 'row', justifyContent: 'space-around', padding: 12 },
  day: { width: 40, height: 60, backgroundColor: '#fff', borderWidth: 3, borderColor: C.ink, borderRadius: 14, alignItems: 'center', justifyContent: 'center', gap: 4 },
  dayL: { fontWeight: '900', fontSize: 14, color: C.ink },
  info: { backgroundColor: C.cream, borderWidth: 3, borderColor: C.ink, borderRadius: 20, margin: 16, padding: 14 },
  infoT: { textAlign: 'center', fontWeight: '700', fontSize: 14, color: C.ink, lineHeight: 20 },
});
