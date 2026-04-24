import React from 'react';
import { View, Text, Pressable, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { C } from '../../theme';

type Props = {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  badge?: string;
  accent?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  footer?: React.ReactNode;
  noPad?: boolean;
};

export default function KCard({
  children,
  title,
  subtitle,
  badge,
  accent = '#fff',
  onPress,
  style,
  footer,
  noPad = false,
}: Props) {
  const Wrap = onPress ? Pressable : View;

  return (
    <Wrap
      onPress={onPress}
      style={({ pressed }: any) => [
        s.card,
        { backgroundColor: accent, transform: [{ scale: pressed ? 0.97 : 1 }] },
        style,
      ]}
    >
      {/* Badge top-right */}
      {badge ? (
        <View style={s.badge}>
          <Text style={s.badgeT}>{badge}</Text>
        </View>
      ) : null}

      {/* Main content area */}
      <View style={noPad ? undefined : s.body}>
        {children}
      </View>

      {/* Footer label area */}
      {(title || subtitle || footer) ? (
        <View style={s.footer}>
          {title ? <Text style={s.title} numberOfLines={1}>{title}</Text> : null}
          {subtitle ? <Text style={s.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
          {footer}
        </View>
      ) : null}
    </Wrap>
  );
}

const s = StyleSheet.create({
  card: {
    borderWidth: 3,
    borderColor: C.ink,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: C.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 0,
    elevation: 4,
  },
  body: {
    padding: 12,
  },
  footer: {
    borderTopWidth: 3,
    borderTopColor: C.ink,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  title: {
    fontWeight: '900',
    fontSize: 15,
    color: C.ink,
  },
  subtitle: {
    fontWeight: '700',
    fontSize: 12,
    color: C.inkSoft,
    marginTop: 2,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: C.coral,
    borderWidth: 2,
    borderColor: C.ink,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeT: {
    fontWeight: '900',
    fontSize: 10,
    color: '#fff',
    letterSpacing: 0.5,
  },
});
