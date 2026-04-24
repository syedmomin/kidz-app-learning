import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { C } from '../../theme';

type Variant = 'bar' | 'ring';

type BarProps = {
  variant?: 'bar';
  value: number;       // 0–100
  color?: string;
  trackColor?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
  style?: StyleProp<ViewStyle>;
};

type RingProps = {
  variant: 'ring';
  value: number;       // 0–100
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

type Props = BarProps | RingProps;

// ── Bar ───────────────────────────────────────────────────────────────────────
function ProgressBar({ value, color = C.mint, trackColor = '#E0E0E0', height = 14, showLabel = false, label, style }: BarProps) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, { toValue: Math.max(0, Math.min(100, value)), useNativeDriver: false, friction: 8 }).start();
  }, [value]);

  const width = anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <View style={[s.barWrap, style]}>
      {(showLabel || label) && (
        <View style={s.barLabelRow}>
          {label ? <Text style={s.barLabel}>{label}</Text> : null}
          {showLabel ? <Text style={s.barPct}>{Math.round(value)}%</Text> : null}
        </View>
      )}
      <View style={[s.barTrack, { height, backgroundColor: trackColor }]}>
        <Animated.View style={[s.barFill, { width, height, backgroundColor: color }]} />
      </View>
    </View>
  );
}

// ── Ring ──────────────────────────────────────────────────────────────────────
function ProgressRing({ value, size = 100, strokeWidth = 10, color = C.mint, trackColor = '#E0E0E0', children, style }: RingProps) {
  const anim = useRef(new Animated.Value(0)).current;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;

  useEffect(() => {
    Animated.spring(anim, { toValue: Math.max(0, Math.min(100, value)), useNativeDriver: false, friction: 8 }).start();
  }, [value]);

  // We use a View-based ring using border trick (simpler, no SVG dep in this file)
  const pct = Math.max(0, Math.min(100, value)) / 100;

  return (
    <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
      {/* Track circle */}
      <View style={{
        position: 'absolute', width: size, height: size, borderRadius: size / 2,
        borderWidth: strokeWidth, borderColor: trackColor,
      }} />
      {/* We render a static-looking indicator using a colored arc via border segments */}
      {/* For a real SVG ring, use react-native-svg in parent. This gives a pill progress overlay. */}
      <View style={{
        position: 'absolute', width: size, height: size, borderRadius: size / 2,
        borderWidth: strokeWidth,
        borderColor: 'transparent',
        borderTopColor: pct > 0 ? color : 'transparent',
        borderRightColor: pct > 0.25 ? color : 'transparent',
        borderBottomColor: pct > 0.5 ? color : 'transparent',
        borderLeftColor: pct > 0.75 ? color : 'transparent',
        transform: [{ rotate: '-90deg' }],
      }} />
      {children ? <View style={{ alignItems: 'center', justifyContent: 'center' }}>{children}</View> : (
        <Text style={{ fontWeight: '900', fontSize: size * 0.22, color }}>{Math.round(value)}%</Text>
      )}
    </View>
  );
}

export default function KProgress(props: Props) {
  if (props.variant === 'ring') return <ProgressRing {...props} />;
  return <ProgressBar {...(props as BarProps)} />;
}

const s = StyleSheet.create({
  barWrap: { width: '100%' },
  barLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  barLabel: { fontWeight: '800', fontSize: 13, color: C.ink },
  barPct: { fontWeight: '700', fontSize: 12, color: C.inkSoft },
  barTrack: {
    borderRadius: 999, overflow: 'hidden',
    borderWidth: 2, borderColor: C.ink,
  },
  barFill: { borderRadius: 999 },
});
