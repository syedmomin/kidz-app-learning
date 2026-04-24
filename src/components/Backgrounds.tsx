// src/components/Backgrounds.tsx
import React from 'react';
import Svg, { Defs, LinearGradient, Stop, Rect, Path, Circle, Ellipse, G } from 'react-native-svg';
import { C } from '../theme';

type BgProps = { w?: number; h?: number };

export function SkyBg({ w = 390, h = 844 }: BgProps) {
  return (
    <Svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute' }}>
      <Defs>
        <LinearGradient id="sg" x1="0" x2="0" y1="0" y2="1">
          <Stop offset="0" stopColor="#A8E0FF"/>
          <Stop offset="1" stopColor="#FFE9A8"/>
        </LinearGradient>
      </Defs>
      <Rect width={w} height={h} fill="url(#sg)"/>
      <Path d="M -50 200 Q 195 -50 440 200" fill="none" stroke={C.coral} strokeWidth="14"/>
      <Path d="M -50 220 Q 195 -30 440 220" fill="none" stroke={C.yellow} strokeWidth="14"/>
      <Path d="M -50 240 Q 195 -10 440 240" fill="none" stroke={C.mint} strokeWidth="14"/>
      <Path d="M -50 260 Q 195 10 440 260" fill="none" stroke={C.blue} strokeWidth="14"/>
      <G transform="translate(60,140)">
        <Circle r="22" fill={C.yellow} stroke={C.ink} strokeWidth="3"/>
        <Circle cx="-6" cy="-3" r="2" fill={C.ink}/>
        <Circle cx="6" cy="-3" r="2" fill={C.ink}/>
        <Path d="M -7 5 Q 0 11 7 5" stroke={C.ink} strokeWidth="2" fill="none" strokeLinecap="round"/>
      </G>
      <G transform="translate(280,120)">
        <Ellipse cx="0" cy="0" rx="32" ry="14" fill="#fff" stroke={C.ink} strokeWidth="3"/>
        <Ellipse cx="-14" cy="-8" rx="16" ry="12" fill="#fff" stroke={C.ink} strokeWidth="3"/>
        <Ellipse cx="14" cy="-6" rx="18" ry="13" fill="#fff" stroke={C.ink} strokeWidth="3"/>
      </G>
      <Path d={`M 0 700 Q 100 620 200 680 Q 300 740 ${w} 660 L ${w} ${h} L 0 ${h} Z`} fill={C.mintDeep} stroke={C.ink} strokeWidth="3"/>
      <Path d={`M 0 740 Q 120 690 240 730 Q 340 760 ${w} 720 L ${w} ${h} L 0 ${h} Z`} fill={C.mint} stroke={C.ink} strokeWidth="3"/>
    </Svg>
  );
}

export function GardenBg({ w = 390, h = 844 }: BgProps) {
  return (
    <Svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute' }}>
      <Defs>
        <LinearGradient id="gg" x1="0" x2="0" y1="0" y2="1">
          <Stop offset="0" stopColor="#FFE9C7"/>
          <Stop offset="0.6" stopColor="#FFF4D9"/>
          <Stop offset="1" stopColor="#C9F0CB"/>
        </LinearGradient>
      </Defs>
      <Rect width={w} height={h} fill="url(#gg)"/>
      <Circle cx="330" cy="80" r="28" fill={C.yellow} stroke={C.ink} strokeWidth="3"/>
      <G transform="translate(40,720)">
        <Rect x="-6" y="0" width="12" height="60" fill="#8B5A2B" stroke={C.ink} strokeWidth="3"/>
        <Circle cx="0" cy="-10" r="34" fill={C.mintDeep} stroke={C.ink} strokeWidth="3"/>
        <Circle cx="-20" cy="-20" r="20" fill={C.mintDeep} stroke={C.ink} strokeWidth="3"/>
        <Circle cx="20" cy="-20" r="22" fill={C.mintDeep} stroke={C.ink} strokeWidth="3"/>
      </G>
    </Svg>
  );
}
