import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, G, Circle } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ScreenProps } from '../navigation/types';

const { width, height } = Dimensions.get('window');

const PALETTE = [
  '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', 
  '#536DFE', '#448AFF', '#40C4FF', '#18FFFF', 
  '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41', 
  '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40',
];

const SHAPES = [
  {
    id: 'butterfly',
    paths: [
      { id: 'wing-l', d: "M 80 80 Q 20 20 20 80 Q 20 140 80 140 Z" },
      { id: 'wing-r', d: "M 80 80 Q 140 20 140 80 Q 140 140 80 140 Z" },
      { id: 'body',   d: "M 75 60 Q 80 40 85 60 L 85 150 Q 80 160 75 150 Z" },
    ]
  },
  {
    id: 'flower',
    paths: [
      { id: 'petal-1', d: "M 80 80 Q 80 20 110 50 Q 140 80 80 80 Z" },
      { id: 'petal-2', d: "M 80 80 Q 140 80 110 110 Q 80 140 80 80 Z" },
      { id: 'petal-3', d: "M 80 80 Q 80 140 50 110 Q 20 80 80 80 Z" },
      { id: 'petal-4', d: "M 80 80 Q 20 80 50 50 Q 80 20 80 80 Z" },
      { id: 'center',  d: "M 70 80 A 10 10 0 1 0 90 80 A 10 10 0 1 0 70 80 Z" },
    ]
  }
];

export default function ColoringScreen({ navigation }: ScreenProps<'Coloring'>) {
  const [selectedColor, setSelectedColor] = useState(PALETTE[0]);
  const [fills, setFills] = useState<{ [key: string]: string }>({});
  const [activeShapeIdx, setActiveShapeIdx] = useState(0);

  const handleFill = (pathId: string) => {
    setFills(prev => ({ ...prev, [pathId]: selectedColor }));
  };

  const activeShape = SHAPES[activeShapeIdx];

  return (
    <View style={s.container}>
      <View style={s.bgBlob1} />
      <View style={s.bgBlob2} />

      <SafeAreaView style={s.safe}>
        {/* Header */}
        <View style={s.header}>
          <Pressable onPress={() => navigation.goBack()} style={s.backBtn}>
            <BlurView intensity={30} tint="light" style={s.blurBtn}>
              <Ionicons name="chevron-back" size={28} color="#333" />
            </BlurView>
          </Pressable>
          <Text style={s.title}>Coloring Fun</Text>
          <Pressable onPress={() => setFills({})} style={s.resetBtn}>
            <BlurView intensity={30} tint="light" style={s.blurBtn}>
              <Ionicons name="refresh" size={24} color="#333" />
            </BlurView>
          </Pressable>
        </View>

        {/* Canvas Area */}
        <View style={s.canvasContainer}>
          <BlurView intensity={40} tint="light" style={s.canvasBlur}>
            <Svg width={width * 0.8} height={width * 0.8} viewBox="0 0 160 200">
              <G transform="translate(0, 10)">
                {activeShape.paths.map(p => (
                  <Path
                    key={p.id}
                    d={p.d}
                    fill={fills[p.id] || '#fff'}
                    stroke="#333"
                    strokeWidth="3"
                    onPress={() => handleFill(p.id)}
                  />
                ))}
              </G>
            </Svg>
          </BlurView>
        </View>

        {/* Shape Selector */}
        <View style={s.shapeSelector}>
          {SHAPES.map((shape, idx) => (
            <Pressable 
              key={shape.id} 
              onPress={() => { setActiveShapeIdx(idx); setFills({}); }}
              style={[s.shapeTab, activeShapeIdx === idx && s.activeTab]}
            >
              <Text style={[s.tabText, activeShapeIdx === idx && s.activeTabText]}>
                {shape.id.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Palette */}
        <View style={s.paletteContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.paletteScroll}>
            {PALETTE.map(color => (
              <Pressable
                key={color}
                onPress={() => setSelectedColor(color)}
                style={[
                  s.colorCircle, 
                  { backgroundColor: color },
                  selectedColor === color && s.selectedColor
                ]}
              >
                {selectedColor === color && (
                  <Ionicons name="checkmark" size={20} color="#fff" />
                )}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FE' },
  bgBlob1: { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: '#FFD1DC', top: -50, right: -50, opacity: 0.6 },
  bgBlob2: { position: 'absolute', width: 250, height: 250, borderRadius: 125, backgroundColor: '#E0BBE4', bottom: -50, left: -50, opacity: 0.6 },
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10 },
  backBtn: { width: 50, height: 50, borderRadius: 25, overflow: 'hidden' },
  resetBtn: { width: 50, height: 50, borderRadius: 25, overflow: 'hidden' },
  blurBtn: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '900', color: '#333' },
  canvasContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  canvasBlur: { width: width * 0.85, height: width * 0.95, borderRadius: 30, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  paletteContainer: { height: 100, paddingVertical: 10 },
  paletteScroll: { paddingHorizontal: 20, alignItems: 'center' },
  colorCircle: { width: 50, height: 50, borderRadius: 25, marginHorizontal: 8, alignItems: 'center', justifyContent: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },
  selectedColor: { borderWidth: 3, borderColor: '#fff', transform: [{ scale: 1.1 }] },
  shapeSelector: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
  shapeTab: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.5)', marginHorizontal: 5 },
  activeTab: { backgroundColor: '#FF99C8' },
  tabText: { fontWeight: '700', color: '#666' },
  activeTabText: { color: '#fff' },
});
