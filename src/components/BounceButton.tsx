// src/components/BounceButton.tsx
import React, { useRef, ReactNode } from 'react';
import { Pressable, Text, Animated, StyleProp, ViewStyle } from 'react-native';
import { C } from '../theme';

type Props = {
  children: ReactNode;
  color?: string;
  shadow?: string;
  onPress?: () => void;
  big?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function BounceButton({ children, color = C.coral, shadow, onPress, big = false, style }: Props) {
  const sc = shadow || C.ink;
  const t = useRef(new Animated.Value(0)).current;
  const press = (to: number) => Animated.spring(t, { toValue: to, useNativeDriver: true, friction: 6 }).start();
  const ty = t.interpolate({ inputRange: [0, 1], outputRange: [0, 4] });
  const sh = t.interpolate({ inputRange: [0, 1], outputRange: [6, 2] });
  return (
    <Pressable onPress={onPress} onPressIn={() => press(1)} onPressOut={() => press(0)} style={[{ alignSelf: 'center' }, style]}>
      <Animated.View style={{
        backgroundColor: color, borderWidth: 4, borderColor: C.ink, borderRadius: 999,
        paddingVertical: big ? 18 : 12, paddingHorizontal: big ? 36 : 24,
        transform: [{ translateY: ty }],
      }}>
        <Animated.View style={{
          position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
          borderRadius: 999, backgroundColor: sc, zIndex: -1,
          transform: [{ translateY: sh }],
        }}/>
        <Text style={{
          color: C.cream, fontWeight: '900', fontSize: big ? 24 : 18, textAlign: 'center',
          letterSpacing: 0.5,
        }}>{children}</Text>
      </Animated.View>
    </Pressable>
  );
}
