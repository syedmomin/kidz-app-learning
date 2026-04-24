import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, useWindowDimensions } from 'react-native';
import { KButton } from '../components/ui';
import { C } from '../theme';
import type { ScreenProps } from '../navigation/types';
import Svg, { Circle, Path, Ellipse, Rect, G, Defs, RadialGradient, Stop } from 'react-native-svg';

function FullBackground({ width, height }: { width: number; height: number }) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={StyleSheet.absoluteFillObject}
    >
      <Defs>
        <RadialGradient id="sky" cx="50%" cy="25%" r="80%">
          <Stop offset="0%" stopColor="#E8F6FF" />
          <Stop offset="50%" stopColor="#C2E8FF" />
          <Stop offset="100%" stopColor="#85CFFF" />
        </RadialGradient>
      </Defs>

      {/* Full background */}
      <Rect width={width} height={height} fill="url(#sky)" />

      {/* Sun top-right */}
      <Circle cx={width * 0.82} cy={height * 0.10} r={52} fill="#FFE566" opacity="0.9" />
      <Circle cx={width * 0.82} cy={height * 0.10} r={38} fill="#FFCD2E" />

      {/* Sun rays */}
      {[0,45,90,135,180,225,270,315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = width * 0.82 + Math.cos(rad) * 56;
        const y1 = height * 0.10 + Math.sin(rad) * 56;
        const x2 = width * 0.82 + Math.cos(rad) * 72;
        const y2 = height * 0.10 + Math.sin(rad) * 72;
        return <Path key={i} d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke="#FFE566" strokeWidth="6" strokeLinecap="round" />;
      })}

      {/* Rainbow arc */}
      <Path d={`M ${width*0.05} ${height*0.72} Q ${width*0.5} ${height*0.28} ${width*0.95} ${height*0.72}`}
        stroke="#FF6B6B" strokeWidth="14" fill="none" opacity="0.35" strokeLinecap="round" />
      <Path d={`M ${width*0.08} ${height*0.74} Q ${width*0.5} ${height*0.32} ${width*0.92} ${height*0.74}`}
        stroke="#FFE566" strokeWidth="12" fill="none" opacity="0.35" strokeLinecap="round" />
      <Path d={`M ${width*0.11} ${height*0.76} Q ${width*0.5} ${height*0.36} ${width*0.89} ${height*0.76}`}
        stroke="#7BE0AD" strokeWidth="10" fill="none" opacity="0.35" strokeLinecap="round" />
      <Path d={`M ${width*0.14} ${height*0.78} Q ${width*0.5} ${height*0.40} ${width*0.86} ${height*0.78}`}
        stroke="#3FB5FF" strokeWidth="8" fill="none" opacity="0.35" strokeLinecap="round" />

      {/* Big cloud left */}
      <Ellipse cx={width*0.18} cy={height*0.22} rx={width*0.16} ry={height*0.05} fill="#fff" opacity="0.75" />
      <Ellipse cx={width*0.12} cy={height*0.21} rx={width*0.10} ry={height*0.04} fill="#fff" opacity="0.75" />
      <Ellipse cx={width*0.24} cy={height*0.20} rx={width*0.09} ry={height*0.035} fill="#fff" opacity="0.75" />

      {/* Cloud right */}
      <Ellipse cx={width*0.68} cy={height*0.30} rx={width*0.14} ry={height*0.045} fill="#fff" opacity="0.6" />
      <Ellipse cx={width*0.74} cy={height*0.29} rx={width*0.08} ry={height*0.035} fill="#fff" opacity="0.6" />

      {/* Stars scattered */}
      {[
        [0.08, 0.07], [0.25, 0.04], [0.45, 0.06], [0.60, 0.12],
        [0.15, 0.14], [0.88, 0.20], [0.92, 0.06], [0.50, 0.16],
      ].map(([fx, fy], i) => {
        const sx = width * fx, sy = height * fy;
        const sc = i % 2 === 0 ? '#FFE566' : '#fff';
        return (
          <G key={i} transform={`translate(${sx},${sy})`}>
            <Path d="M0-9 L2.5-3 L9-3 L4 1 L6 9 L0 5 L-6 9 L-4 1 L-9-3 L-2.5-3 Z"
              fill={sc} opacity="0.9" />
          </G>
        );
      })}

      {/* Green hills at bottom */}
      <Path d={`M 0 ${height} Q ${width*0.25} ${height*0.78} ${width*0.5} ${height*0.82} Q ${width*0.75} ${height*0.86} ${width} ${height*0.75} L ${width} ${height} Z`}
        fill="#7BE0AD" opacity="0.55" />
      <Path d={`M 0 ${height} Q ${width*0.3} ${height*0.85} ${width*0.6} ${height*0.88} Q ${width*0.8} ${height*0.90} ${width} ${height*0.84} L ${width} ${height} Z`}
        fill="#3CB57F" opacity="0.4" />

      {/* Floating balloons */}
      <Ellipse cx={width*0.08} cy={height*0.52} rx={14} ry={18} fill="#FF6B6B" stroke="#2D2A4A" strokeWidth="2" />
      <Path d={`M ${width*0.08} ${height*0.52+18} Q ${width*0.08+6} ${height*0.52+32} ${width*0.08} ${height*0.52+44}`}
        stroke="#2D2A4A" strokeWidth="1.5" fill="none" />

      <Ellipse cx={width*0.93} cy={height*0.45} rx={13} ry={17} fill="#B68CFF" stroke="#2D2A4A" strokeWidth="2" />
      <Path d={`M ${width*0.93} ${height*0.45+17} Q ${width*0.93-5} ${height*0.45+30} ${width*0.93} ${height*0.45+42}`}
        stroke="#2D2A4A" strokeWidth="1.5" fill="none" />
    </Svg>
  );
}

