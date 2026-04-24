import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { C } from '../../theme';

type Variant = 'pill' | 'dot' | 'tag' | 'star' | 'coin';
type Size    = 'sm' | 'md' | 'lg';

type Props = {
  label?: string | number;
  variant?: Variant;
  color?: string;
  size?: Size;
  style?: StyleProp<ViewStyle>;
};

const SIZE_MAP = {
  sm: { fontSize: 10, paddingH: 7,  paddingV: 2,  dot: 8,  icon: 14 },
  md: { fontSize: 12, paddingH: 10, paddingV: 4,  dot: 11, icon: 18 },
  lg: { fontSize: 15, paddingH: 14, paddingV: 6,  dot: 14, icon: 22 },
};

export default function KBadge({
  label,
  variant = 'pill',
  color = C.coral,
  size = 'md',
  style,
}: Props) {
  const sz = SIZE_MAP[size];

  if (variant === 'dot') {
    return (
      <View style={[{
        width: sz.dot, height: sz.dot, borderRadius: sz.dot / 2,
        backgroundColor: color, borderWidth: 2, borderColor: C.ink,
      }, style]} />
    );
  }

  if (variant === 'star') {
    return (
      <View style={[s.pill, { backgroundColor: C.yellow, paddingHorizontal: sz.paddingH, paddingVertical: sz.paddingV }, style]}>
        <Text style={{ fontSize: sz.icon }}>⭐</Text>
        {label !== undefined
          ? <Text style={[s.label, { fontSize: sz.fontSize, color: C.ink }]}>{label}</Text>
          : null}
      </View>
    );
  }

  if (variant === 'coin') {
    return (
      <View style={[s.pill, { backgroundColor: C.yellow, paddingHorizontal: sz.paddingH, paddingVertical: sz.paddingV }, style]}>
        <Text style={{ fontSize: sz.icon }}>🪙</Text>
        {label !== undefined
          ? <Text style={[s.label, { fontSize: sz.fontSize, color: C.ink }]}>{label}</Text>
          : null}
      </View>
    );
  }

  if (variant === 'tag') {
    return (
      <View style={[s.tag, { borderColor: color, paddingHorizontal: sz.paddingH, paddingVertical: sz.paddingV }, style]}>
        <Text style={[s.label, { fontSize: sz.fontSize, color }]}>{label}</Text>
      </View>
    );
  }

  // Default: pill (filled)
  return (
    <View style={[s.pill, { backgroundColor: color, paddingHorizontal: sz.paddingH, paddingVertical: sz.paddingV }, style]}>
      <Text style={[s.label, { fontSize: sz.fontSize }]}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: C.ink,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  tag: {
    borderWidth: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  label: {
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.3,
  },
});
