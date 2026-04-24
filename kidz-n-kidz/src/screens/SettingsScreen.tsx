// src/screens/SettingsScreen.tsx — parent area
import React from 'react';
import { View, Text, StyleSheet, Pressable, Switch, Alert, ScrollView } from 'react-native';
import PhoneSafe from '../components/PhoneSafe';
import { C } from '../theme';
import { useProgress } from '../store/ProgressStore';
import type { ScreenProps } from '../navigation/types';

export default function SettingsScreen({ navigation }: ScreenProps<'Settings'>) {
  const { p, update, reset } = useProgress();

  const confirmReset = () => {
    Alert.alert('Reset progress?', 'This will erase stars, badges, and all progress.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => { reset(); navigation.navigate('Splash'); } },
    ]);
  };

  return (
    <PhoneSafe bg="#F0EBFF">
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}><Text style={s.backT}>←</Text></Pressable>
        <Text style={s.title}>Settings</Text>
        <View style={{ width: 44 }}/>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={s.section}>SOUND</Text>
        <View style={s.card}>
          <Row label="🔊 Sound effects" value={p.soundOn} onChange={(v) => update({ soundOn: v })}/>
          <Row label="🎵 Background music" value={p.musicOn} onChange={(v) => update({ musicOn: v })}/>
        </View>

        <Text style={s.section}>ABOUT</Text>
        <View style={s.card}>
          <Info label="Version" value="1.0.0"/>
          <Info label="Ages" value="3 – 8"/>
          <Info label="Made with" value="❤️ for kids"/>
        </View>

        <Text style={s.section}>DANGER ZONE</Text>
        <Pressable onPress={confirmReset} style={s.danger}>
          <Text style={s.dangerT}>Reset all progress</Text>
        </Pressable>
      </ScrollView>
    </PhoneSafe>
  );
}

function Row({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={s.row}>
      <Text style={s.rowL}>{label}</Text>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: C.mint, false: '#ddd' }} thumbColor={value ? C.mintDeep : '#fff'}/>
    </View>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.row}>
      <Text style={s.rowL}>{label}</Text>
      <Text style={s.rowV}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  back: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', borderWidth: 3, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  backT: { fontSize: 20, fontWeight: '900', color: C.ink },
  title: { flex: 1, textAlign: 'center', fontWeight: '900', fontSize: 22, color: C.ink },
  section: { fontSize: 12, fontWeight: '900', color: C.inkSoft, marginTop: 16, marginBottom: 8, letterSpacing: 1 },
  card: { backgroundColor: '#fff', borderWidth: 4, borderColor: C.ink, borderRadius: 20, padding: 6 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 10, borderBottomWidth: 1, borderColor: '#eee' },
  rowL: { flex: 1, fontSize: 15, fontWeight: '700', color: C.ink },
  rowV: { fontSize: 15, fontWeight: '800', color: C.inkSoft },
  danger: { backgroundColor: C.coral, borderWidth: 4, borderColor: C.ink, borderRadius: 16, padding: 14, alignItems: 'center' },
  dangerT: { color: C.cream, fontWeight: '900', fontSize: 16 },
});
