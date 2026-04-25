// src/screens/WordMatchScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect, Polygon } from 'react-native-svg';
import PhoneSafe from '../components/PhoneSafe';
import { C } from '../theme';
import { useProgress } from '../store/ProgressStore';
import type { ScreenProps } from '../navigation/types';

const TOTAL = 30;

// ─── SVG illustrations ────────────────────────────────────────────────────────

const SvgCat   = () => <Svg width="140" height="140" viewBox="0 0 160 160"><Ellipse cx="80" cy="115" rx="52" ry="38" fill={C.cream} stroke={C.ink} strokeWidth="4"/><Circle cx="80" cy="72" r="40" fill={C.cream} stroke={C.ink} strokeWidth="4"/><Path d="M 48 52 L 40 22 L 68 40 Z" fill={C.cream} stroke={C.ink} strokeWidth="4"/><Path d="M 112 52 L 120 22 L 92 40 Z" fill={C.cream} stroke={C.ink} strokeWidth="4"/><Ellipse cx="66" cy="70" rx="5" ry="7" fill={C.ink}/><Ellipse cx="94" cy="70" rx="5" ry="7" fill={C.ink}/><Path d="M 76 84 L 84 84 L 80 90 Z" fill={C.coral} stroke={C.ink} strokeWidth="2"/></Svg>;

const SvgSun   = () => <Svg width="140" height="140" viewBox="0 0 160 160"><Circle cx="80" cy="80" r="34" fill={C.yellow} stroke={C.ink} strokeWidth="4"/>{[0,45,90,135,180,225,270,315].map((a,i)=>{const r=a*Math.PI/180,x1=80+40*Math.cos(r),y1=80+40*Math.sin(r),x2=80+58*Math.cos(r),y2=80+58*Math.sin(r);return<Path key={i} d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke={C.ink} strokeWidth="5" strokeLinecap="round"/>;})}</Svg>;

const SvgBus   = () => <Svg width="140" height="140" viewBox="0 0 160 160"><Rect x="10" y="55" width="140" height="72" rx="12" fill={C.blue} stroke={C.ink} strokeWidth="4"/><Rect x="20" y="65" width="32" height="25" rx="4" fill="#fff" stroke={C.ink} strokeWidth="3"/><Rect x="64" y="65" width="32" height="25" rx="4" fill="#fff" stroke={C.ink} strokeWidth="3"/><Rect x="108" y="65" width="32" height="25" rx="4" fill="#fff" stroke={C.ink} strokeWidth="3"/><Circle cx="38" cy="134" r="14" fill={C.ink}/><Circle cx="38" cy="134" r="7" fill="#aaa"/><Circle cx="122" cy="134" r="14" fill={C.ink}/><Circle cx="122" cy="134" r="7" fill="#aaa"/><Rect x="10" y="55" width="140" height="12" rx="6" fill={C.yellow} stroke={C.ink} strokeWidth="3"/></Svg>;

const SvgDog   = () => <Svg width="140" height="140" viewBox="0 0 160 160"><Ellipse cx="80" cy="115" rx="52" ry="38" fill="#E8C98A" stroke={C.ink} strokeWidth="4"/><Circle cx="80" cy="72" r="42" fill="#E8C98A" stroke={C.ink} strokeWidth="4"/><Ellipse cx="46" cy="52" rx="16" ry="30" fill="#C8A870" stroke={C.ink} strokeWidth="4"/><Ellipse cx="114" cy="52" rx="16" ry="30" fill="#C8A870" stroke={C.ink} strokeWidth="4"/><Ellipse cx="80" cy="88" rx="26" ry="18" fill="#C8A870" stroke={C.ink} strokeWidth="3"/><Circle cx="65" cy="65" r="8" fill={C.ink}/><Circle cx="95" cy="65" r="8" fill={C.ink}/><Ellipse cx="80" cy="82" rx="8" ry="5" fill={C.ink}/></Svg>;

const SvgTree  = () => <Svg width="140" height="140" viewBox="0 0 160 160"><Rect x="66" y="110" width="28" height="38" fill="#8B5E3C" stroke={C.ink} strokeWidth="4"/><Polygon points="80,10 130,110 30,110" fill={C.mint} stroke={C.ink} strokeWidth="4"/><Polygon points="80,28 118,95 42,95" fill="#5CB87A" stroke={C.ink} strokeWidth="3"/></Svg>;

const SvgFish  = () => <Svg width="140" height="140" viewBox="0 0 160 160"><Ellipse cx="75" cy="80" rx="58" ry="36" fill={C.blue} stroke={C.ink} strokeWidth="4"/><Path d="M 130,80 L 158,55 L 158,105 Z" fill={C.blue} stroke={C.ink} strokeWidth="4"/><Circle cx="38" cy="70" r="12" fill="#fff" stroke={C.ink} strokeWidth="3"/><Circle cx="36" cy="68" r="5" fill={C.ink}/></Svg>;