function KidCharacter({ size = 160 }: { size?: number }) {
  return (
    <Svg width={size} height={size * 1.25} viewBox="0 0 160 200">
      {/* Body */}
      <Ellipse cx="80" cy="145" rx="38" ry="42" fill="#FF6B6B" stroke="#2D2A4A" strokeWidth="3" />
      <Path d="M 48 135 Q 80 130 112 135 L 112 148 Q 80 143 48 148 Z" fill="#FFE566" opacity="0.7"/>
      <Path d="M 46 153 Q 80 149 114 153 L 114 162 Q 80 158 46 162 Z" fill="#FFE566" opacity="0.5"/>
      {/* Arms */}
      <Ellipse cx="38" cy="148" rx="13" ry="22" fill="#FFD9B5" stroke="#2D2A4A" strokeWidth="2.5" transform="rotate(-15 38 148)"/>
      <Ellipse cx="122" cy="148" rx="13" ry="22" fill="#FFD9B5" stroke="#2D2A4A" strokeWidth="2.5" transform="rotate(15 122 148)"/>
      {/* Legs */}
      <Rect x="56" y="180" width="18" height="28" rx="9" fill="#3FB5FF" stroke="#2D2A4A" strokeWidth="2.5"/>
      <Rect x="86" y="180" width="18" height="28" rx="9" fill="#3FB5FF" stroke="#2D2A4A" strokeWidth="2.5"/>
      <Ellipse cx="65" cy="208" rx="13" ry="7" fill="#2D2A4A"/>
      <Ellipse cx="95" cy="208" rx="13" ry="7" fill="#2D2A4A"/>
      {/* Neck */}
      <Rect x="70" y="96" width="20" height="16" fill="#FFD9B5" />
      {/* Head */}
      <Ellipse cx="80" cy="78" rx="42" ry="40" fill="#FFD9B5" stroke="#2D2A4A" strokeWidth="3"/>
      {/* Hair */}
      <Path d="M 40 60 Q 42 28 80 26 Q 118 28 120 60 Q 115 44 80 44 Q 45 44 40 60 Z" fill="#5A3A1F" stroke="#2D2A4A" strokeWidth="2"/>
      <Path d="M 40 60 Q 36 48 40 42 Q 44 34 50 40 Z" fill="#5A3A1F"/>
      <Path d="M 120 60 Q 124 48 120 42 Q 116 34 110 40 Z" fill="#5A3A1F"/>
      {/* Eyes */}
      <Ellipse cx="64" cy="76" rx="8" ry="9" fill="#2D2A4A"/>
      <Ellipse cx="96" cy="76" rx="8" ry="9" fill="#2D2A4A"/>
      <Circle cx="66" cy="73" r="3" fill="#fff"/>
      <Circle cx="98" cy="73" r="3" fill="#fff"/>
      {/* Cheeks */}
      <Circle cx="52" cy="88" r="8" fill="#FF6B6B" opacity="0.4"/>
      <Circle cx="108" cy="88" r="8" fill="#FF6B6B" opacity="0.4"/>
      {/* Smile */}
      <Path d="M 67 92 Q 80 106 93 92" stroke="#2D2A4A" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      {/* Book */}
      <Rect x="20" y="136" width="22" height="28" rx="3" fill="#B68CFF" stroke="#2D2A4A" strokeWidth="2"/>
      <Rect x="22" y="136" width="4" height="28" rx="2" fill="#8857E0"/>
      <Path d="M 28 143 L 38 143 M 28 150 L 38 150 M 28 156 L 36 156" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Star */}
      <G transform="translate(118, 128)">
        <Path d="M0-13 L3.5-4.5 L13-4.5 L5.5 2 L8.5 13 L0 7 L-8.5 13 L-5.5 2 L-13-4.5 L-3.5-4.5 Z"
          fill="#FFE566" stroke="#2D2A4A" strokeWidth="2"/>
      </G>
    </Svg>
  );
}

