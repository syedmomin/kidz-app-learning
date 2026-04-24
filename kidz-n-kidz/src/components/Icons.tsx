// src/components/Icons.tsx
import React from 'react';
import Svg, { Path, Circle, Text as SvgText } from 'react-native-svg';
import { C } from '../theme';

type StarProps = { size?: number; color?: string };
export function Star({ size = 24, color = C.yellow }: StarProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 2 L14.6 9 L22 9.5 L16.3 14.2 L18.2 21.5 L12 17.3 L5.8 21.5 L7.7 14.2 L2 9.5 L9.4 9 Z"
        fill={color} stroke={C.ink} strokeWidth="2.5" strokeLinejoin="round"/>
    </Svg>
  );
}

type CoinProps = { size?: number };
export function Coin({ size = 24 }: CoinProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="10" fill={C.yellow} stroke={C.ink} strokeWidth="2.5"/>
      <Circle cx="12" cy="12" r="6.5" fill="none" stroke={C.yellowDeep} strokeWidth="2"/>
      <SvgText x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="900" fill={C.yellowDeep}>★</SvgText>
    </Svg>
  );
}