const SvgStar  = () => <Svg width="140" height="140" viewBox="0 0 160 160"><Polygon points="80,10 96,55 145,58 108,88 120,135 80,108 40,135 52,88 15,58 64,55" fill={C.yellow} stroke={C.ink} strokeWidth="4"/></Svg>;

const SvgApple = () => <Svg width="140" height="140" viewBox="0 0 160 160"><Path d="M 28 72 Q 28 30 80 30 Q 132 30 132 72 Q 132 138 80 148 Q 28 138 28 72 Z" fill={C.coral} stroke={C.ink} strokeWidth="4"/><Path d="M 80 30 Q 76 14 66 10" stroke={C.ink} strokeWidth="4" fill="none" strokeLinecap="round"/><Ellipse cx="90" cy="20" rx="12" ry="6" fill={C.mint} stroke={C.ink} strokeWidth="3"/></Svg>;

const SvgBall  = () => <Svg width="140" height="140" viewBox="0 0 160 160"><Circle cx="80" cy="80" r="65" fill={C.coral} stroke={C.ink} strokeWidth="4"/><Path d="M 80,15 Q 110,80 80,145" stroke={C.ink} strokeWidth="3" fill="none"/><Path d="M 15,80 Q 80,110 145,80" stroke={C.ink} strokeWidth="3" fill="none"/></Svg>;

const SvgHouse = () => <Svg width="140" height="140" viewBox="0 0 160 160"><Rect x="28" y="82" width="104" height="74" rx="4" fill={C.cream} stroke={C.ink} strokeWidth="4"/><Path d="M 10,86 L 80,20 L 150,86 Z" fill={C.coral} stroke={C.ink} strokeWidth="4"/><Rect x="62" y="112" width="36" height="44" rx="4" fill="#8B5E3C" stroke={C.ink} strokeWidth="3"/><Rect x="36" y="96" width="30" height="26" rx="4" fill="#AEE6F8" stroke={C.ink} strokeWidth="3"/><Rect x="94" y="96" width="30" height="26" rx="4" fill="#AEE6F8" stroke={C.ink} strokeWidth="3"/></Svg>;

const SvgMoon  = () => <Svg width="140" height="140" viewBox="0 0 160 160"><Path d="M85,18 A60,60 0 1 0 85,142 A40,40 0 1 1 85,18 Z" fill={C.yellow} stroke={C.ink} strokeWidth="4"/></Svg>;

// ─── Round bank ───────────────────────────────────────────────────────────────

interface Round { word: string; options: string[]; Illus: () => React.ReactNode; bg: string }