export default function SplashScreen({ navigation }: ScreenProps<'Splash'>) {
  const { width, height } = useWindowDimensions();
  const floatAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -16, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#C2E8FF' }}>
      {/* Full-screen background — covers every pixel */}
      <FullBackground width={width} height={height} />

      <Animated.View style={[s.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        {/* Logo */}
        <View style={s.logoRow}>
          {['K','i','d','z',' ','N',' ','K','i','d','z'].map((ch, i) => (
            <Text key={i} style={[s.logoChar, { color: LOGO_COLORS[i % LOGO_COLORS.length] }]}>{ch}</Text>
          ))}
        </View>

        {/* Tagline pill */}
        <View style={s.pill}>
          <Text style={s.pillText}>🌟  Learn • Play • Grow  🌟</Text>
        </View>

        {/* Floating character */}
        <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
          <KidCharacter size={160} />
        </Animated.View>

        {/* Description */}
        <View style={s.descBox}>
          <Text style={s.desc}>Fun learning adventures{'\n'}for little explorers! 🚀</Text>
        </View>

        <KButton color={C.coral} size="lg" onPress={() => navigation.navigate('Explore')}>
          🎉  Let's Start!
        </KButton>
      </Animated.View>
    </View>
  );
}

const LOGO_COLORS = [C.yellow, C.coral, C.mint, C.purple, '#fff', C.yellow, '#fff', C.coral, C.mint, C.purple, C.yellow];

const s = StyleSheet.create({
  content: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 24, zIndex: 10,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  logoChar: {
    fontSize: 40, fontWeight: '900',
    textShadowColor: '#1A4A6A', textShadowOffset: { width: 2, height: 3 }, textShadowRadius: 0,
  },
  pill: {
    backgroundColor: '#fff', borderWidth: 3, borderColor: C.ink,
    borderRadius: 999, paddingHorizontal: 22, paddingVertical: 9, marginBottom: 6,
  },
  pillText: { fontWeight: '800', fontSize: 15, color: C.ink },
  descBox: {
    backgroundColor: 'rgba(255,255,255,0.88)', borderWidth: 3, borderColor: C.ink,
    borderRadius: 22, paddingHorizontal: 24, paddingVertical: 12,
    marginBottom: 22, marginTop: 6,
  },
  desc: { fontWeight: '800', fontSize: 16, color: C.ink, textAlign: 'center', lineHeight: 24 },
});
