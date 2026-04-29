import React from 'react';
import { Pressable, View, Text, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { C } from '../../theme';

interface ExploreCardProps {
  onPress: () => void;
  image: ImageSourcePropType;
  title: string;
  stepNumber?: number;
  isNew?: boolean;
}

export default function ExploreCard({ onPress, image, title, stepNumber, isNew }: ExploreCardProps) {
  return (
    <Pressable 
      onPress={onPress} 
      style={({ pressed }) => [
        s.card, 
        { transform: [{ scale: pressed ? 0.95 : 1 }] }
      ]}
    >
      {isNew && (
        <View style={s.newBadge}>
          <Text style={s.newT}>NEW</Text>
        </View>
      )}
      
      {stepNumber && (
        <View style={s.stepBadge}>
          <Text style={s.stepT}>{stepNumber}</Text>
        </View>
      )}

      <View style={s.content}>
        <View style={s.imgBox}>
          <Image source={image} style={s.img} />
        </View>
        <Text style={s.name}>{title}</Text>
      </View>
      
      {/* Little triangle tail to make it look like a bubble */}
      <View style={s.tail} />
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: { 
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 6,
    width: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  imgBox: { 
    width: 100,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 4,
    overflow: 'hidden',
  },
  img: { 
    width: '90%', 
    height: '90%', 
    resizeMode: 'contain' 
  },
  name: { 
    fontWeight: '800', 
    fontSize: 13, 
    color: '#444',
    textAlign: 'center'
  },
  stepBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF8FB1',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 20,
  },
  stepT: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 12,
  },
  newBadge: { 
    position: 'absolute', 
    top: -10, 
    left: -10, 
    zIndex: 20, 
    backgroundColor: '#FF6B6B', 
    borderRadius: 8, 
    paddingHorizontal: 6, 
    paddingVertical: 2,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  newT: { 
    color: '#fff', 
    fontWeight: '900', 
    fontSize: 10 
  },
  tail: {
    position: 'absolute',
    bottom: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#fff',
  }
});


