import React, { useRef } from 'react';
import { Pressable, Text, Animated, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { C } from '../../theme';

type Size = 'sm' | 'md' | 'lg';
type Variant = 'filled' | 'outline' | 'ghost';

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  color?: string;
  shadowColor?: string;
  size?: Size;
  variant?: Variant;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: string;
};

const SIZE = {
  sm: { paddingV: 8,  paddingH: 18, fontSize: 14, borderWidth: 3, shadow: 4, radius: 999 },
  md: { paddingV: 13, paddingH: 26, fontSize: 18, borderWidth: 3, shadow: 5, radius: 999 },
  lg: { paddingV: 18, paddingH: 36, fontSize: 22, borderWidth: 4, shadow: 6, radius: 999 },
};

export default function KButton({
  children,
  onPress,
  color = C.coral,
  shadowColor,
  size = 'md',
  variant = 'filled',
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
}: Props) {
  const sc = shadowColor || C.ink;
  const t = useRef(new Animated.Value(0)).current;
  const sz = SIZE[size];

  const press = (to: number) =>
    Animated.spring(t, { toValue: to, useNativeDriver: true, friction: 6 }).start();

  const ty  = t.interpolate({ inputRange: [0, 1], outputRange: [0, sz.shadow * 0.6] });
  const shY = t.interpolate({ inputRange: [0, 1], outputRange: [sz.shadow, sz.shadow * 0.3] });

  const isFilled  = variant === 'filled';
  const isOutline = variant === 'outline';

  const bgColor      = isFilled ? (disabled ? '#C8C8C8' : color) : 'transparent';
  const borderColor  = disabled ? '#B0B0B0' : (isOutline ? color : C.ink);
  const labelColor   = isFilled ? C.cream : (disabled ? '#A0A0A0' : color);
  const shadowC      = disabled ? 'transparent' : (isFilled ? sc : 'transparent');

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={() => !disabled && press(1)}
      onPressOut={() => !disabled && press(0)}
      style={[{ alignSelf: fullWidth ? 'stretch' : 'center' }, style]}
    >
      <Animated.View style={{
        backgroundColor: bgColor,
        borderWidth: sz.borderWidth,
        borderColor,
        borderRadius: sz.radius,
        paddingVertical: sz.paddingV,
        paddingHorizontal: sz.paddingH,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        transform: [{ translateY: ty }],
      }}>
        {/* Shadow layer */}
        <Animated.View style={{
          position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
          borderRadius: sz.radius,
          backgroundColor: shadowC,
          zIndex: -1,
          transform: [{ translateY: shY }],
        }} />

        {icon ? <Text style={{ fontSize: sz.fontSize }}>{icon}</Text> : null}
        <Text style={[{
          color: labelColor,
          fontWeight: '900',
          fontSize: sz.fontSize,
          textAlign: 'center',
          letterSpacing: 0.3,
        }, textStyle]}>
          {children}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
