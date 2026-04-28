import React from 'react';
import { Pressable, View, Text, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { C } from '../../theme';

interface ExploreCardProps {
  onPress: () => void;
  image: ImageSourcePropType;
  title: string;
  backgroundColor?: string;
  isNew?: boolean;
}

export default function ExploreCard({ onPress, image, title, backgroundColor = '#F5F5F5', isNew }: ExploreCardProps) {
  return (
    <Pressable 
      onPress={onPress} 
      style={({ pressed }) => [
        s.card, 
        { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }
      ]}
    >
      {isNew && (
        <View style={s.newBadge}>
          <Text style={s.newT}>NEW</Text>
        </View>
      )}
      <View style={[s.imgBox, { backgroundColor }]}>
        <Image source={image} style={s.img} />
      </View>
      <View style={[s.footer, { backgroundColor }]}>
        <Text style={s.name}>{title}</Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: { 
    borderRadius: 22, 
    overflow: 'hidden', 
    backgroundColor: '#fff', 
    borderWidth: 3.5, 
    borderColor: C.ink, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.10, 
    shadowRadius: 10, 
    elevation: 5 
  },
  imgBox: { 
    height: 120, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  img: { 
    width: '100%', 
    height: '100%', 
    resizeMode: 'cover' 
  },
  footer: { 
    paddingHorizontal: 10, 
    paddingVertical: 10, 
    alignItems: 'center' 
  },
  name: { 
    fontWeight: '900', 
    fontSize: 15, 
    color: C.ink 
  },
  newBadge: { 
    position: 'absolute', 
    top: 8, 
    right: 8, 
    zIndex: 10, 
    backgroundColor: C.coral, 
    borderRadius: 999, 
    paddingHorizontal: 8, 
    paddingVertical: 3 
  },
  newT: { 
    color: '#fff', 
    fontWeight: '900', 
    fontSize: 10 
  },
});
