// src/components/Mango.tsx
import React from 'react';
import Svg, { Circle, Ellipse, Path, G } from 'react-native-svg';
import { C } from '../theme';

type Props = { size?: number };

export default function Mango({ size = 200 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Ellipse cx="100" cy="135" rx="55" ry="50" fill={C.coral} stroke={C.ink} strokeWidth="5"/>
      <Ellipse cx="100" cy="145" rx="32" ry="32" fill="#FFE9B0" stroke={C.ink} strokeWidth="4"/>
      <Ellipse cx="78" cy="180" rx="14" ry="9" fill={C.coralDeep} stroke={C.ink} strokeWidth="4"/>
      <Ellipse cx="122" cy="180" rx="14" ry="9" fill={C.coralDeep} stroke={C.ink} strokeWidth="4"/>
      <Ellipse cx="50" cy="125" rx="14" ry="20" fill={C.coral} stroke={C.ink} strokeWidth="5" transform="rotate(-15 50 125)"/>
      <Ellipse cx="150" cy="110" rx="14" ry="20" fill={C.coral} stroke={C.ink} strokeWidth="5" transform="rotate(25 150 110)"/>
      <Circle cx="160" cy="92" r="9" fill={C.coral} stroke={C.ink} strokeWidth="4"/>
      <Circle cx="100" cy="78" r="48" fill={C.coral} stroke={C.ink} strokeWidth="5"/>
      <Path d="M 62 50 Q 55 25 75 35 L 78 55 Z" fill={C.coral} stroke={C.ink} strokeWidth="5" strokeLinejoin="round"/>
      <Path d="M 138 50 Q 145 25 125 35 L 122 55 Z" fill={C.coral} stroke={C.ink} strokeWidth="5" strokeLinejoin="round"/>
      <Path d="M 65 45 Q 62 33 72 38 L 76 52 Z" fill={C.cream}/>
      <Path d="M 135 45 Q 138 33 128 38 L 124 52 Z" fill={C.cream}/>
      <Ellipse cx="100" cy="88" rx="32" ry="26" fill={C.cream}/>
      <Ellipse cx="84" cy="78" rx="7" ry="9" fill={C.ink}/>
      <Ellipse cx="116" cy="78" rx="7" ry="9" fill={C.ink}/>
      <Circle cx="86" cy="75" r="2.5" fill="#fff"/>
      <Circle cx="118" cy="75" r="2.5" fill="#fff"/>
      <Circle cx="74" cy="92" r="6" fill={C.coral} opacity="0.55"/>
      <Circle cx="126" cy="92" r="6" fill={C.coral} opacity="0.55"/>
      <Ellipse cx="100" cy="92" rx="5" ry="4" fill={C.ink}/>
      <Path d="M 90 100 Q 100 110 110 100" stroke={C.ink} strokeWidth="4" fill="none" strokeLinecap="round"/>
    </Svg>
  );
}