const BANK: Round[] = [
  { word:'CAT',   options:['CAT','BAT','COT','CUT'],    Illus:SvgCat,   bg:'#FFF8EC' },
  { word:'SUN',   options:['SUN','BUN','SIN','GUN'],    Illus:SvgSun,   bg:'#FFF9C4' },
  { word:'BUS',   options:['BUS','BUN','BOX','BUT'],    Illus:SvgBus,   bg:'#E3F2FD' },
  { word:'DOG',   options:['DOG','LOG','FOG','DIG'],    Illus:SvgDog,   bg:'#FFF0E0' },
  { word:'TREE',  options:['TREE','FREE','KNEE','SEE'], Illus:SvgTree,  bg:'#E8F5E9' },
  { word:'FISH',  options:['FISH','FIST','DISH','WISH'],Illus:SvgFish,  bg:'#E3F2FD' },
  { word:'STAR',  options:['STAR','SCAR','STIR','STAY'],Illus:SvgStar,  bg:'#FFFDE7' },
  { word:'APPLE', options:['APPLE','AMPLE','ABLE','ANKLE'],Illus:SvgApple,bg:'#FFEBEE'},
  { word:'BALL',  options:['BALL','TALL','FALL','BELL'],Illus:SvgBall,  bg:'#FFE0E0' },
  { word:'HOUSE', options:['HOUSE','MOUSE','HORSE','LOUSE'],Illus:SvgHouse,bg:'#F3E5F5'},
  { word:'MOON',  options:['MOON','NOON','BOON','MOAN'],Illus:SvgMoon,  bg:'#E8EAF6' },
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

function buildRounds(): Round[] {
  const result: Round[] = [];
  while (result.length < TOTAL) result.push(...shuffle(BANK));
  return result.slice(0, TOTAL);
}

const ROUNDS = buildRounds();

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function WordMatchScreen({ navigation }: ScreenProps<'WordMatch'>) {
  const [idx,    setIdx]    = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score,  setScore]  = useState(0);
  const { completeWord } = useProgress();

  const round       = ROUNDS[idx];
  const optionsRef  = useRef<string[]>(shuffle(round.options));
  const shake       = useRef(new Animated.Value(0)).current;
  const slideIn     = useRef(new Animated.Value(300)).current;
  const illusBounce = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    slideIn.setValue(300);
    Animated.spring(slideIn, { toValue: 0, tension: 55, friction: 11, useNativeDriver: true }).start();
    optionsRef.current = shuffle(round.options);
  }, [idx]);

  const doShake = () => Animated.sequence([
    Animated.timing(shake, { toValue: 14,  duration: 55, useNativeDriver: true }),
    Animated.timing(shake, { toValue: -14, duration: 55, useNativeDriver: true }),
    Animated.timing(shake, { toValue: 8,   duration: 55, useNativeDriver: true }),
    Animated.timing(shake, { toValue: 0,   duration: 55, useNativeDriver: true }),
  ]).start();

  const doBounce = () => Animated.sequence([
    Animated.spring(illusBounce, { toValue: 1.15, tension: 200, friction: 5, useNativeDriver: true }),
    Animated.spring(illusBounce, { toValue: 1,    tension: 200, friction: 8, useNativeDriver: true }),
  ]).start();

  const advance = (sc: number) => {
    if (idx + 1 >= TOTAL) {
      navigation.navigate('Reward', { from: 'WordMatch', stars: sc >= 25 ? 3 : sc >= 18 ? 2 : 1 });
      return;
    }
    setIdx(i => i + 1);
    setPicked(null);
    illusBounce.setValue(1);
  };

  const pick = async (w: string) => {
    if (picked !== null) return;
    setPicked(w);
    if (w === round.word) {
      const ns = score + 1;
      setScore(ns);
      doBounce();
      await completeWord(w);
      setTimeout(() => advance(ns), 1200);
    } else {
      doShake();
      setTimeout(() => advance(score), 1600);
    }
  };

  const isCorrect = picked === round.word;
  const optBg  = (w: string) => { if (!picked) return '#fff'; if (w === round.word) return C.mint; if (w === picked) return C.coral; return '#fff'; };
  const optClr = (w: string) => (!picked || (w !== round.word && w !== picked)) ? C.ink : '#fff';

  return (
    <PhoneSafe bg="#F0EAFF">
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}><Text style={s.backT}>←</Text></Pressable>
        <Text style={s.title}>Word Match</Text>
        <View style={s.scorePill}><Text style={s.scoreT}>⭐ {score}</Text></View>
      </View>

      <View style={s.progressBar}>
        <View style={[s.progressFill, { width: `${(idx / TOTAL) * 100}%` }]}/>
      </View>

      <Text style={s.prompt}>Which word matches the picture?</Text>

      <Animated.View style={[s.illusBox, { backgroundColor: round.bg, transform: [{ translateX: slideIn }, { translateX: shake }, { scale: illusBounce }] }]}>
        {round.Illus()}
      </Animated.View>

      <View style={s.optGrid}>
        {optionsRef.current.map(w => (
          <Pressable key={w} onPress={() => pick(w)} disabled={picked !== null}
            style={({ pressed }) => [s.opt, { backgroundColor: optBg(w), borderColor: picked && w === round.word ? C.mintDeep : picked === w ? C.coralDeep : C.ink, transform: [{ scale: pressed && !picked ? 0.93 : 1 }] }]}>
            <Text style={[s.optT, { color: optClr(w) }]}>{w}</Text>
            {picked && w === round.word && <Text style={s.mark}>✓</Text>}
            {picked === w && w !== round.word && <Text style={s.mark}>✗</Text>}
          </Pressable>
        ))}
      </View>

      {picked && (
        <Text style={[s.feedback, { color: isCorrect ? C.mintDeep : C.coralDeep }]}>
          {isCorrect ? '🎉 Correct!' : `❌ It's "${round.word}"`}
        </Text>
      )}
    </PhoneSafe>
  );
}

const s = StyleSheet.create({
  header:       { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  back:         { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', borderWidth: 3, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  backT:        { fontSize: 20, fontWeight: '900', color: C.ink },
  title:        { flex: 1, textAlign: 'center', fontWeight: '900', fontSize: 20, color: C.ink },
  scorePill:    { backgroundColor: C.yellow, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 3, borderColor: C.ink },
  scoreT:       { fontWeight: '900', fontSize: 13, color: C.ink },
  progressBar:  { height: 12, marginHorizontal: 20, backgroundColor: '#fff', borderRadius: 7, borderWidth: 3, borderColor: C.ink, overflow: 'hidden', marginBottom: 4 },
  progressFill: { height: '100%', backgroundColor: C.purple, borderRadius: 5 },
  prompt:       { textAlign: 'center', fontWeight: '900', fontSize: 18, color: C.ink, marginTop: 12, marginBottom: 10 },
  illusBox:     { alignSelf: 'center', width: 190, height: 190, borderRadius: 28, borderWidth: 4, borderColor: C.ink, alignItems: 'center', justifyContent: 'center', marginBottom: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 6 },
  optGrid:      { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, paddingHorizontal: 20 },
  opt:          { width: '44%', paddingVertical: 14, borderRadius: 18, borderWidth: 3.5, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  optT:         { fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  mark:         { fontSize: 18, fontWeight: '900' },
  feedback:     { textAlign: 'center', fontWeight: '900', fontSize: 16, marginTop: 14 },
});
