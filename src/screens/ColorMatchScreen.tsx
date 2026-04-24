// src/screens/ColorMatchScreen.tsx — pick a color, tap a shape
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path, Rect, Circle, Ellipse } from 'react-native-svg';
import PhoneSafe from '../components/PhoneSafe';
import { KButton } from '../components/ui';
import { C } from '../theme';
import Mango from '../components/Mango';
import { useProgress } from '../store/ProgressStore';
import type { ScreenProps } from '../navigation/types';

const ITEMS = [
  { id: 'apple', target: C.coral, label: 'Apple' },
  { id: 'sun',   target: C.yellow, label: 'Sun' },
  { id: 'leaf',  target: C.mint,   label: 'Leaf' },
];
const PALETTE = [C.coral, C.yellow, C.blue, C.mint, C.purple];

function ShapeSvg({ id, fill }: { id: string; fill: string }) {
  if (id === 'apple') return (
    <Svg width="76" height="80" viewBox="0 0 76 80">
      <Path d="M 10 30 Q 10 10 38 10 Q 66 10 66 30 Q 66 68 38 76 Q 10 68 10 30 Z" fill={fill} stroke={C.ink} strokeWidth="3.5"/>
    </Svg>
  );
  if (id === 'sun') return (
    <Svg width="76" height="80" viewBox="0 0 76 80">
      {Array.from({ length: 8 }).map((_, i) => (
        <Rect key={i} x="36" y="6" width="4" height="12" fill={fill} stroke={C.ink} strokeWidth="2" transform={`rotate(${i * 45} 38 40)`}/>
      ))}
      <Circle cx="38" cy="40" r="20" fill={fill} stroke={C.ink} strokeWidth="3.5"/>
    </Svg>
  );
  return (
    <Svg width="76" height="80" viewBox="0 0 76 80">
      <Path d="M 38 8 Q 8 30 14 56 Q 30 74 38 76 Q 46 74 62 56 Q 68 30 38 8 Z" fill={fill} stroke={C.ink} strokeWidth="3.5"/>
    </Svg>
  );
}

export default function ColorMatchScreen({ navigation }: ScreenProps<'ColorMatch'>) {
  const [picked, setPicked] = useState<string | null>(null);
  const [filled, setFilled] = useState<Record<string, string>>({});
  const { update, addStars, addCoins, p } = useProgress();

  const allDone = ITEMS.every(it => filled[it.id] === it.target);

  const tapShape = (id: string) => {
    if (!picked) return;
    setFilled({ ...filled, [id]: picked });
    setPicked(null);
  };

  const finish = async () => {
    if (!allDone) return;
    if (!p.colorsCompleted) await update({ colorsCompleted: true });
    await addStars(3);
    await addCoins(2);
    navigation.navigate('Reward', { from: 'Colors', stars: 3 });
  };

  return (
    <PhoneSafe bg="#FFF6E0">
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}><Text style={s.backT}>←</Text></Pressable>
        <Text style={s.title}>Color Match</Text>
        <View style={{ width: 44 }}/>
      </View>

      <View style={s.hint}>
        <Mango size={56}/>
        <Text style={s.hintT}>Tap paint, then tap shape!</Text>
      </View>

      <View style={s.targets}>
        {ITEMS.map(it => (
          <Pressable key={it.id} onPress={() => tapShape(it.id)} style={s.target}>
            <ShapeSvg id={it.id} fill={filled[it.id] || '#E8DDC7'}/>
            <Text style={s.targetL}>{it.label}</Text>
            {filled[it.id] === it.target && <Text style={{ fontSize: 18 }}>✓</Text>}
          </Pressable>
        ))}
      </View>

      <View style={s.palette}>
        <Text style={s.paletteL}>YOUR PAINT</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          {PALETTE.map((col) => (
            <Pressable key={col} onPress={() => setPicked(col)}
              style={[s.dot, { backgroundColor: col, transform: picked === col ? [{ scale: 1.2 }] : [{ scale: 1 }] }]}/>
          ))}
        </View>
      </View>

      <View style={{ padding: 16 }}>
        <KButton color={allDone ? C.mint : C.blue} shadowColor={allDone ? C.mintDeep : C.blueDeep} size="lg" fullWidth onPress={finish} style={{ alignSelf: 'stretch' }}>
          {allDone ? 'Done ✓' : 'Keep going...'}
        </KButton>
      </View>
    </PhoneSafe>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  back: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', borderWidth: 3, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  backT: { fontSize: 20, fontWeight: '900', color: C.ink },
  title: { flex: 1, textAlign: 'center', fontWeight: '900', fontSize: 20, color: C.ink },
  hint: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 4, borderColor: C.ink, borderRadius: 24, margin: 16, padding: 10 },
  hintT: { flex: 1, marginLeft: 10, fontWeight: '800', fontSize: 16, color: C.ink },
  targets: { flexDirection: 'row', justifyContent: 'space-around', padding: 16 },
  target: { alignItems: 'center', backgroundColor: '#fff', borderWidth: 4, borderColor: C.ink, borderRadius: 20, padding: 10, width: 100 },
  targetL: { fontWeight: '800', fontSize: 14, color: C.ink, marginTop: 4 },
  palette: { backgroundColor: C.cream, borderWidth: 4, borderColor: C.ink, borderRadius: 28, margin: 16, padding: 14 },
  paletteL: { textAlign: 'center', fontWeight: '700', fontSize: 11, color: C.inkSoft, letterSpacing: 1, marginBottom: 8 },
  dot: { width: 48, height: 48, borderRadius: 24, borderWidth: 4, borderColor: C.ink },
});
